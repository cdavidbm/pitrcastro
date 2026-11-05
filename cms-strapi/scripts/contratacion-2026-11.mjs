#!/usr/bin/env node
/**
 * Contratación (Transparencia 3.2) — pedido de Martha Lucía Gómez, Proceso de Contratación (3-nov-2026):
 *   1. Relación de contratos suscritos a julio, agosto y septiembre de 2026 (vigencia 2026).
 *   2. Selecciones Abreviadas nuevas: ITRC-SASI-005-2026 y ITRC-SASI-006-2026, con su aviso de convocatoria
 *      (PDF subido a la mediateca, como el aviso de SASI-004-2026) y su vista pública en SECOP.
 *   3. Resoluciones de adjudicación en «Otros documentos»: Res. 343 (SASI-003-2026) y Res. 471 (SASI-004-2026).
 * Solo añade; no modifica ninguna otra fila. Los archivos deben estar en public/documentos/transparencia/
 * (copia local y árbol de trabajo del servidor). Es repetible.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/contratacion-2026-11.mjs --seco
 *
 * Después hay que recompilar el sitio.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID = 'api::transparencia-contratacion-contratacion-suscrita.transparencia-contratacion-contratacion-suscrita';
const DOCS = new URL('../../public/documentos/transparencia/', import.meta.url).pathname;
const RUTA = '/documentos/transparencia/';

const CONTRATOS = [ // de más reciente a más antiguo: van arriba de la lista
  ['Septiembre', 'Contratos-suscritos-a-30-de-septiembre-de-2026.xlsx'],
  ['Agosto', 'Contratos-suscritos-a-31-de-agosto-de-2026.xlsx'],
  ['Julio', 'Contratos-suscritos-a-31-de-julio-de-2026.xlsx'],
];
const NUEVOS = [ // más reciente primero
  { label: 'ITRC-SASI-006-2026', aviso: '20261028-Aviso-de-convocatoria-publica-ITRC-SASI-006-2026.pdf', secop: 'CO1.NTC.11139659' },
  { label: 'ITRC-SASI-005-2026', aviso: '20261027-Aviso-de-convocatoria-publica-ITRC-SASI-005-2026.pdf', secop: 'CO1.NTC.11133729' },
];
const ADJUDICACION = [
  { proceso: 'ITRC-SASI-003-2026', archivo: 'Res.-343-Por-medio-de-la-cual-se-adjudica-el-Proceso-ITRC-SASI-003-2026.pdf', label: 'Res. 343 - Por medio de la cual se adjudica el Proceso ITRC-SASI-003-2026' },
  { proceso: 'ITRC-SASI-004-2026', archivo: 'Res.-471-Por-medio-de-la-cual-se-adjudica-el-Proceso-ITRC-SASI-004-2026.pdf', label: 'Res. 471 - Por medio de la cual se adjudica el Proceso ITRC-SASI-004-2026' },
];

const sinIds = (o) => Array.isArray(o) ? o.map(sinIds)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'id').map(([k, v]) => [k, sinIds(v)])) : o;
const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const CM = `${BASE}/content-manager/single-types/${UID}`;

for (const f of [...CONTRATOS.map((c) => c[1]), ...NUEVOS.map((n) => n.aviso), ...ADJUDICACION.map((a) => a.archivo)])
  if (!fs.existsSync(DOCS + f)) { console.error(`Falta el archivo ${f} en public/documentos/transparencia/`); process.exit(1); }

const doc = (await j(await fetch(CM, { headers: H }))).data;
let cambios = 0;

// ── 1. Contratos suscritos 2026 ─────────────────────────────────────────────────────────
console.log('1. Contratos suscritos 2026');
const vig = doc.contratacionSuscrita.find((v) => String(v.anio) === '2026');
if (!vig) throw new Error('No encuentro la vigencia 2026');
const nuevosContratos = [];
for (const [mes, archivo] of CONTRATOS) {
  const periodo = `Relación de contratos suscritos a ${mes} de 2026`;
  if (vig.contratos.some((c) => c.periodo === periodo || c.url === RUTA + archivo)) { console.log(`   · ya está: ${periodo}`); continue; }
  console.log(`   + ${periodo}`); nuevosContratos.push({ periodo, url: RUTA + archivo }); cambios++;
}
vig.contratos = [...nuevosContratos, ...vig.contratos];

// ── 2. Selecciones abreviadas nuevas (aviso en la mediateca) ───────────────────────────────
console.log('\n2. Selecciones Abreviadas nuevas');
const sel = doc.convocatorias.find((c) => /Selecciones Abreviadas/i.test(c.categoria));
if (!sel) throw new Error('No encuentro la categoría Selecciones Abreviadas');
async function subir(archivo) {
  const ya = await j(await fetch(`${BASE}/upload/files?filters[name][$eq]=${encodeURIComponent(archivo)}`, { headers: H }));
  const hallado = (ya.results ?? ya.data ?? [])[0];
  if (hallado) return hallado.id;
  if (SECO) return -1;
  const fd = new FormData();
  fd.append('files', new Blob([fs.readFileSync(DOCS + archivo)], { type: 'application/pdf' }), archivo);
  fd.append('fileInfo', JSON.stringify({ name: archivo }));
  return (await j(await fetch(`${BASE}/upload`, { method: 'POST', headers: H, body: fd })))[0].id;
}
const nuevosProcesos = [];
for (const n of NUEVOS) {
  if (sel.procesos.some((p) => p.label === n.label)) { console.log(`   · ya está: ${n.label}`); continue; }
  console.log(`   + ${n.label} · SECOP ${n.secop} · aviso ${n.aviso}`);
  nuevosProcesos.push({ label: n.label, anio: '2026', pdfUrl: await subir(n.aviso), secopRef: n.secop, otros: [] }); cambios++;
}

// ── 3. Resoluciones de adjudicación ───────────────────────────────────────────────────────
console.log('\n3. Resoluciones de adjudicación (Otros documentos)');
for (const a of ADJUDICACION) {
  const p = sel.procesos.find((x) => x.label === a.proceso);
  if (!p) { console.log(`   ✗ no encuentro ${a.proceso}`); continue; }
  const otros = Array.isArray(p.otros) ? p.otros : [];
  if (otros.some((o) => o.url === RUTA + a.archivo)) { console.log(`   · ya está en ${a.proceso}`); continue; }
  console.log(`   + ${a.proceso}: «${a.label}»`); p.otros = [...otros, { url: RUTA + a.archivo, label: a.label }]; cambios++;
}

if (!cambios) { console.log('\nNada que cambiar (ya está hecho).'); process.exit(0); }
console.log(`\n${cambios} cambios.`);
if (SECO) { console.log('(en seco: no se guardó nada)'); process.exit(0); }

// Se envían los procesos existentes tal cual (el medio por su id) y los nuevos arriba.
const aId = (p) => ({ ...p, pdfUrl: p.pdfUrl && typeof p.pdfUrl === 'object' ? p.pdfUrl.id : p.pdfUrl ?? null });
sel.procesos = [...nuevosProcesos, ...sel.procesos].map(aId);
for (const c of doc.convocatorias) if (c !== sel) c.procesos = c.procesos.map(aId);
const cuerpo = sinIds({ title: doc.title, description: doc.description, icon: doc.icon, intro: doc.intro, secopI: doc.secopI, secopII: doc.secopII,
  convocatorias: doc.convocatorias, contratacionSuscrita: doc.contratacionSuscrita });
await j(await fetch(CM, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) }));
await j(await fetch(`${CM}/actions/publish`, { method: 'POST', headers: H }));
const d2 = (await j(await fetch(CM, { headers: H }))).data;
const s2 = d2.convocatorias.find((c) => /Selecciones Abreviadas/i.test(c.categoria));
console.log(`✓ guardado y publicado. Selecciones: ${s2.procesos.length}; contratos 2026: ${d2.contratacionSuscrita.find((v) => String(v.anio) === '2026').contratos.length}. Falta recompilar el sitio.`);
process.exit(0);
