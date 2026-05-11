#!/usr/bin/env node
/**
 * Recalcula info.displayName en todos los schemas autogen sin tocar
 * atributos ni regenerar componentes.
 *
 * Comparte el algoritmo brandedDisplayName con autogen-schemas.mjs (lo
 * importa por copy del módulo).
 *
 * Uso:
 *   node cms-strapi/scripts/update-display-names.mjs           # aplica
 *   node cms-strapi/scripts/update-display-names.mjs --dry-run # solo muestra diff
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const API_DIR = path.resolve(__dirname, '..', 'src', 'api');
const MANIFEST = path.join(__dirname, '.autogen-manifest.json');

const dryRun = process.argv.includes('--dry-run');

// === Algoritmo (espejo de autogen-schemas.mjs brandedDisplayName) ===

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
  etnicos: 'Étnicos',
  economico: 'Económico',
  educacion: 'Educación',
  ejecucion: 'Ejecución',
  especifico: 'Específico',
  especificas: 'Específicas',
  estrategico: 'Estratégico',
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
  return text
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w, i) => prettyWord(w, i === 0))
    .join(' ');
}

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

// === Main ===

function findSchemaFile(slug) {
  // El dir del content type es el singularName. Para slugs plurales
  // (terminan en 's' length > 3) probamos también el singular.
  const candidates = [slug];
  if (slug.endsWith('s') && slug.length > 3) {
    if (slug.endsWith('es') && slug.length > 4) candidates.push(slug.slice(0, -2));
    else candidates.push(slug.slice(0, -1));
  }
  for (const key of candidates) {
    const f = path.join(API_DIR, key, 'content-types', key, 'schema.json');
    if (fs.existsSync(f)) return f;
  }
  return null;
}

function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('[update-dn] manifest no existe.');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  let changed = 0, skipped = 0, missing = 0;
  const all = [
    ...manifest.singlePages.map((s) => ({ ...s, kind: 'single' })),
    ...manifest.collections.map((c) => ({ ...c, kind: 'collection' })),
  ];
  for (const entry of all) {
    const schemaFile = findSchemaFile(entry.slug);
    if (!schemaFile) {
      console.warn(`  [missing] ${entry.slug}: no encontré schema.json`);
      missing++;
      continue;
    }
    const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
    const oldDn = schema.info.displayName;
    const newDn = brandedDisplayName(entry.slug);
    if (oldDn === newDn) {
      skipped++;
      continue;
    }
    console.log(`  ${entry.slug}: "${oldDn}" → "${newDn}"`);
    if (!dryRun) {
      schema.info.displayName = newDn;
      fs.writeFileSync(schemaFile, JSON.stringify(schema, null, 2) + '\n', 'utf8');
    }
    changed++;
  }
  console.log(
    `\n[update-dn] ${changed} cambiados, ${skipped} sin cambio, ${missing} sin schema (${dryRun ? 'dry-run' : 'aplicado'})`
  );
}

main();
