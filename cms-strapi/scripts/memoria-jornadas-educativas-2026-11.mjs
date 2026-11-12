#!/usr/bin/env node
/**
 * Observatorio · Eje de Participación — nueva memoria con las jornadas de sensibilización en
 * instituciones educativas (carpeta observatorio_eje_participacion: 36 fotos + textos.txt con diez
 * pies de foto, uno por grupo de fotos «FOTOS: 01 - 07»).
 *
 * Crea UNA memoria con página propia (cada texto íntegro, con sus fotos debajo) y su entrada en el
 * listado de Memorias de 2026. Las fotos van en public/documentos/observatorio/eventos/<slug>/.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… \
 *     node scripts/memoria-jornadas-educativas-2026-11.mjs <carpeta con textos.txt> --seco
 *
 * Repetible: no duplica. Después hay que recompilar el sitio.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
const CARPETA = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!CARPETA) { console.error('Falta la carpeta con textos.txt'); process.exit(1); }
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID_MEMORIA = 'api::observatorio-eje-de-participacion-memoria.observatorio-eje-de-participacion-memoria';
const UID_INFO = 'api::observatorio-eje-de-participacion-memorias-info.observatorio-eje-de-participacion-memorias-info';
const SLUG = 'jornadas-de-sensibilizacion-en-instituciones-educativas-educando-para-la-transparencia';
const TITULO = 'Jornadas de sensibilización en instituciones educativas: educando para la transparencia y la integridad';
const FECHA = '2026-11-12';           // fecha de publicación (el material no trae fecha de los eventos)
const FECHA_TXT = '12 de noviembre de 2026';
const RUTA_FOTOS = `/documentos/observatorio/eventos/${SLUG}`;
const RUTA_MEMORIAS = '/observatorio/eje-de-participacion/memorias';
const enArbol = (rel) => new URL(`../../public${rel}`, import.meta.url).pathname;

// textos.txt → [{desde, hasta, texto}]
const bloques = [...fs.readFileSync(path.join(CARPETA, 'textos.txt'), 'utf8')
  .matchAll(/FOTOS:\s*(\d+)\s*-\s*(\d+)\s*\n'''\s*\n([\s\S]*?)\n'''/g)]
  .map((m) => ({ desde: +m[1], hasta: +m[2], texto: m[3].replace(/\s+/g, ' ').trim() }));
if (bloques.length !== 9) { console.error(`Se esperaban 9 bloques y hay ${bloques.length}`); process.exit(1); }
const nn = (n) => String(n).padStart(2, '0');

const fotos = [];
const partes = [];
for (const b of bloques) {
  partes.push(b.texto);
  for (let n = b.desde; n <= b.hasta; n++) {
    const u = `${RUTA_FOTOS}/${nn(n)}.jpeg`;
    if (!fs.existsSync(enArbol(u))) { console.error(`Falta la foto ${u}`); process.exit(1); }
    const alt = `${b.texto.split(/(?<=[.!])\s/)[0].replace(/[.!]$/, '')} — fotografía ${nn(n)}`;
    fotos.push({ url: u, alt }); partes.push(`![${alt}](${u})`);
  }
}
const sinFoto = Array.from({ length: 36 }, (_, i) => i + 1).filter((n) => !bloques.some((b) => n >= b.desde && n <= b.hasta));
if (sinFoto.length) console.log(`⚠ fotos sin texto: ${sinFoto.join(', ')}`);
const contenido = partes.join('\n\n');
const resumen = 'Jornadas de sensibilización de la Agencia ITRC en colegios, universidades y sedes del SENA de Meta, Chocó, La Guajira, Cundinamarca, Córdoba, Atlántico y Valle del Cauca.';

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` }; const HJ = { ...H, 'Content-Type': 'application/json' };
const CM = (uid, k) => `${BASE}/content-manager/${k}/${uid}`;
const sinIds = (o) => Array.isArray(o) ? o.map(sinIds)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'id').map(([k, v]) => [k, sinIds(v)])) : o;

console.log(`Memoria: «${TITULO}» · ${fotos.length} fotos · ${bloques.length} textos`);
const ya = (await j(await fetch(`${CM(UID_MEMORIA, 'collection-types')}?${new URLSearchParams({ 'filters[slug][$eq]': SLUG, pageSize: '1' })}`, { headers: H }))).results?.[0];
if (ya) console.log('· la memoria ya existe');
else if (!SECO) {
  const id = (await j(await fetch(CM(UID_MEMORIA, 'collection-types'), { method: 'POST', headers: HJ, body: JSON.stringify({
    titulo: TITULO, slug: SLUG, fecha: FECHA, resumen, contenido, imagenDestacada: fotos[0].url, galeria: [] }) }))).data.documentId;
  await j(await fetch(`${CM(UID_MEMORIA, 'collection-types')}/${id}/actions/publish`, { method: 'POST', headers: H }));
  console.log('✓ memoria creada y publicada');
} else console.log('+ se crearía la memoria');

const info = (await j(await fetch(CM(UID_INFO, 'single-types'), { headers: H }))).data;
const g = info.anios.find((a) => a.anio === '2026');
const urlE = `${RUTA_MEMORIAS}/${SLUG}`;
if (!g) console.log('✗ no hay grupo 2026 en el listado');
else if (g.entradas.some((x) => x.url === urlE)) console.log('· ya está en el listado');
else {
  g.entradas.unshift({ titulo: TITULO, fecha: FECHA_TXT, imagen: fotos[0].url, url: urlE });   // la más reciente, arriba
  console.log('+ entrada en el listado de 2026 (primera)');
  if (!SECO) {
    const limpio = sinIds(Object.fromEntries(Object.entries(info).filter(([k]) => !['documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'locale', 'localizations', 'status'].includes(k))));
    await j(await fetch(CM(UID_INFO, 'single-types'), { method: 'PUT', headers: HJ, body: JSON.stringify(limpio) }));
    await j(await fetch(`${CM(UID_INFO, 'single-types')}/actions/publish`, { method: 'POST', headers: H }));
    console.log('✓ listado guardado y publicado');
  }
}
console.log(SECO ? '(en seco: no se guardó nada)' : 'Listo. Falta recompilar el sitio.');
process.exit(0);
