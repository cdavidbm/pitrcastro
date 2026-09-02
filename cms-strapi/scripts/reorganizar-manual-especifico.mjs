#!/usr/bin/env node
/**
 * reorganizar-manual-especifico.mjs — Reparte los documentos del Manual
 * Especifico de Funciones en las categorias por dependencia que tenia el
 * portal anterior.
 *
 * La pagina nueva quedo con dos secciones: las resoluciones (11 documentos) y
 * un bloque unico de 86 fichas. En el portal anterior esas 86 estaban repartidas
 * en nueve categorias por dependencia, y asi las quieren de vuelta.
 *
 * A que categoria va cada documento NO se decide aqui: se lee de
 * `manual-especifico-categorias.json`, extraido de la copia archivada del
 * portal anterior. La correspondencia se hace por nombre de archivo
 * normalizado, de modo que no depende de tildes ni de mayusculas.
 *
 * Lo que conserva:
 *   - El titulo y la descripcion de las secciones que ya existen.
 *   - Cada documento con su titulo y su enlace, intactos.
 *
 * Lo que hace:
 *   - Reagrupa. Nada mas. Si un solo documento quedara sin categoria, aborta
 *     sin escribir: es preferible no hacer nada a dejar la pagina a medias.
 *
 * Uso:
 *   STRAPI_EMAIL=... STRAPI_PASSWORD=... node cms-strapi/scripts/reorganizar-manual-especifico.mjs --revisar
 *   ...                                                                        (sin --revisar, guarda y publica)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SOLO_REVISAR = process.argv.includes('--revisar');

const UID = 'api::agencia-empleo-rrhh-manual-especifico-funciones.agencia-empleo-rrhh-manual-especifico-funciones';

/**
 * Descripcion para las categorias nuevas. Recoge lo que explicaba la seccion
 * "Fichas de cargo por empleo", que desaparece al repartirse.
 */
const DESCRIPCION_DEPENDENCIA =
  'Fichas técnicas con los requisitos, funciones y competencias de los empleos de esta dependencia.';

/** Historico no son fichas vigentes, sino documentos superados. */
const DESCRIPCIONES_PROPIAS = {
  'Histórico': 'Versiones anteriores del Manual y fichas ya modificadas, conservadas como referencia.',
};

/** Misma normalizacion que uso el extractor: sin tildes, sin mayusculas. */
function clave(url) {
  const n = decodeURIComponent(String(url || '')).split('/').pop().toLowerCase();
  return n.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.]+/g, '');
}

async function entrar() {
  const r = await fetch(`${STRAPI}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`no se pudo entrar: ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

if (!EMAIL || !PASSWORD) {
  console.error('ERROR: faltan STRAPI_EMAIL y STRAPI_PASSWORD.');
  process.exit(1);
}

const CAT = JSON.parse(fs.readFileSync(path.join(AQUI, 'manual-especifico-categorias.json'), 'utf8'));
const token = await entrar();
const cabeceras = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
const ruta = `${STRAPI}/content-manager/single-types/${UID}`;

const actual = await fetch(ruta, { headers: cabeceras }).then((r) => r.json());
const doc = actual.data;
const seccionesActuales = doc.secciones || [];

// Lo que hay hoy, para conservar titulo y descripcion donde ya existan.
const descripcionPorTitulo = new Map();
for (const s of seccionesActuales) {
  if (s.descripcion) descripcionPorTitulo.set(s.titulo, s.descripcion);
}
/** La primera categoria del portal anterior es la misma que la seccion de
 *  resoluciones que ya existe; se respeta el nombre actual, mejor redactado. */
const RENOMBRES = new Map();
const resolucionesActual = seccionesActuales.find((s) => /resolucion/i.test(s.titulo || ''));
if (resolucionesActual) RENOMBRES.set(CAT.orden[0], resolucionesActual.titulo);

// Repartir. Cada documento conserva su titulo y su enlace.
const porCategoria = new Map(CAT.orden.map((c) => [c, []]));
const huerfanos = [];
let total = 0;
for (const s of seccionesActuales) {
  for (const d of s.documentos || []) {
    total++;
    const cat = CAT.documentos[clave(d.url)];
    if (!cat) { huerfanos.push({ seccion: s.titulo, ...d }); continue; }
    porCategoria.get(cat).push({ titulo: d.titulo, url: d.url });
  }
}

if (huerfanos.length) {
  console.error(`ABORTADO: ${huerfanos.length} de ${total} documentos sin categoria. No se escribio nada.`);
  for (const h of huerfanos.slice(0, 10)) console.error(`  - ${h.titulo} → ${h.url}`);
  process.exit(1);
}

const secciones = CAT.orden
  .filter((c) => porCategoria.get(c).length > 0)
  .map((c) => {
    const titulo = RENOMBRES.get(c) || c;
    return {
      titulo,
      descripcion:
        descripcionPorTitulo.get(titulo) ||
        DESCRIPCIONES_PROPIAS[titulo] ||
        DESCRIPCION_DEPENDENCIA,
      documentos: porCategoria.get(c),
    };
  });

const repartidos = secciones.reduce((a, s) => a + s.documentos.length, 0);

console.log(`\n  Antes: ${seccionesActuales.length} secciones, ${total} documentos`);
console.log(`  Despues: ${secciones.length} secciones, ${repartidos} documentos\n`);
for (const s of secciones) {
  console.log(`  ${String(s.documentos.length).padStart(3)}  ${s.titulo}`);
  console.log(`       ${s.descripcion.slice(0, 88)}`);
}

if (repartidos !== total) {
  console.error(`\nABORTADO: se repartieron ${repartidos} de ${total}. No se escribio nada.`);
  process.exit(1);
}

if (SOLO_REVISAR) {
  console.log('\n  (modo revision: no se guardo nada)');
  process.exit(0);
}

const guardar = await fetch(ruta, {
  method: 'PUT',
  headers: cabeceras,
  body: JSON.stringify({ ...doc, secciones }),
});
if (!guardar.ok) {
  console.error(`ERROR al guardar: ${guardar.status} ${await guardar.text()}`);
  process.exit(1);
}
console.log('\n  ✓ borrador guardado');

const publicar = await fetch(`${ruta}/actions/publish`, { method: 'POST', headers: cabeceras });
if (!publicar.ok) {
  console.error(`ERROR al publicar: ${publicar.status} ${await publicar.text()}`);
  process.exit(1);
}
console.log('  ✓ publicado');
