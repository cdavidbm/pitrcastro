#!/usr/bin/env node
/**
 * Prensa › Eventos: los Encuentros Regionales de 2026 que tienen fecha exacta publicada en sus
 * noticias, para que la agenda muestre también lo que ya se hizo (pedido del usuario, 2026-11-24).
 * Solo se cargan los de fecha cierta; los demás de la tabla 19 del Informe de Rendición de Cuentas
 * 2025-2026 esperan a que Comunicaciones confirme el día. Sin hora conocida, el evento se guarda a
 * la medianoche y la página no muestra hora. Es repetible: no duplica (compara por título).
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/eventos-encuentros-2026.mjs --seco
 */
const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const DIALOGO = '«Diálogo para el cuidado y vigilancia de los recursos públicos de la DIAN, la UGPP y Coljuegos»';
const EVENTOS = [
  {
    title: 'Encuentro Regional Medellín',
    startDate: '2026-02-03T08:00:00-05:00', endDate: '2026-02-03T11:00:00-05:00',
    location: 'Auditorio del Concejo de Medellín, Antioquia',
    description: `Encuentro Regional ${DIALOGO}, con líderes sociales, organizaciones y ciudadanía. Un espacio de diálogo y pedagogía para fortalecer la vigilancia ciudadana sobre la gestión tributaria, aduanera y de las contribuciones parafiscales, y la denuncia responsable.`,
    inscriptionLink: '/prensa/noticias/2026-02-02-medellin-sera-sede-del-encuentro-regional-de-vigilancia-de',
    image: null,
  },
  {
    title: 'Encuentro Regional Cali-Palmira',
    startDate: '2026-02-12T00:00:00-05:00', endDate: '2026-02-13T00:00:00-05:00',
    location: 'Palmira (12 de febrero) y Cali (13 de febrero), Valle del Cauca',
    description: `Encuentro Regional ${DIALOGO} en el Valle del Cauca, con jornadas el 12 de febrero en Palmira y el 13 de febrero en Cali, para fortalecer la cultura de la legalidad y la protección de los recursos públicos en los territorios.`,
    inscriptionLink: '/prensa/noticias/2026-02-10-el-valle-del-cauca-sera-escenario-del-encuentro-regional-de',
    image: '/uploads/PALMIRA_BANNER_b11fff7f2f.jpeg',
  },
  {
    title: 'Encuentro Regional Cúcuta',
    startDate: '2026-03-03T00:00:00-05:00', endDate: null,
    location: 'Cúcuta, Norte de Santander',
    description: 'Encuentro Regional en el que la Agencia ITRC presentó los resultados de sus acciones de inspección, auditoría y control a la DIAN, la UGPP y Coljuegos.',
    inscriptionLink: '/prensa/noticias/2026-03-03-en-norte-de-santander-la-agencia-itrc-refuerza-estrategia',
    image: '/uploads/ITRC_1_0d13c95424.jpeg',
  },
  {
    title: 'Encuentro Regional Pasto',
    startDate: '2026-05-14T14:00:00-05:00', endDate: '2026-05-14T16:00:00-05:00',
    location: 'Auditorio Alcaldía de Pasto – Sede San Andrés, Nariño',
    description: `Encuentro Regional ${DIALOGO}, con ciudadanía, líderes sociales, veedurías, academia y actores institucionales, para fortalecer el control social y la protección de los recursos públicos.`,
    inscriptionLink: '/prensa/noticias/2026-05-12-la-vigilancia-ciudadana-es-clave-para-proteger-los-recursos-publicos',
    image: null,
  },
];

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
const CM = `${BASE}/content-manager/collection-types/api::evento.evento`;
const existentes = (await j(await fetch(`${CM}?pageSize=100`, { headers: H }))).results;
const nuevos = EVENTOS.filter((e) => !existentes.some((x) => x.title === e.title));
for (const e of EVENTOS) console.log(`${nuevos.includes(e) ? '+' : '·'} ${e.startDate.slice(0, 10)}  ${e.title} — ${e.location}`);
if (SECO || !nuevos.length) { console.log(SECO ? '(en seco: no se guardó nada)' : 'Nada que crear.'); process.exit(0); }
for (const e of nuevos) {
  const creado = (await j(await fetch(CM, { method: 'POST', headers: H, body: JSON.stringify({ ...e, published: true, archived: false }) }))).data;
  await j(await fetch(`${CM}/${creado.documentId}/actions/publish`, { method: 'POST', headers: H }));
}
console.log(`✓ ${nuevos.length} eventos creados y publicados. El sitio se recompila solo.`);
process.exit(0);
