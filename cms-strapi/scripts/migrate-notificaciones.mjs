#!/usr/bin/env node
/**
 * Migración one-shot de las notificaciones desde
 * src/content/notificaciones/{edictos,estados,traslados}.json al
 * collection-type Strapi `notificacion`.
 *
 * Idempotente: borra todas las notificaciones existentes antes de cargar
 * (porque la cantidad supera draft-and-publish reasonable y queremos un
 * estado limpio).
 *
 * Uso:
 *   node cms-strapi/scripts/migrate-notificaciones.mjs
 *
 * Variables:
 *   STRAPI_URL       (default http://127.0.0.1:1337)
 *   STRAPI_EMAIL     (default admin@itrc.local)
 *   STRAPI_PASSWORD  (default AdminITRC2026!)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

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

// Wrapper que reintenta una vez con un token nuevo si la API responde 401.
// El JWT del admin caduca tras ~30 min y la migración de 1473 entries puede
// extenderse más allá vía VPN.
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
  // Trae todos los documentos existentes (admin API expone Content Manager).
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::notificacion.notificacion?pageSize=2000`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error(`list: ${r.status} ${await r.text()}`);
  const j = await r.json();
  return j.results || [];
}

async function deleteOne(token, documentId) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::notificacion.notificacion/${documentId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) throw new Error(`delete ${documentId}: ${r.status}`);
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

function loadCategoriaEntries(categoria, file) {
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  return (j.entries || []).map((e) => ({
    categoria,
    expediente: e.expediente || '',
    tipoAuto: e.tipoAuto || '',
    tipoNotificacion: e.tipoNotificacion || '',
    dependencia: e.dependencia || '',
    fechaAuto: e.fechaAuto || '',
    desde: e.desde || '',
    hasta: e.hasta || '',
    pdfUrl: e.pdfUrl || '',
    vigencia: typeof e.vigencia === 'number' ? e.vigencia : parseInt(e.vigencia, 10) || null,
  }));
}

async function main() {
  const holder = { token: await login() };
  console.log('logged in');

  console.log('fetching existing...');
  const existing = await withTokenRefresh(holder, (t) => fetchAllExisting(t));
  console.log(`existing: ${existing.length}`);

  for (let i = 0; i < existing.length; i++) {
    await withTokenRefresh(holder, (t) => deleteOne(t, existing[i].documentId));
    if ((i + 1) % 100 === 0) console.log(`  deleted ${i + 1}/${existing.length}`);
  }
  if (existing.length) console.log(`  deleted ${existing.length}`);

  const payloads = [
    ...loadCategoriaEntries('edicto', path.join(REPO_ROOT, 'src/content/notificaciones/edictos.json')),
    ...loadCategoriaEntries('estado', path.join(REPO_ROOT, 'src/content/notificaciones/estados.json')),
    ...loadCategoriaEntries('traslado', path.join(REPO_ROOT, 'src/content/notificaciones/traslados.json')),
  ];
  console.log(`payloads: ${payloads.length}`);

  let ok = 0;
  for (let i = 0; i < payloads.length; i++) {
    try {
      const created = await withTokenRefresh(holder, (t) => createOne(t, payloads[i]));
      const documentId = created?.data?.documentId || created?.documentId;
      if (documentId) await withTokenRefresh(holder, (t) => publishOne(t, documentId));
      ok++;
      if ((i + 1) % 100 === 0) console.log(`  created+published ${i + 1}/${payloads.length}`);
    } catch (e) {
      console.error(`  error en ${i}: ${e.message}`);
    }
  }
  console.log(`done. created+published ${ok}/${payloads.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
