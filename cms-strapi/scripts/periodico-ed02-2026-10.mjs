#!/usr/bin/env node
/**
 * Periódico ITRC — Edición No. 02 (octubre de 2026, «El Informador ITRC»), en Prensa › Noticias del portal.
 *
 * La edición 01 se publicó el 2-jul con su PDF; la 02 la envió Prensa a los servidores el 19-oct. Misma
 * estructura que la 01 (categoría «periodico», botones de descarga) sin el visor externo de Heyzine: no
 * hay enlace de visor para la 02 y los iframes externos los bloquea el WAF.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… \
 *     node scripts/periodico-ed02-2026-10.mjs <carpeta con portada-periodico-02-2026.webp> --seco
 *
 * El PDF debe estar ya en public/documentos/media/prensa/Periodico-ITRC-02-2026.pdf (copia local y árbol de
 * trabajo del servidor). Es repetible: no duplica si ya existe el «slug».
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
const CARPETA = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!CARPETA) { console.error('Falta la carpeta con la portada'); process.exit(1); }
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID = 'api::noticia.noticia';
const SLUG = '2026-10-19-periodico-itrc-edicion-02';
const TITULO = 'Periódico ITRC — Edición No. 02 de 2026';
const PDF = '/documentos/media/prensa/Periodico-ITRC-02-2026.pdf';
const PORTADA = 'portada-periodico-02-2026.webp';
const RESUMEN = 'Segunda edición del Periódico El Informador ITRC (octubre de 2026): «Control, formación y cercanía: la integridad se construye entre todos». Léela en línea o descárgala en PDF.';
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

<p class="periodico-help">
  <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
  La edición tiene cuatro páginas en formato A3: se lee mejor en una pantalla grande. Usa el botón <strong>Descargar PDF</strong> para verla sin conexión.
</p>`;

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const HJ = { ...H, 'Content-Type': 'application/json' };
const CM = `${BASE}/content-manager/collection-types/${UID}`;

console.log(`Periódico ITRC — edición 02`);
if (!fs.existsSync(new URL('../../public' + PDF, import.meta.url).pathname)) console.log(`  ⚠ falta el PDF en el árbol de trabajo local: ${PDF}`);
const ya = (await j(await fetch(`${CM}?${new URLSearchParams({ 'filters[slug][$eq]': SLUG, pageSize: '1' })}`, { headers: H }))).results ?? [];
if (ya.length) { console.log('  · ya existe: no se toca'); process.exit(0); }
if (SECO) { console.log(`  (seco) se subiría la portada y se crearía «${TITULO}» (${SLUG})`); process.exit(0); }

const ruta = path.resolve(CARPETA, PORTADA);
const fd = new FormData();
fd.append('files', new Blob([fs.readFileSync(ruta)], { type: 'image/webp' }), PORTADA);
fd.append('fileInfo', JSON.stringify({ name: PORTADA, alternativeText: 'Portada de la edición 02 del Periódico El Informador ITRC, octubre de 2026' }));
const up = await j(await fetch(`${BASE}/upload`, { method: 'POST', headers: H, body: fd }));
console.log(`  ✓ portada subida: ${up[0].url}`);
const doc = (await j(await fetch(CM, { method: 'POST', headers: HJ, body: JSON.stringify({
  titulo: TITULO, slug: SLUG, fecha: '2026-10-19T17:00:00.000Z', categoria: 'periodico', resumen: RESUMEN, contenido: CONTENIDO, imagen: up[0].id,
}) }))).data.documentId;
await j(await fetch(`${CM}/${doc}/actions/publish`, { method: 'POST', headers: H }));
console.log(`  ✓ creado y publicado (${doc}). Falta recompilar el sitio.`);
process.exit(0);
