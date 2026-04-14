#!/usr/bin/env node
// Migra los 39 posts de categoría `memorias-eje-participacion` del Observatorio
// WP a páginas internas + regenera el listado por año.
//
// Mismo flujo que migrate-memorias-participacion; sólo cambian rutas.
// Uso: NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/migrate-memorias-participacion.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DUMP = "/tmp/lote-c-full.json";
const OUT_DIR = join(ROOT, "src/content/pages/observatorio/eje-de-participacion/memorias");
const LISTADO_PATH = join(ROOT, "src/content/pages/observatorio/eje-de-participacion/memorias.json");
const REPORTS_DIR = join(ROOT, "reports");
const TODAY = new Date().toISOString().slice(0, 10);
const PLACEHOLDER = "/images/placeholder-itrc.svg";
const SLUG_MAX = 80;

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });

// -- Limpia runs previos para no dejar huérfanos si cambian slugs.
for (const f of readdirSync(OUT_DIR)) {
  if (f.endsWith(".json")) unlinkSync(join(OUT_DIR, f));
}

const posts = JSON.parse(readFileSync(SRC_DUMP, "utf-8"));

// -- D5 #4: strip shortcodes Elementor + Visual Composer.
function stripShortcodes(html) {
  return html
    .replace(/\[\/?et_pb_[^\]]*\]/g, "")
    .replace(/\[\/?vc_[^\]]*\]/g, "")
    .replace(/\[\/?pb_[^\]]*\]/g, "")
    // Colapsa `//` duplicados en atributos href/src (D5).
    .replace(/(src|href)="([^"]*?)"/g, (_, attr, url) => {
      const clean = url.replace(/([^:])\/\/+/g, "$1/");
      return `${attr}="${clean}"`;
    });
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

// -- D4: slug ASCII kebab, truncado preservando palabras. Descarta fechas
//    largas "-1-de-junio-de-2023" al final cuando el slug rebasa el máximo.
function normalizeSlug(raw) {
  const ascii = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (ascii.length <= SLUG_MAX) return ascii;
  // Corta en el último guión antes del límite.
  const cut = ascii.slice(0, SLUG_MAX);
  const last = cut.lastIndexOf("-");
  return (last > SLUG_MAX / 2 ? cut.slice(0, last) : cut).replace(/-+$/, "");
}

// -- Extrae imágenes <img> del HTML limpio. data-src > src.
function extractImages(html) {
  const out = [];
  const re = /<img\b[^>]*>/gi;
  const reDataSrc = /\bdata-src="([^"]*)"/i;
  const reSrc = /\bsrc="([^"]*)"/i;
  const reAlt = /\balt="([^"]*)"/i;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const dataSrc = tag.match(reDataSrc);
    const src = tag.match(reSrc);
    const alt = tag.match(reAlt);
    const url = decodeEntities((dataSrc?.[1] || src?.[1] || "").trim());
    if (!url || url.startsWith("data:")) continue;
    if (url.includes("/plugins/") || url.includes("/themes/")) continue;
    out.push({ url, alt: alt ? decodeEntities(alt[1]).trim() : "" });
  }
  const byUrl = new Map();
  for (const im of out) {
    const prev = byUrl.get(im.url);
    if (!prev || (!prev.alt && im.alt)) byUrl.set(im.url, im);
  }
  return [...byUrl.values()];
}

// -- HEAD check paralelo (mismo patrón que Lote A).
async function checkUrls(urls, concurrency = 10) {
  const results = new Map();
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < urls.length) {
      const url = urls[i++];
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

// -- Resuelve featured_media en bloque.
async function fetchFeaturedMedia(ids) {
  if (ids.length === 0) return new Map();
  const chunks = [];
  for (let i = 0; i < ids.length; i += 50) chunks.push(ids.slice(i, i + 50));
  const out = new Map();
  for (const chunk of chunks) {
    const url = `https://www.itrc.gov.co/observatorio/wp-json/wp/v2/media?include=${chunk.join(",")}&per_page=50&_fields=id,source_url,alt_text`;
    // ^ misma REST del observatorio que B
    const res = await fetch(url);
    if (!res.ok) continue;
    const media = await res.json();
    for (const m of media) out.set(m.id, { url: m.source_url, alt: m.alt_text || "" });
  }
  return out;
}

// ============================================================
// 1. Limpieza + parseo de cada post
// ============================================================

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "_",
  strongDelimiter: "**",
});
// Mantener <strong><em><a><img> limpios; descartar style/class (D5).
turndown.addRule("stripStyle", {
  filter: (node) => node.nodeType === 1 && (node.getAttribute("style") || node.getAttribute("class")),
  replacement: (content, node, options) => {
    node.removeAttribute("style");
    node.removeAttribute("class");
    // Re-procesa con reglas estándar.
    return turndown.turndown(node.outerHTML);
  },
});

const featuredIds = [...new Set(posts.map((p) => p.featured_media).filter((x) => x && x > 0))];
console.log(`Resolviendo ${featuredIds.length} featured_media en bloque...`);
const featuredMap = await fetchFeaturedMedia(featuredIds);

// Detecta colisiones de slug (D4).
const slugCounts = new Map();
const slugByPostId = new Map();
for (const p of posts) {
  let slug = normalizeSlug(p.slug || p.title?.rendered || `post-${p.id}`);
  // Resolución determinista: si ya existe, sufijo -2, -3...
  if (slugCounts.has(slug)) {
    const n = slugCounts.get(slug) + 1;
    slugCounts.set(slug, n);
    slug = `${slug}-${n}`.slice(0, SLUG_MAX);
  } else {
    slugCounts.set(slug, 1);
  }
  slugByPostId.set(p.id, slug);
}

// ============================================================
// 2. Colecta todas las URLs de imágenes para HEAD-check en bloque
// ============================================================

const perPost = posts.map((p) => {
  const cleaned = stripShortcodes(p.content?.rendered || "");
  const imgs = extractImages(cleaned);
  return { post: p, cleaned, imgs };
});

const allImgUrls = [
  ...new Set([
    ...perPost.flatMap((pp) => pp.imgs.map((i) => i.url)),
    ...[...featuredMap.values()].map((m) => m.url),
  ]),
];
console.log(`HEAD-checking ${allImgUrls.length} imágenes (inline + featured)...`);
const imgChecks = await checkUrls(allImgUrls, 12);

// ============================================================
// 3. Escribe JSONs
// ============================================================

const broken = [];
const emptyPosts = [];
let placeholderUses = 0;
const written = [];

for (const { post, cleaned, imgs } of perPost) {
  const slug = slugByPostId.get(post.id);
  const titulo = decodeEntities(post.title?.rendered || "").replace(/<[^>]+>/g, "").trim();
  const resumen = decodeEntities(post.excerpt?.rendered || "")
    .replace(/<[^>]+>/g, "")
    .trim()
    .slice(0, 400);

  // Validación imágenes inline: filtra broken.
  const validImgs = [];
  for (const im of imgs) {
    const s = imgChecks.get(im.url);
    if (s === "ok") validImgs.push(im);
    else broken.push({ slug, url: im.url, status: s });
  }

  // Featured: si 404/ausente → placeholder (D5).
  const fm = post.featured_media ? featuredMap.get(post.featured_media) : null;
  let imagenDestacada;
  if (fm && imgChecks.get(fm.url) === "ok") {
    imagenDestacada = fm.url;
  } else {
    if (fm) broken.push({ slug, url: fm.url, status: imgChecks.get(fm.url) || "not_in_media" });
    imagenDestacada = PLACEHOLDER;
    placeholderUses++;
  }

  // Limpia class/style antes de turndown.
  const forTurndown = cleaned
    .replace(/\s(class|style)="[^"]*"/gi, "")
    .replace(/\s(class|style)='[^']*'/gi, "");

  let contenidoMd = "";
  try {
    contenidoMd = turndown.turndown(forTurndown).trim();
  } catch {
    contenidoMd = "";
  }

  // D5 #7: contenido vacío tras limpiar → skip.
  if (!contenidoMd) {
    emptyPosts.push({ slug, title: titulo, id: post.id });
    continue;
  }

  const postJson = {
    titulo,
    slug,
    fecha: (post.date || "").slice(0, 10),
    resumen,
    contenido: contenidoMd,
    imagenDestacada,
    galeria: validImgs.map((im) => ({ url: im.url, alt: im.alt || titulo })),
    originalUrl: post.link,
  };

  writeFileSync(join(OUT_DIR, `${slug}.json`), JSON.stringify(postJson, null, 2) + "\n", "utf-8");
  written.push({ slug, anio: postJson.fecha.slice(0, 4), titulo, fecha: postJson.fecha, imagen: imagenDestacada });
}

// ============================================================
// 4. Regenera listado por año (opción A del usuario)
// ============================================================

// Fecha humana para la tarjeta: "5 de junio de 2024".
const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
function fechaHumana(iso) {
  const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return iso;
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

const porAnio = new Map();
for (const w of written) {
  if (!porAnio.has(w.anio)) porAnio.set(w.anio, []);
  porAnio.get(w.anio).push(w);
}
// Orden años descendente, entradas por fecha descendente.
const aniosOrdenados = [...porAnio.keys()].sort((a, b) => b.localeCompare(a));
const nuevosAnios = aniosOrdenados.map((anio) => ({
  anio,
  entradas: porAnio.get(anio)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((e) => ({
      titulo: e.titulo,
      fecha: fechaHumana(e.fecha),
      imagen: e.imagen,
      url: `/observatorio/eje-de-educacion/memorias/${e.slug}`,
    })),
}));

const listadoActual = JSON.parse(readFileSync(LISTADO_PATH, "utf-8"));
const nuevoListado = {
  ...listadoActual,
  anios: nuevosAnios,
};
writeFileSync(LISTADO_PATH, JSON.stringify(nuevoListado, null, 2) + "\n", "utf-8");

// ============================================================
// 5. Reportes
// ============================================================

if (broken.length > 0) {
  const lines = [
    `# Broken assets — memorias eje educación — ${TODAY}`,
    "",
    `Total imágenes con fallo HEAD: ${broken.length}`,
    "",
    "| Slug | URL | Status |",
    "|------|-----|--------|",
    ...broken.map((b) => `| ${b.slug} | ${b.url} | ${b.status} |`),
  ];
  writeFileSync(join(REPORTS_DIR, `broken-assets-memorias-participacion-${TODAY}.md`), lines.join("\n") + "\n");
}

if (emptyPosts.length > 0) {
  const lines = [
    `# Posts vacíos — memorias eje educación — ${TODAY}`,
    "",
    "Posts saltados porque el contenido quedó vacío tras limpieza:",
    "",
    ...emptyPosts.map((e) => `- \`${e.slug}\` (id ${e.id}) — ${e.title}`),
  ];
  writeFileSync(join(REPORTS_DIR, `empty-posts-memorias-participacion-${TODAY}.md`), lines.join("\n") + "\n");
}

// Reporte de colisiones de slug resueltas.
const colisiones = [...slugCounts.entries()].filter(([, n]) => n > 1);

console.log(`\n== REPORTE LOTE C — Memorias Eje Participación ==`);
console.log(`Posts procesados:         ${written.length} (esperado 39)`);
console.log(`Posts saltados por vacío: ${emptyPosts.length}`);
console.log(`Posts con placeholder:    ${placeholderUses}`);
console.log(`Colisiones slug (-N):     ${colisiones.length}`);
console.log(`Imágenes rotas excluidas: ${broken.length}`);
console.log(`JSONs:                    ${OUT_DIR}`);
console.log(`Listado regenerado:       ${LISTADO_PATH}`);
if (broken.length) console.log(`Broken:  reports/broken-assets-memorias-participacion-${TODAY}.md`);
if (emptyPosts.length) console.log(`Vacíos:  reports/empty-posts-memorias-participacion-${TODAY}.md`);
