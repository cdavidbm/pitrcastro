#!/usr/bin/env node
/**
 * seed-denuncias.mjs — Carga en Strapi los textos e imágenes del formulario de
 * denuncias (/denuncias), tal como estaban escritos en las páginas.
 *
 * A partir de aquí ese contenido se edita desde el panel. Las preguntas sobre
 * los hechos NO están aquí: las entrega el sistema que recibe las denuncias.
 *
 * Es idempotente: reutiliza las imágenes ya subidas y sobrescribe el contenido.
 *
 * Uso:
 *   STRAPI_EMAIL=... STRAPI_PASSWORD=... node cms-strapi/scripts/seed-denuncias.mjs
 *   ... --revisar     # muestra qué haría, sin escribir nada
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, '../..');
const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SOLO_REVISAR = process.argv.includes('--revisar');
const UID = 'api::denuncias.denuncias';

const contenido = JSON.parse(fs.readFileSync(path.join(__dirname, 'denuncias-contenido.json'), 'utf8'));

async function login() {
  const r = await fetch(`${STRAPI}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`login → ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

/** Sube la imagen si no está ya en la biblioteca; devuelve su id. */
async function subirImagen(token, rutaPublica) {
  const abs = path.join(RAIZ, 'public', rutaPublica);
  if (!fs.existsSync(abs)) throw new Error(`no existe la imagen ${abs}`);
  const nombre = path.basename(abs);

  const buscar = await fetch(
    `${STRAPI}/upload/files?filters[name][$eq]=${encodeURIComponent(nombre)}&pageSize=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (buscar.ok) {
    const j = await buscar.json();
    const ya = Array.isArray(j) ? j[0] : j?.results?.[0];
    if (ya?.id) { console.log(`   imagen ya en la biblioteca: ${nombre} (id ${ya.id})`); return ya.id; }
  }

  const fd = new FormData();
  fd.append('files', new Blob([fs.readFileSync(abs)]), nombre);
  const r = await fetch(`${STRAPI}/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
  if (!r.ok) throw new Error(`subir ${nombre} → ${r.status} ${await r.text()}`);
  const j = await r.json();
  const id = Array.isArray(j) ? j[0]?.id : j?.id;
  if (!id) throw new Error(`subir ${nombre}: respuesta sin id`);
  console.log(`   imagen subida: ${nombre} (id ${id})`);
  return id;
}

async function main() {
  if (!SOLO_REVISAR && (!EMAIL || !PASSWORD)) throw new Error('faltan STRAPI_EMAIL y STRAPI_PASSWORD');
  console.log(`Strapi: ${STRAPI}${SOLO_REVISAR ? '  (solo revisar)' : ''}`);

  const imagenes = [
    ...contenido.entidades.map(e => e.logo),
    ...contenido.pantallaDatos.tiposPersona.map(t => t.imagen),
  ];
  console.log(`Imágenes a vincular: ${imagenes.length}`);
  imagenes.forEach(i => console.log(`   ${i}`));

  if (SOLO_REVISAR) {
    console.log(`Entidades: ${contenido.entidades.map(e => e.nombre).join(', ')}`);
    console.log(`Conductas: ${contenido.pantallaConducta.grupos.reduce((n, g) => n + g.conductas.length, 0)} + 1 destacada`);
    console.log('No se escribió nada.');
    return;
  }

  const token = await login();
  const payload = JSON.parse(JSON.stringify(contenido));
  for (const e of payload.entidades) e.logo = await subirImagen(token, e.logo);
  for (const t of payload.pantallaDatos.tiposPersona) t.imagen = await subirImagen(token, t.imagen);

  const put = await fetch(`${STRAPI}/content-manager/single-types/${UID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!put.ok) throw new Error(`guardar → ${put.status} ${await put.text()}`);
  console.log('Contenido guardado.');

  const pub = await fetch(`${STRAPI}/content-manager/single-types/${UID}/actions/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
  });
  if (!pub.ok) throw new Error(`publicar → ${pub.status} ${await pub.text()}`);
  console.log('Publicado.');
}

main().catch(e => { console.error('FALLÓ:', e.message); process.exit(1); });
