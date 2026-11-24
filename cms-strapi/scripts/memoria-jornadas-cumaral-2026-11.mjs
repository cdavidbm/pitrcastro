#!/usr/bin/env node
/**
 * Observatorio · Eje de Participación — memoria «Jornadas de sensibilización en instituciones
 * educativas»: agrega al final la actividad en la I.E. Teniente Cruz Paredes (Cumaral, Meta), con sus
 * cuatro fotografías (37 a 40.jpeg, carpeta material_3). Las fotos deben estar ya en
 * public/documentos/observatorio/eventos/<slug>/ (copia local y árbol de trabajo del servidor).
 * Es repetible: no duplica la actividad.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/memoria-jornadas-cumaral-2026-11.mjs --seco
 */
import fs from 'node:fs';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID = 'api::observatorio-eje-de-participacion-memoria.observatorio-eje-de-participacion-memoria';
const SLUG = 'jornadas-de-sensibilizacion-en-instituciones-educativas-educando-para-la-transparencia';
const RUTA = `/documentos/observatorio/eventos/${SLUG}`;
const TEXTO = 'Recorrido por el Meta, llegamos a la Institución Educativa Teniente Cruz Paredes, en Cumaral, para acercar la Agencia ITRC a niños, niñas y adolescentes, mediante herramientas pedagógicas virtuales, que promueven la integridad, la prevención del fraude y la lucha contra la corrupción.';
const FOTOS = [37, 38, 39, 40];

for (const n of FOTOS) {
  const p = new URL(`../../public${RUTA}/${n}.jpeg`, import.meta.url).pathname;
  if (!fs.existsSync(p)) { console.error(`Falta la foto ${n}.jpeg`); process.exit(1); }
}

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` }; const HJ = { ...H, 'Content-Type': 'application/json' };
const CM = `${BASE}/content-manager/collection-types/${UID}`;
const m = (await j(await fetch(`${CM}?${new URLSearchParams({ 'filters[slug][$eq]': SLUG, pageSize: '1' })}`, { headers: H }))).results?.[0];
if (!m) { console.error('No existe la memoria'); process.exit(1); }
if ((m.contenido || '').includes(`${RUTA}/40.jpeg`)) { console.log('· la actividad ya está'); process.exit(0); }

const alt = (n) => `${TEXTO.replace(/\.$/, '')} — fotografía ${n}`;
const bloque = [TEXTO, ...FOTOS.map((n) => `![${alt(n)}](${RUTA}/${n}.jpeg)`)].join('\n\n');
const contenido = `${(m.contenido || '').trimEnd()}\n\n${bloque}`;
console.log(`+ actividad en Cumaral (Meta) con ${FOTOS.length} fotos; el contenido pasa de ${m.contenido.length} a ${contenido.length} caracteres`);
if (SECO) { console.log('(en seco: no se guardó nada)'); process.exit(0); }

const datos = { titulo: m.titulo, slug: m.slug, fecha: m.fecha, resumen: m.resumen, contenido, imagenDestacada: m.imagenDestacada, galeria: m.galeria ?? [] };
await j(await fetch(`${CM}/${m.documentId}`, { method: 'PUT', headers: HJ, body: JSON.stringify(datos) }));
await j(await fetch(`${CM}/${m.documentId}/actions/publish`, { method: 'POST', headers: H }));
console.log('✓ guardado y publicado. Falta recompilar el sitio.');
process.exit(0);
