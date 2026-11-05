#!/usr/bin/env node
/**
 * Menú «Atención y Servicios › Consulte el estado de su PQRSDF» (2026-11-03, pedido de Comunicaciones):
 * la aplicación de consulta no está disponible, así que el elemento del menú lleva a la página
 * https://www.itrc.gov.co/tu-p-q-r-s-al-dia (enlace interno, se abre en la misma pestaña) en lugar de
 * https://www.itrc.gov.co/denuncias/consulta. El texto del elemento no cambia.
 *
 * El botón «Consultar estado de su PQRSDF» de esa página se oculta solo: la plantilla lo pinta únicamente
 * cuando el campo «consultaUrl» de Strapi trae una dirección, y hoy está vacío.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/menu-pqrsdf-2026-11.mjs --seco
 *
 * Es repetible. Después hay que recompilar el sitio.
 */
const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID = 'api::navigation.navigation';
const ANTES = 'https://www.itrc.gov.co/denuncias/consulta';
const DESPUES = '/tu-p-q-r-s-al-dia';

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const CM = `${BASE}/content-manager/single-types/${UID}`;

const doc = (await j(await fetch(CM, { headers: H }))).data;
const menu = doc.mainMenu?.mainMenu ?? doc.mainMenu;
let cambios = 0;
const recorre = (items, ruta = '') => { for (const it of items ?? []) {
  const nombre = `${ruta}${it.label}`;
  if ((it.url ?? '') === ANTES) {
    console.log(`  ${nombre}\n    antes:   ${it.url}${it.external ? '  (externo, pestaña nueva)' : ''}\n    después: ${DESPUES}  (interno)`);
    it.url = DESPUES; delete it.external; cambios++;
  } else if ((it.url ?? '') === DESPUES && /estado de su pqrsdf/i.test(it.label ?? '')) console.log(`  · ${nombre}: ya apunta a ${DESPUES}`);
  recorre(it.children, `${nombre} › `);
} };
recorre(menu);
if (!cambios) { console.log('Nada que cambiar.'); process.exit(0); }
if (SECO) { console.log('\n(en seco: no se guardó nada)'); process.exit(0); }
await j(await fetch(CM, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ mainMenu: doc.mainMenu }) }));
await j(await fetch(`${CM}/actions/publish`, { method: 'POST', headers: H }));
console.log('\n✓ guardado y publicado. Falta recompilar el sitio.');
process.exit(0);
