#!/usr/bin/env node
/**
 * Migra planes institucionales históricos (2013-2022 + algunos 2026 sueltos)
 * desde `_wp-snapshot-planes-historicos.json` al single
 * `agencia-direccionamiento-planes`.
 *
 * Delta no destructivo: lee los documents actuales del single, dedup por
 * (category|anio|nameNormalizado), descarga + sube + agrega solo los faltantes.
 * Hace PUT al single con la lista combinada y publica.
 *
 * Uso:
 *   node cms-strapi/scripts/update-planes-historicos.mjs           # ejecuta
 *   node cms-strapi/scripts/update-planes-historicos.mjs --dry-run
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';
const DRY = process.argv.includes('--dry-run');
const SINGLE_UID =
  'api::agencia-direccionamiento-planes.agencia-direccionamiento-planes';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SNAPSHOT = path.join(__dirname, '_wp-snapshot-planes-historicos.json');
const PDF_DIR = path.join(REPO_ROOT, 'public', 'documentos', 'agencia');

const norm = (s) =>
  String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[áä]/g, 'a').replace(/[éë]/g, 'e').replace(/[íï]/g, 'i')
    .replace(/[óö]/g, 'o').replace(/[úü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/\s+/g, ' ');

const dedupKey = (doc) =>
  `${norm(doc.category)}|${norm(doc.anio)}|${norm(doc.name)}`;

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

async function getSingle(token) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/single-types/${SINGLE_UID}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error(`get: ${r.status} ${await r.text()}`);
  const j = await r.json();
  return j.data || {};
}

async function putSingle(token, payload) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/single-types/${SINGLE_UID}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  if (!r.ok) throw new Error(`put: ${r.status} ${await r.text()}`);
  return r.json();
}

async function publishSingle(token) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/single-types/${SINGLE_UID}/actions/publish`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }
  );
  if (!r.ok) throw new Error(`publish: ${r.status} ${await r.text()}`);
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
    console.warn(`  upload failed ${r.status}: ${filename}`);
    return null;
  }
  const j = await r.json();
  const id = Array.isArray(j) ? j[0]?.id : j?.id;
  if (id) stats.uploaded++;
  return id || null;
}

async function main() {
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  const wpDocs = snap.documentos;
  console.log(`snapshot WP: ${wpDocs.length} docs históricos`);

  const token = DRY ? null : await login();
  if (!DRY) console.log('login OK');

  const current = DRY ? { sections: [] } : await getSingle(token);
  const currentSecs = current.sections || [];
  const currentDocs = currentSecs[0]?.documents || [];
  console.log(`single actual: ${currentSecs.length} section(s), ${currentDocs.length} docs`);

  const existingKeys = new Set(currentDocs.map(dedupKey));
  const todo = wpDocs.filter((d) => !existingKeys.has(dedupKey(d)));
  console.log(`a insertar (delta): ${todo.length} de ${wpDocs.length} (${wpDocs.length - todo.length} ya existen por dedup category+anio+name)`);

  if (DRY) {
    console.log('\n-- DRY RUN sample (10) --');
    for (const d of todo.slice(0, 10)) {
      console.log(`  [${d.category}] ${d.anio} | ${d.name} → ${basenameFromUrl(d.url)}`);
    }
    return;
  }

  if (todo.length === 0) {
    console.log('nada que insertar. Exit.');
    return;
  }

  const stats = {
    pdfDownloaded: 0, pdfAlready: 0, pdfFailed: 0,
    uploaded: 0, uploadFailed: 0,
    appended: 0,
  };

  const newDocsForSingle = [];
  for (let i = 0; i < todo.length; i++) {
    const d = todo[i];
    const local = await ensurePdfLocal(d.url, stats);
    const fileId = local ? await uploadToStrapi(token, local.abs, local.filename, stats) : null;
    newDocsForSingle.push({
      name: d.name,
      category: d.category,
      anio: d.anio,
      file: fileId,
    });
    stats.appended++;
    if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${todo.length}`);
  }

  const updatedDocs = [...currentDocs.map(stripIds), ...newDocsForSingle];
  const updatedSections = currentSecs.length
    ? [
        {
          sectionTitle: currentSecs[0].sectionTitle || 'Planes de la Agencia ITRC',
          displayMode: currentSecs[0].displayMode || 'list',
          documents: updatedDocs,
        },
        ...currentSecs.slice(1).map(stripIds),
      ]
    : [{ sectionTitle: 'Planes de la Agencia ITRC', displayMode: 'list', documents: updatedDocs }];

  const putPayload = {
    title: current.title,
    slug: current.slug,
    description: current.description,
    icon: current.icon,
    order: current.order,
    published: current.published,
    sections: updatedSections,
  };
  await putSingle(token, putPayload);
  console.log(`✓ PUT al single (${updatedDocs.length} docs totales en sections[0])`);
  await publishSingle(token);
  console.log('✓ publicado');

  console.log('\n=== STATS ===');
  console.log(JSON.stringify(stats, null, 2));
}

function stripIds(o) {
  if (Array.isArray(o)) return o.map(stripIds);
  if (o && typeof o === 'object') {
    const r = {};
    for (const [k, v] of Object.entries(o)) {
      if (k === 'id' || k === 'documentId') continue;
      // media field: preserve as numeric id (Strapi expects id ref)
      if (k === 'file' && v && typeof v === 'object' && v.id) {
        r[k] = v.id;
      } else {
        r[k] = stripIds(v);
      }
    }
    return r;
  }
  return o;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
