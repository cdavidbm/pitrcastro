#!/usr/bin/env node
/**
 * Banners del home de www.itrc.gov.co (2026-10-28, pedido de Comunicaciones):
 *   1. el primero (el formulario de Microsoft Forms, «Banner_Web_2») se quita de la vista: se DESACTIVA
 *      (active = false), no se borra; el slider ya filtra los inactivos y se puede reactivar desde el panel;
 *   2. el del periódico (hoy el tercero) pasa a apuntar a la edición 02 de El Informador ITRC en lugar de la 01.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/home-banners-2026-10.mjs --seco
 *
 * Las diapositivas se reconocen por su enlace (en local y en producción los identificadores internos
 * no coinciden). Es repetible. Después hay que recompilar el sitio.
 */
const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID = 'api::slider.slider';
const ENLACE_FORMS = 'forms.cloud.microsoft/r/YN5JEcziaL';
const ENLACE_ED01 = '/prensa/noticias/2026-07-02-periodico-itrc-edicion-01';
const ENLACE_ED02 = '/prensa/noticias/2026-10-19-periodico-itrc-edicion-02';

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const CM = `${BASE}/content-manager/single-types/${UID}`;

const d = (await j(await fetch(CM, { headers: H }))).data;
const resumen = (s) => `${s.active === false ? '○ inactivo' : '● activo  '} · ${(s.link ?? '(sin enlace)').slice(0, 62)}`;
console.log('Antes:');
d.slides.forEach((s, i) => console.log(`  ${i + 1}. ${resumen(s)}`));

let cambios = 0;
const slides = d.slides.map((s) => {
  const { id, image, imageMobile, ...resto } = s;       // los medios se envían por su id; el id del componente se descarta
  const nueva = { ...resto, image: image?.id ?? null, imageMobile: imageMobile?.id ?? null };
  if ((s.link ?? '').includes(ENLACE_FORMS) && s.active !== false) { nueva.active = false; cambios++; console.log('  → se desactiva el banner del formulario'); }
  if ((s.link ?? '') === ENLACE_ED01) { nueva.link = ENLACE_ED02; cambios++; console.log('  → el banner del periódico pasa a la edición 02'); }
  return nueva;
});
if (!cambios) { console.log('\nNada que cambiar (ya está hecho).'); process.exit(0); }
if (SECO) { console.log(`\n(en seco: ${cambios} cambios, no se guardó nada)`); process.exit(0); }

const cuerpo = { name: d.name, description: d.description, autoplay: d.autoplay, interval: d.interval, slides };
await j(await fetch(CM, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) }));
await j(await fetch(`${CM}/actions/publish`, { method: 'POST', headers: H }));
const despues = (await j(await fetch(CM, { headers: H }))).data;
console.log('\nDespués:');
despues.slides.forEach((s, i) => console.log(`  ${i + 1}. ${resumen(s)}  ${s.image ? '[imagen ok]' : '[SIN IMAGEN]'}`));
console.log('\nGuardado y publicado. Falta recompilar el sitio.');
process.exit(0);
