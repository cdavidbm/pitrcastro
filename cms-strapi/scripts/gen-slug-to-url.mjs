#!/usr/bin/env node
/**
 * gen-slug-to-url.mjs — Genera el mapping slug → URL pública para el
 * botón "Ver en el sitio" del editor de Strapi.
 *
 * Lee cada src/pages/**\/*.astro buscando el atributo `strapiSlug` del
 * componente <Base>. Output: cms-strapi/src/admin/slug-to-url.json
 * (importado por src/admin/app.tsx).
 *
 * Idempotente. Correr cuando se agregue/quite el strapiSlug de alguna
 * página o se renombren rutas:
 *   node cms-strapi/scripts/gen-slug-to-url.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const PAGES_DIR = path.join(REPO_ROOT, 'src/pages');
const OUT_FILE = path.join(REPO_ROOT, 'cms-strapi/src/admin/slug-to-url.json');

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (ent.name.endsWith('.astro')) out.push(full);
  }
  return out;
}

const mapping = {};
for (const astroFile of walk(PAGES_DIR)) {
  const content = fs.readFileSync(astroFile, 'utf8');
  const m = content.match(/strapiSlug=["']([^"']+)["']/);
  if (!m) continue;
  const slug = m[1];
  let url = astroFile
    .replace(PAGES_DIR, '')
    .replace(/\.astro$/, '')
    .replace(/\/index$/, '/');
  if (url.endsWith('/') && url.length > 1) url = url.slice(0, -1);
  if (!url) url = '/';
  mapping[slug] = url;
}

// Ordenar las keys para diff estable
const sorted = Object.keys(mapping)
  .sort()
  .reduce((acc, k) => ((acc[k] = mapping[k]), acc), {});

fs.writeFileSync(OUT_FILE, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
console.log(`✓ ${Object.keys(sorted).length} slugs → ${path.relative(REPO_ROOT, OUT_FILE)}`);
