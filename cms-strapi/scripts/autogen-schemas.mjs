#!/usr/bin/env node
/**
 * Auto-genera content types Strapi v5 a partir de los JSONs en
 * src/content/pages/.
 *
 * - Single-pages → Single Types (kind: "singleType")
 * - Folder collections (>= 5 archivos similares en un dir) → Collection Types
 * - Arrays de objetos → repeatable components (categoria = slug del content type)
 * - Si un campo `enlacesRelacionados` tiene shape {titulo,descripcion,url,icon},
 *   reutiliza shared.related-link.
 *
 * Salida:
 *   cms-strapi/src/api/<slug>/content-types/<slug>/schema.json
 *   cms-strapi/src/api/<slug>/controllers/<slug>.ts
 *   cms-strapi/src/api/<slug>/services/<slug>.ts
 *   cms-strapi/src/api/<slug>/routes/<slug>.ts
 *   cms-strapi/src/components/<slug>/<sub>.json (cuando aplica)
 *   cms-strapi/scripts/.autogen-manifest.json (lista de slugs + paths origen)
 *
 * Uso (desde la raíz del repo):
 *   node cms-strapi/scripts/autogen-schemas.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');
const PAGES_DIR = path.join(REPO_ROOT, 'src/content/pages');
const STRAPI_API_DIR = path.join(REPO_ROOT, 'cms-strapi/src/api');
const STRAPI_COMP_DIR = path.join(REPO_ROOT, 'cms-strapi/src/components');
const MANIFEST_PATH = path.join(__dirname, '.autogen-manifest.json');

// Threshold: directorio con >= esto archivos JSON se trata como folder collection.
const COLLECTION_THRESHOLD = 5;

// ============================================================
// Utilidades
// ============================================================

function toSlug(s) {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function singularize(s) {
  // Reglas básicas en español + inglés. Fallback: sin cambios.
  if (s.endsWith('iones')) return s.slice(0, -5) + 'ion';
  if (s.endsWith('aciones')) return s.slice(0, -7) + 'acion';
  if (s.endsWith('ones')) return s.slice(0, -2);
  if (s.endsWith('ces')) return s.slice(0, -3) + 'z';
  if (s.endsWith('ies')) return s.slice(0, -3) + 'y';
  if (s.endsWith('es') && s.length > 4) return s.slice(0, -2);
  if (s.endsWith('s') && s.length > 3) return s.slice(0, -1);
  return s;
}

function pluralize(s) {
  if (s.endsWith('s')) return s + 'es';
  if (s.endsWith('z')) return s.slice(0, -1) + 'ces';
  return s + 's';
}

function displayName(s) {
  return s
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Calcula el slug del content type a partir del path relativo del JSON.
 * src/content/pages/marco-legal.json                 → marco-legal
 * src/content/pages/transparencia/leyes.json         → transparencia-leyes
 * src/content/pages/normativa/delitos/<archivo>.json → normativa-delitos (collection)
 */
function slugFromPath(jsonPath, isCollection = false, collectionDir = null) {
  if (isCollection) {
    const rel = path.relative(PAGES_DIR, collectionDir).split(path.sep).filter(Boolean);
    return toSlug(rel.join('-'));
  }
  const rel = path.relative(PAGES_DIR, jsonPath);
  const noExt = rel.replace(/\.json$/, '');
  return toSlug(noExt.replace(/[\\/]/g, '-'));
}

// ============================================================
// Inferencia de tipos
// ============================================================

const RELATED_LINK_KEYS = ['titulo', 'descripcion', 'url', 'icon'];
function isRelatedLinkShape(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const keys = Object.keys(obj);
  return RELATED_LINK_KEYS.every(k => keys.includes(k));
}

/**
 * Infer un campo Strapi para un valor JSON. Si encuentra arrays de objetos,
 * registra el componente nuevo en `componentRegistry` para escribirlo después.
 *
 * @param {string} fieldName  nombre del campo
 * @param {*} value  valor de muestra
 * @param {string} ctSlug  slug del content type owner (para nombrar componentes)
 * @param {Map} componentRegistry  acumulador de componentes a generar
 * @param {string[]} [pathStack]  path para diagnostico
 */
// Strapi solo acepta atributos cuyo nombre coincida con un identificador JS
// estándar: letra inicial + letras/digitos/_. Si el JSON fuente trae un objeto
// con llaves como "Atención y Servicios" significa que es un diccionario de
// datos, no un shape de campos — lo emitimos como tipo `json`.
const SAFE_ATTR_RE = /^[a-zA-Z][a-zA-Z0-9_]*$/;
function hasValidStrapiAttrNames(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;
  return keys.every((k) => SAFE_ATTR_RE.test(k));
}

function inferField(fieldName, value, ctSlug, componentRegistry, pathStack = []) {
  if (value === null || value === undefined) {
    // Sin info; default a string opcional.
    return { type: 'string' };
  }
  if (typeof value === 'boolean') {
    return { type: 'boolean' };
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return { type: 'integer' };
    return { type: 'decimal' };
  }
  if (typeof value === 'string') {
    if (value.length > 200 || value.includes('\n')) return { type: 'text' };
    return { type: 'string' };
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      // Array vacío → JSON field (genérico)
      return { type: 'json' };
    }
    const sample = value[0];
    if (typeof sample === 'string' || typeof sample === 'number' || typeof sample === 'boolean') {
      // Array de primitivos → JSON field
      return { type: 'json' };
    }
    if (sample && typeof sample === 'object' && !Array.isArray(sample)) {
      // Array de objetos → repeatable component.
      // Caso especial: shape de related-link → reusar shared.related-link.
      if (fieldName === 'enlacesRelacionados' && isRelatedLinkShape(sample)) {
        return {
          type: 'component',
          component: 'shared.related-link',
          repeatable: true,
        };
      }
      // Mergear todos los samples para detectar campos opcionales
      const merged = mergeShapes(value);
      // Si el objeto-shape tiene llaves no-identificador, fallback a JSON.
      if (!hasValidStrapiAttrNames(merged)) {
        return { type: 'json' };
      }
      const compName = singularize(toSlug(fieldName));
      const compKey = `${ctSlug}.${compName}`;
      if (!componentRegistry.has(compKey)) {
        componentRegistry.set(compKey, {
          category: ctSlug,
          name: compName,
          attributes: buildAttributes(merged, ctSlug, componentRegistry, [...pathStack, fieldName]),
          displayName: displayName(compName),
        });
      }
      return {
        type: 'component',
        component: compKey,
        repeatable: true,
      };
    }
    return { type: 'json' };
  }
  if (typeof value === 'object') {
    // Si las llaves del objeto no son identificadores válidos (espacios,
    // acentos, dashes), no es un "shape" de campo — es un diccionario de
    // datos. Lo guardamos como JSON para preservar la información sin romper
    // el typegen de Strapi.
    if (!hasValidStrapiAttrNames(value)) {
      return { type: 'json' };
    }
    const compName = toSlug(fieldName);
    const compKey = `${ctSlug}.${compName}`;
    if (!componentRegistry.has(compKey)) {
      componentRegistry.set(compKey, {
        category: ctSlug,
        name: compName,
        attributes: buildAttributes(value, ctSlug, componentRegistry, [...pathStack, fieldName]),
        displayName: displayName(compName),
      });
    }
    return {
      type: 'component',
      component: compKey,
      repeatable: false,
    };
  }
  return { type: 'string' };
}

/**
 * Mergea todos los samples de un array para tener una vista completa de
 * los campos opcionales. Devuelve un objeto con todas las claves vistas.
 */
function mergeShapes(samples) {
  const out = {};
  for (const s of samples) {
    if (!s || typeof s !== 'object') continue;
    for (const [k, v] of Object.entries(s)) {
      if (!(k in out) || out[k] === null || out[k] === undefined) {
        out[k] = v;
        continue;
      }
      // Si ya tenemos un valor: para strings, conservamos el más largo
      // para que la inferencia (string vs text) refleje el caso más amplio.
      // postgres rechaza varchar(255) si algún sample supera ese límite.
      if (typeof v === 'string' && typeof out[k] === 'string' && v.length > out[k].length) {
        out[k] = v;
      }
    }
  }
  return out;
}

// Strapi v5 reserva ciertos nombres de atributo y rechaza el modelo si los usamos.
// Renombramos al cargar el JSON fuente para evitar conflictos. Los scripts de
// migración deben aplicar el mismo mapeo antes de POSTear el contenido.
const RESERVED_ATTR_RENAMES = {
  id: 'idLogico',
  createdAt: 'creadoEn',
  updatedAt: 'actualizadoEn',
  publishedAt: 'publicadoEn',
  createdBy: 'creadoPor',
  updatedBy: 'actualizadoPor',
  locale: 'idiomaLocal',
  localizations: 'localizaciones',
  documentId: 'idDocumento',
};

function buildAttributes(obj, ctSlug, componentRegistry, pathStack = []) {
  const attrs = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const renamed = RESERVED_ATTR_RENAMES[k] || k;
    if (!SAFE_ATTR_RE.test(renamed)) {
      // Caída de seguridad: un atributo con espacios/acentos llegó a este
      // nivel — lo descartamos del schema (la información se preservaría
      // a través de un campo `json` padre detectado más arriba). Si esto
      // dispara para un single-type/collection, hay que decidir si conviene
      // anidarlo o renombrarlo manualmente.
      console.warn(`[autogen] omitiendo atributo con nombre inválido: "${k}" en ${ctSlug}`);
      continue;
    }
    attrs[renamed] = inferField(renamed, v, ctSlug, componentRegistry, pathStack);
  }
  return attrs;
}

// ============================================================
// Escritura de archivos
// ============================================================

function writeJson(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeContentType({ slug, kind, attributes, displayName: dn, sourcePath }) {
  const singularName = slug;
  const pluralName = pluralize(slug);
  const collectionName = slug.replace(/-/g, '_') + (kind === 'collectionType' ? '_items' : '');
  const schema = {
    kind,
    collectionName,
    info: {
      singularName,
      pluralName,
      displayName: dn,
      description: `Auto-generado desde ${sourcePath}`,
    },
    options: { draftAndPublish: true },
    pluginOptions: {},
    attributes,
  };
  const apiDir = path.join(STRAPI_API_DIR, slug);
  writeJson(path.join(apiDir, 'content-types', slug, 'schema.json'), schema);

  const factoryUid = `api::${slug}.${slug}`;
  writeText(
    path.join(apiDir, 'controllers', `${slug}.ts`),
    `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreController('${factoryUid}');\n`
  );
  writeText(
    path.join(apiDir, 'services', `${slug}.ts`),
    `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreService('${factoryUid}');\n`
  );
  writeText(
    path.join(apiDir, 'routes', `${slug}.ts`),
    `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreRouter('${factoryUid}');\n`
  );
}

function writeComponent({ category, name, attributes, displayName: dn }) {
  const collectionName = `components_${category.replace(/-/g, '_')}_${pluralize(name).replace(/-/g, '_')}`;
  const schema = {
    collectionName,
    info: { displayName: dn, icon: 'cube' },
    options: {},
    attributes,
  };
  writeJson(path.join(STRAPI_COMP_DIR, category, `${name}.json`), schema);
}

// ============================================================
// Detección de single-pages vs folder collections
// ============================================================

/**
 * ¿Los JSONs en un directorio comparten suficiente shape para ser una folder
 * collection? Heurística: si >= 70% de ellos tienen exactamente el mismo set
 * de keys top-level, sí.
 */
function looksLikeCollection(jsonFiles) {
  if (jsonFiles.length < COLLECTION_THRESHOLD) return false;
  const shapes = jsonFiles.map(f => {
    try {
      const data = JSON.parse(fs.readFileSync(f, 'utf8'));
      return JSON.stringify(Object.keys(data || {}).sort());
    } catch { return ''; }
  });
  const counts = new Map();
  for (const s of shapes) counts.set(s, (counts.get(s) || 0) + 1);
  const maxCount = Math.max(...counts.values());
  return maxCount / shapes.length >= 0.7;
}

function detectInputs() {
  const singlePages = []; // [{ jsonPath, slug }]
  const collections = []; // [{ dirPath, slug, samples: [path] }]

  function walk(dir) {
    const jsonFiles = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => path.join(dir, f));
    const subdirs = fs.readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => path.join(dir, d.name));

    if (dir !== PAGES_DIR && looksLikeCollection(jsonFiles)) {
      collections.push({
        dirPath: dir,
        slug: slugFromPath(null, true, dir),
        samples: jsonFiles,
      });
      // No descender (los subdirs internos a una collection suelen no ser content)
      return;
    }
    // Cada JSON es una single-page distinta
    for (const f of jsonFiles) {
      singlePages.push({
        jsonPath: f,
        slug: slugFromPath(f),
      });
    }
    for (const sub of subdirs) walk(sub);
  }

  walk(PAGES_DIR);
  return { singlePages, collections };
}

// ============================================================
// Main
// ============================================================

function wipeAutogenOutputs() {
  // Limpia artefactos viejos antes de regenerar para evitar archivos huérfanos
  // cuando un content type se elimina o un componente cambia de shape.
  // Preserva src/components/shared/ (componentes manuales como related-link).
  const apiDir = path.resolve(__dirname, '..', 'src', 'api');
  const compDir = path.resolve(__dirname, '..', 'src', 'components');
  if (fs.existsSync(apiDir)) {
    for (const entry of fs.readdirSync(apiDir)) {
      fs.rmSync(path.join(apiDir, entry), { recursive: true, force: true });
    }
  }
  if (fs.existsSync(compDir)) {
    for (const entry of fs.readdirSync(compDir)) {
      if (entry === 'shared') continue;
      fs.rmSync(path.join(compDir, entry), { recursive: true, force: true });
    }
  }
}

function main() {
  wipeAutogenOutputs();
  const { singlePages, collections } = detectInputs();
  // Si una single-page comparte slug con una collection (i.e. existe X.json
  // junto a X/), renombramos la single a X-info para que ambos coexistan
  // como content types separados en Strapi.
  const collSlugs = new Set(collections.map((c) => c.slug));
  for (const sp of singlePages) {
    if (collSlugs.has(sp.slug)) {
      console.log(`[autogen] conflicto: ${sp.slug} → renombrando single-page a ${sp.slug}-info`);
      sp.slug = `${sp.slug}-info`;
    }
  }
  console.log(`[autogen] ${singlePages.length} single-pages, ${collections.length} folder collections`);

  const componentRegistry = new Map();
  const manifest = {
    singlePages: [],
    collections: [],
    components: [],
  };

  // --- Single-pages ---
  for (const sp of singlePages) {
    const data = JSON.parse(fs.readFileSync(sp.jsonPath, 'utf8'));
    const attributes = buildAttributes(data, sp.slug, componentRegistry);
    const dn = displayName(sp.slug);
    writeContentType({
      slug: sp.slug,
      kind: 'singleType',
      attributes,
      displayName: dn,
      sourcePath: path.relative(REPO_ROOT, sp.jsonPath),
    });
    manifest.singlePages.push({
      slug: sp.slug,
      sourcePath: path.relative(REPO_ROOT, sp.jsonPath).replaceAll('\\', '/'),
      displayName: dn,
    });
    console.log(`  [single]     ${sp.slug}`);
  }

  // --- Collections ---
  for (const coll of collections) {
    // Mergear todos los samples para obtener todas las claves
    const allShapes = coll.samples.map(p => {
      try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return {}; }
    });
    const merged = mergeShapes(allShapes);
    const attributes = buildAttributes(merged, coll.slug, componentRegistry);
    // Asegurar campo `slug` en el content type para identificación
    if (!attributes.slug) {
      attributes.slug = { type: 'uid', targetField: attributes.titulo ? 'titulo' : (attributes.title ? 'title' : undefined), required: true };
    } else if (typeof attributes.slug === 'object' && attributes.slug.type === 'string') {
      attributes.slug = { type: 'uid', required: true };
    }
    const dn = displayName(coll.slug);
    writeContentType({
      slug: coll.slug,
      kind: 'collectionType',
      attributes,
      displayName: dn,
      sourcePath: path.relative(REPO_ROOT, coll.dirPath),
    });
    manifest.collections.push({
      slug: coll.slug,
      dirPath: path.relative(REPO_ROOT, coll.dirPath).replaceAll('\\', '/'),
      sourceFiles: coll.samples.map(p => path.relative(REPO_ROOT, p).replaceAll('\\', '/')),
      displayName: dn,
    });
    console.log(`  [collection] ${coll.slug} (${coll.samples.length} entries)`);
  }

  // --- Components ---
  for (const [key, comp] of componentRegistry.entries()) {
    if (key === 'shared.related-link') continue; // ya existe
    writeComponent(comp);
    manifest.components.push({ key, ...comp, attributes: undefined });
  }
  console.log(`  [components] ${componentRegistry.size} (excluyendo shared.related-link)`);

  writeJson(MANIFEST_PATH, manifest);
  console.log(`\n[autogen] manifest: ${path.relative(REPO_ROOT, MANIFEST_PATH)}`);
}

main();
