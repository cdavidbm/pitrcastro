#!/usr/bin/env node
/**
 * Migración one-shot de src/content/events/*.json al collection-type
 * Strapi `evento`. Idempotente: borra todos los eventos existentes antes
 * de cargar.
 *
 * Uso:
 *   STRAPI_URL=http://192.168.82.13 node cms-strapi/scripts/migrate-eventos.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const EVENTS_DIR = path.join(REPO_ROOT, 'src/content/events');

async function login() {
  const r = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`login: ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

async function withTokenRefresh(holder, fn) {
  try {
    return await fn(holder.token);
  } catch (e) {
    if (!String(e.message).includes('401')) throw e;
    holder.token = await login();
    return await fn(holder.token);
  }
}

async function fetchAllExisting(token) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::evento.evento?pageSize=2000`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error(`list: ${r.status} ${await r.text()}`);
  return (await r.json()).results || [];
}

async function deleteOne(token, documentId) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::evento.evento/${documentId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error(`delete ${documentId}: ${r.status}`);
}

async function createOne(token, payload) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::evento.evento`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  if (!r.ok) throw new Error(`create: ${r.status} ${await r.text()}`);
  return r.json();
}

async function publishOne(token, documentId) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::evento.evento/${documentId}/actions/publish`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error(`publish ${documentId}: ${r.status}`);
}

function loadEvents() {
  const out = [];
  for (const fname of fs.readdirSync(EVENTS_DIR)) {
    if (!fname.endsWith('.json')) continue;
    const j = JSON.parse(fs.readFileSync(path.join(EVENTS_DIR, fname), 'utf8'));
    out.push({
      title: j.title || '',
      startDate: j.startDate || null,
      endDate: j.endDate || null,
      location: j.location || '',
      description: j.description || '',
      inscriptionLink: j.inscriptionLink || '',
      virtualLink: j.virtualLink || '',
      image: j.image || '',
      published: j.published !== false,
      archived: !!j.archived,
    });
  }
  return out;
}

async function main() {
  const holder = { token: await login() };
  console.log('logged in');

  const existing = await withTokenRefresh(holder, (t) => fetchAllExisting(t));
  console.log(`existing: ${existing.length}`);
  for (const e of existing) {
    await withTokenRefresh(holder, (t) => deleteOne(t, e.documentId));
  }

  const payloads = loadEvents();
  console.log(`payloads: ${payloads.length}`);

  let ok = 0;
  for (const p of payloads) {
    try {
      const created = await withTokenRefresh(holder, (t) => createOne(t, p));
      const documentId = created?.data?.documentId || created?.documentId;
      if (documentId) await withTokenRefresh(holder, (t) => publishOne(t, documentId));
      ok++;
    } catch (e) {
      console.error(`  error: ${e.message}`);
    }
  }
  console.log(`done. created+published ${ok}/${payloads.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
