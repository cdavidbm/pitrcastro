#!/usr/bin/env node
/**
 * Sincroniza notificaciones (edictos/estados/traslados) vigencia 2026
 * desde el snapshot `_wp-snapshot-2026-06-17.json` hacia el Strapi local
 * y los JSON respaldo en src/content/notificaciones/.
 *
 * Modo DELTA (no destructivo): inserta solo items que no existen ya en el
 * JSON local. Idempotente por la clave (expediente|fechaAuto|tipoAuto)
 * normalizada.
 *
 * Para cada item nuevo:
 *  - descarga el PDF del WP a public/documentos/notificaciones/<basename>
 *    si no existe localmente todavía;
 *  - sube ese PDF al Media Library de Strapi;
 *  - crea + publica la entrada via Admin API;
 *  - hace append al JSON respaldo correspondiente.
 *
 * Uso:
 *   node cms-strapi/scripts/update-notif-delta.mjs           # ejecuta
 *   node cms-strapi/scripts/update-notif-delta.mjs --dry-run # reporta sin escribir
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';
const DRY = process.argv.includes('--dry-run');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SNAPSHOT = path.join(__dirname, '_wp-snapshot-2026-06-17.json');
const PDF_DIR = path.join(REPO_ROOT, 'public', 'documentos', 'notificaciones');
const JSON_DIR = path.join(REPO_ROOT, 'src', 'content', 'notificaciones');

const FILES = {
  edicto: path.join(JSON_DIR, 'edictos.json'),
  estado: path.join(JSON_DIR, 'estados.json'),
  traslado: path.join(JSON_DIR, 'traslados.json'),
};

const normKey = (e) =>
  [e.expediente, e.fechaAuto, e.tipoAuto]
    .map((s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' '))
    .join('|');

const basenameFromUrl = (url) => {
  try {
    const u = new URL(url);
    return decodeURIComponent(u.pathname.split('/').pop() || '');
  } catch {
    return path.basename(url);
  }
};

async function login() {
  const r = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`login: ${r.status} ${await r.text()}`);
  const j = await r.json();
  return j.data.token;
}

async function ensurePdfLocal(remoteUrl, stats) {
  const filename = basenameFromUrl(remoteUrl);
  if (!filename) return null;
  const abs = path.join(PDF_DIR, filename);
  if (fs.existsSync(abs)) {
    stats.pdfAlready++;
    return { filename, abs };
  }
  if (DRY) {
    stats.pdfWouldDownload++;
    return { filename, abs };
  }
  const res = await fetch(remoteUrl);
  if (!res.ok) {
    stats.pdfFailed++;
    console.warn(`  PDF fetch failed ${res.status}: ${remoteUrl}`);
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(PDF_DIR, { recursive: true });
  fs.writeFileSync(abs, buf);
  stats.pdfDownloaded++;
  return { filename, abs };
}

async function uploadPdfToStrapi(token, abs, filename, stats) {
  const buf = fs.readFileSync(abs);
  const fd = new FormData();
  fd.append('files', new Blob([buf]), filename);
  const r = await fetch(`${STRAPI_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!r.ok) {
    stats.uploadFailed++;
    console.warn(`  upload failed ${r.status}: ${filename}`);
    return null;
  }
  const j = await r.json();
  const id = Array.isArray(j) ? j[0]?.id : j?.id;
  if (id) stats.uploaded++;
  return id || null;
}

async function createOne(token, payload) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::notificacion.notificacion`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  if (!r.ok) throw new Error(`create: ${r.status} ${await r.text()}`);
  return r.json();
}

async function publishOne(token, documentId) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::notificacion.notificacion/${documentId}/actions/publish`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error(`publish ${documentId}: ${r.status} ${await r.text()}`);
}

async function main() {
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  console.log(`snapshot WP: ${snap.traslados.length} traslados + ${snap.estados.length} estados + ${snap.edictos.length} edictos`);

  const existing = {
    edicto: JSON.parse(fs.readFileSync(FILES.edicto, 'utf8')),
    estado: JSON.parse(fs.readFileSync(FILES.estado, 'utf8')),
    traslado: JSON.parse(fs.readFileSync(FILES.traslado, 'utf8')),
  };
  const keySets = {
    edicto: new Set((existing.edicto.entries || []).map(normKey)),
    estado: new Set((existing.estado.entries || []).map(normKey)),
    traslado: new Set((existing.traslado.entries || []).map(normKey)),
  };

  const tasks = [
    ...snap.edictos.map((e) => ({ ...e, _cat: 'edicto' })),
    ...snap.estados.map((e) => ({ ...e, _cat: 'estado' })),
    ...snap.traslados.map((e) => ({ ...e, _cat: 'traslado' })),
  ];

  const todo = tasks.filter((e) => !keySets[e._cat].has(normKey(e)));
  console.log(`a insertar (delta): ${todo.length} de ${tasks.length} (${tasks.length - todo.length} ya existen)`);
  console.log(`  por categoría: edicto=${todo.filter(e=>e._cat==='edicto').length} estado=${todo.filter(e=>e._cat==='estado').length} traslado=${todo.filter(e=>e._cat==='traslado').length}`);

  if (DRY) {
    console.log('\n-- DRY RUN --');
    const sample = todo.slice(0, 5);
    for (const s of sample) console.log(`  ${s._cat} ${s.expediente} ${s.fechaAuto} → ${basenameFromUrl(s.pdfUrl)}`);
    return;
  }

  if (todo.length === 0) {
    console.log('nada que insertar, todos los items del snapshot ya existen en JSON. exit.');
    return;
  }

  const token = await login();
  console.log('login OK');

  const stats = {
    pdfDownloaded: 0, pdfAlready: 0, pdfWouldDownload: 0, pdfFailed: 0,
    uploaded: 0, uploadFailed: 0,
    created: 0, published: 0, createFailed: 0,
  };
  const newEntriesByCat = { edicto: [], estado: [], traslado: [] };

  for (let i = 0; i < todo.length; i++) {
    const item = todo[i];
    try {
      const local = await ensurePdfLocal(item.pdfUrl, stats);
      const pdfId = local ? await uploadPdfToStrapi(token, local.abs, local.filename, stats) : null;

      const payload = {
        categoria: item._cat,
        expediente: item.expediente,
        tipoAuto: item.tipoAuto || '',
        tipoNotificacion: item.tipoNotificacion || '',
        dependencia: item.dependencia || '',
        fechaAuto: item.fechaAuto || '',
        desde: item.desde || '',
        hasta: item.hasta || '',
        vigencia: 2026,
        pdfUrl: pdfId,
      };
      const created = await createOne(token, payload);
      const documentId = created?.data?.documentId || created?.documentId;
      stats.created++;
      if (documentId) {
        await publishOne(token, documentId);
        stats.published++;
      }

      newEntriesByCat[item._cat].push({
        expediente: item.expediente,
        tipoAuto: item.tipoAuto || '',
        tipoNotificacion: item.tipoNotificacion || '',
        dependencia: item.dependencia || '',
        fechaAuto: item.fechaAuto || '',
        desde: item.desde || '',
        hasta: item.hasta || '',
        pdfUrl: local ? `/documentos/notificaciones/${local.filename}` : '',
        vigencia: 2026,
      });

      if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${todo.length}`);
    } catch (e) {
      stats.createFailed++;
      console.error(`  ERROR ${item._cat} ${item.expediente}: ${e.message}`);
    }
  }

  for (const cat of ['edicto', 'estado', 'traslado']) {
    if (newEntriesByCat[cat].length === 0) continue;
    const file = FILES[cat];
    const data = existing[cat];
    data.entries = [...newEntriesByCat[cat], ...(data.entries || [])];
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
    console.log(`✓ ${path.basename(file)}: +${newEntriesByCat[cat].length} → ${data.entries.length} total`);
  }

  console.log('\n=== STATS ===');
  console.log(JSON.stringify(stats, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
