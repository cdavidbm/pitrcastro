#!/usr/bin/env node
// Migra los álbumes WP (parent page_id=2805) a JSONs locales bajo
// src/content/pages/galeria/<slug>.json, siguiendo D3 (schema Album)
// y D5 (edge cases: shortcodes Elementor, imágenes 404).
//
// Asume que /tmp/galeria-hijos-full.json ya contiene el dump de WP.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DUMP = "/tmp/galeria-hijos-full.json";
const OUT_DIR = join(ROOT, "src/content/pages/galeria");
const REPORTS_DIR = join(ROOT, "reports");
const TODAY = new Date().toISOString().slice(0, 10);

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });

const pages = JSON.parse(readFileSync(SRC_DUMP, "utf-8"));

// -- Limpieza D5 #4: strip shortcodes Elementor/VC antes de parsear imgs.
function stripShortcodes(html) {
  return html
    .replace(/\[\/?et_pb_[^\]]*\]/g, "")
    .replace(/\[\/?vc_[^\]]*\]/g, "");
}

// -- Decodifica entidades HTML comunes en atributos.
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// -- Extrae <img src alt> del HTML ya limpio. Descarta spinners/placeholders
//    (SVG base64 incrustados de lazy-loading Elementor).
function extractImages(html) {
  const out = [];
  const re = /<img\b[^>]*>/gi;
  const reDataSrc = /\bdata-src="([^"]*)"/i;
  const reSrc = /\bsrc="([^"]*)"/i;
  const reAlt = /\balt="([^"]*)"/i;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    // Si hay data-src (lazy), úsalo; si no, src.
    const dataSrc = tag.match(reDataSrc);
    const src = tag.match(reSrc);
    const alt = tag.match(reAlt);
    const url = decodeEntities((dataSrc?.[1] || src?.[1] || "").trim());
    if (!url) continue;
    if (url.startsWith("data:")) continue; // Spinners base64.
    if (url.includes("/plugins/") || url.includes("/themes/")) continue;
    out.push({ url, alt: alt ? decodeEntities(alt[1]).trim() : "" });
  }
  // Dedup por URL, conservando primer alt no vacío.
  const byUrl = new Map();
  for (const im of out) {
    const prev = byUrl.get(im.url);
    if (!prev || (!prev.alt && im.alt)) byUrl.set(im.url, im);
  }
  return [...byUrl.values()];
}

// -- HEAD check en paralelo con concurrencia limitada.
async function checkUrls(urls, concurrency = 8) {
  const results = new Map();
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < urls.length) {
      const idx = i++;
      const url = urls[idx];
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 15000);
        const res = await fetch(url, { method: "HEAD", signal: ctrl.signal, redirect: "follow" });
        clearTimeout(t);
        results.set(url, res.ok ? "ok" : `http_${res.status}`);
      } catch (err) {
        results.set(url, `err_${err.name || "fetch"}`);
      }
    }
  });
  await Promise.all(workers);
  return results;
}

// -- Colecta todas las imágenes primero, HEAD-chequea en bloque, luego escribe.
const perAlbum = [];
for (const p of pages) {
  const html = stripShortcodes(p.content?.rendered || "");
  const imgs = extractImages(html);
  perAlbum.push({ page: p, imgs });
}

const allUrls = [...new Set(perAlbum.flatMap((a) => a.imgs.map((i) => i.url)))];
console.log(`HEAD-checking ${allUrls.length} URLs únicas en ${perAlbum.length} álbumes...`);
const checks = await checkUrls(allUrls, 10);

const broken = [];
const empty = [];
let writtenAlbums = 0;
let writtenImages = 0;

for (const { page, imgs } of perAlbum) {
  const ok = [];
  for (const im of imgs) {
    const status = checks.get(im.url);
    if (status === "ok") ok.push(im);
    else broken.push({ slug: page.slug, url: im.url, status });
  }

  if (ok.length === 0) {
    empty.push({ slug: page.slug, title: page.title?.rendered });
    continue;
  }

  const slug = page.slug;
  const date = (page.date || "").slice(0, 10);
  const titulo = decodeEntities(page.title?.rendered || slug)
    .replace(/<[^>]+>/g, "")
    .trim();

  const album = {
    titulo,
    slug,
    fecha: date,
    descripcion: "",
    portada: { url: ok[0].url, alt: ok[0].alt || titulo },
    imagenes: ok.map((im) => ({
      url: im.url,
      alt: im.alt || titulo,
      ...(im.alt && im.alt !== titulo ? { caption: im.alt } : {}),
    })),
    originalUrl: page.link,
  };

  writeFileSync(join(OUT_DIR, `${slug}.json`), JSON.stringify(album, null, 2) + "\n", "utf-8");
  writtenAlbums++;
  writtenImages += ok.length;
}

// Reportes.
if (broken.length > 0) {
  const lines = [
    `# Broken assets — galería — ${TODAY}`,
    "",
    `Total imágenes con problemas: ${broken.length}`,
    "",
    "| Álbum | URL | Status |",
    "|-------|-----|--------|",
    ...broken.map((b) => `| ${b.slug} | ${b.url} | ${b.status} |`),
  ];
  writeFileSync(join(REPORTS_DIR, `broken-assets-${TODAY}.md`), lines.join("\n") + "\n");
}

if (empty.length > 0) {
  const lines = [
    `# Álbumes vacíos — galería — ${TODAY}`,
    "",
    "Álbumes saltados porque ninguna imagen resultó válida tras HEAD-check:",
    "",
    ...empty.map((e) => `- \`${e.slug}\` — ${e.title}`),
  ];
  writeFileSync(join(REPORTS_DIR, `empty-albums-${TODAY}.md`), lines.join("\n") + "\n");
}

console.log(`\n== REPORTE GALERÍA ==`);
console.log(`Álbumes migrados:        ${writtenAlbums} (esperado 24)`);
console.log(`Álbumes saltados vacíos: ${empty.length}`);
console.log(`Imágenes totales:        ${writtenImages}`);
console.log(`Imágenes 404/err:        ${broken.length}`);
console.log(`JSONs escritos en:       ${OUT_DIR}`);
if (broken.length) console.log(`Broken:  reports/broken-assets-${TODAY}.md`);
if (empty.length) console.log(`Vacíos:  reports/empty-albums-${TODAY}.md`);
