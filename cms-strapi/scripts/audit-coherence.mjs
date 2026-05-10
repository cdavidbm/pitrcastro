#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const API_DIR = path.join(ROOT, 'cms-strapi', 'src', 'api');
const FETCHERS = path.join(ROOT, 'src', 'utils', 'strapi-fetchers.ts');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const LAYOUTS_DIR = path.join(ROOT, 'src', 'layouts');

function walk(dir, ext) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, ext));
    else if (!ext || entry.name.endsWith(ext)) out.push(p);
  }
  return out;
}

function loadSchemas() {
  const schemas = {};
  for (const slug of fs.readdirSync(API_DIR)) {
    const schemaPath = path.join(API_DIR, slug, 'content-types', slug, 'schema.json');
    if (!fs.existsSync(schemaPath)) continue;
    const j = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    schemas[slug] = {
      kind: j.kind,
      displayName: j.info?.displayName || slug,
      attributes: Object.keys(j.attributes || {}),
      raw: j,
    };
  }
  return schemas;
}

function loadFetchers() {
  const txt = fs.readFileSync(FETCHERS, 'utf8');
  const re = /export const (get[A-Za-z0-9_]+)\s*=\s*\([^)]*\)\s*=>\s*strapiGet<[^>]+>\("([^"]+)"\)/g;
  const fetchers = {};
  let m;
  while ((m = re.exec(txt)) !== null) {
    const [, name, url] = m;
    const apiMatch = url.match(/^\/api\/([a-z0-9-]+)/);
    fetchers[name] = { url, api: apiMatch ? apiMatch[1] : null };
  }
  return fetchers;
}

// Word-boundary substring check: returns true if `name` appears as a complete
// identifier in `txt`. Avoids dynamic RegExp construction.
function hasIdentifier(txt, name) {
  let idx = 0;
  while (true) {
    const found = txt.indexOf(name, idx);
    if (found < 0) return false;
    const before = found === 0 ? '' : txt[found - 1];
    const after = txt[found + name.length] || '';
    const isBoundary = (c) => c === '' || !/[A-Za-z0-9_$]/.test(c);
    if (isBoundary(before) && isBoundary(after)) return true;
    idx = found + 1;
  }
}

function findFetcherUsage(fetcherNames) {
  const usage = Object.fromEntries(fetcherNames.map((n) => [n, []]));
  const dirs = [PAGES_DIR, COMPONENTS_DIR, LAYOUTS_DIR];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir, '.astro')) {
      const txt = fs.readFileSync(file, 'utf8');
      for (const name of fetcherNames) {
        if (hasIdentifier(txt, name)) usage[name].push(path.relative(ROOT, file));
      }
    }
  }
  return usage;
}

function main() {
  const schemas = loadSchemas();
  const fetchers = loadFetchers();
  const usage = findFetcherUsage(Object.keys(fetchers));

  const fetcherApis = new Set(Object.values(fetchers).map((f) => f.api).filter(Boolean));
  const schemaSlugs = new Set(Object.keys(schemas));

  const schemasSinFetcher = [...schemaSlugs].filter((s) => !fetcherApis.has(s));
  const fetchersSinSchema = Object.entries(fetchers)
    .filter(([, f]) => f.api && !schemaSlugs.has(f.api))
    .map(([name, f]) => ({ name, api: f.api }));
  const fetchersNoUsados = Object.keys(fetchers).filter((n) => usage[n].length === 0);
  const usedFetchers = Object.entries(usage).filter(([, files]) => files.length > 0);

  const lines = [];
  const push = (s = '') => lines.push(s);

  push('# AUDIT 3 — Coherencia frontend ↔ Strapi');
  push('');
  push('Generado por `cms-strapi/scripts/audit-coherence.mjs`. No editar a mano.');
  push('');
  push('## Resumen');
  push(`- **Schemas Strapi**: ${schemaSlugs.size}`);
  push(`- **Fetchers Astro**: ${Object.keys(fetchers).length}`);
  push(`- **Páginas .astro analizadas**: ${walk(PAGES_DIR, '.astro').length}`);
  push(`- **Schemas sin fetcher** (huérfanos en Strapi): ${schemasSinFetcher.length}`);
  push(`- **Fetchers sin schema** (apuntan a API que no existe): ${fetchersSinSchema.length}`);
  push(`- **Fetchers sin uso** (ninguna página los importa): ${fetchersNoUsados.length}`);
  push('');

  push('## (a) Schemas en Strapi sin fetcher correspondiente');
  push('');
  push('Content types definidos pero el frontend no los consume. Son candidatos a borrar del Strapi (si no son intermedios) o requieren generar fetcher.');
  push('');
  if (schemasSinFetcher.length === 0) {
    push('_(ninguno)_');
  } else {
    push('| Slug | Kind | DisplayName |');
    push('|---|---|---|');
    for (const s of schemasSinFetcher.sort()) {
      push(`| \`${s}\` | ${schemas[s].kind} | ${schemas[s].displayName} |`);
    }
  }
  push('');

  push('## (b) Fetchers que apuntan a un schema inexistente');
  push('');
  push('Un fetcher hace `strapiGet("/api/X")` pero no hay `cms-strapi/src/api/X/`. Si alguna página los usa, el build falla en producción.');
  push('');
  if (fetchersSinSchema.length === 0) {
    push('_(ninguno)_');
  } else {
    push('| Fetcher | API ruta | Usado por |');
    push('|---|---|---|');
    for (const { name, api } of fetchersSinSchema) {
      const usados = usage[name].length;
      push(`| \`${name}\` | \`/api/${api}\` | ${usados} archivo(s) |`);
    }
  }
  push('');

  push('## (c) Fetchers sin uso (huérfanos en frontend)');
  push('');
  push('Existen en `strapi-fetchers.ts` pero ninguna página los importa. Candidatos a borrar al regenerar fetchers.');
  push('');
  if (fetchersNoUsados.length === 0) {
    push('_(ninguno)_');
  } else {
    push('| Fetcher | Schema slug |');
    push('|---|---|');
    for (const n of fetchersNoUsados.sort()) {
      push(`| \`${n}\` | \`${fetchers[n].api}\` |`);
    }
  }
  push('');

  push('## (d) Mapa de uso (fetcher → páginas)');
  push('');
  push('| Fetcher | # archivos | Archivos |');
  push('|---|---|---|');
  for (const [name, files] of usedFetchers.sort()) {
    push(`| \`${name}\` | ${files.length} | ${files.map((f) => `\`${f}\``).join(', ')} |`);
  }
  push('');

  push('## Páginas .astro sin fetcher Strapi');
  push('');
  push('Páginas que probablemente sirven contenido hardcoded o vienen de import estático de JSONs (`src/content/pages/*.json`). Candidatas para Fase 4 (hardcoded scan).');
  push('');
  const allPages = walk(PAGES_DIR, '.astro');
  const fetcherNames = Object.keys(fetchers);
  const pagesSinFetcher = [];
  for (const p of allPages) {
    const txt = fs.readFileSync(p, 'utf8');
    const usaAlgunFetcher = fetcherNames.some((n) => hasIdentifier(txt, n));
    if (!usaAlgunFetcher) pagesSinFetcher.push(path.relative(ROOT, p));
  }
  push(`Total: ${pagesSinFetcher.length}`);
  push('');
  push('<details><summary>Ver lista</summary>');
  push('');
  for (const p of pagesSinFetcher.sort()) push(`- \`${p}\``);
  push('');
  push('</details>');
  push('');

  const outFile = path.join(ROOT, '.local-docs', 'AUDIT-3-COHERENCE.md');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, lines.join('\n'));

  console.log('Generado:', path.relative(ROOT, outFile));
  console.log('Schemas sin fetcher:', schemasSinFetcher.length);
  console.log('Fetchers sin schema:', fetchersSinSchema.length);
  console.log('Fetchers sin uso:', fetchersNoUsados.length);
  console.log('Páginas sin fetcher:', pagesSinFetcher.length);
}

main();
