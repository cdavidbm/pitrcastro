#!/usr/bin/env node
/**
 * Para cada doc del single `agencia-direccionamiento-planes` que NO tenga
 * `file` asociado, busca su URL del WP en el snapshot
 * `_wp-snapshot-planes-actuales.json` por (category, anio), descarga el
 * PDF/XLSX, lo sube al Media del Strapi destino y hace PUT del single con
 * file asociado al doc correspondiente.
 *
 * Mantiene los docs que ya tienen file. No borra nada.
 *
 * Uso:
 *   STRAPI_URL=http://192.168.82.13 \
 *     node cms-strapi/scripts/attach-pdfs-to-planes-actuales.mjs [--dry-run]
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
const SNAPSHOT = path.join(__dirname, '_wp-snapshot-planes-actuales.json');
const PDF_DIR = path.join(REPO_ROOT, 'public', 'documentos', 'agencia');
const UID = 'api::agencia-direccionamiento-planes.agencia-direccionamiento-planes';

const norm = (s) =>
  String(s || '').trim().toLowerCase()
    .replace(/[áä]/g, 'a').replace(/[éë]/g, 'e').replace(/[íï]/g, 'i')
    .replace(/[óö]/g, 'o').replace(/[úü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/\s+/g, ' ');

const matchKey = (category, anio) => `${norm(category)}|${norm(anio)}`;

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

async function ensurePdfLocal(remoteUrl, stats) {
  const filename = basenameFromUrl(remoteUrl);
  if (!filename) return null;
  const abs = path.join(PDF_DIR, filename);
  if (fs.existsSync(abs)) {
    stats.pdfAlready++;
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

async function getSingle(token) {
  const r = await fetch(`${STRAPI_URL}/content-manager/single-types/${UID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`get: ${r.status}`);
  return (await r.json()).data || {};
}

async function putSingle(token, payload) {
  const r = await fetch(`${STRAPI_URL}/content-manager/single-types/${UID}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`put: ${r.status} ${await r.text()}`);
  return r.json();
}

async function publishSingle(token) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/single-types/${UID}/actions/publish`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }
  );
  if (!r.ok) throw new Error(`publish: ${r.status} ${await r.text()}`);
}

async function main() {
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  const wpMap = new Map();
  for (const d of snap.documentos) {
    wpMap.set(matchKey(d.category, d.anio), d.url);
  }
  console.log(`mapping WP cargado: ${wpMap.size} entradas`);

  const token = DRY ? null : await login();
  if (!DRY) console.log('login OK');
  if (DRY) throw new Error('dry-run no implementado para este script (requiere login para GET)');

  const current = await getSingle(token);
  const sections = current.sections || [];
  if (sections.length === 0) {
    console.error('single sin sections, exit');
    return;
  }
  const docs = sections[0].documents || [];
  console.log(`docs en single: ${docs.length}`);
  const nofile = docs.filter((d) => !d.file);
  console.log(`docs sin file: ${nofile.length}`);

  const stats = {
    matchedWp: 0, noMatchWp: 0,
    pdfDownloaded: 0, pdfAlready: 0, pdfFailed: 0,
    uploaded: 0, uploadFailed: 0,
  };

  // Para cada doc sin file, busca url WP, descarga, upload, mete file id
  const idByKey = new Map();  // key → strapi media id
  for (const doc of nofile) {
    const key = matchKey(doc.category, doc.anio);
    const wpUrl = wpMap.get(key);
    if (!wpUrl) {
      stats.noMatchWp++;
      console.warn(`  no WP match: [${doc.category}] ${doc.anio} | ${doc.name}`);
      continue;
    }
    stats.matchedWp++;
    if (idByKey.has(wpUrl)) {
      // mismo PDF para varios docs (e.g. PIGA 2023 y PIGA 2024 → mismo PIGA-2023-2026.pdf)
      idByKey.set(key, idByKey.get(wpUrl));
      continue;
    }
    const local = await ensurePdfLocal(wpUrl, stats);
    if (!local) continue;
    const id = await uploadToStrapi(token, local.abs, local.filename, stats);
    if (id) {
      idByKey.set(key, id);
      idByKey.set(wpUrl, id);
    }
  }

  // Construir nuevo array de docs con file asociado
  const updatedDocs = docs.map((doc) => {
    const key = matchKey(doc.category, doc.anio);
    const fileId = idByKey.get(key);
    const stripped = {
      name: doc.name,
      category: doc.category,
      anio: doc.anio,
    };
    // Mantener file existente si lo había; o el nuevo si lo conseguimos
    if (doc.file && doc.file.id) {
      stripped.file = doc.file.id;
    } else if (fileId) {
      stripped.file = fileId;
    } else {
      stripped.file = null;
    }
    return stripped;
  });

  const updatedSections = [
    {
      sectionTitle: sections[0].sectionTitle || 'Planes de la Agencia ITRC',
      displayMode: sections[0].displayMode || 'list',
      documents: updatedDocs,
    },
    ...sections.slice(1).map((s) => ({
      sectionTitle: s.sectionTitle,
      displayMode: s.displayMode,
      documents: (s.documents || []).map((d) => ({
        name: d.name, category: d.category, anio: d.anio,
        file: d.file?.id || null,
      })),
    })),
  ];

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
  console.log('✓ PUT al single');
  await publishSingle(token);
  console.log('✓ publicado');

  console.log('\n=== STATS ===');
  console.log(JSON.stringify(stats, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
