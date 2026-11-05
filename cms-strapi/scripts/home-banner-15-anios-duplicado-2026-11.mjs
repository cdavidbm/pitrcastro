#!/usr/bin/env node
/**
 * El banner de los 15 años quedó repetido en el home (2026-11-05): una copia añadida desde el panel
 * (imagen «Banner_web_15.webp», «15 años ITRC») y otra como primera diapositiva
 * («slider-15-anios-2026.webp»). Se deja la primera y se DESACTIVA la otra (no se borra: se puede
 * reactivar desde el panel).
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/home-banner-15-anios-duplicado-2026-11.mjs --seco
 *
 * Es repetible. Después hay que recompilar el sitio.
 */
const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const QUEDA = 'slider-15-anios-2026.webp';
const SE_DESACTIVA = 'Banner_web_15.webp';

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const SL = `${BASE}/content-manager/single-types/api::slider.slider`;

const d = (await j(await fetch(SL, { headers: H }))).data;
const linea = (s, i) => `  ${i + 1}. ${s.active === false ? '○ inactiva' : '● activa  '} · ${s.image?.name ?? '(sin imagen)'}`;
console.log('Antes:'); d.slides.forEach((s, i) => console.log(linea(s, i)));
if (!d.slides.some((s) => s.image?.name === QUEDA)) { console.error(`\n✗ no está la diapositiva «${QUEDA}»: no se toca nada`); process.exit(1); }

let cambios = 0;
const slides = d.slides.map((s) => {
  const { id, image, imageMobile, ...resto } = s;
  const n = { ...resto, image: image?.id ?? null, imageMobile: imageMobile?.id ?? null };
  if (s.image?.name === SE_DESACTIVA && s.active !== false) { n.active = false; cambios++; console.log('\n→ se desactiva la copia «15 años ITRC» (Banner_web_15.webp)'); }
  return n;
});
if (!cambios) { console.log('\nNada que cambiar.'); process.exit(0); }
if (SECO) { console.log('\n(en seco: no se guardó nada)'); process.exit(0); }
await j(await fetch(SL, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: d.name, description: d.description, autoplay: d.autoplay, interval: d.interval, slides }) }));
await j(await fetch(`${SL}/actions/publish`, { method: 'POST', headers: H }));
const despues = (await j(await fetch(SL, { headers: H }))).data;
console.log('\nDespués:'); despues.slides.forEach((s, i) => console.log(linea(s, i)));
console.log('\nGuardado y publicado. Falta recompilar el sitio.');
process.exit(0);
