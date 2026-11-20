#!/usr/bin/env node
/**
 * Participa › Rendición de Cuentas: agrega a la vigencia 2026 el Informe de Rendición de Cuentas
 * 2025-2026 (periodo noviembre de 2025 – octubre de 2026). Versión de diagramación publicada por
 * instrucción de Comunicaciones (20-nov-2026); cuando llegue la versión final basta reemplazar el PDF
 * en public/documentos/participa/ con el mismo nombre.
 * Se enlaza también desde Transparencia, numeral 4.7.3. Es repetible.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/rendicion-cuentas-2026-11.mjs --seco
 */
const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID = 'api::participa-rendicion-de-cuentas.participa-rendicion-de-cuentas';
const DOC = { nombre: 'Informe de Rendición de Cuentas 2025-2026', url: '/documentos/participa/Informe-de-Rendicion-de-Cuentas-2025-2026.pdf', tipo: 'pdf' };

const sinIds = (o) => Array.isArray(o) ? o.map(sinIds)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'id').map(([k, v]) => [k, sinIds(v)])) : o;
const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const CM = `${BASE}/content-manager/single-types/${UID}`;
const d = (await j(await fetch(CM, { headers: H }))).data;

let anio = d.anios.find((a) => a.anio === '2026');
if (!anio) { anio = { anio: '2026', documentos: [] }; d.anios.unshift(anio); }
if (anio.documentos.some((x) => x.url === DOC.url)) { console.log('· ya está publicado'); process.exit(0); }
anio.documentos.unshift(DOC);
console.log(`+ 2026: «${DOC.nombre}» (la vigencia queda con ${anio.documentos.length} documentos)`);
if (SECO) { console.log('(en seco: no se guardó nada)'); process.exit(0); }

const cuerpo = sinIds(Object.fromEntries(Object.entries(d).filter(([k]) => !['documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'locale', 'localizations', 'status'].includes(k))));
await j(await fetch(CM, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) }));
await j(await fetch(`${CM}/actions/publish`, { method: 'POST', headers: H }));
console.log('✓ guardado y publicado. Falta recompilar el sitio.');
process.exit(0);
