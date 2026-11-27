#!/usr/bin/env node
/**
 * Prensa › Eventos: Audiencia Pública de Rendición de Cuentas 2026, jueves 10 de diciembre de
 * 10:00 a.m. a 12:00 m., virtual por Microsoft Teams (invitación de Prensa del 26-nov-2026). Solo el
 * enlace público para unirse; nunca el de opciones del organizador. Es repetible (compara por título).
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/evento-rendicion-cuentas-2026.mjs --seco
 */
const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const EVENTO = {
  title: 'Audiencia Pública de Rendición de Cuentas 2026',
  startDate: '2026-12-10T10:00:00-05:00', endDate: '2026-12-10T12:00:00-05:00',
  location: 'Virtual — Microsoft Teams',
  description: 'Un espacio para conocer los resultados, avances y logros de la Agencia ITRC. Acompáñenos, infórmese y sea parte de este ejercicio de transparencia y diálogo ciudadano. El informe de Rendición de Cuentas 2025-2026 ya está publicado en Participa.',
  inscriptionLink: '/participa/rendicion-de-cuentas',
  virtualLink: 'https://teams.microsoft.com/meet/279611585008093?p=2jnKBgfimb8Li0dsPE',
  image: null,
  published: true, archived: false,
};

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
const CM = `${BASE}/content-manager/collection-types/api::evento.evento`;
const ya = (await j(await fetch(`${CM}?pageSize=100`, { headers: H }))).results.find((x) => x.title === EVENTO.title);
console.log(`${ya ? '·' : '+'} ${EVENTO.startDate} ${EVENTO.title} — ${EVENTO.location}`);
if (SECO || ya) { console.log(SECO ? '(en seco: no se guardó nada)' : 'Ya existe.'); process.exit(0); }
const creado = (await j(await fetch(CM, { method: 'POST', headers: H, body: JSON.stringify(EVENTO) }))).data;
await j(await fetch(`${CM}/${creado.documentId}/actions/publish`, { method: 'POST', headers: H }));
console.log('✓ creado y publicado. El sitio se recompila solo.');
process.exit(0);
