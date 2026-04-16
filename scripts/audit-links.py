#!/usr/bin/env python3
"""
AUDIT-LINKS — Compare external links between WP origin and local Astro build.

Detects external links present in WordPress pages but missing from the local
dist/ build. Useful for catching links that were rendered as plain text instead
of clickable <a> tags during migration.

This is a READ-ONLY audit tool. It does NOT modify any files.

Usage:
  python3 scripts/audit-links.py                         # audit all discovered pages
  python3 scripts/audit-links.py --slug contratacion-suscrita  # audit single page
  python3 scripts/audit-links.py --limit 10              # audit first N pages
  python3 scripts/audit-links.py --concurrency 3         # limit parallel fetches
  python3 scripts/audit-links.py --dist-dir dist/        # custom dist directory
  python3 scripts/audit-links.py --mapping mapping.json  # explicit URL mapping file
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import json
import shutil
import subprocess  # nosec B404 — only used with static argv + scheme-validated URL
import sys
import unicodedata
from collections import defaultdict
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

# ---------------------------------------------------------------------------
# curl setup (same pattern as download-binaries.py)
# ---------------------------------------------------------------------------

_CURL_BIN = shutil.which("curl")
if not _CURL_BIN:
    raise RuntimeError("audit-links requiere `curl` en PATH.")

_CA_BUNDLE = Path(__file__).parent / ".cache" / "itrc-ca-bundle.pem"
_SECTIGO_R36_AIA = "http://crt.sectigo.com/SectigoPublicServerAuthenticationCAOVR36.crt"

ROOT = Path(__file__).resolve().parent.parent
DIST_DEFAULT = ROOT / "dist"
REPORTS_DIR = ROOT / "reports"

# WP base URL pattern: https://www.itrc.gov.co/Itrc/{slug}/
WP_BASE = "https://www.itrc.gov.co/Itrc"

# Domains considered internal/navigation (excluded from external link comparison)
INTERNAL_DOMAINS = {
    "www.itrc.gov.co",
    "itrc.gov.co",
    "localhost",
    "127.0.0.1",
}

# Slugs to skip (not real content pages)
SKIP_SLUGS = {
    "admin",
    "assets",
    "documentos",
    "uploads",
    "rss.xml",
    "search-index.json",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
    "estados",  # likely a WP artifact
}


# ---------------------------------------------------------------------------
# CA bundle (reused from download-binaries.py)
# ---------------------------------------------------------------------------

def _ensure_ca_bundle() -> Path:
    """Build or reuse the custom CA bundle for itrc.gov.co TLS."""
    if _CA_BUNDLE.exists() and _CA_BUNDLE.stat().st_size > 0:
        return _CA_BUNDLE
    _CA_BUNDLE.parent.mkdir(parents=True, exist_ok=True)
    try:
        import certifi  # type: ignore
    except ImportError as e:
        raise RuntimeError(
            "audit-links requiere el paquete `certifi` (pip install certifi)."
        ) from e
    # Fetch Sectigo R36 intermediate via curl (AIA URL is http)
    tmp_der = _CA_BUNDLE.parent / "sectigo-r36.der"
    tmp_pem = _CA_BUNDLE.parent / "sectigo-r36.pem"
    argv = [
        _CURL_BIN, "--silent", "--show-error", "--fail", "--max-time", "30",
        "--proto", "=http", "--output", str(tmp_der), "--", _SECTIGO_R36_AIA,
    ]
    r = subprocess.run(argv, capture_output=True, text=True, check=False)  # nosec B603
    if r.returncode != 0 or not tmp_der.exists():
        raise RuntimeError(f"No pude descargar intermedio Sectigo: {r.stderr.strip()}")
    ossl = shutil.which("openssl")
    if not ossl:
        raise RuntimeError("audit-links requiere `openssl` en PATH para convertir DER→PEM.")
    r = subprocess.run(
        [ossl, "x509", "-inform", "DER", "-in", str(tmp_der), "-out", str(tmp_pem)],
        capture_output=True, text=True, check=False,
    )  # nosec B603
    if r.returncode != 0:
        raise RuntimeError(f"openssl falló al convertir intermedio: {r.stderr}")
    with open(_CA_BUNDLE, "wb") as out:
        out.write(Path(certifi.where()).read_bytes())
        out.write(b"\n")
        out.write(tmp_pem.read_bytes())
    return _CA_BUNDLE


# ---------------------------------------------------------------------------
# curl fetch
# ---------------------------------------------------------------------------

def _validate_url(url: str) -> None:
    scheme = urlparse(url).scheme.lower()
    if scheme not in ("http", "https"):
        raise ValueError(f"esquema no permitido: {scheme!r}")


def curl_fetch_html(url: str, timeout: int = 30) -> str | None:
    """Fetch a URL and return the HTML body, or None on failure."""
    _validate_url(url)
    ca = _ensure_ca_bundle()
    argv: list[str] = [
        _CURL_BIN,  # type: ignore[list-item]
        "--silent",
        "--show-error",
        "--location",
        "--max-redirs", "5",
        "--proto", "=http,https",
        "--proto-redir", "=http,https",
        "--max-time", str(timeout),
        "--user-agent", "itrc-audit/1.0",
        "--cacert", str(ca),
        "--fail",
        "--", url,
    ]
    r = subprocess.run(  # nosec B603
        argv, capture_output=True, text=True, check=False,
    )
    if r.returncode != 0:
        return None
    return r.stdout


# ---------------------------------------------------------------------------
# HTML link extraction
# ---------------------------------------------------------------------------

class LinkExtractor(HTMLParser):
    """Extract href attributes from <a> tags."""

    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "a":
            for name, value in attrs:
                if name == "href" and value:
                    self.links.append(value)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)


def extract_links(html: str) -> list[str]:
    """Extract all href values from <a> tags in an HTML string."""
    parser = LinkExtractor()
    try:
        parser.feed(html)
    except Exception:
        pass
    return parser.links


# ---------------------------------------------------------------------------
# URL normalization and classification
# ---------------------------------------------------------------------------

def normalize_link(url: str) -> str:
    """Normalize a URL for comparison: unquote, NFC normalize, lowercase, strip trailing slashes."""
    url = url.strip()
    url = unquote(url)
    url = unicodedata.normalize("NFC", url)
    # Lowercase for comparison (preserve original for reporting)
    url = url.lower()
    # Remove trailing slash for consistency
    url = url.rstrip("/")
    # Remove fragment
    if "#" in url:
        url = url.split("#")[0]
    return url


def is_external_link(url: str) -> bool:
    """Return True if the URL is an external HTTP(S) link (not internal navigation)."""
    try:
        parsed = urlparse(url)
    except ValueError:
        return False
    # Must be http or https
    if parsed.scheme.lower() not in ("http", "https"):
        return False
    hostname = (parsed.hostname or "").lower()
    if not hostname:
        return False
    # Exclude internal domains
    if hostname in INTERNAL_DOMAINS:
        return False
    return True


def extract_domain(url: str) -> str:
    """Extract the domain from a URL."""
    try:
        return (urlparse(url).hostname or "").lower()
    except ValueError:
        return ""


def extract_external_links(html: str) -> set[str]:
    """Extract and normalize all external links from HTML."""
    raw_links = extract_links(html)
    external: set[str] = set()
    for link in raw_links:
        if is_external_link(link):
            external.add(normalize_link(link))
    return external


def original_external_links(html: str) -> dict[str, str]:
    """Return a mapping of normalized → original URL for external links."""
    raw_links = extract_links(html)
    result: dict[str, str] = {}
    for link in raw_links:
        if is_external_link(link):
            norm = normalize_link(link)
            if norm not in result:
                result[norm] = link.strip()
    return result


# ---------------------------------------------------------------------------
# Page discovery
# ---------------------------------------------------------------------------

def discover_pages(dist_dir: Path) -> list[dict]:
    """
    Auto-discover page mappings by scanning dist/ for index.html files
    and mapping slugs to WP URLs.

    Returns list of dicts: [{"slug": str, "wp_url": str, "local_path": str}, ...]
    """
    pages: list[dict] = []
    if not dist_dir.exists():
        return pages

    for entry in sorted(dist_dir.iterdir()):
        if not entry.is_dir():
            continue
        slug = entry.name
        if slug in SKIP_SLUGS:
            continue
        if slug.startswith("."):
            continue
        index_html = entry / "index.html"
        if not index_html.exists():
            continue
        # Map to WP URL — standard pattern is /Itrc/{slug}/
        # The WP slugs use the same kebab-case as the Astro slugs
        wp_url = f"{WP_BASE}/{slug}/"
        pages.append({
            "slug": slug,
            "wp_url": wp_url,
            "local_path": str(index_html),
        })

    return pages


def load_mapping_file(path: Path) -> list[dict]:
    """
    Load an explicit mapping file. Expected format:
    [
      {"slug": "contratacion-suscrita", "wp_url": "https://...", "local_path": "dist/contratacion-suscrita/index.html"},
      ...
    ]

    OR a simpler format:
    {
      "contratacion-suscrita": "https://www.itrc.gov.co/Itrc/contratacion-suscrita/",
      ...
    }
    """
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        pages = []
        for slug, wp_url in data.items():
            pages.append({
                "slug": slug,
                "wp_url": wp_url,
                "local_path": str(DIST_DEFAULT / slug / "index.html"),
            })
        return pages
    raise ValueError(f"Formato de mapping no reconocido en {path}")


# ---------------------------------------------------------------------------
# Per-page audit
# ---------------------------------------------------------------------------

def audit_page(page: dict, timeout: int = 30) -> dict:
    """
    Audit a single page: fetch WP, read local, compare external links.
    Returns a result dict.
    """
    slug = page["slug"]
    wp_url = page["wp_url"]
    local_path = Path(page["local_path"])

    result: dict = {
        "slug": slug,
        "wp_url": wp_url,
        "local_path": str(local_path),
        "status": "ok",
        "error": None,
        "wp_external_links_count": 0,
        "local_external_links_count": 0,
        "missing_links": [],
        "missing_domains": [],
    }

    # Read local HTML
    if not local_path.exists():
        result["status"] = "error"
        result["error"] = f"local file not found: {local_path}"
        return result

    try:
        local_html = local_path.read_text(encoding="utf-8", errors="ignore")
    except OSError as e:
        result["status"] = "error"
        result["error"] = f"cannot read local file: {e}"
        return result

    # Fetch WP HTML
    wp_html = curl_fetch_html(wp_url, timeout=timeout)
    if wp_html is None:
        result["status"] = "wp-fetch-failed"
        result["error"] = f"could not fetch WP page: {wp_url}"
        return result

    # Extract external links
    wp_ext_map = original_external_links(wp_html)
    wp_ext_normalized = set(wp_ext_map.keys())
    local_ext_normalized = extract_external_links(local_html)

    result["wp_external_links_count"] = len(wp_ext_normalized)
    result["local_external_links_count"] = len(local_ext_normalized)

    # Find missing: in WP but not in local
    missing_normalized = wp_ext_normalized - local_ext_normalized
    missing_links = []
    for norm in sorted(missing_normalized):
        original = wp_ext_map.get(norm, norm)
        domain = extract_domain(original)
        missing_links.append({
            "url": original,
            "normalized": norm,
            "domain": domain,
        })

    result["missing_links"] = missing_links

    # Aggregate missing domains
    domain_counts: dict[str, int] = defaultdict(int)
    for link in missing_links:
        domain_counts[link["domain"]] += 1
    result["missing_domains"] = [
        {"domain": d, "count": c}
        for d, c in sorted(domain_counts.items(), key=lambda x: -x[1])
    ]

    if missing_links:
        result["status"] = "gaps-found"

    return result


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser(
        description="Audit external links: compare WP origin vs local Astro build."
    )
    ap.add_argument(
        "--slug", type=str, default=None,
        help="Audit a single page by slug (e.g., contratacion-suscrita)",
    )
    ap.add_argument(
        "--limit", type=int, default=0,
        help="Limit number of pages to process (0 = all)",
    )
    ap.add_argument(
        "--concurrency", type=int, default=5,
        help="Number of parallel WP fetches (default 5)",
    )
    ap.add_argument(
        "--dist-dir", type=str, default=str(DIST_DEFAULT),
        help=f"Path to dist/ directory (default: {DIST_DEFAULT})",
    )
    ap.add_argument(
        "--mapping", type=str, default=None,
        help="Path to JSON mapping file (WP URL → local path). If omitted, auto-discover from dist/.",
    )
    ap.add_argument(
        "--timeout", type=int, default=30,
        help="HTTP timeout per request in seconds (default 30)",
    )
    args = ap.parse_args()

    dist_dir = Path(args.dist_dir)
    if not dist_dir.exists():
        print(f"ERROR: dist directory not found: {dist_dir}", file=sys.stderr)
        print("Run `npm run build` first to generate the static site.", file=sys.stderr)
        return 2

    # Discover or load pages
    if args.mapping:
        mapping_path = Path(args.mapping)
        if not mapping_path.exists():
            print(f"ERROR: mapping file not found: {mapping_path}", file=sys.stderr)
            return 2
        pages = load_mapping_file(mapping_path)
        print(f"[audit-links] Loaded {len(pages)} page mappings from {mapping_path}")
    else:
        pages = discover_pages(dist_dir)
        print(f"[audit-links] Auto-discovered {len(pages)} pages in {dist_dir}")

    # Filter by slug
    if args.slug:
        pages = [p for p in pages if p["slug"] == args.slug]
        if not pages:
            print(f"ERROR: slug '{args.slug}' not found in discovered pages.", file=sys.stderr)
            return 2
        print(f"[audit-links] Filtering to single slug: {args.slug}")

    # Apply limit
    if args.limit > 0:
        pages = pages[: args.limit]
        print(f"[audit-links] Limited to {len(pages)} pages")

    if not pages:
        print("No pages to audit.", file=sys.stderr)
        return 1

    print(f"[audit-links] Auditing {len(pages)} pages with concurrency={args.concurrency}...")
    print()

    # Run audits
    results: list[dict] = []
    with cf.ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        future_to_page = {
            executor.submit(audit_page, page, args.timeout): page
            for page in pages
        }
        for i, future in enumerate(cf.as_completed(future_to_page), 1):
            page = future_to_page[future]
            try:
                result = future.result()
            except Exception as e:
                result = {
                    "slug": page["slug"],
                    "wp_url": page["wp_url"],
                    "local_path": page["local_path"],
                    "status": "error",
                    "error": f"{type(e).__name__}: {e}",
                    "wp_external_links_count": 0,
                    "local_external_links_count": 0,
                    "missing_links": [],
                    "missing_domains": [],
                }
            results.append(result)

            # Progress indicator
            n_missing = len(result.get("missing_links", []))
            status_icon = {
                "ok": "✓",
                "gaps-found": "!",
                "wp-fetch-failed": "✗",
                "error": "✗",
            }.get(result["status"], "?")
            print(
                f"  [{i}/{len(pages)}] {status_icon} {result['slug']:<55} "
                f"WP:{result['wp_external_links_count']:>3}  "
                f"Local:{result['local_external_links_count']:>3}  "
                f"Missing:{n_missing:>3}"
            )
            if result.get("error"):
                print(f"          ERROR: {result['error']}")

    # Sort results by slug for consistent output
    results.sort(key=lambda r: r["slug"])

    # Build summary
    total_pages = len(results)
    pages_ok = sum(1 for r in results if r["status"] == "ok")
    pages_gaps = sum(1 for r in results if r["status"] == "gaps-found")
    pages_wp_failed = sum(1 for r in results if r["status"] == "wp-fetch-failed")
    pages_error = sum(1 for r in results if r["status"] == "error")
    total_missing = sum(len(r["missing_links"]) for r in results)
    total_wp_links = sum(r["wp_external_links_count"] for r in results)
    total_local_links = sum(r["local_external_links_count"] for r in results)

    # Top domains with gaps (across all pages)
    global_domain_counts: dict[str, int] = defaultdict(int)
    for r in results:
        for link in r.get("missing_links", []):
            global_domain_counts[link["domain"]] += 1
    top_domains = [
        {"domain": d, "missing_count": c}
        for d, c in sorted(global_domain_counts.items(), key=lambda x: -x[1])
    ]

    # Pages ranked by number of missing links
    pages_by_gaps = [
        {"slug": r["slug"], "missing": len(r["missing_links"])}
        for r in results
        if len(r["missing_links"]) > 0
    ]
    pages_by_gaps.sort(key=lambda x: -x["missing"])

    summary = {
        "total_pages_checked": total_pages,
        "pages_ok": pages_ok,
        "pages_with_gaps": pages_gaps,
        "pages_wp_fetch_failed": pages_wp_failed,
        "pages_error": pages_error,
        "total_wp_external_links": total_wp_links,
        "total_local_external_links": total_local_links,
        "total_missing_links": total_missing,
        "top_domains_with_gaps": top_domains[:30],
        "pages_ranked_by_gaps": pages_by_gaps[:50],
    }

    # Write report
    REPORTS_DIR.mkdir(exist_ok=True)
    datestamp = datetime.now().strftime("%Y-%m-%d")
    report_path = REPORTS_DIR / f"audit-links-{datestamp}.json"

    report = {
        "generated_at": datetime.now().isoformat(),
        "dist_dir": str(dist_dir),
        "summary": summary,
        "pages": results,
    }

    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    # Print summary
    print()
    print("=" * 70)
    print("  AUDIT-LINKS SUMMARY")
    print("=" * 70)
    print(f"  Pages checked:        {total_pages}")
    print(f"    OK (no gaps):       {pages_ok}")
    print(f"    Gaps found:         {pages_gaps}")
    print(f"    WP fetch failed:    {pages_wp_failed}")
    print(f"    Errors:             {pages_error}")
    print(f"  Total WP ext links:   {total_wp_links}")
    print(f"  Total local ext links:{total_local_links}")
    print(f"  Total missing links:  {total_missing}")
    print()

    if top_domains:
        print("  Top domains with missing links:")
        for entry in top_domains[:15]:
            print(f"    {entry['domain']:<40} {entry['missing_count']:>4} missing")
        print()

    if pages_by_gaps:
        print("  Pages with most gaps:")
        for entry in pages_by_gaps[:15]:
            print(f"    {entry['slug']:<55} {entry['missing']:>4} missing")
        print()

    print(f"  Report saved to: {report_path.relative_to(ROOT)}")
    print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
