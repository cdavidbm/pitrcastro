#!/usr/bin/env node
/**
 * Periódico ITRC — edición 02: visor de lectura (Heyzine) y banner nuevo del home.
 *
 *   1. La página de la edición 02 (Prensa › Noticias) pasa a tener el mismo visor embebido que la 01
 *      (Heyzine, https://heyzine.com/flip-book/8d8f599516.html), con los botones de descarga y la ayuda.
 *   2. El banner del periódico en el home (el que enlaza a esa edición) cambia a las piezas nuevas:
 *      escritorio 1900x600 y cuadrada 801x801 para móvil.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… \
 *     node scripts/periodico-ed02-visor-2026-10.mjs <carpeta con los dos .webp> --seco
 *
 * La carpeta debe traer slider-periodico-02-2026.webp y slider-periodico-02-2026-mobile.webp. Es repetible.
 * Después hay que recompilar el sitio.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
const CARPETA = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!CARPETA) { console.error('Falta la carpeta con los banners'); process.exit(1); }
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const SLUG = '2026-10-19-periodico-itrc-edicion-02';
const TITULO = 'Periódico ITRC — Edición No. 02 de 2026';
const PDF = '/documentos/media/prensa/Periodico-ITRC-02-2026.pdf';
const VISOR = 'https://heyzine.com/flip-book/8d8f599516.html';
const ENLACE = `/prensa/noticias/${SLUG}`;
const ALT = 'El Informador ITRC vuelve con nuevas historias. Un espacio para conocer las acciones, iniciativas y temas que fortalecen la transparencia, la integridad y el control en la gestión pública. Léelo, compártelo y sé parte de la conversación.';
const BANNERS = { desktop: 'slider-periodico-02-2026.webp', mobile: 'slider-periodico-02-2026-mobile.webp' };

const CONTENIDO = `<div class="periodico-actions">
  <a href="${PDF}" download class="periodico-btn periodico-btn--primary">
    <i class="fa-solid fa-download" aria-hidden="true"></i>
    <span>Descargar PDF</span>
  </a>
  <a href="${PDF}" target="_blank" rel="noopener" class="periodico-btn periodico-btn--secondary">
    <i class="fa-solid fa-up-right-from-square" aria-hidden="true"></i>
    <span>Abrir PDF en pestaña nueva</span>
  </a>
</div>

<div class="periodico-embed">
  <iframe
    src="${VISOR}"
    title="${TITULO}"
    allowfullscreen
    allow="clipboard-write"
    loading="lazy"
  ></iframe>
</div>

<p class="periodico-help">
  <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
  Pasa las páginas tocando o arrastrando en el visor. Si prefieres verlo sin conexión, usa el botón <strong>Descargar PDF</strong>.
</p>`;

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const HJ = { ...H, 'Content-Type': 'application/json' };

// ── 1. La página de la edición 02 ───────────────────────────────────────────────────────
console.log('1. Página de la edición 02');
const NOT = `${BASE}/content-manager/collection-types/api::noticia.noticia`;
const n = (await j(await fetch(`${NOT}?${new URLSearchParams({ 'filters[slug][$eq]': SLUG, pageSize: '1', populate: 'imagen' })}`, { headers: H }))).results?.[0];
if (!n) { console.error('   ✗ no existe la noticia de la edición 02'); process.exit(1); }
if ((n.contenido ?? '').includes(VISOR)) console.log('   · ya tiene el visor');
else {
  console.log('   se añade el visor Heyzine (misma estructura que la edición 01)');
  if (!SECO) {
    await j(await fetch(`${NOT}/${n.documentId}`, { method: 'PUT', headers: HJ, body: JSON.stringify({
      titulo: n.titulo, slug: n.slug, fecha: n.fecha, categoria: n.categoria, resumen: n.resumen, imagen: n.imagen?.id ?? null, contenido: CONTENIDO,
    }) }));
    await j(await fetch(`${NOT}/${n.documentId}/actions/publish`, { method: 'POST', headers: H }));
    console.log('   ✓ guardada y publicada');
  }
}

// ── 2. El banner del home ───────────────────────────────────────────────────────────────
console.log('\n2. Banner del periódico en el home');
async function subir(archivo, alt) {
  const q = new URLSearchParams({ 'filters[name][$eq]': archivo, pageSize: '1' });
  const ya = (await j(await fetch(`${BASE}/upload/files?${q}`, { headers: H }))).results?.[0];
  if (ya) { console.log(`   · ${archivo} ya está en la biblioteca (id ${ya.id})`); return ya.id; }
  const ruta = path.resolve(CARPETA, archivo);
  if (!fs.existsSync(ruta)) throw new Error(`no encuentro ${ruta}`);
  if (SECO) { console.log(`   (seco) se subiría ${archivo}`); return -1; }
  const fd = new FormData();
  fd.append('files', new Blob([fs.readFileSync(ruta)], { type: 'image/webp' }), archivo);
  fd.append('fileInfo', JSON.stringify({ name: archivo, alternativeText: alt.slice(0, 250) }));
  const up = await j(await fetch(`${BASE}/upload`, { method: 'POST', headers: H, body: fd }));
  console.log(`   ✓ ${archivo} subido (id ${up[0].id})`);
  return up[0].id;
}
const idD = await subir(BANNERS.desktop, ALT);
const idM = await subir(BANNERS.mobile, ALT);
const SL = `${BASE}/content-manager/single-types/api::slider.slider`;
const d = (await j(await fetch(SL, { headers: H }))).data;
let cambios = 0;
const slides = d.slides.map((s) => {
  const { id, image, imageMobile, ...resto } = s;
  const nueva = { ...resto, image: image?.id ?? null, imageMobile: imageMobile?.id ?? null };
  if ((s.link ?? '') === ENLACE) {
    const igual = nueva.image === idD && nueva.imageMobile === idM && (s.imageAlt ?? '') === ALT;
    if (igual) console.log('   · el banner ya usa las imágenes nuevas');
    else { nueva.image = idD; nueva.imageMobile = idM; nueva.imageAlt = ALT; cambios++; console.log('   → el banner de la edición 02 cambia a las imágenes nuevas (escritorio y móvil)'); }
  }
  return nueva;
});
if (!d.slides.some((s) => s.link === ENLACE)) { console.error('   ✗ no encuentro el banner que enlaza a la edición 02'); process.exit(1); }
if (cambios && !SECO) {
  await j(await fetch(SL, { method: 'PUT', headers: HJ, body: JSON.stringify({ name: d.name, description: d.description, autoplay: d.autoplay, interval: d.interval, slides }) }));
  await j(await fetch(`${SL}/actions/publish`, { method: 'POST', headers: H }));
  const despues = (await j(await fetch(SL, { headers: H }))).data;
  console.log('   ✓ guardado y publicado:', despues.slides.map((s, i) => `${i + 1}${s.active === false ? '○' : '●'}`).join(' '));
}
console.log(SECO ? '\n(en seco: no se guardó nada)' : '\nListo. Falta recompilar el sitio.');
process.exit(0);
