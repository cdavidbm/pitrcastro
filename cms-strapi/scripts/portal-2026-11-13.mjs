#!/usr/bin/env node
/**
 * Solicitudes del 6 al 9-nov-2026 atendidas el 13-nov:
 *   1. Estado 063-2026 (CID, exp. 008 de 2025) y Traslado 077-2026 (SDL, exp. 1704-00-2025-157)
 *      → /notificaciones-y-traslados (colección «Notificaciones y Traslados»). Los PDF se publican tal
 *      como llegaron: protegidos con contraseña (la contraseña va a la persona notificada, no al sitio).
 *   2. Informe de Avance Plan de Acción 2026 – Trimestre III (Oficina Asesora de Planeación)
 *      → /agencia/direccionamiento-estrategico/informes, sección «Informes de Avance Plan de Acción Anual».
 *      Llegó en PowerPoint (71 diapositivas); se publica el PDF exportado, como los trimestres anteriores.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/portal-2026-11-13.mjs <carpeta con los PDF> --seco
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
if (!CARPETA) { console.error('Falta la carpeta con los PDF'); process.exit(1); }
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID_NOT = 'api::notificacion.notificacion';
const UID_INF = 'api::agencia-direccionamiento-informes.agencia-direccionamiento-informes';

const NOTIFICACIONES = [
  { categoria: 'estado', expediente: '1704-00-2025-008', tipoAuto: 'INVESTIGACION DISCIPLINARIA', tipoNotificacion: 'ESTADO',
    dependencia: 'SUBDIRECCION DE ASUNTOS LEGALES', fechaAuto: '27/10/2026', desde: '09/11/2026', hasta: '09/11/2026', vigencia: 2026,
    pdf: 'Estado-063-2026_protected.pdf' },
  { categoria: 'traslado', expediente: '1704-00-2025-157', tipoAuto: 'CIERRE DE INVESTIGACION', tipoNotificacion: 'TRASLADO',
    dependencia: 'SUBDIRECCION DE INSTRUCCION DISCIPLINARIA', fechaAuto: '30/10/2026', desde: '10/11/2026', hasta: '24/11/2026', vigencia: 2026,
    pdf: 'TRASLADO-077-2026_protected.pdf' },
];
const INFORME = { name: 'Informe de Avance Plan de Acción 2026 – Trimestre III', category: 'Informes Plan de Acción Anual', anio: '2026', pdf: 'Informe-Avance-Plan-de-Accion-2026-Trimestre-III.pdf' };

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` }; const HJ = { ...H, 'Content-Type': 'application/json' };
const sinIds = (o) => Array.isArray(o) ? o.map(sinIds)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'id').map(([k, v]) => [k, sinIds(v)])) : o;

async function subir(archivo) {
  const ruta = path.join(CARPETA, archivo);
  if (!fs.existsSync(ruta)) throw new Error(`no encuentro ${ruta}`);
  const ya = await j(await fetch(`${BASE}/upload/files?filters[name][$eq]=${encodeURIComponent(archivo)}`, { headers: H }));
  const hallado = (ya.results ?? ya.data ?? [])[0];
  if (hallado) return hallado.id;
  if (SECO) return -1;
  const fd = new FormData();
  fd.append('files', new Blob([fs.readFileSync(ruta)], { type: 'application/pdf' }), archivo);
  fd.append('fileInfo', JSON.stringify({ name: archivo }));
  return (await j(await fetch(`${BASE}/upload`, { method: 'POST', headers: H, body: fd })))[0].id;
}

// ── 1. Estado y Traslado ───────────────────────────────────────────────────────────────────
console.log('1. Notificaciones y Traslados');
for (const n of NOTIFICACIONES) {
  const q = new URLSearchParams({ 'filters[categoria][$eq]': n.categoria, 'filters[expediente][$eq]': n.expediente, 'filters[desde][$eq]': n.desde, 'filters[vigencia][$eq]': String(n.vigencia), pageSize: '1' });
  const ya = (await j(await fetch(`${BASE}/content-manager/collection-types/${UID_NOT}?${q}`, { headers: H }))).results?.[0];
  if (ya) { console.log(`   · ya está: ${n.categoria} ${n.expediente} (${n.desde})`); continue; }
  console.log(`   + ${n.categoria} · exp. ${n.expediente} · ${n.tipoAuto} · ${n.dependencia} · ${n.desde} → ${n.hasta} · ${n.pdf}`);
  if (SECO) continue;
  const { pdf, ...datos } = n;
  const id = (await j(await fetch(`${BASE}/content-manager/collection-types/${UID_NOT}`, { method: 'POST', headers: HJ, body: JSON.stringify({ ...datos, pdfUrl: await subir(pdf) }) }))).data.documentId;
  await j(await fetch(`${BASE}/content-manager/collection-types/${UID_NOT}/${id}/actions/publish`, { method: 'POST', headers: H }));
}

// ── 2. Informe del Plan de Acción ──────────────────────────────────────────────────────────
console.log('\n2. Informe de Avance Plan de Acción 2026 – Trimestre III');
const CM = `${BASE}/content-manager/single-types/${UID_INF}`;
const doc = (await j(await fetch(CM, { headers: H }))).data;
const sec = doc.sections.find((s) => s.sectionTitle === 'Informes de Avance Plan de Acción Anual');
if (!sec) console.log('   ✗ no encuentro la sección');
else if (sec.documents.some((d) => d.name === INFORME.name)) console.log('   · ya está');
else {
  console.log(`   + «${INFORME.name}» al inicio de la sección (${sec.documents.length} documentos)`);
  if (!SECO) {
    const fid = await subir(INFORME.pdf);
    sec.documents = [{ name: INFORME.name, category: INFORME.category, anio: INFORME.anio, file: fid }, ...sec.documents.map((d) => ({ ...d, file: d.file?.id ?? d.file ?? null }))];
    for (const s of doc.sections) if (s !== sec) s.documents = s.documents.map((d) => ({ ...d, file: d.file?.id ?? d.file ?? null }));
    const cuerpo = sinIds(Object.fromEntries(Object.entries(doc).filter(([k]) => !['documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'locale', 'localizations', 'status'].includes(k))));
    await j(await fetch(CM, { method: 'PUT', headers: HJ, body: JSON.stringify(cuerpo) }));
    await j(await fetch(`${CM}/actions/publish`, { method: 'POST', headers: H }));
    console.log('   ✓ guardado y publicado');
  }
}
console.log(SECO ? '\n(en seco: no se guardó nada)' : '\nListo. Falta recompilar el sitio.');
process.exit(0);
