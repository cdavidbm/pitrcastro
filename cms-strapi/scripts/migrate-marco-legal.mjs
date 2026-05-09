#!/usr/bin/env node
/**
 * Migración inicial: lee src/content/pages/normativa/marco-legal.json
 * (relativo a la raíz del repo) y lo carga al Single Type marco-legal de
 * Strapi via Admin API. Idempotente: re-ejecutar sobreescribe el draft.
 *
 * Uso desde la raíz del repo:
 *   node cms-strapi/scripts/migrate-marco-legal.mjs
 *
 * Variables (con defaults para POC local):
 *   STRAPI_URL       (default http://127.0.0.1:1337)
 *   STRAPI_EMAIL     (default admin@itrc.local)
 *   STRAPI_PASSWORD  (default AdminITRC2026!)
 *   SOURCE           (default ../src/content/pages/normativa/marco-legal.json
 *                     resuelto relativo a este script)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';
const UID = 'api::marco-legal.marco-legal';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const SOURCE = process.env.SOURCE || path.join(
  REPO_ROOT,
  'src/content/pages/normativa/marco-legal.json'
);

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

async function putSingleType(token, payload) {
  const res = await fetch(`${STRAPI_URL}/content-manager/single-types/${UID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`PUT falló: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function publishSingleType(token) {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/single-types/${UID}/actions/publish`,
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
    throw new Error(`Publish falló: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function transform(data) {
  return {
    title: data.title,
    description: data.description,
    icon: data.icon,
    secciones: (data.secciones || []).map((s) => ({
      titulo: s.titulo,
      icon: s.icon,
      documentos: (s.documentos || []).map((d) => ({
        nombre: d.nombre,
        descripcion: d.descripcion,
        file: d.file,
        externo: Boolean(d.externo),
      })),
    })),
    enlacesRelacionados: (data.enlacesRelacionados || []).map((e) => ({
      titulo: e.titulo,
      descripcion: e.descripcion || '',
      url: e.url,
      icon: e.icon,
    })),
  };
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error(`SOURCE no existe: ${SOURCE}`);
  }
  console.log(`[migrate] leyendo ${SOURCE}`);
  const data = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
  const payload = transform(data);

  console.log(`[migrate] login admin → ${STRAPI_URL}`);
  const token = await adminLogin();

  console.log(`[migrate] PUT ${UID}`);
  await putSingleType(token, payload);

  console.log(`[migrate] publish ${UID}`);
  await publishSingleType(token);

  console.log('[migrate] OK — verificando lectura pública...');
  const check = await fetch(`${STRAPI_URL}/api/${UID.split('.')[1]}?populate=deep`);
  console.log(`[migrate] GET /api/marco-legal → HTTP ${check.status}`);
}

main().catch((e) => {
  console.error('[migrate] FALLO:', e.message);
  process.exit(1);
});
