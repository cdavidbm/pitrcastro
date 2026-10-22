#!/usr/bin/env node
/**
 * Observatorio · Eje de Participación — requerimientos de la Experta Misional (Doris Molina,
 * 2026-10-22, formato COM-FT-002 «Dirección General»):
 *
 *   1. Comunicados de prensa 2025 y 2026 → «Noticias del Observatorio». Los seis de 2025 ya
 *      estaban publicados como memorias; el de 2026 (webinar CyberChat4All-11, OEA) estaba en el
 *      listado de Memorias sin página ni enlace. Se crea su memoria, se enlaza desde el listado
 *      y los siete se añaden a Noticias apuntando a su página.
 *   2. Plenarias de RENOBA 2025 y 2026 → sección «RENOBA» del Eje de Participación: una página
 *      con las cinco ayudas de memoria (PDF) y el registro fotográfico, y su tarjeta en el Eje.
 *
 * Es repetible: no duplica nada que ya exista.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… \
 *     node scripts/observatorio-2026-10.mjs --seco
 *
 * Los cinco PDF y las cuatro imágenes deben estar ya en el árbol de trabajo (copia local y
 * servidor): public/documentos/observatorio/renoba/ y public/images/observatorio/. Las imágenes
 * no pasan por la biblioteca de medios: Strapi guarda los nombres con guiones bajos y el
 * renderizador de memorias los toma por cursivas (`_texto_`) y rompe la dirección.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID_MEMORIA = 'api::observatorio-eje-de-participacion-memoria.observatorio-eje-de-participacion-memoria';
const UID_MEMORIAS_INFO = 'api::observatorio-eje-de-participacion-memorias-info.observatorio-eje-de-participacion-memorias-info';
const UID_NOTICIAS = 'api::observatorio-eje-de-participacion-noticias.observatorio-eje-de-participacion-noticias';
const UID_EJE = 'api::observatorio-eje-de-participacion.observatorio-eje-de-participacion';

const RUTA_MEMORIAS = '/observatorio/eje-de-participacion/memorias';
const RUTA_DOCS = '/documentos/observatorio/renoba';
const RUTA_IMG = '/images/observatorio';
const enArbol = (rel) => new URL(`../../public${rel}`, import.meta.url).pathname;

// ── Datos ────────────────────────────────────────────────────────────────────────────────────
const CYBERCHAT = {
  slug: 'el-observatorio-anticorrupcion-de-la-itrc-asistio-en-el-webinar-internacional-sobre-deepfakes',
  titulo: 'El Observatorio Anticorrupción de la ITRC asistió en el webinar internacional sobre Deepfakes y Ciberseguridad de las Mujeres organizado por la OEA',
  fecha: '2026-03-26',
  imagen: { archivo: 'cyberchat4all-11-deepfakes-2026-03-26.png',
            alt: 'Captura del webinar internacional CyberChat4All-11: Deepfakes, nuevos desafíos para la ciberseguridad de las mujeres de América Latina y el Caribe, organizado por la OEA.' },
  // texto íntegro del comunicado (docx «ComunicadoPrensa_CyberChat4All11_ITRC Final»)
  parrafos: [
    "El Observatorio Anticorrupción de la Agencia ITRC (Inspector General de Tributos, Rentas y Contribuciones Parafiscales) asistió el jueves 26 de marzo de 2026 al webinar internacional CyberChat4All-11: “Deepfakes: Nuevos Desafíos para la Ciberseguridad de las Mujeres de América Latina y el Caribe”, organizado por la Sección de Ciberseguridad del CICTE de la Organización de los Estados Americanos (OEA), con el respaldo del programa CYNDER Cyber Gender Project y el apoyo del Gobierno de Canadá.",
    "El evento, que contó con la asistencia de más de 500 participantes de la región, constituyó un espacio de análisis técnico, científico y jurídico en torno al uso de inteligencia artificial para la generación de contenido sintético falso (deepfakes) con fines sexuales, sus impactos en mujeres, niñas y grupos en situación de vulnerabilidad, y las estrategias de prevención, detección y respuesta disponibles.",
    "La asistencia del Observatorio Anticorrupción en este tipo de espacios responde a su mandato de seguimiento de fenómenos que confluyen con el fraude, la extorsión, la suplantación de identidad y las violencias facilitadas por tecnología, en el marco del ejercicio de vigilancia y control de la Agencia ITRC. Los deepfakes sexuales representan una forma emergente de violencia digital que puede asociarse a conductas de extorsión, acoso, desacreditación de servidores públicos y manipulación de la opinión pública, materias de interés directo para esta entidad.",
    "Entre las ponentes y expertas que participaron en el evento se encontraron la Dra. Nataly Buslón (Universidad Pompeu Fabra — UNESCO), quien presentó el estado del fenómeno a nivel global y reveló datos de alto impacto: el 90-95% del contenido deepfake sexual está dirigido contra mujeres; entre 2022 y 2023 se registró un incremento del 464% en su producción; y en 2026, la herramienta Grok generó más de 3 millones de imágenes sexualizadas en solo 11 días, 23.000 de ellas correspondientes a menores de edad.",
    "La investigadora peruana Ximena Cuzcano-Chávez expuso los hallazgos de un análisis de más de 100 aplicaciones deepfake disponibles en Google Play para América Latina, evidenciando que el 89,5% de estas herramientas representan un peligro concreto para las mujeres y que el 66% se presentan como aptas para todo público sin ningún control por parte de la plataforma distribuidora. El panel de expertas, integrado por Selva Oregón, Daniela Rojas y la Dra. Velda Gámez, profundizó en las consecuencias victimológicas, el impacto en la participación democrática de las mujeres y las vías de prevención y respuesta institucional.",
    "El Observatorio Anticorrupción de la ITRC reitera su compromiso con la formación continua, el seguimiento de nuevas modalidades de fraude y violencia facilitada por tecnología, y la articulación con espacios académicos e internacionales que fortalezcan su capacidad institucional de análisis e incidencia.",
  ],
};

const RENOBA = {
  slug: 'renoba-plenarias-2025-2026',
  titulo: 'RENOBA — Red Nacional de Observatorios Anticorrupción: plenarias 2025 y 2026',
  fecha: '2026-07-09',
  portada: 'renoba-plenaria-2026-07-09.png',
  sesiones: [
    { anio: 2026, fecha: '2026-07-09', texto: '9 de julio de 2026', nombre: 'Segunda plenaria del año 2026', pdf: 'ayuda-de-memoria-plenaria-renoba-2026-07-09.pdf', foto: 'renoba-plenaria-2026-07-09.png' },
    { anio: 2026, fecha: '2026-04-29', texto: '29 de abril de 2026', nombre: 'Primera plenaria del año 2026', pdf: 'ayuda-de-memoria-plenaria-renoba-2026-04-29.pdf', foto: 'renoba-plenaria-2026-04-29.png' },
    { anio: 2025, fecha: '2025-11-20', texto: '20 de noviembre de 2025', nombre: 'Cuarta plenaria', pdf: 'ayuda-de-memoria-plenaria-renoba-2025-11-20.pdf', foto: 'renoba-plenaria-2025-11-20.png',
      enlace: { rotulo: 'Comunicado de prensa de esta sesión', slug: 'participacion-del-observatorio-anticorrupcion-de-la-agencia-itrc-en-la-sesion' } },
    { anio: 2025, fecha: '2025-09-25', texto: '25 de septiembre de 2025', nombre: 'Tercera plenaria', pdf: 'ayuda-de-memoria-plenaria-renoba-2025-09-25.pdf' },
    { anio: 2025, fecha: '2025-06-25', texto: '25 de junio de 2025', nombre: 'Segunda sesión', pdf: 'ayuda-de-memoria-plenaria-renoba-2025-06-25.pdf' },
  ],
  tarjeta: {
    titulo: 'RENOBA',
    descripcion: 'Plenarias de la Red Nacional de Observatorios Anticorrupción',
    icon: 'fa-network-wired',
    color: 'teal',
  },
};

// los siete comunicados que van a «Noticias»: los seis de 2025 (ya son memorias) y el de 2026
const COMUNICADOS = [
  CYBERCHAT.slug,
  'participacion-del-observatorio-anticorrupcion-de-la-agencia-itrc-en-la-sesion',
  'el-observatorio-de-la-itrc-asistio-a-la-rendicion-de-cuentas-de-apc-colombia',
  'funcionarios-y-contratistas-de-la-itrc-participaron-en-capacitacion-sobre-linea',
  'la-itrc-participa-en-mesa-tecnica-interinstitucional-para-identificar-riesgos',
  'la-itrc-participo-en-el-lanzamiento-de-la-campana-ciberseguridad-en-nuestras',
  'decreto-1600',
];

// ── Utilidades ───────────────────────────────────────────────────────────────────────────────
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fechaLarga = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} de ${MESES[m - 1]} de ${y}`; };
const sinIds = (o) => Array.isArray(o) ? o.map(sinIds)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'id').map(([k, v]) => [k, sinIds(v)])) : o;
// texto de relleno de Elementor que quedó dentro del contenido de alguna memoria importada
const BASURA = /Tienes que añadir un widget/;
const resumenDe = (md, max = 250) => {
  const p = md.split(/\n\s*\n/).map((s) => s.replace(/[*_#>`]|!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim()).find((s) => s.length > 40 && !BASURA.test(s)) ?? '';
  if (p.length <= max) return p;
  const corte = p.slice(0, max); return `${corte.slice(0, corte.lastIndexOf(' '))}…`;
};

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const HJ = { ...H, 'Content-Type': 'application/json' };
const CM = (uid, kind) => `${BASE}/content-manager/${kind}/${uid}`;

async function guardarMemoria(m) {
  const lista = (await j(await fetch(`${CM(UID_MEMORIA, 'collection-types')}?${new URLSearchParams({ 'filters[slug][$eq]': m.slug, pageSize: '1' })}`, { headers: H }))).results ?? [];
  const datos = { titulo: m.titulo, slug: m.slug, fecha: m.fecha, resumen: m.resumen, contenido: m.contenido, imagenDestacada: m.imagenDestacada, galeria: [] };
  if (SECO) { console.log(`  (seco) memoria «${m.slug}»: ${lista.length ? 'existe, se actualizaría' : 'se crearía'}`); return; }
  let doc;
  if (lista.length) {
    doc = lista[0].documentId;
    await j(await fetch(`${CM(UID_MEMORIA, 'collection-types')}/${doc}`, { method: 'PUT', headers: HJ, body: JSON.stringify(datos) }));
  } else {
    doc = (await j(await fetch(CM(UID_MEMORIA, 'collection-types'), { method: 'POST', headers: HJ, body: JSON.stringify(datos) }))).data.documentId;
  }
  await j(await fetch(`${CM(UID_MEMORIA, 'collection-types')}/${doc}/actions/publish`, { method: 'POST', headers: H }));
  console.log(`  ✓ memoria ${lista.length ? 'actualizada' : 'creada'} y publicada: ${m.slug}`);
}

async function leerUnico(uid) { return (await j(await fetch(CM(uid, 'single-types'), { headers: H }))).data; }
async function guardarUnico(uid, datos) {
  if (SECO) return;
  const limpio = sinIds(Object.fromEntries(Object.entries(datos).filter(([k]) => !['documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'locale', 'localizations', 'status'].includes(k))));
  await j(await fetch(CM(uid, 'single-types'), { method: 'PUT', headers: HJ, body: JSON.stringify(limpio) }));
  await j(await fetch(`${CM(uid, 'single-types')}/actions/publish`, { method: 'POST', headers: H }));
}

// ── 1. Memoria del comunicado de 2026 ───────────────────────────────────────────────────────
console.log('\n1. Comunicado CyberChat4All-11 (2026)');
const imgCyber = `${RUTA_IMG}/${CYBERCHAT.imagen.archivo.replace(/\.png$/, '.webp')}`;
if (!fs.existsSync(enArbol(imgCyber))) console.log(`  ⚠ falta la imagen en el árbol de trabajo local: ${imgCyber}`);
const contenidoCyber = CYBERCHAT.parrafos.join('\n\n');
await guardarMemoria({ ...CYBERCHAT, resumen: resumenDe(contenidoCyber), contenido: contenidoCyber, imagenDestacada: imgCyber });

// ── 2. Su entrada en el listado de Memorias ─────────────────────────────────────────────────
console.log('\n2. Listado de Memorias: enlazar la entrada de 2026');
const info = await leerUnico(UID_MEMORIAS_INFO);
const urlCyber = `${RUTA_MEMORIAS}/${CYBERCHAT.slug}`;
const anio26 = info.anios.find((a) => a.anio === '2026');
const entrada = anio26?.entradas.find((e) => /CyberChat4All/i.test(e.titulo));
if (!entrada) console.log('  ✗ no encuentro la entrada de CyberChat en 2026: no se toca');
else if (entrada.url === urlCyber) console.log('  · ya está enlazada');
else {
  console.log(`  entrada «${entrada.titulo.slice(0, 60)}…»: url «${entrada.url}» → ${urlCyber}`);
  entrada.url = urlCyber; entrada.imagen = imgCyber;
  await guardarUnico(UID_MEMORIAS_INFO, info); if (!SECO) console.log('  ✓ guardado y publicado');
}

// ── 3. Página de RENOBA (memoria) ───────────────────────────────────────────────────────────
console.log('\n3. Página «RENOBA» (plenarias 2025 y 2026)');
const urlsFoto = {};
for (const s of RENOBA.sesiones.filter((x) => x.foto)) {
  urlsFoto[s.foto] = `${RUTA_IMG}/${s.foto.replace(/\.png$/, '.webp')}`;
  if (!fs.existsSync(enArbol(urlsFoto[s.foto]))) console.log(`  ⚠ falta la imagen en el árbol de trabajo local: ${urlsFoto[s.foto]}`);
}
for (const s of RENOBA.sesiones) {
  if (!fs.existsSync(enArbol(`${RUTA_DOCS}/${s.pdf}`))) console.log(`  ⚠ falta el PDF en el árbol de trabajo local: ${s.pdf}`);
}
const md = [
  'Ayudas de memoria de las sesiones plenarias de la Red Nacional de Observatorios Anticorrupción – RENOBA, vigencias 2025 y 2026.',
];
let anioActual = null;
for (const s of RENOBA.sesiones) {
  if (s.anio !== anioActual) { anioActual = s.anio; md.push(`## Vigencia ${s.anio}`); }
  md.push(`### Sesión del ${s.texto}`);
  md.push(`${s.nombre} de la Red Nacional de Observatorios Anticorrupción – RENOBA.`);
  // párrafos y no viñetas: el renderizador de memorias no convierte enlaces dentro de una lista
  md.push(`[Ayuda de memoria — plenaria del ${s.texto} (PDF)](${RUTA_DOCS}/${s.pdf})`);
  if (s.enlace) md.push(`[${s.enlace.rotulo}](${RUTA_MEMORIAS}/${s.enlace.slug})`);
  if (s.foto) md.push(`![Captura de la ${s.nombre.toLowerCase()} de RENOBA del ${s.texto}.](${urlsFoto[s.foto]})`);
}
const contenidoRenoba = md.join('\n\n');
await guardarMemoria({
  slug: RENOBA.slug, titulo: RENOBA.titulo, fecha: RENOBA.fecha,
  resumen: 'Ayudas de memoria de las sesiones plenarias de la Red Nacional de Observatorios Anticorrupción – RENOBA, vigencias 2025 y 2026.',
  contenido: contenidoRenoba, imagenDestacada: urlsFoto[RENOBA.portada],
});

// ── 4. Tarjeta «RENOBA» en el Eje de Participación ─────────────────────────────────────────
console.log('\n4. Eje de Participación: tarjeta RENOBA');
const eje = await leerUnico(UID_EJE);
const urlRenoba = `${RUTA_MEMORIAS}/${RENOBA.slug}`;
if (eje.secciones.some((s) => s.url === urlRenoba)) console.log('  · ya existe');
else {
  // va justo antes de CIPREP, que cierra la lista
  const i = eje.secciones.findIndex((s) => /ciprep/i.test(s.titulo));
  eje.secciones.splice(i === -1 ? eje.secciones.length : i, 0, { ...RENOBA.tarjeta, url: urlRenoba });
  console.log(`  se añade la tarjeta en la posición ${i === -1 ? eje.secciones.length - 1 : i} de ${eje.secciones.length}`);
  await guardarUnico(UID_EJE, eje); if (!SECO) console.log('  ✓ guardado y publicado');
}

// ── 5. Noticias del Observatorio ────────────────────────────────────────────────────────────
console.log('\n5. Noticias del Observatorio: los siete comunicados');
const noticias = await leerUnico(UID_NOTICIAS);
const existentes = new Set(noticias.noticias.map((n) => n.slug));
// Las fotos heredadas del WordPress están guardadas como https://www.itrc.gov.co/observatorio/wp-content/uploads/…,
// que nginx no sirve (404); el mismo archivo responde en /uploads/AAAA/MM/…
const rutaQueFunciona = (u = '') => u.replace(/^https?:\/\/www\.itrc\.gov\.co\/observatorio\/wp-content\/uploads\//, '/uploads/');
let corregidas = 0;
for (const n of noticias.noticias) {
  if (!COMUNICADOS.includes(n.slug)) continue;
  if (rutaQueFunciona(n.imagen) !== n.imagen) { n.imagen = rutaQueFunciona(n.imagen); corregidas++; }
  if (BASURA.test(n.resumen ?? '')) {
    const r = (await j(await fetch(`${BASE}/api/observatorio-eje-de-participacion-memorias?${new URLSearchParams({ 'filters[slug][$eq]': n.slug, 'pagination[pageSize]': '1' })}`))).data?.[0];
    if (r) { n.resumen = resumenDe(r.contenido ?? ''); corregidas++; }
  }
}
const porUrl = new Map(info.anios.flatMap((a) => a.entradas).filter((e) => e.url).map((e) => [e.url, e]));
const nuevas = [];
for (const slug of COMUNICADOS) {
  if (existentes.has(slug)) { console.log(`  · ya está: ${slug}`); continue; }
  const r = (await j(await fetch(`${BASE}/api/observatorio-eje-de-participacion-memorias?${new URLSearchParams({ 'filters[slug][$eq]': slug, 'pagination[pageSize]': '1' })}`))).data?.[0];
  const m = r ?? (slug === CYBERCHAT.slug ? { ...CYBERCHAT, contenido: contenidoCyber, imagenDestacada: imgCyber } : null);
  if (!m) { console.log(`  ✗ no existe la memoria ${slug}: se omite`); continue; }
  const entradaLista = porUrl.get(`${RUTA_MEMORIAS}/${slug}`);
  nuevas.push({
    slug,
    fechaIso: m.fecha,
    fecha: fechaLarga(m.fecha),
    titulo: (entradaLista?.titulo ?? m.titulo).replace(/&#8211;/g, '–'),
    imagen: rutaQueFunciona(m.imagenDestacada || entradaLista?.imagen || ''),
    resumen: resumenDe(m.contenido ?? ''),
    descripcion: '',
  });
}
nuevas.sort((a, b) => b.fechaIso.localeCompare(a.fechaIso));
for (const n of nuevas) console.log(`  + ${n.fechaIso} · ${n.titulo.slice(0, 80)}`);
if (nuevas.length || corregidas) {
  noticias.noticias = [...nuevas, ...noticias.noticias];
  await guardarUnico(UID_NOTICIAS, noticias); if (!SECO) console.log(`  ✓ guardado y publicado: ${noticias.noticias.length} noticias${corregidas ? ` (${corregidas} campos corregidos en tarjetas nuevas)` : ''}`);
}

console.log(SECO ? '\n(en seco: no se guardó nada)' : '\nListo. Falta recompilar el sitio.');
process.exit(0);
