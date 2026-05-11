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
  // Si el slug ya termina en 's', asumimos que es plural (la mayoría de los
  // slugs derivados del path JSON original ya vienen pluralizados, p. ej.
  // 'normativa-delitos', 'ciprep-speakers'). Devolverlo como está y dejar que
  // singularize() derive la forma singular para singularName.
  if (s.endsWith('s')) return s;
  if (s.endsWith('z')) return s.slice(0, -1) + 'ces';
  return s + 's';
}

function displayName(s) {
  return s
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Asocia cada slug con la rama del menú principal del sitio. El primer
// segmento del slug suele coincidir con la rama; los slugs sueltos
// (singletons) van en SLUG_TO_BRANCH. El número fuerza el orden alfabético
// del sidebar para que coincida con el orden de la nav del sitio.
const BRANCH_BY_PREFIX = {
  agencia: { order: '02', label: 'Agencia' },
  normativa: { order: '03', label: 'Normativa' },
  atencion: { order: '04', label: 'Atención y Servicios' },
  participa: { order: '05', label: 'Participa' },
  transparencia: { order: '06', label: 'Transparencia' },
  observatorio: { order: '07', label: 'Observatorio ITRC' },
  prensa: { order: '08', label: 'Prensa' },
  institucional: { order: '09', label: 'Institucional' },
};
const SLUG_TO_BRANCH = {
  // Singletons en raíz que pertenecen a una rama específica
  home: { order: '01', label: 'Inicio' },
  ciprep: { order: '08', label: 'Prensa', sub: ['Congreso CIPREP'] },
  'ciprep-speakers': { order: '08', label: 'Prensa', sub: ['Congreso CIPREP', 'Speakers'] },
  'ciprep-speaker': { order: '08', label: 'Prensa', sub: ['Congreso CIPREP', 'Speakers'] },
  galeria: { order: '08', label: 'Prensa', sub: ['Galería'] },
  normograma: { order: '03', label: 'Normativa', sub: ['Normograma'] },
  participa: { order: '05', label: 'Participa', sub: ['Inicio'] },
  prensa: { order: '08', label: 'Prensa', sub: ['Inicio'] },
  transparencia: { order: '06', label: 'Transparencia', sub: ['Inicio'] },
  'mapa-del-sitio': { order: '99', label: 'Sistema', sub: ['Mapa del sitio'] },
  // Collections cuyo slug en el manifest es el singular (singularName del schema).
  notificacion: { order: '04', label: 'Atención y Servicios', sub: ['Notificaciones y Traslados'] },
  evento: { order: '08', label: 'Prensa', sub: ['Eventos'] },
  'normativa-delito': { order: '03', label: 'Normativa', sub: ['Delitos'] },
  'normativa-vigencia': { order: '03', label: 'Normativa', sub: ['Vigencias'] },
  'observatorio-eje-de-educacion-memoria': { order: '07', label: 'Observatorio ITRC', sub: ['Eje de Educación', 'Memorias'] },
  'observatorio-eje-de-participacion-memoria': { order: '07', label: 'Observatorio ITRC', sub: ['Eje de Participación', 'Memorias'] },
  'transparencia-informe': { order: '06', label: 'Transparencia', sub: ['Informes'] },
};

// Diccionario para mejorar legibilidad del displayName. Los slugs vienen
// sin acentos y con todo en minúscula; aquí restauramos forma humana.
// - WORD_OVERRIDES: palabras concretas (con acentos, mayúsculas mixtas).
// - ACRONYMS: siglas conocidas (siempre en mayúsculas).
// - CONNECTORS: palabras de unión que NO se capitalizan al medio.
const WORD_OVERRIDES = {
  adquisicion: 'Adquisición',
  anonimos: 'Anónimos',
  articulos: 'Artículos',
  atencion: 'Atención',
  comite: 'Comité',
  conciliacion: 'Conciliación',
  contratacion: 'Contratación',
  contraloria: 'Contraloría',
  cuenta: 'Cuenta',
  decision: 'Decisión',
  decisiones: 'Decisiones',
  documentacion: 'Documentación',
  economico: 'Económico',
  educacion: 'Educación',
  ejecucion: 'Ejecución',
  especifico: 'Específico',
  especificas: 'Específicas',
  estrategico: 'Estratégico',
  etnicos: 'Étnicos',
  evaluacion: 'Evaluación',
  formacion: 'Formación',
  galeria: 'Galería',
  gestion: 'Gestión',
  glosario: 'Glosario',
  historico: 'Histórico',
  indice: 'Índice',
  informacion: 'Información',
  informe: 'Informe',
  informes: 'Informes',
  interes: 'Interés',
  juridico: 'Jurídico',
  medicion: 'Medición',
  ninos: 'Niños',
  organico: 'Orgánico',
  participacion: 'Participación',
  politicas: 'Políticas',
  proteccion: 'Protección',
  publica: 'Pública',
  publicacion: 'Publicación',
  publicaciones: 'Publicaciones',
  publicos: 'Públicos',
  rendicion: 'Rendición',
  republica: 'República',
  resoluciones: 'Resoluciones',
  resolucion: 'Resolución',
  supervision: 'Supervisión',
  tramites: 'Trámites',
  unificacion: 'Unificación',
  vinculacion: 'Vinculación',
};
const ACRONYMS = new Set([
  'rrhh', 'pqrs', 'spfc', 'sci', 'ivc', 'sagr', 'cgr', 'suin',
  'itrc', 'dian', 'ugpp', 'pai',
]);
const CONNECTORS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'a', 'o', 'u', 'e']);

function prettyWord(w, isFirst) {
  if (!w) return w;
  const lower = w.toLowerCase();
  if (WORD_OVERRIDES[lower]) return WORD_OVERRIDES[lower];
  if (ACRONYMS.has(lower)) return lower.toUpperCase();
  if (!isFirst && CONNECTORS.has(lower)) return lower;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function prettyPhrase(text) {
  // Acepta espacios o guiones como separador
  return text
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w, i) => prettyWord(w, i === 0))
    .join(' ');
}

// Devuelve el displayName con prefijo numérico + rama + sub-rama legible.
// Ejemplos:
//   normativa-marco-legal → "03. Normativa / Marco Legal"
//   agencia-direccionamiento-estrategico → "02. Agencia / Direccionamiento Estratégico"
//   agencia-empleo-rrhh-manual-especifico-funciones →
//     "02. Agencia / Empleo RRHH / Manual Específico Funciones"
//   home → "01. Inicio"
//   ciprep → "08. Prensa / Congreso CIPREP"
function brandedDisplayName(slug) {
  const explicit = SLUG_TO_BRANCH[slug];
  if (explicit) {
    const sub = explicit.sub ? ' / ' + explicit.sub.join(' / ') : '';
    return `${explicit.order}. ${explicit.label}${sub}`;
  }
  const segments = slug.split('-');
  const branchKey = segments[0];
  const branch = BRANCH_BY_PREFIX[branchKey];
  if (!branch) {
    return `99. ${prettyPhrase(slug)}`;
  }
  const rest = segments.slice(1).join(' ');
  if (!rest) {
    return `${branch.order}. ${branch.label}`;
  }
  return `${branch.order}. ${branch.label} / ${prettyPhrase(rest)}`;
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

// Campos del JSON fuente que históricamente apuntan a binarios alojados.
// Aunque su valor sea un string (URL o path), Strapi los maneja mejor como
// media nativo: el editor sube/elige el archivo desde el Media Library sin
// salir del componente.
const MEDIA_FIELD_NAMES = new Set([
  'file',
  'fileUrl',
  'archivo',
  'pdfUrl',
  'pdf',
]);
const BINARY_EXT_RE = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|csv|txt|odt|ods|odp|epub|mobi|mp3|mp4|webm|ogg|wav|jpe?g|png|gif|svg|webp|avif|tiff?)(\?[^/]*)?$/i;

function looksLikeBinaryRef(value) {
  if (typeof value !== 'string' || !value) return false;
  if (BINARY_EXT_RE.test(value)) return true;
  // Path explícito a carpetas conocidas (legacy /documentos/, /uploads/).
  if (/^\/(documentos|uploads|api\/uploads)\//.test(value)) return true;
  return false;
}

function mediaField() {
  return {
    type: 'media',
    multiple: false,
    required: false,
    allowedTypes: ['files', 'images'],
  };
}

function inferField(fieldName, value, ctSlug, componentRegistry, pathStack = []) {
  // Detección temprana de campos de archivo, independiente del tipo del valor.
  // Si el nombre canónico es de binario, lo tratamos como media salvo que el
  // valor explícitamente NO parezca un path/URL de binario (ej. un objeto).
  if (MEDIA_FIELD_NAMES.has(fieldName)) {
    if (value === null || value === undefined || looksLikeBinaryRef(value)) {
      return mediaField();
    }
    // Si el valor existe pero no parece binario, caemos al inferidor genérico
    // (puede ser un id, una entrada con shape distinta, etc.).
  }

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
  // Strapi requiere singularName != pluralName y, crucial: el directorio
  // del content type debe llamarse igual que singularName (la "key" del UID
  // api::<key>.<key>). Para slugs plurales (terminan en 's') derivamos el
  // singular con singularize() y lo usamos como dirname y como key del UID.
  // El pluralName se conserva como el slug original.
  const slugIsPlural = slug.endsWith('s');
  const singularName = slugIsPlural ? singularize(slug) : slug;
  const pluralName = pluralize(slug);
  const ctKey = singularName;
  // collectionName define la tabla DB y NO se cambia entre regeneraciones
  // (eso destruiría datos). Para colecciones plurales usamos el slug plural
  // tal cual (sin sufijo _items, ya es plural).
  const collectionName = slugIsPlural
    ? slug.replace(/-/g, '_')
    : slug.replace(/-/g, '_') + (kind === 'collectionType' ? '_items' : '');
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
  const apiDir = path.join(STRAPI_API_DIR, ctKey);
  writeJson(path.join(apiDir, 'content-types', ctKey, 'schema.json'), schema);

  const factoryUid = `api::${ctKey}.${ctKey}`;
  writeText(
    path.join(apiDir, 'controllers', `${ctKey}.ts`),
    `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreController('${factoryUid}');\n`
  );
  writeText(
    path.join(apiDir, 'services', `${ctKey}.ts`),
    `import { factories } from '@strapi/strapi';\n\nexport default factories.createCoreService('${factoryUid}');\n`
  );
  writeText(
    path.join(apiDir, 'routes', `${ctKey}.ts`),
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

function loadManualSlugsFromManifest() {
  // Slugs de content types y categorías de componentes que NO vienen de
  // src/content/pages y por tanto el autogen no los conoce. wipeAutogenOutputs
  // debe respetarlos para no borrarlos antes de regenerar.
  if (!fs.existsSync(MANIFEST_PATH)) return { apiSlugs: new Set(), compCategories: new Set() };
  try {
    const prev = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    const apiSlugs = new Set();
    const compCategories = new Set();
    const isManual = (entry) => {
      const sample =
        (entry.sourceFiles && entry.sourceFiles[0]) ||
        entry.sourcePath ||
        entry.dirPath ||
        '';
      return sample && !sample.startsWith('src/content/pages');
    };
    for (const s of prev.singlePages || []) {
      if (isManual(s)) {
        apiSlugs.add(s.slug);
        compCategories.add(s.slug);
      }
    }
    for (const c of prev.collections || []) {
      if (isManual(c)) {
        apiSlugs.add(c.slug);
        compCategories.add(c.slug);
      }
    }
    return { apiSlugs, compCategories };
  } catch {
    return { apiSlugs: new Set(), compCategories: new Set() };
  }
}

function wipeAutogenOutputs() {
  // Limpia artefactos viejos antes de regenerar para evitar archivos huérfanos
  // cuando un content type se elimina o un componente cambia de shape.
  // Preserva:
  //   - src/components/shared/ (componentes manuales como related-link).
  //   - Content types manuales (notificacion, evento, etc.) — detectados
  //     porque su sourcePath en el manifest previo no apunta a src/content/pages.
  const apiDir = path.resolve(__dirname, '..', 'src', 'api');
  const compDir = path.resolve(__dirname, '..', 'src', 'components');
  const { apiSlugs: preserveApi, compCategories: preserveComp } =
    loadManualSlugsFromManifest();
  if (fs.existsSync(apiDir)) {
    for (const entry of fs.readdirSync(apiDir)) {
      if (preserveApi.has(entry)) continue;
      fs.rmSync(path.join(apiDir, entry), { recursive: true, force: true });
    }
  }
  if (fs.existsSync(compDir)) {
    for (const entry of fs.readdirSync(compDir)) {
      if (entry === 'shared') continue;
      if (preserveComp.has(entry)) continue;
      fs.rmSync(path.join(compDir, entry), { recursive: true, force: true });
    }
  }
  if (preserveApi.size > 0) {
    console.log(
      `[autogen] preservando manuales: ${[...preserveApi].join(', ')}`
    );
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
    const dn = brandedDisplayName(sp.slug);
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
    const dn = brandedDisplayName(coll.slug);
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

  // Merge con entradas manuales preexistentes. El autogen solo lee
  // src/content/pages/; content types craftados a mano que migran desde
  // otras fuentes (notificacion ← src/content/notificaciones, evento ←
  // src/content/events) deben sobrevivir a la regeneración.
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      const prev = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      const isManual = (entry) => {
        const sample =
          (entry.sourceFiles && entry.sourceFiles[0]) ||
          entry.sourcePath ||
          entry.dirPath ||
          '';
        return sample && !sample.startsWith('src/content/pages');
      };
      const manualSingles = (prev.singlePages || []).filter(isManual);
      const manualCollections = (prev.collections || []).filter(isManual);
      const manualKeys = new Set([
        ...manualSingles.map((s) => s.slug),
        ...manualCollections.map((c) => c.slug),
      ]);
      for (const s of manualSingles) {
        if (!manifest.singlePages.some((x) => x.slug === s.slug)) {
          manifest.singlePages.push(s);
        }
      }
      for (const c of manualCollections) {
        if (!manifest.collections.some((x) => x.slug === c.slug)) {
          manifest.collections.push(c);
        }
      }
      if (manualKeys.size > 0) {
        console.log(
          `  [manual]    preservados: ${[...manualKeys].join(', ')}`
        );
      }
    } catch (e) {
      console.warn(
        `[autogen] no pude mergear manifest previo: ${e.message}`
      );
    }
  }

  writeJson(MANIFEST_PATH, manifest);
  console.log(`\n[autogen] manifest: ${path.relative(REPO_ROOT, MANIFEST_PATH)}`);
}

main();
