#!/usr/bin/env node
/**
 * Requerimientos de la Dirección General (Doris Molina), 29-oct y 3-nov-2026:
 *   1. Encuesta ciudadana (Observatorio › Eje de Participación): el tablero de Participación Ciudadana 2026
 *      (Power BI) y el enlace de la «Encuesta de conocimiento ciudadano sobre la Agencia ITRC». El portal no
 *      puede incrustar el tablero (la política del WAF bloquea todo marco externo), así que va como enlace que
 *      se abre aparte, igual que el tablero del CIPREP 2025. Lo anterior queda en normograma-style log local.
 *   2. CIPREP 2025 › Memorias › «Documentos oficiales»: enlaza el PDF de las memorias (antes «Próximamente»).
 *   3. Observatorio › Eje de Educación › Artículos y Publicaciones: tarjeta con las mismas memorias.
 * Los archivos deben estar en public/ (copia local y árbol de trabajo del servidor). Es repetible.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/doris-2026-11.mjs --seco
 *
 * Después hay que recompilar el sitio.
 */
import fs from 'node:fs';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const PDF = '/documentos/ciprep/Memorias-CIPREP-2025.pdf';
const PORTADA = '/images/ciprep/memorias-ciprep-2025.png';
const TABLERO = 'https://app.powerbi.com/reportEmbed?reportId=f91fb2b1-2ee9-4392-a4f3-7cff5cdc536f&autoAuth=true&ctid=a725d1dc-3e64-4283-955e-dd4e513608e6';
const FORMS = 'https://forms.cloud.microsoft/r/aAWS7bz5sy';
for (const f of [PDF, PORTADA]) if (!fs.existsSync(new URL(`../../public${f}`, import.meta.url).pathname)) { console.error(`Falta public${f}`); process.exit(1); }

const SISTEMA = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations', 'locale', 'status'];
const limpiar = (o) => Array.isArray(o) ? o.map(limpiar)
  : o && typeof o === 'object' ? (o.hash && o.mime ? o.id : Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'id').map(([k, v]) => [k, limpiar(v)]))) : o;
const cuerpo = (d) => limpiar(Object.fromEntries(Object.entries(d).filter(([k]) => !SISTEMA.includes(k))));

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const leer = async (uid) => (await j(await fetch(`${BASE}/content-manager/single-types/${uid}`, { headers: H }))).data;
async function guardar(uid, d) {
  if (SECO) return;
  const u = `${BASE}/content-manager/single-types/${uid}`;
  await j(await fetch(u, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo(d)) }));
  await j(await fetch(`${u}/actions/publish`, { method: 'POST', headers: H }));
}
let cambios = 0; const previos = [];

// ── 1. Encuesta ciudadana + tablero 2026 ─────────────────────────────────────────────────
console.log('1. Encuesta ciudadana');
const UID_ENC = 'api::observatorio-eje-de-participacion-encuesta.observatorio-eje-de-participacion-encuesta';
const enc = await leer(UID_ENC);
if (enc.participar.url === FORMS && enc.resultados.url === TABLERO) console.log('   · ya está');
else {
  previos.push({ pagina: 'encuesta-ciudadana', participar: enc.participar, resultados: enc.resultados });
  console.log(`   ✎ encuesta: ${enc.participar.url.slice(0, 60)}… → ${FORMS}`);
  console.log('   ✎ resultados: dashboard anterior → Tablero de Participación Ciudadana 2026 (Power BI, enlace aparte)');
  enc.participar = { ...enc.participar, titulo: 'Participe en la Encuesta', descripcion: 'Encuesta de conocimiento ciudadano sobre la Agencia ITRC.', url: FORMS };
  enc.resultados = { ...enc.resultados, titulo: 'Tablero de Participación Ciudadana 2026', descripcion: 'Consulte los resultados en el tablero de Participación Ciudadana 2026.', url: TABLERO };
  await guardar(UID_ENC, enc); cambios++;
}

// ── 2. CIPREP 2025 › Documentos oficiales ────────────────────────────────────────────────
console.log('\n2. CIPREP 2025 · Documentos oficiales');
const UID_CIP = 'api::ciprep.ciprep';
const cip = await leer(UID_CIP);
const rec = cip.memorias.recursos.find((r) => r.titulo === 'Documentos oficiales');
if (!rec) console.log('   ✗ no encuentro el recurso «Documentos oficiales»');
else if (rec.url === PDF) console.log('   · ya está');
else {
  console.log(`   ✎ «${rec.titulo}»: «${rec.url || '(vacío)'}» → ${PDF}`);
  rec.url = PDF; rec.descripcion = 'Memorias del Primer Congreso Internacional para la Protección de los Recursos Públicos (PDF).';
  await guardar(UID_CIP, cip); cambios++;
}

// ── 3. Artículos y Publicaciones ──────────────────────────────────────────────────────────
console.log('\n3. Artículos y Publicaciones (Eje de Educación)');
const UID_ART = 'api::observatorio-eje-de-educacion-articulos.observatorio-eje-de-educacion-articulos';
const art = await leer(UID_ART);
if (art.articulos.some((a) => a.url === PDF)) console.log('   · ya está');
else {
  console.log('   + Memorias del Primer Congreso Internacional (CIPREP 2025)');
  art.articulos = [...art.articulos, { titulo: 'Memorias del Primer Congreso Internacional para la Protección de los Recursos Públicos – CIPREP 2025', autor: 'Agencia ITRC', url: PDF, imagen: PORTADA }];
  await guardar(UID_ART, art); cambios++;
}

console.log(`\n${cambios} cambios${SECO ? ' (en seco: no se guardó nada)' : ' guardados y publicados. Falta recompilar el sitio.'}`);
// va al final: escribir dentro de cms-strapi/ reinicia Strapi en desarrollo y cortaría el guardado
if (!SECO && previos.length) {
  const f = new URL('./doris-2026-11-previos.json', import.meta.url).pathname;
  fs.writeFileSync(f, JSON.stringify([...(fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []), ...previos], null, 1));
  console.log(`Valores anteriores guardados en ${f}`);
}
process.exit(0);
