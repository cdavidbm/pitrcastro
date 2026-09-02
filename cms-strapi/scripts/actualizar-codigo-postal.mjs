#!/usr/bin/env node
/**
 * actualizar-codigo-postal.mjs — Cambia el codigo postal de la entidad en los
 * dos sitios del CMS donde vive.
 *
 * Aviso ciudadano de septiembre de 2026: el codigo publicado no era el de la
 * sede. Estaba en dos lugares distintos y habia que cambiarlo en ambos, o el
 * portal quedaria mostrando dos codigos a la vez.
 *
 *   1. Contacto (api::contact) → campo `postalCode`. Alimenta el pie de pagina
 *      y los datos estructurados de las 390 paginas.
 *   2. Canales de atencion → el item "Codigo Postal", que es el unico sitio
 *      donde hoy se ve escrito en pantalla.
 *
 * NO toca las noticias ya publicadas: son contenido historico.
 *
 * El guion comprueba que encuentra exactamente lo que espera y, si no, aborta
 * sin escribir nada.
 *
 * Uso:
 *   ANTERIOR=111071 NUEVO=110931 STRAPI_EMAIL=... STRAPI_PASSWORD=... \
 *     node cms-strapi/scripts/actualizar-codigo-postal.mjs --revisar
 */

const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const ANTERIOR = process.env.ANTERIOR || '';
const NUEVO = process.env.NUEVO || '';
const SOLO_REVISAR = process.argv.includes('--revisar');

const UID_CONTACTO = 'api::contact.contact';
const UID_CANALES = 'api::atencion-canales-de-atencion.atencion-canales-de-atencion';

if (!EMAIL || !PASSWORD || !ANTERIOR || !NUEVO) {
  console.error('ERROR: faltan ANTERIOR, NUEVO, STRAPI_EMAIL o STRAPI_PASSWORD.');
  process.exit(1);
}

async function entrar() {
  const r = await fetch(`${STRAPI}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`no se pudo entrar: ${r.status}`);
  return (await r.json()).data.token;
}

const token = await entrar();
const cab = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
const cambios = [];

// --- 1. Contacto -----------------------------------------------------------
const rutaContacto = `${STRAPI}/content-manager/single-types/${UID_CONTACTO}`;
const contacto = (await fetch(rutaContacto, { headers: cab }).then((r) => r.json())).data;
if (contacto.postalCode !== ANTERIOR) {
  console.error(`ABORTADO: el contacto tiene "${contacto.postalCode}", esperaba "${ANTERIOR}". Nada escrito.`);
  process.exit(1);
}
cambios.push({ que: 'Contacto → postalCode', de: contacto.postalCode, a: NUEVO });

// --- 2. Canales de atencion ------------------------------------------------
const rutaCanales = `${STRAPI}/content-manager/single-types/${UID_CANALES}`;
const canales = (await fetch(rutaCanales, { headers: cab }).then((r) => r.json())).data;
let encontrados = 0;
for (const bloque of canales.canales || []) {
  for (const item of bloque.items || []) {
    if (item.valor === ANTERIOR) {
      encontrados++;
      cambios.push({ que: `Canales → "${item.label}"`, de: item.valor, a: NUEVO });
    }
  }
}
if (encontrados !== 1) {
  console.error(`ABORTADO: esperaba 1 item con "${ANTERIOR}" en canales, encontre ${encontrados}. Nada escrito.`);
  process.exit(1);
}

console.log(`\n  Cambios (${ANTERIOR} → ${NUEVO}):\n`);
for (const c of cambios) console.log(`    ${c.que.padEnd(34)} ${c.de} → ${c.a}`);

if (SOLO_REVISAR) {
  console.log('\n  (modo revision: no se guardo nada)');
  process.exit(0);
}

async function guardarYPublicar(ruta, cuerpo, nombre) {
  const g = await fetch(ruta, { method: 'PUT', headers: cab, body: JSON.stringify(cuerpo) });
  if (!g.ok) throw new Error(`al guardar ${nombre}: ${g.status} ${await g.text()}`);
  const p = await fetch(`${ruta}/actions/publish`, { method: 'POST', headers: cab });
  if (!p.ok) throw new Error(`al publicar ${nombre}: ${p.status} ${await p.text()}`);
  console.log(`  ✓ ${nombre}`);
}

await guardarYPublicar(rutaContacto, { ...contacto, postalCode: NUEVO }, 'Contacto');

const canalesNuevos = {
  ...canales,
  canales: (canales.canales || []).map((b) => ({
    ...b,
    items: (b.items || []).map((i) => (i.valor === ANTERIOR ? { ...i, valor: NUEVO } : i)),
  })),
};
await guardarYPublicar(rutaCanales, canalesNuevos, 'Canales de atencion');
