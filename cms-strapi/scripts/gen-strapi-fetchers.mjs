#!/usr/bin/env node
/**
 * Genera ../src/utils/strapi-fetchers.ts con un getter por cada content type
 * declarado en .autogen-manifest.json. El query de populate se construye
 * recursivamente a partir del schema, descendiendo en cada attribute de tipo
 * component (los relations y media seguirían el mismo patrón pero el modelo
 * actual es solo components).
 *
 * Uso:
 *   node cms-strapi/scripts/gen-strapi-fetchers.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const MANIFEST = path.join(__dirname, '.autogen-manifest.json');
const COMPONENTS_DIR = path.join(__dirname, '..', 'src', 'components');
const API_DIR = path.join(__dirname, '..', 'src', 'api');
const OUTPUT = path.join(REPO_ROOT, 'src', 'utils', 'strapi-fetchers.ts');

function loadComponentSchema(uid) {
  // uid like "shared.related-link"
  const [category, name] = uid.split('.');
  const file = path.join(COMPONENTS_DIR, category, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadContentTypeSchema(slug) {
  const file = path.join(API_DIR, slug, 'content-types', slug, 'schema.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Devuelve un objeto de populate compatible con el query parser de Strapi:
 *   { secciones: { populate: { documentos: true, enlacesRelacionados: true } } }
 * Recursivo: descender por cada attribute de tipo component.
 * Evita ciclos limitando la profundidad a 5 niveles.
 */
function buildPopulate(attributes, depth = 0, seen = new Set()) {
  if (depth > 5) return true;
  const out = {};
  let any = false;
  for (const [name, attr] of Object.entries(attributes || {})) {
    if (attr.type === 'component') {
      any = true;
      const compSchema = loadComponentSchema(attr.component);
      if (!compSchema || seen.has(attr.component)) {
        out[name] = true;
        continue;
      }
      const nested = buildPopulate(
        compSchema.attributes || {},
        depth + 1,
        new Set([...seen, attr.component])
      );
      out[name] = nested === true ? true : { populate: nested };
    } else if (attr.type === 'media') {
      // Strapi v5 no popula media por defecto; hay que pedirlo explícito.
      any = true;
      out[name] = true;
    }
  }
  return any ? out : true;
}

/**
 * Convierte un objeto de populate en query string al estilo Strapi:
 *   buildQs({ secciones: { populate: { documentos: true } } })
 *     → "populate[secciones][populate][documentos]=true"
 */
function buildQs(populate, prefix = 'populate') {
  if (populate === true) return `${prefix}=true`;
  const parts = [];
  for (const [k, v] of Object.entries(populate)) {
    if (v === true) {
      parts.push(`${prefix}[${k}]=true`);
    } else if (v && typeof v === 'object') {
      // v es { populate: {...} }
      if (v.populate) {
        const inner = buildQs(v.populate, `${prefix}[${k}][populate]`);
        parts.push(inner);
      } else {
        parts.push(`${prefix}[${k}]=true`);
      }
    }
  }
  return parts.join('&');
}

function camel(s) {
  return s
    .split(/[-_]/)
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join('');
}

function pascalCase(s) {
  const c = camel(s);
  return c.charAt(0).toUpperCase() + c.slice(1);
}

function generate() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('[gen-fetchers] manifest no existe. Corre primero: node scripts/autogen-schemas.mjs');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

  const lines = [];
  lines.push('/**');
  lines.push(' * Auto-generado por cms-strapi/scripts/gen-strapi-fetchers.mjs');
  lines.push(' * NO EDITAR A MANO. Cambios en schemas → regenerar:');
  lines.push(' *   node cms-strapi/scripts/gen-strapi-fetchers.mjs');
  lines.push(' */');
  lines.push("import { strapiGet } from './strapi';");
  lines.push('');

  // Single pages
  for (const sp of manifest.singlePages) {
    const schema = loadContentTypeSchema(sp.slug);
    if (!schema) continue;
    const populate = buildPopulate(schema.attributes || {});
    const qs = populate === true ? '' : '?' + buildQs(populate);
    const fnName = `get${pascalCase(sp.slug)}`;
    const url = `/api/${sp.slug}${qs}`;
    lines.push(`export const ${fnName} = () => strapiGet<any>(${JSON.stringify(url)});`);
  }

  lines.push('');

  // Collections — usan pluralName para el route
  for (const coll of manifest.collections) {
    const schema = loadContentTypeSchema(coll.slug);
    if (!schema) continue;
    const populate = buildPopulate(schema.attributes || {});
    const qs = populate === true ? 'pagination[pageSize]=2000' : 'pagination[pageSize]=2000&' + buildQs(populate);
    const fnName = `get${pascalCase(coll.slug)}List`;
    const pluralName = schema.info.pluralName;
    const url = `/api/${pluralName}?${qs}`;
    lines.push(`export const ${fnName} = () => strapiGet<any[]>(${JSON.stringify(url)});`);
  }

  lines.push('');
  // Map para acceso por slug en runtime
  lines.push('export const fetchers = {');
  for (const sp of manifest.singlePages) {
    const schema = loadContentTypeSchema(sp.slug);
    if (!schema) continue;
    const fnName = `get${pascalCase(sp.slug)}`;
    lines.push(`  ${JSON.stringify(sp.slug)}: ${fnName},`);
  }
  for (const coll of manifest.collections) {
    const schema = loadContentTypeSchema(coll.slug);
    if (!schema) continue;
    const fnName = `get${pascalCase(coll.slug)}List`;
    lines.push(`  ${JSON.stringify(coll.slug + '__list')}: ${fnName},`);
  }
  lines.push('};');
  lines.push('');

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`[gen-fetchers] ${OUTPUT}`);
  console.log(`  ${manifest.singlePages.length} single-pages, ${manifest.collections.length} collections`);
}

generate();
