#!/usr/bin/env node
/**
 * Reemplaza el contenido de los singles
 *   - transparencia-contratacion-plan-adquisiciones
 *   - agencia-directorio
 * con los datos del snapshot `_wp-snapshot-2026-06-17.json`.
 *
 * Usa la Admin API. PUT al draft + publish. NO toca el draft histórico de
 * Strapi para el resto de campos (solo reemplaza los listados destino).
 *
 * Uso:
 *   node cms-strapi/scripts/update-singles-from-wp.mjs
 *   node cms-strapi/scripts/update-singles-from-wp.mjs --dry-run
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';
const DRY = process.argv.includes('--dry-run');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = path.join(__dirname, '_wp-snapshot-2026-06-17.json');

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

async function getSingle(token, uid) {
  const r = await fetch(`${STRAPI_URL}/content-manager/single-types/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`get ${uid}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function putSingle(token, uid, payload) {
  const r = await fetch(`${STRAPI_URL}/content-manager/single-types/${uid}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`put ${uid}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function publishSingle(token, uid) {
  const r = await fetch(`${STRAPI_URL}/content-manager/single-types/${uid}/actions/publish`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!r.ok) throw new Error(`publish ${uid}: ${r.status} ${await r.text()}`);
}

function buildPlanAdquisicionesPayload(current, wp) {
  const anios = wp.anios.map((g) => ({
    anio: String(g.anio),
    docs: g.documentos.map((d) => ({ nombre: d.titulo, url: d.url })),
  }));
  return {
    title: current.title || wp.title,
    description: current.description || wp.description,
    icon: current.icon || 'fa-cart-shopping',
    secopUrl: wp.secopUrl,
    anios,
  };
}

function buildDirectorioPayload(current, wp) {
  const directorios = wp.directorios.map((d) => {
    const label = d.fechaActualizacion ? `${d.titulo} (Actualizado ${d.fechaActualizacion})` : d.titulo;
    return {
      titulo: label,
      descripcion: '',
      icon: 'fa-address-card',
      url: d.url,
      color: '',
      external: true,
    };
  });
  return {
    title: current.title || wp.title,
    description: current.description || wp.description,
    icon: current.icon || 'fa-id-card',
    directorios,
    escalaSalarial: current.escalaSalarial || null,
    infoAdicional: current.infoAdicional || [],
  };
}

async function main() {
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  const token = DRY ? null : await login();
  if (!DRY) console.log('login OK');

  for (const [uid, builder, wpKey] of [
    ['api::transparencia-contratacion-plan-adquisiciones.transparencia-contratacion-plan-adquisiciones',
     buildPlanAdquisicionesPayload, 'planAdquisiciones'],
    ['api::agencia-directorio.agencia-directorio',
     buildDirectorioPayload, 'directorio'],
  ]) {
    console.log(`\n--- ${uid} ---`);
    if (DRY) {
      console.log('payload sample:', JSON.stringify(builder({}, snap[wpKey]), null, 2).slice(0, 600), '...');
      continue;
    }
    const current = (await getSingle(token, uid))?.data || {};
    const payload = builder(current, snap[wpKey]);
    await putSingle(token, uid, payload);
    console.log('  ✓ draft actualizado');
    await publishSingle(token, uid);
    console.log('  ✓ publicado');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
