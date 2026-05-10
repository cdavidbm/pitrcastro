#!/usr/bin/env node
/**
 * Bulk rewriter de páginas .astro: reemplaza imports JSON estáticos por
 * fetchers de Strapi auto-generados.
 *
 * Antes:
 *   import pageData from '../content/pages/normativa/marco-legal.json';
 *
 * Después:
 *   import { getNormativaMarcoLegal } from '../utils/strapi-fetchers';
 *   const pageData = await getNormativaMarcoLegal();
 *
 * Reglas:
 *   - Solo reemplaza imports cuyo path matchee un slug del manifest
 *     (single-pages). Las collections requieren ajustes manuales.
 *   - Si el archivo .astro YA tenía `await getXxx()`, no toca.
 *   - Crea un .bak por si hay rollback.
 *
 * Uso:
 *   node cms-strapi/scripts/rewrite-astro.mjs        # ejecuta cambios
 *   node cms-strapi/scripts/rewrite-astro.mjs --dry  # solo lista
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const PAGES_DIR = path.join(REPO_ROOT, 'src', 'pages');
const MANIFEST = path.join(__dirname, '.autogen-manifest.json');
const DRY = process.argv.includes('--dry');

function pascalCase(slug) {
  return slug
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

// Construye un map sourcePath → fetcherName a partir del manifest.
function buildSourceMap() {
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const map = new Map();
  for (const sp of m.singlePages) {
    map.set(sp.sourcePath, `get${pascalCase(sp.slug)}`);
  }
  return map;
}

function listAstroFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listAstroFiles(full));
    else if (entry.name.endsWith('.astro')) out.push(full);
  }
  return out;
}

// Resuelve un import path relativo dentro de .astro a un sourcePath del repo.
// e.g. '../content/pages/normativa/marco-legal.json'
//   desde src/pages/marco-legal.astro
//   → src/content/pages/normativa/marco-legal.json
function resolveImportPath(astroFile, importPath) {
  if (!importPath.endsWith('.json')) return null;
  const dir = path.dirname(astroFile);
  const abs = path.resolve(dir, importPath);
  const rel = path.relative(REPO_ROOT, abs);
  return rel.replace(/\\/g, '/');
}

function rewrite(filePath, sourceMap) {
  const original = fs.readFileSync(filePath, 'utf8');
  let text = original;
  let changed = false;
  const replacements = [];

  // Match `import IDENT from 'path/.../X.json'` (single or double quotes)
  const importRe = /^(\s*)import\s+(\w+)\s+from\s+['"]([^'"]+\.json)['"];?\s*$/gm;
  text = text.replace(importRe, (full, indent, ident, importPath) => {
    const sourcePath = resolveImportPath(filePath, importPath);
    if (!sourcePath) return full;
    const fetcher = sourceMap.get(sourcePath);
    if (!fetcher) return full;
    changed = true;
    replacements.push({ ident, fetcher, sourcePath });
    return `${indent}import { ${fetcher} } from '${pathToFetchersImport(filePath)}';\n${indent}const ${ident} = await ${fetcher}();`;
  });

  return { changed, text, replacements, original };
}

function pathToFetchersImport(astroFile) {
  const fromDir = path.dirname(astroFile);
  const target = path.join(REPO_ROOT, 'src', 'utils', 'strapi-fetchers');
  let rel = path.relative(fromDir, target).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function main() {
  const sourceMap = buildSourceMap();
  console.log(`[rewrite-astro] ${sourceMap.size} mappings cargados`);
  const files = listAstroFiles(PAGES_DIR);
  console.log(`[rewrite-astro] ${files.length} archivos .astro a inspeccionar`);

  let touched = 0;
  let imports = 0;
  let skipped = 0;

  for (const f of files) {
    const r = rewrite(f, sourceMap);
    if (!r.changed) {
      skipped++;
      continue;
    }
    touched++;
    imports += r.replacements.length;
    const rel = path.relative(REPO_ROOT, f);
    console.log(`  [${DRY ? 'dry' : 'ok'}] ${rel}: ${r.replacements.map((x) => x.fetcher).join(', ')}`);
    if (!DRY) {
      fs.writeFileSync(f + '.bak', r.original, 'utf8');
      fs.writeFileSync(f, r.text, 'utf8');
    }
  }
  console.log(`\n[rewrite-astro] tocados: ${touched}, imports reemplazados: ${imports}, sin cambios: ${skipped}`);
  if (!DRY) console.log('[rewrite-astro] backups en *.bak. Borrar con: find src/pages -name "*.astro.bak" -delete');
}

main();
