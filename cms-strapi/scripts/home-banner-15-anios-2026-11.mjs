#!/usr/bin/env node
/**
 * Banner de los 15 años de la Agencia ITRC (3-nov-2011 → 3-nov-2026) en el home de www.itrc.gov.co.
 * Se añade como PRIMERA diapositiva del carrusel, activa, sin enlace (la pieza lleva su texto dentro de la
 * imagen) y sin versión para móvil, como otros banners del carrusel.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… \
 *     node scripts/home-banner-15-anios-2026-11.mjs <carpeta con slider-15-anios-2026.webp> --seco
 *
 * Es repetible: se reconoce por el nombre de la imagen. Después hay que recompilar el sitio.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
const CARPETA = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!CARPETA) { console.error('Falta la carpeta con el banner'); process.exit(1); }
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const ARCHIVO = 'slider-15-anios-2026.webp';
const ALT = 'Agencia ITRC: 15 años protegiendo lo público. Auditamos, investigamos y prevenimos para fortalecer la transparencia. 3 de noviembre de 2011 – 3 de noviembre de 2026.';

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const SL = `${BASE}/content-manager/single-types/api::slider.slider`;

const d = (await j(await fetch(SL, { headers: H }))).data;
console.log(`Antes: ${d.slides.length} diapositivas`);
if (d.slides.some((s) => s.image?.name === ARCHIVO)) { console.log('· el banner de los 15 años ya está en el carrusel'); process.exit(0); }

let id = (await j(await fetch(`${BASE}/upload/files?${new URLSearchParams({ 'filters[name][$eq]': ARCHIVO, pageSize: '1' })}`, { headers: H }))).results?.[0]?.id;
if (id) console.log(`· la imagen ya está en la biblioteca (id ${id})`);
else if (SECO) console.log('(seco) se subiría la imagen');
else {
  const ruta = path.resolve(CARPETA, ARCHIVO);
  if (!fs.existsSync(ruta)) { console.error(`✗ no encuentro ${ruta}`); process.exit(1); }
  const fd = new FormData();
  fd.append('files', new Blob([fs.readFileSync(ruta)], { type: 'image/webp' }), ARCHIVO);
  fd.append('fileInfo', JSON.stringify({ name: ARCHIVO, alternativeText: ALT.slice(0, 250) }));
  id = (await j(await fetch(`${BASE}/upload`, { method: 'POST', headers: H, body: fd })))[0].id;
  console.log(`✓ imagen subida (id ${id})`);
}
console.log('→ se añade como primera diapositiva: activa, sin enlace, sin imagen móvil');
if (SECO) { console.log('\n(en seco: no se guardó nada)'); process.exit(0); }

const resto = d.slides.map(({ id: _i, image, imageMobile, ...r }) => ({ ...r, image: image?.id ?? null, imageMobile: imageMobile?.id ?? null }));
const nueva = { image: id, imageMobile: null, imageAlt: ALT, title: '', subtitle: '', description: '', link: '', linkText: '', external: false, overlay: false, active: true, order: 0 };
await j(await fetch(SL, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: d.name, description: d.description, autoplay: d.autoplay, interval: d.interval, slides: [nueva, ...resto] }) }));
await j(await fetch(`${SL}/actions/publish`, { method: 'POST', headers: H }));
const despues = (await j(await fetch(SL, { headers: H }))).data;
console.log(`\nDespués: ${despues.slides.length} diapositivas:`, despues.slides.map((s, i) => `${i + 1}${s.active === false ? '○' : '●'}`).join(' '));
console.log('Guardado y publicado. Falta recompilar el sitio.');
process.exit(0);
