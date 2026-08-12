#!/usr/bin/env node
/**
 * migrar-noticias.mjs — Lleva las noticias de src/content/news/*.md al CMS.
 *
 * Hasta ahora cada noticia era un archivo de texto en el repositorio: para
 * publicar una había que editar código y desplegar. Este script las pasa al
 * panel, donde la redacción puede crearlas sin ayuda técnica.
 *
 * Conserva la dirección de cada noticia (el nombre del archivo pasa a ser el
 * `slug`), así que ningún enlace publicado se rompe.
 *
 * Uso:
 *   node cms-strapi/scripts/migrar-noticias.mjs --revisar    # no escribe nada
 *   node cms-strapi/scripts/migrar-noticias.mjs              # migra
 *
 * Variables (mismo esquema que migrate-all.mjs):
 *   STRAPI_URL       por defecto http://localhost:1337
 *   STRAPI_EMAIL     correo del administrador
 *   STRAPI_PASSWORD  su contraseña
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '../..');
const DIR_NOTICIAS = path.join(RAIZ, 'src/content/news');

const STRAPI = process.env.STRAPI_URL || 'http://localhost:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SOLO_REVISAR = process.argv.includes('--revisar');
const UID = 'api::noticia.noticia';
let token = '';

/** Separa el encabezado YAML del cuerpo del archivo. */
function partir(texto) {
  const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { frontmatter: {}, cuerpo: texto };
  return { frontmatter: leerYamlPlano(m[1]), cuerpo: m[2].trim() };
}

/**
 * Lector de YAML del subconjunto que usan estos archivos: `clave: valor`,
 * comillas opcionales y listas en línea. No hay anidamiento en ninguno.
 */
function leerYamlPlano(yaml) {
  const datos = {};
  for (const linea of yaml.split(/\r?\n/)) {
    const m = linea.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    const clave = m[1];
    let valor = m[2].trim();
    if (valor.startsWith('[') && valor.endsWith(']')) {
      valor = valor
        .slice(1, -1)
        .split(',')
        .map((x) => x.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      valor = valor.replace(/^["']|["']$/g, '');
      if (valor === 'true') valor = true;
      else if (valor === 'false') valor = false;
    }
    datos[clave] = valor;
  }
  return datos;
}

function leerNoticias() {
  return fs
    .readdirSync(DIR_NOTICIAS)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((archivo) => {
      const { frontmatter, cuerpo } = partir(
        fs.readFileSync(path.join(DIR_NOTICIAS, archivo), 'utf8')
      );
      return {
        archivo,
        slug: archivo.replace(/\.md$/, ''),
        titulo: frontmatter.title || '',
        fecha: frontmatter.date || '',
        resumen: frontmatter.excerpt || '',
        imagen: frontmatter.image || null,
        categoria: frontmatter.categoria === 'periodico' ? 'periodico' : 'noticia',
        borrador: frontmatter.draft === true,
        archivada: frontmatter.archived === true,
        contenido: cuerpo,
      };
    });
}

async function pedir(ruta, opciones = {}) {
  const r = await fetch(`${STRAPI}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opciones.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`${opciones.method || 'GET'} ${ruta} → ${r.status} ${await r.text()}`);
  return r.json();
}

/** Inicia sesión como administrador, igual que migrate-all.mjs. */
async function entrar() {
  const r = await fetch(`${STRAPI}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`no se pudo entrar como administrador: ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

const noticias = leerNoticias();

if (SOLO_REVISAR) {
  const sinResumen = noticias.filter((n) => !n.resumen);
  const sinImagen = noticias.filter((n) => !n.imagen);
  const conHtml = noticias.filter((n) => /<(div|iframe|script|style)\b/i.test(n.contenido));
  const largoMax = Math.max(...noticias.map((n) => n.contenido.length));

  console.log(`Noticias encontradas: ${noticias.length}`);
  console.log(`  borradores:        ${noticias.filter((n) => n.borrador).length}`);
  console.log(`  archivadas:        ${noticias.filter((n) => n.archivada).length}`);
  console.log(`  categoría periódico: ${noticias.filter((n) => n.categoria === 'periodico').length}`);
  console.log(`  sin resumen:       ${sinResumen.length}`);
  console.log(`  sin imagen (usan la institucional): ${sinImagen.length}`);
  console.log(`  con HTML incrustado: ${conHtml.length}${conHtml.length ? ' → ' + conHtml.map((n) => n.slug).join(', ') : ''}`);
  console.log(`  cuerpo más largo:  ${largoMax} caracteres`);

  const sinTitulo = noticias.filter((n) => !n.titulo);
  const sinFecha = noticias.filter((n) => !n.fecha);
  if (sinTitulo.length) console.log(`  ⚠ SIN TÍTULO: ${sinTitulo.map((n) => n.archivo).join(', ')}`);
  if (sinFecha.length) console.log(`  ⚠ SIN FECHA: ${sinFecha.map((n) => n.archivo).join(', ')}`);

  const repetidos = noticias.map((n) => n.slug).filter((s, i, a) => a.indexOf(s) !== i);
  if (repetidos.length) console.log(`  ⚠ SLUGS REPETIDOS: ${repetidos.join(', ')}`);

  console.log('\nPrimeras 3, tal como quedarían:');
  for (const n of noticias.slice(-3)) {
    console.log(`  · ${n.titulo.slice(0, 70)}`);
    console.log(`    slug=${n.slug}  fecha=${n.fecha}  imagen=${n.imagen || '(institucional)'}`);
  }
  process.exit(0);
}

if (!EMAIL || !PASSWORD) {
  console.error('ERROR: faltan STRAPI_EMAIL y STRAPI_PASSWORD del administrador.');
  process.exit(1);
}
token = await entrar();
console.log(`Sesión iniciada en ${STRAPI}`);

/**
 * Sube una imagen de public/images al CMS y devuelve su id. Reutiliza la que
 * ya esté subida (varias noticias comparten la misma portada).
 */
const subidas = new Map();
async function subirImagen(rutaPublica) {
  if (subidas.has(rutaPublica)) return subidas.get(rutaPublica);

  // Las que apuntaban al SVG institucional se quedan sin imagen: el sitio ya
  // pone ese marcador solo. Además el CMS no admite SVG, por seguridad.
  if (rutaPublica.toLowerCase().endsWith('.svg')) {
    subidas.set(rutaPublica, null);
    return null;
  }

  const archivo = path.join(RAIZ, 'public', rutaPublica.replace(/^\//, ''));
  if (!fs.existsSync(archivo)) {
    console.log(`  ⚠ no existe la imagen ${rutaPublica}`);
    subidas.set(rutaPublica, null);
    return null;
  }
  const nombre = path.basename(archivo);

  // Si ya está en la biblioteca por una corrida anterior, se reutiliza.
  const yaEsta = await pedir(`/upload/files?filters[name][$eq]=${encodeURIComponent(nombre)}`).catch(() => []);
  const previas = Array.isArray(yaEsta) ? yaEsta : yaEsta?.results || [];
  if (previas.length) {
    subidas.set(rutaPublica, previas[0].id);
    return previas[0].id;
  }

  const tipos = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' };
  const form = new FormData();
  form.append(
    'files',
    new Blob([fs.readFileSync(archivo)], { type: tipos[path.extname(archivo).toLowerCase()] || 'application/octet-stream' }),
    nombre
  );
  const r = await fetch(`${STRAPI}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!r.ok) throw new Error(`subida de ${nombre} → ${r.status} ${await r.text()}`);
  const [subida] = await r.json();
  subidas.set(rutaPublica, subida.id);
  return subida.id;
}

const existentes = new Map();
{
  let pagina = 1;
  for (;;) {
    const r = await pedir(`/content-manager/collection-types/${UID}?page=${pagina}&pageSize=100`);
    for (const d of r.results || []) existentes.set(d.slug, d.documentId);
    if (!r.pagination || pagina >= r.pagination.pageCount) break;
    pagina++;
  }
}
console.log(`Ya en el CMS: ${existentes.size}`);

let creadas = 0;
let saltadas = 0;
for (const n of noticias) {
  if (existentes.has(n.slug)) {
    saltadas++;
    continue;
  }
  const idImagen = n.imagen ? await subirImagen(n.imagen) : null;
  const cuerpo = {
    data: {
      titulo: n.titulo,
      slug: n.slug,
      fecha: n.fecha,
      resumen: n.resumen,
      contenido: n.contenido,
      categoria: n.categoria,
      ...(idImagen ? { imagen: idImagen } : {}),
    },
  };
  const creada = await pedir(`/content-manager/collection-types/${UID}`, {
    method: 'POST',
    body: JSON.stringify(cuerpo.data),
  });
  // Las que no eran borrador quedan publicadas, como estaban en el sitio.
  if (!n.borrador && !n.archivada) {
    await pedir(`/content-manager/collection-types/${UID}/${creada.data.documentId}/actions/publish`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }
  creadas++;
  if (creadas % 10 === 0) console.log(`  ${creadas} creadas...`);
}

console.log(`\n✓ ${creadas} creadas, ${saltadas} ya existían.`);
console.log('  Las imágenes se enlazan aparte: los archivos siguen en /images del sitio.');
