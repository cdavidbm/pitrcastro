#!/usr/bin/env node
/**
 * Inyecta el atributo strapiSlug (y strapiKind cuando aplica) en cada
 * `<Base ...>` de los .astro que ya hacen fetch a Strapi. Lo hace mirando
 * qué fetcher importan desde '../utils/strapi-fetchers' o equivalente y
 * deriva el slug del nombre de la función (getCamelCase → kebab-case).
 *
 * Idempotente: si <Base> ya tiene strapiSlug, lo sobrescribe.
 *
 * Uso:
 *   node cms-strapi/scripts/inject-strapi-slug.mjs        # ejecuta cambios
 *   node cms-strapi/scripts/inject-strapi-slug.mjs --dry  # lista cambios
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const PAGES_DIR = path.join(REPO_ROOT, 'src', 'pages');
const MANIFEST = path.join(__dirname, '.autogen-manifest.json');
const DRY = process.argv.includes('--dry');

function camelToKebab(camel) {
  // Quita el "get" inicial y vuelve cada límite mayúscula a guion-minúscula.
  const without = camel.replace(/^get/, '');
  return without
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function buildIndex() {
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const slugs = new Set();
  const kindBySlug = new Map();
  for (const sp of m.singlePages) {
    slugs.add(sp.slug);
    kindBySlug.set(sp.slug, 'singleType');
  }
  for (const c of m.collections) {
    slugs.add(c.slug);
    kindBySlug.set(c.slug, 'collectionType');
  }
  return { slugs, kindBySlug };
}

function listAstroFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listAstroFiles(full));
    else if (e.name.endsWith('.astro')) out.push(full);
  }
  return out;
}

function findFetcherUsage(text) {
  // Busca import de strapi-fetchers
  const importRe = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"][^'"]*strapi-fetchers['"]/;
  const m = text.match(importRe);
  if (!m) return null;
  const names = m[1].split(',').map((s) => s.trim()).filter(Boolean);
  if (names.length === 0) return null;
  // Si hay varios fetchers en una página, tomamos el primero — la página
  // suele tener un único content type "principal"; los secundarios son
  // datos adicionales (como menú o speakers) que el editor abrirá aparte.
  return names[0];
}

function injectInBase(text, slug, kind) {
  // Caso 1: ya tiene strapiSlug → reemplazar
  const hasSlug = /<Base\b[^>]*\bstrapiSlug=/.test(text);
  if (hasSlug) {
    return text.replace(
      /(<Base\b[^>]*\bstrapiSlug=)["'][^"']*["']/,
      `$1"${slug}"`
    );
  }
  // Caso 2: agregar strapiSlug y strapiKind antes del cierre del tag <Base ...>
  // Solo modificamos la primera ocurrencia (la del tag de apertura).
  return text.replace(
    /<Base\b([^>]*)>/,
    (full, attrs) => {
      const kindAttr = kind === 'collectionType' ? ' strapiKind="collectionType"' : '';
      return `<Base${attrs} strapiSlug="${slug}"${kindAttr}>`;
    }
  );
}

function main() {
  const { slugs, kindBySlug } = buildIndex();
  const files = listAstroFiles(PAGES_DIR);
  let touched = 0,
    skipped = 0,
    notFound = 0;
  for (const f of files) {
    const original = fs.readFileSync(f, 'utf8');
    const fetcher = findFetcherUsage(original);
    if (!fetcher) {
      skipped++;
      continue;
    }
    const candidate = camelToKebab(fetcher);
    if (!slugs.has(candidate)) {
      notFound++;
      console.warn(`  [no-match] ${path.relative(REPO_ROOT, f)}: ${fetcher} → ${candidate}`);
      continue;
    }
    const kind = kindBySlug.get(candidate) || 'singleType';
    const updated = injectInBase(original, candidate, kind);
    if (updated === original) {
      skipped++;
      continue;
    }
    touched++;
    if (DRY) {
      console.log(`  [dry] ${path.relative(REPO_ROOT, f)} → strapiSlug="${candidate}" (${kind})`);
    } else {
      fs.writeFileSync(f, updated, 'utf8');
    }
  }
  console.log(
    `\n[inject-strapi-slug] tocados: ${touched}, sin fetcher Strapi: ${skipped}, sin match en manifest: ${notFound}`
  );
}

main();
