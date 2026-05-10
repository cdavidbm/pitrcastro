#!/usr/bin/env node
/**
 * Migración masiva: lee el manifest del autogen y carga el contenido de
 * cada single-type / collection desde sus JSONs de origen
 * (src/content/pages/...). Idempotente: re-ejecutar sobreescribe el draft
 * y vuelve a publicar.
 *
 * Uso desde la raíz del repo (o desde cms-strapi/):
 *   node cms-strapi/scripts/migrate-all.mjs
 *   node cms-strapi/scripts/migrate-all.mjs --only=normograma,home  # filtro por slug
 *   node cms-strapi/scripts/migrate-all.mjs --skip-collections      # solo single-pages
 *   node cms-strapi/scripts/migrate-all.mjs --skip-singles
 *
 * Variables:
 *   STRAPI_URL       (default http://127.0.0.1:1337)
 *   STRAPI_EMAIL     (default admin@itrc.local)
 *   STRAPI_PASSWORD  (default AdminITRC2026!)
 *
 * Mapeo de atributos reservados aplicado al payload (debe espejar
 * RESERVED_ATTR_RENAMES de autogen-schemas.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const MANIFEST = path.join(__dirname, '.autogen-manifest.json');

const RESERVED_RENAMES = {
  id: 'idLogico',
  createdAt: 'creadoEn',
  updatedAt: 'actualizadoEn',
  publishedAt: 'publicadoEn',
  createdBy: 'creadoPor',
  updatedBy: 'actualizadoPor',
  locale: 'idiomaLocal',
  localizations: 'localizaciones',
  documentId: 'idDocumento',
};
const SAFE_ATTR_RE = /^[a-zA-Z][a-zA-Z0-9_]*$/;

const args = new Map();
for (const a of process.argv.slice(2)) {
  if (a.startsWith('--')) {
    const [k, v] = a.replace(/^--/, '').split('=');
    args.set(k, v ?? true);
  }
}
const ONLY = args.get('only')
  ? new Set(String(args.get('only')).split(',').map((s) => s.trim()))
  : null;
const SKIP_SINGLES = !!args.get('skip-singles');
const SKIP_COLLECTIONS = !!args.get('skip-collections');

// ========================================================================
// Transform: mismo conjunto de reglas que autogen-schemas.mjs
// ========================================================================

function transformValue(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    const sample = value[0];
    if (typeof sample !== 'object' || sample === null) {
      // Array de primitivos: schema=json. Pasamos el array como está.
      return value;
    }
    // Array de objetos: si las llaves son válidas → repeatable component
    // (transformar cada item). Si no → schema=json y pasamos el array tal cual.
    const merged = mergeShapes(value);
    if (!hasValidStrapiAttrNames(merged)) return value;
    return value.map((item) => transformObject(item));
  }
  if (typeof value === 'object') {
    if (!hasValidStrapiAttrNames(value)) return value;
    return transformObject(value);
  }
  return value;
}

function transformObject(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const renamed = RESERVED_RENAMES[k] || k;
    if (!SAFE_ATTR_RE.test(renamed)) continue;
    out[renamed] = transformValue(v);
  }
  return out;
}

function mergeShapes(samples) {
  const out = {};
  for (const s of samples) {
    if (!s || typeof s !== 'object') continue;
    for (const [k, v] of Object.entries(s)) {
      if (!(k in out)) out[k] = v;
      else if (out[k] === null || out[k] === undefined) out[k] = v;
    }
  }
  return out;
}

function hasValidStrapiAttrNames(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;
  return keys.every((k) => SAFE_ATTR_RE.test(k));
}

// ========================================================================
// Strapi Admin API helpers
// ========================================================================

async function adminLogin() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`admin login falló: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return json.data.token;
}

async function putSingleType(token, uid, payload) {
  const res = await fetch(`${STRAPI_URL}/content-manager/single-types/${uid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`PUT ${uid} → ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function publishSingleType(token, uid) {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/single-types/${uid}/actions/publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    }
  );
  if (!res.ok) {
    throw new Error(`Publish ${uid} → ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function listCollectionEntries(token, uid) {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/${uid}?pageSize=500`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return { results: [] };
  return res.json();
}

async function deleteCollectionEntry(token, uid, documentId) {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/${uid}/${documentId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok && res.status !== 404) {
    console.warn(`[delete] ${uid}/${documentId} → ${res.status}`);
  }
}

async function createCollectionEntry(token, uid, payload) {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/${uid}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    throw new Error(`POST ${uid} → ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function publishCollectionEntry(token, uid, documentId) {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/${uid}/${documentId}/actions/publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    }
  );
  if (!res.ok) {
    throw new Error(`publish ${uid}/${documentId} → ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// ========================================================================
// Main
// ========================================================================

async function migrateSinglePage(token, sp) {
  const uid = `api::${sp.slug}.${sp.slug}`;
  if (ONLY && !ONLY.has(sp.slug)) return { skipped: true };
  const sourcePath = path.join(REPO_ROOT, sp.sourcePath);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`[skip] ${sp.slug}: no existe ${sp.sourcePath}`);
    return { skipped: true };
  }
  const data = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const payload = transformObject(data);
  await putSingleType(token, uid, payload);
  await publishSingleType(token, uid);
  return { ok: true };
}

async function migrateCollection(token, coll) {
  const uid = `api::${coll.slug}.${coll.slug}`;
  if (ONLY && !ONLY.has(coll.slug)) return { skipped: true };

  // Limpia entries existentes (idempotencia: cada run reescribe el set completo).
  const existing = await listCollectionEntries(token, uid);
  for (const entry of existing.results || []) {
    await deleteCollectionEntry(token, uid, entry.documentId);
  }

  let count = 0;
  for (const relPath of coll.sourceFiles) {
    const fullPath = path.join(REPO_ROOT, relPath);
    if (!fs.existsSync(fullPath)) continue;
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const payload = transformObject(data);
    // slug auto: deriva del nombre del archivo si falta.
    if (!payload.slug) {
      payload.slug = path.basename(relPath, '.json');
    }
    const created = await createCollectionEntry(token, uid, payload);
    const documentId =
      created.data?.documentId || created.documentId || created.data?.id;
    if (documentId) await publishCollectionEntry(token, uid, documentId);
    count++;
  }
  return { ok: true, count };
}

async function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('[migrate-all] manifest no existe. Corre primero: node scripts/autogen-schemas.mjs');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  console.log(`[migrate-all] login admin → ${STRAPI_URL}`);
  const token = await adminLogin();

  let okSingles = 0, failSingles = 0;
  if (!SKIP_SINGLES) {
    console.log(`\n[migrate-all] === ${manifest.singlePages.length} single-pages ===`);
    for (const sp of manifest.singlePages) {
      try {
        const r = await migrateSinglePage(token, sp);
        if (r.skipped) continue;
        okSingles++;
        if (okSingles % 10 === 0) console.log(`  ... ${okSingles} ok`);
      } catch (e) {
        failSingles++;
        console.error(`  [fail] ${sp.slug}: ${e.message.split('\n')[0].slice(0, 200)}`);
      }
    }
    console.log(`[migrate-all] singles: ${okSingles} ok, ${failSingles} fail`);
  }

  let okColls = 0, failColls = 0, totalEntries = 0;
  if (!SKIP_COLLECTIONS) {
    console.log(`\n[migrate-all] === ${manifest.collections.length} collections ===`);
    for (const coll of manifest.collections) {
      try {
        const r = await migrateCollection(token, coll);
        if (r.skipped) continue;
        okColls++;
        totalEntries += r.count || 0;
        console.log(`  [ok] ${coll.slug}: ${r.count} entries`);
      } catch (e) {
        failColls++;
        console.error(`  [fail] ${coll.slug}: ${e.message.split('\n')[0].slice(0, 200)}`);
      }
    }
    console.log(`[migrate-all] collections: ${okColls} ok (${totalEntries} entries), ${failColls} fail`);
  }
}

main().catch((e) => {
  console.error('[migrate-all] FALLO:', e.message);
  process.exit(1);
});
