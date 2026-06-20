#!/usr/bin/env node
/**
 * Reemplaza los 5 slides del single `slider` por los del WP actual.
 *
 * Cada slide del WP se descarga a public/images/sliders/, se sube al Media
 * Library del Strapi destino, y se arma el array de slides para PUT al
 * single. Luego publica.
 *
 * Uso:
 *   STRAPI_URL=http://192.168.82.13 \
 *     node cms-strapi/scripts/update-slider-from-wp.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.STRAPI_URL || 'http://192.168.82.13';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || 'AdminITRC2026!';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SLIDERS_DIR = path.join(REPO_ROOT, 'public', 'images', 'sliders');
const UID = 'api::slider.slider';

// 5 slides extraídos del WP actual (2026-06-17). Los links apuntan a las
// rutas del portal Astro donde mejor encaja cada anuncio.
const NEW_SLIDES = [
  {
    order: 0,
    imageRemote: 'https://www.itrc.gov.co/Itrc/wp-content/uploads/2026/06/Banner-web.jpg',
    localName: 'slider-socializacion-planeacion-2026.jpg',
    imageAlt: 'Socialización de la Planeación Institucional 2026 de la Agencia ITRC',
    title: 'Socialización Planeación Institucional 2026',
    link: '/agencia/direccionamiento-estrategico/planes',
    external: false,
    overlay: false,
    active: true,
  },
  {
    order: 1,
    imageRemote: 'https://www.itrc.gov.co/Itrc/wp-content/uploads/2026/06/Congreso_banner-1.jpg',
    localName: 'slider-ciprep-2026.jpg',
    imageAlt: 'II Congreso CIPREP 2026 — Agencia ITRC',
    title: 'II Congreso CIPREP 2026',
    link: '/ciprep2026',
    external: false,
    overlay: false,
    active: true,
  },
  {
    order: 2,
    imageRemote: 'https://www.itrc.gov.co/Itrc/wp-content/uploads/2026/04/Banner-transparencia-1.png',
    localName: 'slider-transparencia-pep-2026.png',
    imageAlt: 'Consulta Ciudadana PEP — Programa de Transparencia y Ética Pública',
    title: 'Consulta Ciudadana PEP',
    link: 'https://www.funcionpublica.gov.co/fdci/consultaCiudadana/consultaPEP',
    external: true,
    overlay: false,
    active: true,
  },
  {
    order: 3,
    imageRemote: 'https://www.itrc.gov.co/Itrc/wp-content/uploads/2026/06/PQRSDF-BANNER-WEB.jpg',
    localName: 'slider-pqrsdf-2026.jpg',
    imageAlt: 'Sistema de Peticiones, Quejas, Reclamos, Sugerencias, Denuncias y Felicitaciones de la Agencia ITRC',
    title: 'Tu PQRSDF al día',
    link: '/tu-p-q-r-s-al-dia',
    external: false,
    overlay: false,
    active: true,
  },
  {
    order: 4,
    imageRemote: 'https://www.itrc.gov.co/Itrc/wp-content/uploads/2026/02/Banner-1.jpg',
    localName: 'slider-plan-accion-2026.jpg',
    imageAlt: 'Participa en la construcción del Plan de Acción 2026 de la Agencia ITRC',
    title: 'Plan de Acción 2026',
    link: '/participa/planeacion-y-presupuesto-participativo',
    external: false,
    overlay: false,
    active: true,
  },
];

async function login() {
  const r = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`login: ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

async function downloadIfMissing(remoteUrl, localPath, stats) {
  if (fs.existsSync(localPath)) {
    stats.imgAlready++;
    return localPath;
  }
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  const res = await fetch(remoteUrl);
  if (!res.ok) {
    stats.imgFailed++;
    throw new Error(`download ${res.status}: ${remoteUrl}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(localPath, buf);
  stats.imgDownloaded++;
  return localPath;
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
  if (!r.ok) throw new Error(`upload ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const id = Array.isArray(j) ? j[0]?.id : j?.id;
  if (id) stats.uploaded++;
  return id;
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
  console.log(`target: ${STRAPI_URL}`);
  const token = await login();
  console.log('login OK');

  const current = await getSingle(token);
  console.log(`single actual: name="${current.name}", ${current.slides?.length || 0} slides`);

  const stats = {
    imgDownloaded: 0, imgAlready: 0, imgFailed: 0,
    uploaded: 0,
  };

  const slidesPayload = [];
  for (const s of NEW_SLIDES) {
    const local = path.join(SLIDERS_DIR, s.localName);
    await downloadIfMissing(s.imageRemote, local, stats);
    const imageId = await uploadToStrapi(token, local, s.localName, stats);
    slidesPayload.push({
      image: imageId,
      imageAlt: s.imageAlt,
      title: s.title,
      link: s.link,
      external: s.external,
      overlay: s.overlay,
      active: s.active,
      order: s.order,
    });
    console.log(`  ✓ slide ${s.order}: ${s.title} (img id=${imageId})`);
  }

  const putPayload = {
    name: current.name || 'Slider Principal',
    description: current.description,
    autoplay: current.autoplay !== undefined ? current.autoplay : true,
    interval: current.interval || 6000,
    slides: slidesPayload,
  };
  await putSingle(token, putPayload);
  console.log('✓ PUT al single OK');
  await publishSingle(token);
  console.log('✓ publicado');

  console.log('\n=== STATS ===');
  console.log(JSON.stringify(stats, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
