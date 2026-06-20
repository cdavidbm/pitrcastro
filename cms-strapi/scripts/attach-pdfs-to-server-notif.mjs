#!/usr/bin/env node
/**
 * Asocia PDFs locales a entries del server que se crearon sin pdfUrl
 * (porque el endpoint /upload del nginx no funcionaba en el momento).
 *
 * Para cada item del snapshot WP 2026-06-17:
 *  1. GET server por (categoria + expediente + fechaAuto)
 *  2. Si la entry existe en server y pdfUrl es null, sube el PDF local
 *     y hace PUT del draft con pdfUrl asociado, luego publica.
 *  3. Si pdfUrl ya está, skip.
 *
 * Uso:
 *   STRAPI_URL=http://192.168.82.13 \
 *     node cms-strapi/scripts/attach-pdfs-to-server-notif.mjs [--dry-run]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://192.168.82.13';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';
const DRY = process.argv.includes('--dry-run');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SNAPSHOT = path.join(__dirname, '_wp-snapshot-2026-06-17.json');
const PDF_DIR = path.join(REPO_ROOT, 'public', 'documentos', 'notificaciones');

const basenameFromUrl = (url) => {
  try {
    const u = new URL(url);
    return decodeURIComponent(u.pathname.split('/').pop() || '');
  } catch {
    return path.basename(url || '');
  }
};

async function login() {
  const r = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`login: ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

async function findOnServer(token, item) {
  const qs = new URLSearchParams();
  qs.set('filters[categoria][$eq]', item.categoria);
  qs.set('filters[expediente][$eq]', item.expediente);
  qs.set('filters[fechaAuto][$eq]', item.fechaAuto || '');
  qs.set('pagination[pageSize]', '5');
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::notificacion.notificacion?${qs}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error(`find: ${r.status}`);
  const j = await r.json();
  const results = j.results || j.data || [];
  return results[0] || null;
}

async function uploadFile(token, abs, filename, stats) {
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
    console.warn(`  upload ${r.status}: ${filename}`);
    return null;
  }
  const j = await r.json();
  const id = Array.isArray(j) ? j[0]?.id : j?.id;
  if (id) stats.uploaded++;
  return id || null;
}

async function updateDraft(token, documentId, pdfId) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::notificacion.notificacion/${documentId}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfUrl: pdfId }),
    }
  );
  if (!r.ok) throw new Error(`update ${documentId}: ${r.status} ${await r.text()}`);
}

async function publishOne(token, documentId) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::notificacion.notificacion/${documentId}/actions/publish`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error(`publish ${documentId}: ${r.status}`);
}

async function main() {
  console.log(`target: ${STRAPI_URL}`);
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  const wpItems = [
    ...snap.edictos.map((e) => ({ ...e, categoria: 'edicto' })),
    ...snap.estados.map((e) => ({ ...e, categoria: 'estado' })),
    ...snap.traslados.map((e) => ({ ...e, categoria: 'traslado' })),
  ];
  console.log(`snapshot WP: ${wpItems.length} items`);

  const token = await login();
  console.log('login OK');

  const stats = {
    serverHas: 0, serverMissing: 0,
    alreadyHasPdf: 0, skippedNoLocal: 0,
    uploaded: 0, uploadFailed: 0,
    updated: 0, published: 0, failed: 0,
  };

  for (let i = 0; i < wpItems.length; i++) {
    const it = wpItems[i];
    try {
      const found = await findOnServer(token, it);
      if (!found) { stats.serverMissing++; continue; }
      stats.serverHas++;

      // Si ya tiene pdfUrl asociado, skip
      if (found.pdfUrl && (found.pdfUrl.id || (Array.isArray(found.pdfUrl) && found.pdfUrl.length))) {
        stats.alreadyHasPdf++;
        continue;
      }

      const filename = basenameFromUrl(it.pdfUrl);
      const abs = path.join(PDF_DIR, filename);
      if (!fs.existsSync(abs)) {
        stats.skippedNoLocal++;
        continue;
      }

      if (DRY) {
        console.log(`  WOULD attach ${filename} → ${it.categoria} ${it.expediente} (docId=${found.documentId})`);
        continue;
      }

      const pdfId = await uploadFile(token, abs, filename, stats);
      if (!pdfId) continue;
      await updateDraft(token, found.documentId, pdfId);
      stats.updated++;
      await publishOne(token, found.documentId);
      stats.published++;

      if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${wpItems.length} (updated: ${stats.updated})`);
    } catch (e) {
      stats.failed++;
      console.error(`  ERROR ${it.categoria} ${it.expediente}: ${e.message}`);
    }
  }

  console.log('\n=== STATS ===');
  console.log(JSON.stringify(stats, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
