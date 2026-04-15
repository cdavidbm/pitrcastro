#!/usr/bin/env python3
"""
BIN-2 — Descarga controlada de binarios WP legacy al repo local.

Estrategia de destino (Opción C híbrida):
  - Institucionales (pdf/xlsx/xls/doc/docx) → public/documentos/<area>/<archivo>
  - Media (jpg/jpeg/png/mp4/mp3)            → public/documentos/media/<año>/<archivo>

`<area>` se infiere desde el JSON que referencia cada URL:
  src/content/pages/<grupo>/... → grupo (transparencia, normativa, agencia, etc.)
  src/content/news/*            → media/prensa
  fallback                      → misc

Uso:
  python3 scripts/download-binaries.py --dry-run               # plan sin descargar
  python3 scripts/download-binaries.py --dry-run --ext pdf     # filtrar por extensión
  python3 scripts/download-binaries.py --ext pdf               # descargar sólo PDFs
  python3 scripts/download-binaries.py --limit 20              # descargar N primeros (prueba)
  python3 scripts/download-binaries.py                         # descarga completa
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import json
import re
import sys
import time
import unicodedata
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from urllib.parse import unquote, urlparse

import shutil
import subprocess  # nosec B404 — only used with static argv + scheme-validated URL

_CURL_BIN = shutil.which("curl")
if not _CURL_BIN:
    raise RuntimeError("BIN-2 requiere `curl` en PATH.")

# itrc.gov.co serves an incomplete TLS chain (no intermediate). We rebuild a
# local bundle = certifi roots + Sectigo R36 intermediate (fetched via AIA).
# The script fails hard if the bundle cannot be assembled, rather than bypassing
# verification.
_CA_BUNDLE = Path(__file__).parent / ".cache" / "itrc-ca-bundle.pem"
_SECTIGO_R36_AIA = "http://crt.sectigo.com/SectigoPublicServerAuthenticationCAOVR36.crt"


def _ensure_ca_bundle() -> Path:
    if _CA_BUNDLE.exists() and _CA_BUNDLE.stat().st_size > 0:
        return _CA_BUNDLE
    _CA_BUNDLE.parent.mkdir(parents=True, exist_ok=True)
    try:
        import certifi  # type: ignore
    except ImportError as e:
        raise RuntimeError("BIN-2 requiere el paquete `certifi` (pip install certifi).") from e
    # Fetch Sectigo R36 intermediate via curl (AIA URL is http, so TLS verify N/A)
    tmp_der = _CA_BUNDLE.parent / "sectigo-r36.der"
    tmp_pem = _CA_BUNDLE.parent / "sectigo-r36.pem"
    argv = [_CURL_BIN, "--silent", "--show-error", "--fail", "--max-time", "30",
            "--proto", "=http", "--output", str(tmp_der), "--", _SECTIGO_R36_AIA]
    r = subprocess.run(argv, capture_output=True, text=True, check=False)  # nosec B603
    if r.returncode != 0 or not tmp_der.exists():
        raise RuntimeError(f"No pude descargar intermedio Sectigo: {r.stderr.strip()}")
    # Convert DER→PEM via openssl (available on WSL/Linux by default)
    ossl = shutil.which("openssl")
    if not ossl:
        raise RuntimeError("BIN-2 requiere `openssl` en PATH para convertir DER→PEM.")
    r = subprocess.run([ossl, "x509", "-inform", "DER", "-in", str(tmp_der),
                        "-out", str(tmp_pem)], capture_output=True, text=True, check=False)  # nosec B603
    if r.returncode != 0:
        raise RuntimeError(f"openssl falló al convertir intermedio: {r.stderr}")
    # Combine certifi + Sectigo
    with open(_CA_BUNDLE, "wb") as out:
        out.write(Path(certifi.where()).read_bytes())
        out.write(b"\n")
        out.write(tmp_pem.read_bytes())
    return _CA_BUNDLE



ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src" / "content"
PAGES_DIR = ROOT / "src" / "pages"
PUBLIC_DOCS = ROOT / "public" / "documentos"
REPORTS_DIR = ROOT / "reports"

WP_HOSTS = {"www.itrc.gov.co", "itrc.gov.co"}
MEDIA_EXT = {"jpg", "jpeg", "png", "mp4", "mp3"}
INST_EXT = {"pdf", "xlsx", "xls", "doc", "docx"}

URL_RE = re.compile(r"https?://[^\s\"'<>()\\]+", re.IGNORECASE)

# Area mapping keyed by top-level folder under src/content/pages/
AREA_MAP = {
    "transparencia": "transparencia",
    "normativa": "normativa",
    "agencia": "agencia",
    "atencion": "atencion",
    "participa": "participa",
    "prensa": "prensa",
    "observatorio": "observatorio",
    "participa-atencion": "atencion",
    "contratacion": "contratacion",
    "informes": "informes",
    "planes": "planes",
}


def normalize_url(u: str) -> str:
    u = u.rstrip('.,);:\'"')
    return unicodedata.normalize("NFC", unquote(u))


def is_migration_target(u: str) -> bool:
    try:
        host = urlparse(u).hostname or ""
    except ValueError:
        return False
    if host not in WP_HOSTS:
        return False
    path = urlparse(u).path.lower()
    return "/wp-content/uploads/" in path or "/pestana/" in path


def file_ext(u: str) -> str:
    path = urlparse(u).path.lower()
    m = re.search(r"\.([a-z0-9]{2,5})$", path)
    return m.group(1) if m else ""


def classify_area(json_path: Path) -> str:
    """Infer area from the path of the JSON/MD/astro file referencing the URL."""
    try:
        rel = json_path.relative_to(ROOT)
    except ValueError:
        return "misc"
    parts = rel.parts
    # news markdown → media/prensa
    if len(parts) >= 3 and parts[0] == "src" and parts[1] == "content" and parts[2] == "news":
        return "media/prensa"
    if len(parts) >= 4 and parts[0] == "src" and parts[1] == "content" and parts[2] == "pages":
        top = parts[3]
        # If top is a *file* at the root of pages/ (not a subfolder), use filename stem
        if top.endswith(".json") or top.endswith(".md"):
            stem = re.sub(r"\.(json|md)$", "", top)
            return AREA_MAP.get(stem, stem)
        return AREA_MAP.get(top, top)
    # Any other folder under src/content/ → use that folder as area
    if len(parts) >= 4 and parts[0] == "src" and parts[1] == "content":
        folder = parts[2]
        return AREA_MAP.get(folder, folder)
    # Pages (.astro) reference — derive from slug
    if len(parts) >= 3 and parts[0] == "src" and parts[1] == "pages":
        stem = re.sub(r"\.astro$", "", parts[-1])
        return AREA_MAP.get(stem, stem)
    return "misc"


def collect_references() -> dict[str, list[Path]]:
    """Scan content + pages, return url → list of files that reference it."""
    refs: dict[str, list[Path]] = defaultdict(list)
    patterns = [
        (CONTENT, ("*.json", "*.md")),
        (PAGES_DIR, ("*.astro",)),
    ]
    for base, globs in patterns:
        if not base.exists():
            continue
        for glob in globs:
            for p in base.rglob(glob):
                try:
                    text = p.read_text(encoding="utf-8", errors="ignore")
                except OSError:
                    continue
                for m in URL_RE.findall(text):
                    norm = normalize_url(m)
                    if is_migration_target(norm):
                        refs[norm].append(p)
    return refs


def filename_from_url(u: str) -> str:
    path = urlparse(u).path
    name = unquote(path.rsplit("/", 1)[-1])
    name = unicodedata.normalize("NFC", name)
    # sanitize: strip problematic chars but keep unicode letters
    name = re.sub(r"[\x00-\x1f]", "", name).strip()
    return name or "archivo"


def year_from_url(u: str) -> str:
    path = urlparse(u).path
    m = re.search(r"/uploads/(\d{4})/", path)
    if m:
        return m.group(1)
    m = re.search(r"/(\d{4})/\d{1,2}/", path)
    if m:
        return m.group(1)
    return "sin-fecha"


def plan_target(url: str, referers: list[Path]) -> Path:
    """Compute the local destination path for a URL."""
    ext = file_ext(url)
    fname = filename_from_url(url)
    if ext in MEDIA_EXT:
        year = year_from_url(url)
        return PUBLIC_DOCS / "media" / year / fname
    # institutional → infer area from first referer
    area = "misc"
    for ref in referers:
        a = classify_area(ref)
        if a and a != "misc":
            area = a
            break
    return PUBLIC_DOCS / area / fname


def _validate_url(url: str) -> None:
    """Enforce http/https only; reject file://, ftp://, etc."""
    scheme = urlparse(url).scheme.lower()
    if scheme not in ("http", "https"):
        raise ValueError(f"esquema no permitido: {scheme!r}")


def _curl_run(url: str, timeout: int, head: bool, output: Path | None) -> subprocess.CompletedProcess:
    """Run curl with a fixed argv (URL is a data argument, never shell-interpolated).

    curl is invoked directly via argv (shell=False), so there is no shell-injection
    surface. The URL is validated against an http(s) allow-list before being passed.
    """
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
        "--user-agent", "itrc-migrator/1.0",
        "--cacert", str(ca),
        "--fail",  # non-2xx → exit code
    ]
    if head:
        argv += ["--head"]
    if output is not None:
        argv += ["--output", str(output)]
    argv += ["--", url]
    return subprocess.run(  # nosec B603 — argv list, shell=False, URL scheme-validated
        argv, capture_output=True, text=True, check=False,
    )


def head_remote_size(url: str, timeout: int = 15) -> int | None:
    try:
        r = _curl_run(url, timeout=timeout, head=True, output=None)
    except ValueError:
        return None
    if r.returncode != 0:
        return None
    for line in r.stdout.splitlines():
        if line.lower().startswith("content-length:"):
            v = line.split(":", 1)[1].strip()
            if v.isdigit():
                return int(v)
    return None


def download_one(url: str, dest: Path, retries: int = 3, timeout: int = 60) -> dict:
    result = {"url": url, "dest": str(dest.relative_to(ROOT)), "status": "", "bytes": 0, "error": ""}
    if dest.exists():
        local_size = dest.stat().st_size
        remote_size = head_remote_size(url)
        if remote_size is not None and remote_size == local_size:
            result["status"] = "skip-exists"
            result["bytes"] = local_size
            return result
        if remote_size is None and local_size > 0:
            result["status"] = "skip-exists-unverified"
            result["bytes"] = local_size
            return result
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    last_err = ""
    for attempt in range(1, retries + 1):
        try:
            r = _curl_run(url, timeout=timeout, head=False, output=tmp)
            if r.returncode == 0 and tmp.exists() and tmp.stat().st_size > 0:
                tmp.replace(dest)
                result["status"] = "downloaded"
                result["bytes"] = dest.stat().st_size
                return result
            last_err = (r.stderr or f"curl exit {r.returncode}").strip().splitlines()[-1] if (r.stderr or "").strip() else f"curl exit {r.returncode}"
        except Exception as e:
            last_err = f"{type(e).__name__}: {e}"
        time.sleep(1.5 * attempt)
    try:
        if tmp.exists():
            tmp.unlink()
    except OSError:
        pass
    result["status"] = "error"
    result["error"] = last_err
    return result


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="Solo plan, no descarga")
    ap.add_argument("--ext", action="append", default=[], help="Filtrar por extensión (repetible)")
    ap.add_argument("--limit", type=int, default=0, help="Máximo de URLs a procesar")
    ap.add_argument("--concurrency", type=int, default=8, help="Descargas en paralelo")
    ap.add_argument("--inventory", default=str(REPORTS_DIR / "binarios-inventario-2026-04-15.json"))
    args = ap.parse_args()

    inv_path = Path(args.inventory)
    if not inv_path.exists():
        print(f"ERROR: inventario no encontrado: {inv_path}", file=sys.stderr)
        return 2
    inventory = json.loads(inv_path.read_text(encoding="utf-8"))
    urls: list[str] = [normalize_url(u) for u in inventory["to_migrate"]]

    if args.ext:
        wanted = {e.lower().lstrip(".") for e in args.ext}
        urls = [u for u in urls if file_ext(u) in wanted]
    if args.limit:
        urls = urls[: args.limit]

    print(f"[BIN-2] URLs a procesar: {len(urls)}  (dry-run={args.dry_run})")
    refs = collect_references()

    plan = []
    for u in urls:
        referers = refs.get(u, [])
        target = plan_target(u, referers)
        plan.append({"url": u, "dest": str(target.relative_to(ROOT)), "ext": file_ext(u)})

    # Summary by destination area
    by_area = defaultdict(int)
    for item in plan:
        parts = Path(item["dest"]).parts
        area = parts[2] if len(parts) > 2 else "?"
        if area == "media" and len(parts) > 3:
            area = f"media/{parts[3]}"
        by_area[area] += 1
    print("[BIN-2] Distribución planificada:")
    for area, n in sorted(by_area.items(), key=lambda x: -x[1])[:25]:
        print(f"  {area}: {n}")

    if args.dry_run:
        out = REPORTS_DIR / f"bin2-plan-{datetime.now():%Y-%m-%d}.json"
        REPORTS_DIR.mkdir(exist_ok=True)
        out.write_text(json.dumps({"count": len(plan), "plan": plan, "by_area": dict(by_area)},
                                  ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"[BIN-2] Plan guardado en {out.relative_to(ROOT)}")
        return 0

    # Live download
    results = []
    started = time.time()
    with cf.ThreadPoolExecutor(max_workers=args.concurrency) as ex:
        futs = {ex.submit(download_one, item["url"], ROOT / item["dest"]): item for item in plan}
        for i, fut in enumerate(cf.as_completed(futs), 1):
            r = fut.result()
            results.append(r)
            if i % 25 == 0 or r["status"] == "error":
                print(f"  [{i}/{len(plan)}] {r['status']:<25} {r['dest']}")
                if r["error"]:
                    print(f"       ERROR: {r['error']}")
    elapsed = time.time() - started

    # Report
    counts = defaultdict(int)
    total_bytes = 0
    for r in results:
        counts[r["status"]] += 1
        total_bytes += r.get("bytes", 0)
    out = REPORTS_DIR / f"binarios-descargados-{datetime.now():%Y-%m-%d}.json"
    REPORTS_DIR.mkdir(exist_ok=True)
    out.write_text(json.dumps({
        "generated_at": datetime.now().isoformat(),
        "elapsed_seconds": round(elapsed, 1),
        "total": len(results),
        "total_bytes": total_bytes,
        "by_status": dict(counts),
        "results": results,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n[BIN-2] {len(results)} archivos en {elapsed:.0f}s — {total_bytes/1024/1024:.1f} MB")
    for s, n in counts.items():
        print(f"  {s}: {n}")
    print(f"[BIN-2] Reporte: {out.relative_to(ROOT)}")
    errs = [r for r in results if r["status"] == "error"]
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
