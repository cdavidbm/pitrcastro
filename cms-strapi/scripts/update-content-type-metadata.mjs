#!/usr/bin/env node
/**
 * update-content-type-metadata.mjs — F1.b del plan UX panel Strapi.
 *
 * Aplica cambios masivos a TODOS los schemas de cms-strapi/src/api:
 *
 *   1. `info.mainField`: setea el campo principal para que las listas y
 *      relations muestren un texto humano en vez del id. Prioridad de
 *      candidatos: title → name → nombre → shortTitle → titulo → label.
 *      Solo setea si NO estaba configurado y existe candidato.
 *
 *   2. `info.description`: reemplaza el placeholder genérico
 *      "Auto-generado desde…" por una descripción contextual con
 *      dominio + nombre legible + URL pública del sitio si existe.
 *      Las descripciones manuales (que NO empiezan con "Auto-generado")
 *      se respetan.
 *
 *   3. Fix puntual: si `displayName` = "01. Inicio" (sin el "/ X" del
 *      patrón estándar), lo corrige a "01. Inicio / Home" para que el
 *      sidebar agrupado lo trate igual que al resto.
 *
 * Uso:
 *   node cms-strapi/scripts/update-content-type-metadata.mjs           # dry-run
 *   node cms-strapi/scripts/update-content-type-metadata.mjs --apply   # escribe
 *
 * El mapping slug → URL pública se construye on-demand escaneando
 * src/pages/**\/*.astro y leyendo el atributo strapiSlug del componente
 * <Base> (es el mismo dato que usa el AdminBar para enlazar al editor).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const APPLY = process.argv.includes('--apply');

// --- 1. Construir mapping slug → URL pública ---------------------------
function buildSlugToUrl() {
  const mapping = {};
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith('.astro')) {
        const content = fs.readFileSync(full, 'utf8');
        const m = content.match(/strapiSlug=["']([^"']+)["']/);
        if (m) {
          const slug = m[1];
          let url = full
            .replace(path.join(REPO_ROOT, 'src/pages'), '')
            .replace(/\.astro$/, '')
            .replace(/\/index$/, '/');
          if (url.endsWith('/') && url.length > 1) url = url.slice(0, -1);
          mapping[slug] = url;
        }
      }
    }
  }
  walk(path.join(REPO_ROOT, 'src/pages'));
  return mapping;
}

// --- 2. Heurística de mainField ---------------------------------------
const MAIN_FIELD_PRIORITY = [
  'title', 'name', 'nombre', 'shortTitle', 'titulo', 'label', 'displayName',
];
function pickMainField(attributes) {
  for (const candidate of MAIN_FIELD_PRIORITY) {
    if (attributes[candidate]) return candidate;
  }
  return null;
}

// --- 3. Parser del displayName "NN. Dominio / Nombre" -----------------
function parseDisplayName(displayName) {
  const m = displayName.match(/^(\d{2})\.\s+([^/]+?)\s*\/\s*(.+)$/);
  if (!m) return null;
  return {
    prefix: m[1],
    domain: m[2].trim(),
    subName: m[3].trim(),
  };
}

// --- 4. Plantilla de descripción --------------------------------------
function buildDescription({ domain, subName, url, kind }) {
  const tipoLabel = kind === 'singleType' ? 'Página única' : 'Colección de entradas';
  const partes = [`${tipoLabel} del dominio "${domain}": ${subName}.`];
  if (url) {
    partes.push(`Publicada en: ${url}.`);
  }
  partes.push('Edite estos campos para actualizar el contenido que ven los visitantes del sitio.');
  return partes.join(' ');
}

// --- 5. Recorrer schemas y aplicar ------------------------------------
function findSchemas() {
  const dir = path.join(REPO_ROOT, 'cms-strapi/src/api');
  const out = [];
  for (const apiName of fs.readdirSync(dir)) {
    const schemaPath = path.join(dir, apiName, 'content-types', apiName, 'schema.json');
    if (fs.existsSync(schemaPath)) out.push(schemaPath);
  }
  return out.sort();
}

const slugToUrl = buildSlugToUrl();
const schemas = findSchemas();

const stats = {
  total: schemas.length,
  mainFieldSet: 0,
  descriptionSet: 0,
  displayNameFixed: 0,
  unchanged: 0,
  noChangeNeeded: 0,
};
const changes = [];

for (const schemaPath of schemas) {
  const raw = fs.readFileSync(schemaPath, 'utf8');
  const schema = JSON.parse(raw);
  const info = schema.info || {};
  const attrs = schema.attributes || {};
  const slug = info.singularName;

  let modified = false;
  const log = [];

  // Fix puntual: displayName "01. Inicio" → "01. Inicio / Home"
  if (info.displayName === '01. Inicio') {
    info.displayName = '01. Inicio / Home';
    log.push('displayName fix');
    stats.displayNameFixed++;
    modified = true;
  }

  // mainField
  const currentMainField = info.mainField;
  if (!currentMainField) {
    const candidate = pickMainField(attrs);
    if (candidate) {
      info.mainField = candidate;
      log.push(`mainField=${candidate}`);
      stats.mainFieldSet++;
      modified = true;
    }
  }

  // description
  const currentDesc = info.description || '';
  const isPlaceholder = !currentDesc || /^Auto-generado/.test(currentDesc);
  if (isPlaceholder) {
    const dn = parseDisplayName(info.displayName || '');
    if (dn) {
      const url = slugToUrl[slug] || null;
      info.description = buildDescription({
        domain: dn.domain,
        subName: dn.subName,
        url,
        kind: schema.kind,
      });
      log.push('description=parametrizada');
      stats.descriptionSet++;
      modified = true;
    }
  }

  if (modified) {
    schema.info = info;
    changes.push({ slug, path: schemaPath, log });
    if (APPLY) {
      fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n', 'utf8');
    }
  } else {
    stats.unchanged++;
  }
}

// --- 6. Reporte ------------------------------------------------------
console.log(`\nF1.b — Update content-type metadata ${APPLY ? '(APPLY)' : '(dry-run)'}`);
console.log(`────────────────────────────────────────────────────────`);
console.log(`Total schemas:            ${stats.total}`);
console.log(`Con mainField nuevo:      ${stats.mainFieldSet}`);
console.log(`Con description nueva:    ${stats.descriptionSet}`);
console.log(`displayName fixed:        ${stats.displayNameFixed}`);
console.log(`Sin cambios:              ${stats.unchanged}`);
console.log(`Slug→URL conocidos:       ${Object.keys(slugToUrl).length} / ${stats.total}`);
console.log(`\nMuestra de cambios (primeros 5):`);
for (const c of changes.slice(0, 5)) {
  console.log(`  ${c.slug.padEnd(50)} ${c.log.join(', ')}`);
}
if (changes.length > 5) console.log(`  ... y ${changes.length - 5} más`);

if (!APPLY) {
  console.log(`\nDry-run. Para escribir: node cms-strapi/scripts/update-content-type-metadata.mjs --apply`);
}
