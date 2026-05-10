#!/usr/bin/env node
/**
 * AUDIT 4 — Detecta contenido hardcoded en .astro que debería vivir en Strapi.
 *
 * Heurísticas (conservadoras, optimizadas para precisión sobre recall):
 *  - json-import         import X from "*.json" en src/content/ (legacy fallback)
 *  - glob-import         import.meta.glob("*.json") sobre src/content/
 *  - content-array       const X = [{...}, ...] en frontmatter con shape de contenido
 *  - long-attr           atributo (no class/style/href/src) con valor > 100 chars
 *  - long-string         literal de string > 100 chars en frontmatter
 *  - long-text           texto plano > 150 chars entre tags en el template
 *  - hardcoded-path      ruta /documentos/... o /uploads/... fuera de JSON externo
 *
 * Cruza resultados con AUDIT-3 §"Páginas .astro sin fetcher" para marcar
 * los casos críticos (página 100% hardcoded) vs mixtos (Strapi + hardcoded).
 *
 * Produce: .local-docs/AUDIT-4-HARDCODED.md (no edita .astro).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const FETCHERS_FILE = path.join(ROOT, 'src', 'utils', 'strapi-fetchers.ts');
const AUDIT3 = path.join(ROOT, '.local-docs', 'AUDIT-3-COHERENCE.md');
const OUT = path.join(ROOT, '.local-docs', 'AUDIT-4-HARDCODED.md');

// ---------- Utilidades genéricas ----------

function walk(dir, ext) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, ext));
    else if (!ext || entry.name.endsWith(ext)) out.push(p);
  }
  return out;
}

function lineOf(txt, offset) {
  let line = 1;
  const max = Math.min(offset, txt.length);
  for (let i = 0; i < max; i++) if (txt[i] === '\n') line++;
  return line;
}

function snippet(s, n = 50) {
  const flat = s.replace(/\s+/g, ' ').trim();
  if (flat.length <= n) return flat;
  return flat.slice(0, n) + '…';
}

function escapeMd(s) {
  return s.replace(/\|/g, '\\|').replace(/`/g, '\\`');
}

function loadFetcherNames() {
  if (!fs.existsSync(FETCHERS_FILE)) return [];
  const txt = fs.readFileSync(FETCHERS_FILE, 'utf8');
  const re = /export const (get[A-Za-z0-9_]+)\s*=/g;
  const out = [];
  let m;
  while ((m = re.exec(txt)) !== null) out.push(m[1]);
  return out;
}

function hasIdent(txt, name) {
  let idx = 0;
  while (true) {
    const f = txt.indexOf(name, idx);
    if (f < 0) return false;
    const b = f === 0 ? '' : txt[f - 1];
    const a = txt[f + name.length] || '';
    const isBoundary = (c) => c === '' || !/[A-Za-z0-9_$]/.test(c);
    if (isBoundary(b) && isBoundary(a)) return true;
    idx = f + 1;
  }
}

// Lee la lista de "Páginas .astro sin fetcher" del AUDIT-3 (sin reparsear).
function loadSinFetcher() {
  if (!fs.existsSync(AUDIT3)) return new Set();
  const txt = fs.readFileSync(AUDIT3, 'utf8');
  const start = txt.indexOf('## Páginas .astro sin fetcher');
  if (start < 0) return new Set();
  const sub = txt.slice(start);
  const set = new Set();
  const re = /-\s+`([^`]+\.astro)`/g;
  let m;
  while ((m = re.exec(sub)) !== null) set.add(m[1]);
  return set;
}

// ---------- Splitters ----------

function splitFrontmatter(txt) {
  if (!txt.startsWith('---')) return { fm: '', body: txt, fmStart: 0, fmEnd: 0, bodyStart: 0 };
  const close = txt.indexOf('\n---', 3);
  if (close < 0) return { fm: '', body: txt, fmStart: 0, fmEnd: 0, bodyStart: 0 };
  const bodyStart = close + 4;
  return {
    fm: txt.slice(3, close),
    body: txt.slice(bodyStart),
    fmStart: 3,
    fmEnd: close,
    bodyStart,
  };
}

// Reemplaza <style>...</style> y <script>...</script> con espacios/newlines preservando offsets.
function stripStyleScript(body) {
  return body.replace(/<style\b[\s\S]*?<\/style>/gi, m => m.replace(/[^\n]/g, ' '))
             .replace(/<script\b[\s\S]*?<\/script>/gi, m => m.replace(/[^\n]/g, ' '));
}

// ---------- Detectores ----------

const IGNORED_ATTRS = new Set([
  'class', 'class:list', 'style', 'href', 'src', 'srcset', 'id', 'name', 'type',
  'role', 'slot', 'rel', 'target', 'lang', 'xmlns', 'viewBox', 'fill', 'stroke',
  'd', 'pathLength', 'preserveAspectRatio', 'data-tab', 'data-pagination',
  'data-vigencia', 'data-page', 'data-label', 'data-category', 'data-strapi-slug',
  'method', 'action', 'enctype', 'autocomplete', 'autocapitalize', 'inputmode',
  'pattern', 'min', 'max', 'step', 'maxlength', 'minlength', 'tabindex',
  'aria-controls', 'aria-labelledby', 'aria-describedby', 'aria-expanded',
  'aria-selected', 'aria-hidden', 'aria-disabled', 'aria-current',
  'loading', 'decoding', 'crossorigin', 'integrity', 'media', 'sizes',
  'transform', 'opacity', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height',
]);

// Atributos que más comúnmente cargan contenido editorial.
const CONTENT_ATTRS = new Set([
  'title', 'subtitle', 'description', 'content', 'summary', 'caption',
  'placeholder', 'aria-label', 'alt',
]);

// Detector A — JSON imports estáticos desde src/content/
function detectJsonImports(file, fm, fmOffset, txt, findings) {
  const re = /import\s+(?:\w+|\{[^}]+\})\s+from\s+["'](\.\.[\/\\][^"']*content[\/\\][^"']*\.json)["']/g;
  let m;
  while ((m = re.exec(fm)) !== null) {
    const ln = lineOf(txt, fmOffset + m.index);
    findings.push({
      file,
      line: ln,
      type: 'json-import',
      snippet: snippet(m[1]),
      suggestion: 'mover a Strapi y reemplazar por fetcher',
    });
  }
}

// Detector B — import.meta.glob sobre src/content/
function detectGlobImports(file, fm, fmOffset, txt, findings) {
  const re = /import\.meta\.glob[^;]*?["']([^"']*content[^"']*\.json)["']/g;
  let m;
  while ((m = re.exec(fm)) !== null) {
    const ln = lineOf(txt, fmOffset + m.index);
    findings.push({
      file,
      line: ln,
      type: 'glob-import',
      snippet: snippet(m[1]),
      suggestion: 'modelar como collection-type en Strapi',
    });
  }
}

// Detector C — Arrays inline con shape de contenido
function detectContentArrays(file, fm, fmOffset, txt, findings) {
  const re = /const\s+(\w+)\s*(?::\s*[^=]+)?\s*=\s*\[/g;
  let m;
  while ((m = re.exec(fm)) !== null) {
    const arrStart = m.index + m[0].length - 1; // posición del '['
    const block = extractBracketBlock(fm, arrStart);
    if (!block) continue;
    const items = countItemObjects(block);
    if (items < 3) continue;
    if (!looksLikeContent(block)) continue;
    const ln = lineOf(txt, fmOffset + m.index);
    const name = m[1];
    findings.push({
      file,
      line: ln,
      type: 'content-array',
      snippet: snippet(`${name} (${items} items): ${block.slice(0, 80)}`),
      suggestion: 'modelar como collection-type o repeatable component en Strapi',
    });
  }
}

function extractBracketBlock(s, openIdx) {
  if (s[openIdx] !== '[') return null;
  let depth = 0;
  let inStr = null;
  let escape = false;
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (inStr) {
      if (c === '\\') escape = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return s.slice(openIdx, i + 1);
    }
  }
  return null;
}

function countItemObjects(block) {
  let depth = 0;
  let topObjs = 0;
  let inStr = null;
  let escape = false;
  for (let i = 0; i < block.length; i++) {
    const c = block[i];
    if (escape) { escape = false; continue; }
    if (inStr) {
      if (c === '\\') escape = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{') {
      if (depth === 0) topObjs++;
      depth++;
    } else if (c === '}') depth--;
  }
  return topObjs;
}

function looksLikeContent(block) {
  // Necesitamos al menos UNA clave editorial fuerte.
  const editorial = /\b(title|titulo|name|nombre|description|descripcion|subtitle|subtitulo|content|contenido|text|texto|pdfUrl|pdf|file|documents|documentos|url|href|expediente)\s*:/i;
  if (!editorial.test(block)) return false;
  // Rechazar listas claramente UI: solo {label, href} o {label, icon} o {id, label}.
  // Heurística: si las únicas keys son label/href/icon/id/active, es navegación.
  const keys = [...block.matchAll(/(\w+)\s*:/g)].map(m => m[1].toLowerCase());
  const uniq = [...new Set(keys)];
  const navKeys = new Set(['label', 'href', 'icon', 'id', 'active', 'count', 'entries']);
  const allNav = uniq.every(k => navKeys.has(k));
  if (allNav) return false;
  return true;
}

// Detector D — Atributos largos
function detectLongAttrs(file, body, bodyOffset, txt, findings) {
  const stripped = stripStyleScript(body);
  // Captura attr="..." y attr='...'  (no expresiones ${} ni {}).
  const re = /([\w:.\-]+)=("([^"]{100,})"|'([^']{100,})')/g;
  let m;
  while ((m = re.exec(stripped)) !== null) {
    const attr = m[1];
    const val = m[3] ?? m[4] ?? '';
    if (IGNORED_ATTRS.has(attr)) continue;
    if (attr.startsWith('data-')) continue;
    if (attr.startsWith('on')) continue;
    if (!/\s/.test(val)) continue; // sin espacios → no es lenguaje natural
    if (/^[#a-z0-9_-]+$/i.test(val)) continue;
    const ln = lineOf(txt, bodyOffset + m.index);
    findings.push({
      file,
      line: ln,
      type: 'long-attr',
      snippet: snippet(`${attr}=${val}`, 70),
      suggestion: CONTENT_ATTRS.has(attr)
        ? 'mover a campo Strapi'
        : 'revisar — contenido largo en atributo',
    });
  }
}

// Detector E — Strings literales largos en frontmatter
// Solo strings de UNA SOLA línea para evitar falsos positivos por
// emparejamiento accidental de `'` cierre/apertura entre tokens JS.
function detectLongStringsFm(file, fm, fmOffset, txt, findings) {
  const re = /(?:"([^"\\\n]{100,})"|'([^'\\\n]{100,})'|`([^`\\$\n]{100,})`)/g;
  let m;
  while ((m = re.exec(fm)) !== null) {
    const v = m[1] ?? m[2] ?? m[3] ?? '';
    if (!v) continue;
    if (/\.(json|ts|astro|tsx|js|mjs|css)$/.test(v)) continue;
    if (!/\s/.test(v)) continue;
    if (v.split(' ').length < 6) continue; // ≥ 6 palabras → probable prosa
    const ln = lineOf(txt, fmOffset + m.index);
    findings.push({
      file,
      line: ln,
      type: 'long-string',
      snippet: snippet(v, 70),
      suggestion: 'mover a campo Strapi',
    });
  }
}

// Detector F — Bloques de texto largos entre tags
function detectLongText(file, body, bodyOffset, txt, findings) {
  const stripped = stripStyleScript(body);
  // Texto entre > y < sin {, } o tags. Mínimo 150 chars y al menos 2 oraciones-ish.
  const re = />([^<>{}]{150,})</g;
  let m;
  while ((m = re.exec(stripped)) !== null) {
    const v = m[1];
    if (!/\s/.test(v)) continue;
    if (!/[a-záéíóúñ]/i.test(v)) continue; // necesita letras
    const wordCount = v.trim().split(/\s+/).length;
    if (wordCount < 20) continue;
    const ln = lineOf(txt, bodyOffset + m.index);
    findings.push({
      file,
      line: ln,
      type: 'long-text',
      snippet: snippet(v, 70),
      suggestion: 'mover a campo Strapi (rich text o texto)',
    });
  }
}

// Detector G — Rutas /documentos/ o /uploads/ hardcoded
function detectHardcodedPaths(file, fullTxt, findings) {
  // Excluir comentarios obvios.
  const re = /["'`](\/(?:documentos|uploads)\/[A-Za-z0-9._\-\/%]+)["'`]/g;
  let m;
  while ((m = re.exec(fullTxt)) !== null) {
    const ln = lineOf(fullTxt, m.index);
    findings.push({
      file,
      line: ln,
      type: 'hardcoded-path',
      snippet: snippet(m[1], 70),
      suggestion: 'servir desde Strapi (media library /uploads o getter del CMS)',
    });
  }
}

// ---------- Procesamiento ----------

function analyzeFile(absPath, fetcherNames) {
  const txt = fs.readFileSync(absPath, 'utf8');
  const file = path.relative(ROOT, absPath);
  const findings = [];

  const { fm, body, fmStart, bodyStart } = splitFrontmatter(txt);

  if (fm) {
    detectJsonImports(file, fm, fmStart, txt, findings);
    detectGlobImports(file, fm, fmStart, txt, findings);
    detectContentArrays(file, fm, fmStart, txt, findings);
    detectLongStringsFm(file, fm, fmStart, txt, findings);
  }
  if (body) {
    detectLongAttrs(file, body, bodyStart, txt, findings);
    detectLongText(file, body, bodyStart, txt, findings);
  }
  detectHardcodedPaths(file, txt, findings);

  const usesFetcher = fetcherNames.some(n => hasIdent(txt, n));
  return { findings, usesFetcher };
}

function main() {
  const fetcherNames = loadFetcherNames();
  const sinFetcher = loadSinFetcher();

  const files = [
    ...walk(PAGES_DIR, '.astro'),
    ...walk(COMPONENTS_DIR, '.astro'),
  ];

  const allFindings = [];
  // file → { findings: count, usesFetcher: bool, types: Set }
  const perFile = {};

  for (const f of files) {
    const { findings, usesFetcher } = analyzeFile(f, fetcherNames);
    if (findings.length === 0) continue;
    const rel = path.relative(ROOT, f);
    perFile[rel] = {
      total: findings.length,
      usesFetcher,
      isPage: rel.startsWith('src/pages/'),
      types: new Set(findings.map(x => x.type)),
    };
    for (const x of findings) allFindings.push(x);
  }

  // Mark critical: páginas que aparecen en AUDIT-3 §sin fetcher (100% hardcoded)
  // o páginas que usan fetcher PERO también tienen json-import (mixto = roto a medias).
  for (const f of allFindings) {
    const meta = perFile[f.file];
    if (!meta) continue;
    const isCritical =
      (meta.isPage && sinFetcher.has(f.file)) ||
      (meta.isPage && meta.usesFetcher && (f.type === 'json-import' || f.type === 'glob-import'));
    f.critical = isCritical;
  }

  // ---------- Render ----------
  const lines = [];
  const push = (s = '') => lines.push(s);

  const totalFindings = allFindings.length;
  const totalFiles = Object.keys(perFile).length;
  const criticalFindings = allFindings.filter(x => x.critical).length;
  const byType = {};
  for (const f of allFindings) byType[f.type] = (byType[f.type] || 0) + 1;

  push('# AUDIT 4 — Contenido hardcoded en .astro');
  push('');
  push('Generado por `cms-strapi/scripts/audit-hardcoded.mjs`. No editar a mano.');
  push('');
  push('## Resumen');
  push('');
  push(`- **Archivos .astro analizados**: ${files.length}`);
  push(`- **Archivos con hallazgos**: ${totalFiles}`);
  push(`- **Hallazgos totales**: ${totalFindings}`);
  push(`- **Hallazgos críticos**: ${criticalFindings} (página sin fetcher ó mixto Strapi+JSON)`);
  push('');
  push('### Por tipo');
  push('');
  push('| Tipo | # | Significado |');
  push('|---|--:|---|');
  const typeMeaning = {
    'json-import': 'Importa JSON desde `src/content/` (legacy fallback)',
    'glob-import': '`import.meta.glob` sobre carpeta de contenido',
    'content-array': 'Array inline ≥3 items con shape editorial',
    'long-attr': 'Atributo (no class/style) con valor > 100 chars',
    'long-string': 'String literal > 100 chars en frontmatter',
    'long-text': 'Texto plano > 150 chars entre tags',
    'hardcoded-path': 'Ruta `/documentos/` o `/uploads/` hardcoded',
  };
  for (const [t, n] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    push(`| \`${t}\` | ${n} | ${typeMeaning[t] || ''} |`);
  }
  push('');

  // ---------- Críticos ----------
  push('## (a) Hallazgos críticos — migración prioritaria');
  push('');
  push('Páginas que **deberían** consumir Strapi pero hoy traen contenido del JSON');
  push('legacy (`src/content/...`) o son 100% hardcoded. Estas son las que más');
  push('rompen la promesa "todo contenido editable vive en Strapi".');
  push('');

  const criticalsByFile = {};
  for (const f of allFindings) {
    if (!f.critical) continue;
    (criticalsByFile[f.file] = criticalsByFile[f.file] || []).push(f);
  }
  const sortedCriticalFiles = Object.keys(criticalsByFile).sort();
  if (sortedCriticalFiles.length === 0) {
    push('_(ninguno)_');
  } else {
    push('| Archivo | Línea | Tipo | Snippet | Sugerencia |');
    push('|---|--:|---|---|---|');
    for (const f of sortedCriticalFiles) {
      for (const x of criticalsByFile[f]) {
        push(
          `| \`${escapeMd(x.file)}\` | ${x.line} | \`${x.type}\` | ${escapeMd(x.snippet)} | ${escapeMd(x.suggestion)} |`
        );
      }
    }
  }
  push('');

  // ---------- Top archivos por densidad ----------
  push('## (b) Top archivos por densidad de hallazgos');
  push('');
  const ranked = Object.entries(perFile)
    .map(([file, meta]) => ({ file, ...meta }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 20);
  push('| Archivo | # | Tipos | Usa fetcher | En "sin fetcher" |');
  push('|---|--:|---|:-:|:-:|');
  for (const r of ranked) {
    const uses = r.usesFetcher ? '✓' : '—';
    const sin = sinFetcher.has(r.file) ? '✓' : '—';
    push(
      `| \`${escapeMd(r.file)}\` | ${r.total} | ${[...r.types].join(', ')} | ${uses} | ${sin} |`
    );
  }
  push('');

  // ---------- Inventario completo ----------
  push('## (c) Inventario completo (todos los hallazgos)');
  push('');
  push('<details><summary>Ver tabla (puede ser larga)</summary>');
  push('');
  push('| Archivo | Línea | Tipo | Snippet | Sugerencia | Crítico |');
  push('|---|--:|---|---|---|:-:|');
  const sortedAll = [...allFindings].sort((a, b) => {
    if (a.file === b.file) return a.line - b.line;
    return a.file.localeCompare(b.file);
  });
  for (const x of sortedAll) {
    push(
      `| \`${escapeMd(x.file)}\` | ${x.line} | \`${x.type}\` | ${escapeMd(x.snippet)} | ${escapeMd(x.suggestion)} | ${x.critical ? '✓' : ''} |`
    );
  }
  push('');
  push('</details>');
  push('');

  // ---------- Páginas sin fetcher cruzadas con AUDIT-3 ----------
  push('## (d) Cruce con AUDIT-3 — páginas sin fetcher');
  push('');
  push('Las 38 páginas listadas en AUDIT-3 §"Páginas .astro sin fetcher Strapi"');
  push('cruzadas con esta fase. ✓ = aparece con hallazgos en este audit.');
  push('');
  push('| Archivo | Hallazgos en AUDIT-4 |');
  push('|---|--:|');
  for (const f of [...sinFetcher].sort()) {
    const n = perFile[f]?.total || 0;
    push(`| \`${f}\` | ${n} |`);
  }
  push('');

  // ---------- Limitaciones ----------
  push('## Limitaciones del scan');
  push('');
  push('- Solo detecta imports de `*.json`; los imports de Markdown (`src/content/news/*.md`');
  push('  consumido por `prensa/noticias/[slug].astro`) escapan al detector. Esa página igualmente');
  push('  aparece en AUDIT-3 §"Páginas sin fetcher" — ver fila en cruce (d).');
  push('- Importes desde `src/content/pages/*.json` se reportan como `json-import` aún cuando');
  push('  el componente que los recibe (`<ListadoInformes>`, `<NormativaTematica>`) maneje el');
  push('  rendering: el contenido **dato** sigue viviendo en JSON, no en Strapi.');
  push('- Datos cargados con `fetch()` desde el frontend en runtime no son detectados (el sitio');
  push('  es estático: no aplica).');
  push('- Strings interpolados con `${...}` con prosa larga adentro pueden escapar al detector');
  push('  `long-attr` (regex no atraviesa expresiones).');
  push('- Componentes en `src/components/` reportan los mismos hallazgos que las páginas que');
  push('  los usan; revisar caso por caso si el contenido pertenece a la página o al componente.');
  push('- El detector `long-string` se restringe a strings de UNA LÍNEA para evitar emparejar');
  push('  apóstrofes-cierre con apóstrofes-apertura entre tokens de JS. Strings multi-línea');
  push('  (template literals con prosa) podrían escaparse — improbable en el código actual.');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n'));

  console.log('Generado:', path.relative(ROOT, OUT));
  console.log('Archivos analizados:', files.length);
  console.log('Archivos con hallazgos:', totalFiles);
  console.log('Hallazgos totales:', totalFindings);
  console.log('Críticos:', criticalFindings);
  console.log('Por tipo:', byType);
}

main();
