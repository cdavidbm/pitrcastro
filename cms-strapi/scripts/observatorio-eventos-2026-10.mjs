#!/usr/bin/env node
/**
 * Observatorio · Eje de Participación — eventos 2025 y 2026 (requerimiento COM-FT-002 de la Experta
 * Misional, 2026-10-26, carpeta de OneDrive «Eventos Eje Participación_ITRC_2025_2026»).
 *
 * Cada carpeta trae el comunicado en Word y las fotos del evento. Por cada evento se publica:
 *   1. una memoria con página propia (título, texto íntegro del comunicado, enlace a la publicación
 *      en redes y galería de fotos);
 *   2. su entrada en el listado de Memorias del año (en su lugar, por fecha);
 *   3. su tarjeta en «Noticias del Observatorio», que enlaza a la memoria.
 * Además, las cuatro plenarias de RENOBA enlazan su comunicado desde la página «RENOBA».
 *
 * Se omiten los seis eventos que Doris marcó «YA PUBLICADO» y el E37 (sesión RENOBA del 20-nov-2025),
 * que ya es una memoria publicada.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… \
 *     node scripts/observatorio-eventos-2026-10.mjs <carpeta con eventos.json> --seco
 *
 * Las fotos deben estar ya en public/documentos/observatorio/eventos/<slug>/ (copia local y árbol de
 * trabajo del servidor): no pasan por la biblioteca de medios porque Strapi nombra los archivos con
 * guiones bajos y el renderizador de memorias los toma por cursivas. Es repetible: no toca lo que ya existe.
 * Si se vuelve a ejecutar observatorio-2026-10.mjs, ese guion rehace la página RENOBA sin los enlaces a los
 * comunicados: basta con ejecutar este de nuevo.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
const CARPETA = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!CARPETA) { console.error('Falta la carpeta con eventos.json'); process.exit(1); }
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID_MEMORIA = 'api::observatorio-eje-de-participacion-memoria.observatorio-eje-de-participacion-memoria';
const UID_INFO = 'api::observatorio-eje-de-participacion-memorias-info.observatorio-eje-de-participacion-memorias-info';
const UID_NOTICIAS = 'api::observatorio-eje-de-participacion-noticias.observatorio-eje-de-participacion-noticias';
const RUTA_MEMORIAS = '/observatorio/eje-de-participacion/memorias';
const RUTA_FOTOS = '/documentos/observatorio/eventos';
const enArbol = (rel) => new URL(`../../public${rel}`, import.meta.url).pathname;

const EVENTOS = JSON.parse(fs.readFileSync(path.join(CARPETA, 'eventos.json'), 'utf8'))
  // «LA ITRC…» en mayúsculas es un error tipográfico del Word
  .map((e) => ({ ...e, titulo: e.titulo.replace(/^LA /, 'La ').replace(/\s+/g, ' ').trim() }));

// plenarias de RENOBA: fecha del evento → texto de la sesión en la página «RENOBA»
const PLENARIAS = { '2026-07-09': '9 de julio de 2026', '2026-04-29': '29 de abril de 2026', '2025-09-25': '25 de septiembre de 2025', '2025-06-25': '25 de junio de 2025' };
const SLUG_RENOBA = 'renoba-plenarias-2025-2026';

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fechaLarga = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} de ${MESES[m - 1]} de ${y}`; };
// «24 de abril de 2026», «20 y 21 de octubre de 2025» → [año, mes, día] (el último día de un rango)
const fechaDeTexto = (t = '') => {
  const m = t.match(/(\d{1,2})(?:\s+y\s+(\d{1,2}))?\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/i);
  if (!m) return null;
  const mes = MESES.indexOf(m[3].toLowerCase());
  return mes < 0 ? null : [Number(m[4]), mes + 1, Number(m[2] ?? m[1])];
};
const cmp = (a, b) => (a[0] - b[0]) || (a[1] - b[1]) || (a[2] - b[2]);
const sinIds = (o) => Array.isArray(o) ? o.map(sinIds)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'id').map(([k, v]) => [k, sinIds(v)])) : o;
const resumenDe = (t, max = 250) => {
  const p = t.replace(/\s+/g, ' ').trim();
  if (p.length <= max) return p;
  const c = p.slice(0, max); return `${c.slice(0, c.lastIndexOf(' '))}…`;
};
// el guion bajo de una dirección se codifica: el renderizador lo tomaría por cursiva
const url = (u) => u.replace(/_/g, '%5F');

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const HJ = { ...H, 'Content-Type': 'application/json' };
const CM = (uid, kind) => `${BASE}/content-manager/${kind}/${uid}`;
const leerUnico = async (uid) => (await j(await fetch(CM(uid, 'single-types'), { headers: H }))).data;
async function guardarUnico(uid, datos) {
  if (SECO) return;
  const limpio = sinIds(Object.fromEntries(Object.entries(datos).filter(([k]) => !['documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'locale', 'localizations', 'status'].includes(k))));
  await j(await fetch(CM(uid, 'single-types'), { method: 'PUT', headers: HJ, body: JSON.stringify(limpio) }));
  await j(await fetch(`${CM(uid, 'single-types')}/actions/publish`, { method: 'POST', headers: H }));
}
const buscarMemoria = async (slug) => (await j(await fetch(`${CM(UID_MEMORIA, 'collection-types')}?${new URLSearchParams({ 'filters[slug][$eq]': slug, pageSize: '1' })}`, { headers: H }))).results?.[0];

// ── 1. Las memorias ────────────────────────────────────────────────────────────────────────
console.log(`1. Memorias de los eventos (${EVENTOS.length})`);
let creadas = 0, existentes = 0, faltan = 0;
const memorias = new Map();   // slug → { titulo, fecha, imagen, resumen }
for (const e of EVENTOS) {
  const fotos = e.fotos.map((f) => `${RUTA_FOTOS}/${e.slug}/${f}`);
  for (const f of fotos) if (!fs.existsSync(enArbol(f))) { faltan++; console.log(`   ⚠ falta la foto ${f}`); }
  const redes = e.redes.length
    ? `Enlace de la publicación en redes: ${e.redes.map(([r, u]) => `[${r}](${url(u)})`).join(' · ')}` : null;
  const contenido = [...e.parrafos, ...(redes ? [redes] : [])].join('\n\n');
  const resumen = resumenDe(e.parrafos[0] ?? e.titulo);
  memorias.set(e.slug, { titulo: e.titulo, fecha: e.fecha, imagen: fotos[0] ?? '', resumen });
  if (await buscarMemoria(e.slug)) { existentes++; continue; }
  console.log(`   + ${e.fecha} · ${e.titulo.slice(0, 80)}  (${fotos.length} fotos)`);
  if (!SECO) {
    const nueva = (await j(await fetch(CM(UID_MEMORIA, 'collection-types'), { method: 'POST', headers: HJ, body: JSON.stringify({
      titulo: e.titulo, slug: e.slug, fecha: e.fecha, resumen, contenido,
      imagenDestacada: fotos[0] ?? '', galeria: fotos.map((u, i) => ({ url: u, alt: `${e.titulo.replace(/\.$/, '')} — fotografía ${i + 1}` })),
    }) }))).data.documentId;
    await j(await fetch(`${CM(UID_MEMORIA, 'collection-types')}/${nueva}/actions/publish`, { method: 'POST', headers: H }));
  }
  creadas++;
}
console.log(`   ${creadas} ${SECO ? 'se crearían' : 'creadas'} · ${existentes} ya existían · ${faltan} fotos sin encontrar`);

// ── 2. Listado de Memorias ─────────────────────────────────────────────────────────────────
console.log('\n2. Listado de Memorias del Eje');
const info = await leerUnico(UID_INFO);
let agregadas = 0, reemplazadas = 0;
for (const e of [...EVENTOS].sort((a, b) => b.fecha.localeCompare(a.fecha))) {
  const urlE = `${RUTA_MEMORIAS}/${e.slug}`;
  const anio = e.fecha.slice(0, 4);
  let grupo = info.anios.find((a) => a.anio === anio);
  if (!grupo) { grupo = { anio, entradas: [] }; info.anios.push(grupo); info.anios.sort((a, b) => Number(b.anio) - Number(a.anio)); }
  if (grupo.entradas.some((x) => x.url === urlE)) continue;
  const nueva = { titulo: e.titulo, fecha: fechaLarga(e.fecha), imagen: memorias.get(e.slug).imagen, url: urlE };
  // una entrada vieja del mismo evento sin página ni enlace (p. ej. «Encuentro regional Chocó»): se sustituye
  const ciudad = e.titulo.match(/Encuentro\s+Regional\s+en\s+([A-ZÁÉÍÓÚa-záéíóúñ ]+?)\s+para/i)?.[1]?.split(' ')[0];
  const previa = grupo.entradas.findIndex((x) => !x.url && ciudad && (x.titulo.includes(ciudad) || (ciudad === 'Quibdó' && /Chocó/i.test(x.titulo))) && /encuentro/i.test(x.titulo));
  if (previa >= 0) { console.log(`   ↺ sustituye «${grupo.entradas[previa].titulo.slice(0, 60)}…» (${grupo.entradas[previa].fecha})`); grupo.entradas[previa] = nueva; reemplazadas++; continue; }
  const f = [Number(anio), Number(e.fecha.slice(5, 7)), Number(e.fecha.slice(8, 10))];
  let pos = grupo.entradas.findIndex((x) => { const d = fechaDeTexto(x.fecha); return d && cmp(d, f) <= 0; });
  if (pos < 0) pos = grupo.entradas.length;
  grupo.entradas.splice(pos, 0, nueva); agregadas++;
}
console.log(`   ${agregadas} entradas añadidas · ${reemplazadas} sustituidas`);
if (agregadas || reemplazadas) { await guardarUnico(UID_INFO, info); if (!SECO) console.log('   ✓ guardado y publicado'); }

// ── 3. Noticias del Observatorio ───────────────────────────────────────────────────────────
console.log('\n3. Noticias del Observatorio');
const noticias = await leerUnico(UID_NOTICIAS);
const ya = new Set(noticias.noticias.map((n) => n.slug));
const nuevas = EVENTOS.filter((e) => !ya.has(e.slug)).map((e) => ({
  slug: e.slug, fechaIso: e.fecha, fecha: fechaLarga(e.fecha), titulo: e.titulo, imagen: memorias.get(e.slug).imagen, resumen: memorias.get(e.slug).resumen, descripcion: '',
}));
console.log(`   ${nuevas.length} tarjetas nuevas (ya había ${noticias.noticias.length})`);
if (nuevas.length) {
  // todas juntas, de la más reciente a la más antigua
  noticias.noticias = [...nuevas, ...noticias.noticias].sort((a, b) => (b.fechaIso ?? '').localeCompare(a.fechaIso ?? ''));
  await guardarUnico(UID_NOTICIAS, noticias); if (!SECO) console.log(`   ✓ guardado y publicado: ${noticias.noticias.length} noticias`);
}

// ── 4. Página «RENOBA»: comunicado de cada plenaria ────────────────────────────────────────
console.log('\n4. Página RENOBA: enlaces a los comunicados de las plenarias');
const renoba = await buscarMemoria(SLUG_RENOBA);
if (!renoba) console.log('   ✗ no existe la página RENOBA');
else {
  let contenido = renoba.contenido ?? '', cambios = 0;
  for (const [fecha, texto] of Object.entries(PLENARIAS)) {
    const ev = EVENTOS.find((e) => e.fecha === fecha && /plenaria|segunda sesi/i.test(e.titulo));
    if (!ev) { console.log(`   · sin comunicado para ${texto}`); continue; }
    const enlace = `[Comunicado de prensa de esta sesión](${RUTA_MEMORIAS}/${ev.slug})`;
    if (contenido.includes(`/${ev.slug})`)) continue;
    const linea = new RegExp(`(\\[Ayuda de memoria — plenaria del ${texto} \\(PDF\\)\\]\\([^)]+\\))`);
    if (!linea.test(contenido)) { console.log(`   ✗ no encuentro la sesión del ${texto}`); continue; }
    contenido = contenido.replace(linea, `$1\n\n${enlace}`); cambios++;
  }
  console.log(`   ${cambios} enlaces ${SECO ? 'se añadirían' : 'añadidos'}`);
  if (cambios && !SECO) {
    const datos = { titulo: renoba.titulo, slug: renoba.slug, fecha: renoba.fecha, resumen: renoba.resumen, contenido, imagenDestacada: renoba.imagenDestacada, galeria: [] };
    await j(await fetch(`${CM(UID_MEMORIA, 'collection-types')}/${renoba.documentId}`, { method: 'PUT', headers: HJ, body: JSON.stringify(datos) }));
    await j(await fetch(`${CM(UID_MEMORIA, 'collection-types')}/${renoba.documentId}/actions/publish`, { method: 'POST', headers: H }));
    console.log('   ✓ página RENOBA actualizada');
  }
}
console.log(SECO ? '\n(en seco: no se guardó nada)' : '\nListo. Falta recompilar el sitio.');
process.exit(0);
