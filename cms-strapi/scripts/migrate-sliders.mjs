#!/usr/bin/env node
/**
 * Migración one-shot de src/content/sliders/home.json al single-type
 * Strapi `slider`. Sube las imágenes referenciadas como media al Media
 * Library y construye payload con las relaciones.
 *
 * Uso:
 *   STRAPI_URL=http://192.168.82.13 node cms-strapi/scripts/migrate-sliders.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SOURCE = path.join(REPO_ROOT, 'src/content/sliders/home.json');

async function login() {
  const r = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`login: ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

const uploadCache = new Map();

function resolveBinaryPath(url) {
  if (!url || typeof url !== 'string') return null;
  if (/^https?:\/\//i.test(url)) return null;
  const cleaned = url.replace(/^\/+/, '');
  const candidates = [
    path.join(REPO_ROOT, 'public', cleaned),
    path.join(REPO_ROOT, cleaned),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

async function uploadFile(token, absPath) {
  if (uploadCache.has(absPath)) return uploadCache.get(absPath);
  const buf = await fs.promises.readFile(absPath);
  const fd = new FormData();
  fd.append('files', new Blob([buf]), path.basename(absPath));
  const res = await fetch(`${STRAPI_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error(`upload ${path.basename(absPath)} → ${res.status} ${await res.text()}`);
  const json = await res.json();
  const id = Array.isArray(json) ? json[0]?.id : json?.id;
  if (!id) throw new Error(`upload ${path.basename(absPath)} → respuesta sin id`);
  uploadCache.set(absPath, id);
  return id;
}

async function putSingleType(token, payload) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/single-types/api::slider.slider`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!r.ok) throw new Error(`PUT slider → ${r.status} ${await r.text()}`);
  return r.json();
}

async function publishSingleType(token) {
  const r = await fetch(
    `${STRAPI_URL}/content-manager/single-types/api::slider.slider/actions/publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({}),
    }
  );
  if (!r.ok) throw new Error(`publish slider → ${r.status} ${await r.text()}`);
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`[migrate-sliders] no existe ${SOURCE}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
  const token = await login();
  console.log('logged in');

  const slides = [];
  for (const s of data.slides || []) {
    const imgAbs = resolveBinaryPath(s.image);
    if (!imgAbs) {
      console.warn(`  [skip slide] image no encontrada: ${s.image}`);
      continue;
    }
    const imageId = await uploadFile(token, imgAbs);
    let imageMobileId = null;
    if (s.imageMobile) {
      const mAbs = resolveBinaryPath(s.imageMobile);
      if (mAbs) imageMobileId = await uploadFile(token, mAbs);
    }
    slides.push({
      image: imageId,
      imageMobile: imageMobileId,
      imageAlt: s.imageAlt || '',
      title: s.title || '',
      subtitle: s.subtitle || '',
      description: s.description || '',
      link: s.link || '',
      linkText: s.linkText || s.buttonText || '',
      external: !!s.external,
      overlay: s.overlay !== false,
      active: s.active !== false,
      order: typeof s.order === 'number' ? s.order : 0,
    });
  }

  const payload = {
    name: data.name || 'Slider Principal',
    description: data.description || '',
    autoplay: data.autoplay !== false,
    interval: typeof data.interval === 'number' ? data.interval : 6000,
    slides,
  };

  await putSingleType(token, payload);
  await publishSingleType(token);
  console.log(`done. slider con ${slides.length} slides publicado`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
