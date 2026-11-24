#!/usr/bin/env node
/**
 * Cuenta «prensa» del panel (pedido del usuario, 2026-11-24): la usa la oficina de prensa para
 * publicar noticias y banners, y nada más. Crea (o ajusta) el rol «Prensa» y la cuenta
 * prensa@itrc.local con ese rol. Es repetible: si ya existen, solo vuelve a fijar los permisos
 * (y la contraseña, si se pasa).
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… PRENSA_CLAVE=… node scripts/cuenta-prensa-2026-11.mjs --seco
 *
 * La contraseña de la cuenta no se escribe aquí: llega por PRENSA_CLAVE.
 */
const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const CLAVE = process.env.PRENSA_CLAVE || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const ROL = 'Prensa';
const DESCRIPCION = 'Publica noticias y los banners del inicio. Nada más.';
const CUENTA = { firstname: 'Prensa', lastname: 'ITRC', email: 'prensa@itrc.local' };

const NOTICIA = 'api::noticia.noticia';
const SLIDER = 'api::slider.slider';
const CAMPOS_NOTICIA = ['titulo', 'slug', 'fecha', 'resumen', 'imagen', 'contenido', 'categoria'];
const CAMPOS_SLIDER = ['name', 'description', 'autoplay', 'interval',
  ...['image', 'imageMobile', 'imageAlt', 'title', 'subtitle', 'description', 'link', 'linkText', 'external', 'overlay', 'active', 'order'].map((c) => `slides.${c}`)];
const cm = (a, subject, fields, conditions = []) => ({ action: `plugin::content-manager.explorer.${a}`, subject, properties: fields ? { fields } : {}, conditions });
const PERMISOS = [
  ...['create', 'read', 'update'].map((a) => cm(a, NOTICIA, CAMPOS_NOTICIA)),
  cm('publish', NOTICIA),
  cm('delete', NOTICIA, null, ['admin::is-creator']), // borra solo lo que la cuenta misma creó
  ...['create', 'read', 'update'].map((a) => cm(a, SLIDER, CAMPOS_SLIDER)),
  cm('publish', SLIDER),
  ...['read', 'assets.create', 'assets.download', 'assets.copy-link'].map((a) => ({ action: `plugin::upload.${a}`, subject: null, properties: {}, conditions: [] })),
  { action: 'plugin::upload.assets.update', subject: null, properties: {}, conditions: ['admin::is-creator'] },
];

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 400)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
const api = async (metodo, ruta, cuerpo) => j(await fetch(`${BASE}${ruta}`, { method: metodo, headers: H, ...(cuerpo ? { body: JSON.stringify(cuerpo) } : {}) }));

const roles = (await api('GET', '/admin/roles')).data;
let rol = roles.find((r) => r.name === ROL);
const usuarios = (await api('GET', `/admin/users?pageSize=100&_q=${encodeURIComponent(CUENTA.email)}`)).data.results;
let usuario = usuarios.find((u) => u.email === CUENTA.email);
console.log(`Rol «${ROL}»: ${rol ? 'ya existe' : 'se crea'} · cuenta ${CUENTA.email}: ${usuario ? 'ya existe' : 'se crea'}`);
console.log(`Permisos: noticias (crear, ver, editar, publicar; borrar solo las propias), banners (ver, editar, publicar), biblioteca de medios (ver y subir; editar solo lo propio)`);
if (!usuario && !CLAVE) { console.error('Falta PRENSA_CLAVE para crear la cuenta'); process.exit(1); }
if (SECO) { console.log('(en seco: no se guardó nada)'); process.exit(0); }

if (!rol) rol = (await api('POST', '/admin/roles', { name: ROL, description: DESCRIPCION })).data;
await api('PUT', `/admin/roles/${rol.id}/permissions`, { permissions: PERMISOS });
if (!usuario) usuario = (await api('POST', '/admin/users', { ...CUENTA, roles: [rol.id] })).data;
await api('PUT', `/admin/users/${usuario.id}`, { ...CUENTA, roles: [rol.id], isActive: true, ...(CLAVE ? { password: CLAVE } : {}) });
// El panel en español para esta cuenta (el idioma se toma de la cuenta al iniciar sesión)
if (CLAVE) {
  const t = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: CUENTA.email, password: CLAVE }) }))).data.token;
  await j(await fetch(`${BASE}/admin/users/me`, { method: 'PUT', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ preferedLanguage: 'es' }) }));
}
console.log(`✓ rol «${ROL}» con ${PERMISOS.length} permisos; cuenta ${CUENTA.email} activa${CLAVE ? ' y con su contraseña' : ''}.`);

// Comprobación: la cuenta entra
if (CLAVE) {
  const r = await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: CUENTA.email, password: CLAVE }) });
  console.log(r.ok ? '✓ la cuenta prensa inicia sesión' : `✗ la cuenta prensa NO inicia sesión (${r.status})`);
}
process.exit(0);
