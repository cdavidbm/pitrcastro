#!/usr/bin/env python3
"""
BIN-4 — Reescritura de URLs de binarios en JSONs y Markdown.

Reemplaza URLs de WP legacy:
  https://www.itrc.gov.co/Itrc/wp-content/uploads/<path>
  https://www.itrc.gov.co/Itrc/pestana/documentos/<path>

Por URLs locales:
  {DOCS_BASE_URL}/<area>/<filename>

Donde <area> se infiere del archivo JSON que contiene la URL
(misma lógica que download-binaries.py).

Uso:
  python3 scripts/rewrite-urls.py --dry-run              # reporta sin modificar
  python3 scripts/rewrite-urls.py --dry-run --docs-base /documentos
  python3 scripts/rewrite-urls.py --docs-base /documentos # reescritura real
  python3 scripts/rewrite-urls.py --docs-base https://documentos.itrc.gov.co
  python3 scripts/rewrite-urls.py --revert                # revierte a URLs WP
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src" / "content"
PAGES_DIR = ROOT / "src" / "pages"
PUBLIC_DOCS = ROOT / "public" / "documentos"

WP_URL_RE = re.compile(
    r'https?://(?:www\.)?itrc\.gov\.co/Itrc/'
    r'(?:wp-content/uploads/|pestana/documentos/)'
    r'[^\s"\'<>()\\,;]+',
    re.IGNORECASE,
)

MEDIA_EXT = {"jpg", "jpeg", "png", "mp4", "mp3", "gif", "webp"}

# Area inference: same logic as download-binaries.py
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
    "institucional": "institucional",
}


def normalize_url(u: str) -> str:
    return unicodedata.normalize("NFC", unquote(u.rstrip('.,);:\'"')))


def file_ext(u: str) -> str:
    path = urlparse(u).path.lower()
    m = re.search(r"\.([a-z0-9]{2,5})$", path)
    return m.group(1) if m else ""


def filename_from_url(u: str) -> str:
    path = urlparse(u).path
    name = unquote(path.rsplit("/", 1)[-1])
    name = unicodedata.normalize("NFC", name)
    name = re.sub(r"[\x00-\x1f]", "", name).strip()
    return name or "archivo"


def year_from_url(u: str) -> str:
    m = re.search(r"/uploads/(\d{4})/", u)
    if m:
        return m.group(1)
    return "sin-fecha"


def classify_area_from_file(json_path: Path) -> str:
    try:
        rel = json_path.relative_to(ROOT)
    except ValueError:
        return "misc"
    parts = rel.parts
    if len(parts) >= 3 and parts[0] == "src" and parts[1] == "content" and parts[2] == "news":
        return "media/prensa"
    if len(parts) >= 4 and parts[0] == "src" and parts[1] == "content" and parts[2] == "pages":
        top = parts[3]
        if top.endswith(".json") or top.endswith(".md"):
            stem = re.sub(r"\.(json|md)$", "", top)
            return AREA_MAP.get(stem, stem)
        return AREA_MAP.get(top, top)
    if len(parts) >= 4 and parts[0] == "src" and parts[1] == "content":
        folder = parts[2]
        return AREA_MAP.get(folder, folder)
    if len(parts) >= 3 and parts[0] == "src" and parts[1] == "pages":
        stem = re.sub(r"\.astro$", "", parts[-1])
        return AREA_MAP.get(stem, stem)
    return "misc"


def compute_new_url(wp_url: str, docs_base: str, area: str) -> str:
    """Map a WP URL to its new local URL."""
    ext = file_ext(wp_url)
    fname = filename_from_url(wp_url)

    if ext in MEDIA_EXT:
        year = year_from_url(wp_url)
        return f"{docs_base}/media/{year}/{fname}"
    return f"{docs_base}/{area}/{fname}"


def build_rewrite_map(docs_base: str) -> dict[str, dict]:
    """Scan all content files, build wp_url → {new_url, area, file} map."""
    rewrites: dict[str, dict] = {}
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
                area = classify_area_from_file(p)
                for m in WP_URL_RE.findall(text):
                    norm = normalize_url(m)
                    if norm not in rewrites:
                        new_url = compute_new_url(norm, docs_base, area)
                        rewrites[norm] = {
                            "original": m,
                            "new_url": new_url,
                            "area": area,
                            "files": [],
                        }
                    rewrites[norm]["files"].append(str(p.relative_to(ROOT)))
    return rewrites


def apply_rewrites(rewrites: dict[str, dict], dry_run: bool) -> dict:
    """Apply URL rewrites to all files. Returns stats."""
    # Group by file
    file_rewrites: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for info in rewrites.values():
        for fpath in set(info["files"]):
            file_rewrites[fpath].append((info["original"], info["new_url"]))

    stats = {"files_modified": 0, "urls_rewritten": 0, "files_skipped": 0}

    for rel_path, replacements in sorted(file_rewrites.items()):
        fpath = ROOT / rel_path
        try:
            original_text = fpath.read_text(encoding="utf-8")
        except OSError:
            stats["files_skipped"] += 1
            continue

        new_text = original_text
        count = 0
        for old_url, new_url in replacements:
            if old_url in new_text:
                new_text = new_text.replace(old_url, new_url)
                count += 1

        if new_text != original_text:
            if not dry_run:
                fpath.write_text(new_text, encoding="utf-8")
            stats["files_modified"] += 1
            stats["urls_rewritten"] += count

    return stats


def build_revert_map() -> dict[str, dict]:
    """Find all rewritten URLs (matching docs_base pattern) and map back to WP.

    This requires a mapping file from the last rewrite run.
    """
    map_file = ROOT / "reports" / "bin4-rewrite-map.json"
    if not map_file.exists():
        print(f"ERROR: no se encontró {map_file.relative_to(ROOT)} para revertir.", file=sys.stderr)
        print("  Ejecute primero una reescritura (sin --revert) para generar el mapa.", file=sys.stderr)
        return {}
    data = json.loads(map_file.read_text(encoding="utf-8"))
    # Invert: new_url → original
    reverts = {}
    for norm, info in data["rewrites"].items():
        reverts[info["new_url"]] = {
            "original": info["original"],
            "new_url": info["original"],  # revert TO original
            "area": info["area"],
            "files": info["files"],
        }
    return reverts


def main() -> int:
    ap = argparse.ArgumentParser(description="BIN-4: reescritura de URLs de binarios")
    ap.add_argument("--docs-base", default="/documentos",
                    help="URL base para documentos (default: /documentos)")
    ap.add_argument("--dry-run", action="store_true",
                    help="Solo reportar, no modificar archivos")
    ap.add_argument("--revert", action="store_true",
                    help="Revertir la última reescritura (requiere reports/bin4-rewrite-map.json)")
    args = ap.parse_args()

    if args.revert:
        print("[BIN-4] Modo REVERT: restaurando URLs originales de WP...")
        rewrites = build_revert_map()
        if not rewrites:
            return 2
    else:
        print(f"[BIN-4] DOCS_BASE_URL = {args.docs_base}")
        print(f"[BIN-4] dry-run = {args.dry_run}")
        rewrites = build_rewrite_map(args.docs_base)

    print(f"[BIN-4] URLs a reescribir: {len(rewrites)}")

    # Summary by area
    by_area = defaultdict(int)
    for info in rewrites.values():
        by_area[info["area"]] += 1
    for area, n in sorted(by_area.items(), key=lambda x: -x[1])[:15]:
        print(f"  {area}: {n}")

    # Verify target files exist locally (warning only)
    if not args.revert:
        missing = 0
        for info in rewrites.values():
            local_path = ROOT / "public" / info["new_url"].lstrip("/")
            if not local_path.exists():
                missing += 1
        if missing:
            print(f"\n[BIN-4] AVISO: {missing} archivos NO existen localmente en public/documentos/")
            print(f"  Estos darán 404 si el hosting apunta al filesystem local.")

    stats = apply_rewrites(rewrites, dry_run=args.dry_run)

    print(f"\n[BIN-4] {'DRY-RUN' if args.dry_run else 'COMPLETADO'}:")
    print(f"  Archivos modificados: {stats['files_modified']}")
    print(f"  URLs reescritas: {stats['urls_rewritten']}")
    print(f"  Archivos con error: {stats['files_skipped']}")

    # Save rewrite map for revert capability
    if not args.dry_run and not args.revert:
        map_file = ROOT / "reports" / "bin4-rewrite-map.json"
        map_file.parent.mkdir(exist_ok=True)
        serializable = {}
        for norm, info in rewrites.items():
            serializable[norm] = {
                "original": info["original"],
                "new_url": info["new_url"],
                "area": info["area"],
                "files": list(set(info["files"])),
            }
        map_file.write_text(json.dumps({
            "docs_base": args.docs_base,
            "count": len(rewrites),
            "rewrites": serializable,
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\n[BIN-4] Mapa de reescritura guardado en {map_file.relative_to(ROOT)}")
        print(f"  (usar --revert para restaurar URLs de WP)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
