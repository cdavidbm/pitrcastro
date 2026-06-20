#!/usr/bin/env node
/**
 * Sincroniza al Strapi del SERVER (no al local) las notificaciones del
 * snapshot WP 2026-06-17. Inserta solo los items que NO existen ya en el
 * server (dedup por expediente|fechaAuto|tipoAuto).
 *
 * No toca lo que ya hay en el server. No borra. No actualiza existentes.
 * Solo agrega + publica los faltantes.
 *
 * Uso:
 *   STRAPI_URL=http://192.168.82.13 \
 *     node cms-strapi/scripts/sync-notif-to-server.mjs [--dry-run]
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

const normStr = (s) =>
  String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');

const dedupKey = (e) =>
  [e.categoria, e.expediente, e.fechaAuto, e.tipoAuto].map(normStr).join('|');

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

function loadServerKeysFromDump(dumpPath) {
  // Dump generado vía: ssh ... "docker exec postgres psql ... -c \"SELECT categoria,expediente,fecha_auto FROM notificaciones WHERE published_at IS NOT NULL;\""
  // En lugar de paginar el admin API (que en este server tiene bug y devuelve solo
  // las primeras 10 entries en cada página), usamos el dump SQL directo.
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`dump file not found: ${dumpPath}. Generar con: ssh admweb@192.168.82.13 "docker exec itrc-cms-postgres psql -U strapi -d strapi -t -A -F'|' -c \\"SELECT categoria,expediente,fecha_auto FROM notificaciones WHERE published_at IS NOT NULL;\\"" > ${dumpPath}`);
  }
  const seen = new Set();
  const raw = fs.readFileSync(dumpPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const parts = line.split('|');
    if (parts.length < 3) continue;
    const [cat, exp, fecha] = parts;
    seen.add(normStr(cat) + '|' + normStr(exp) + '|' + normStr(fecha));
  }
  return seen;
}

const keyShort = (e) => normStr(e.categoria) + '|' + normStr(e.expediente) + '|' + normStr(e.fechaAuto);

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
    console.warn(`  PDF fetch ${res.status}: ${remoteUrl}`);
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(PDF_DIR, { recursive: true });
  fs.writeFileSync(abs, buf);
  stats.pdfDownloaded++;
  return { filename, abs };
}

async function uploadToStrapi(token, abs, filename, stats) {
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
  console.log(`target: ${STRAPI_URL}`);
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  const wpItems = [
    ...snap.edictos.map((e) => ({ ...e, categoria: 'edicto' })),
    ...snap.estados.map((e) => ({ ...e, categoria: 'estado' })),
    ...snap.traslados.map((e) => ({ ...e, categoria: 'traslado' })),
  ];
  console.log(`snapshot WP: ${wpItems.length} items totales`);

  const DUMP_PATH = process.env.SERVER_KEYS_DUMP || '/tmp/server-notif-keys.txt';
  const seen = loadServerKeysFromDump(DUMP_PATH);
  console.log(`keys del server cargadas del dump: ${seen.size}`);

  const todo = wpItems.filter((e) => !seen.has(keyShort(e)));
  console.log(`a insertar al server: ${todo.length} de ${wpItems.length} (${wpItems.length - todo.length} ya en server)`);
  console.log(`  edicto=${todo.filter(e=>e.categoria==='edicto').length} estado=${todo.filter(e=>e.categoria==='estado').length} traslado=${todo.filter(e=>e.categoria==='traslado').length}`);

  if (DRY) {
    console.log('\n-- DRY RUN sample --');
    for (const s of todo.slice(0, 8)) console.log(`  ${s.categoria} ${s.expediente} ${s.fechaAuto}`);
    return;
  }

  if (todo.length === 0) {
    console.log('nada que insertar. Exit.');
    return;
  }

  const token = await login();
  console.log('login OK');

  const stats = {
    pdfDownloaded: 0, pdfAlready: 0, pdfFailed: 0,
    uploaded: 0, uploadFailed: 0,
    created: 0, published: 0, createFailed: 0,
  };

  for (let i = 0; i < todo.length; i++) {
    const it = todo[i];
    try {
      const local = await ensurePdfLocal(it.pdfUrl, stats);
      const pdfId = local ? await uploadToStrapi(token, local.abs, local.filename, stats) : null;
      const payload = {
        categoria: it.categoria,
        expediente: it.expediente,
        tipoAuto: it.tipoAuto || '',
        tipoNotificacion: it.tipoNotificacion || '',
        dependencia: it.dependencia || '',
        fechaAuto: it.fechaAuto || '',
        desde: it.desde || '',
        hasta: it.hasta || '',
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
      if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${todo.length}`);
    } catch (e) {
      stats.createFailed++;
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
