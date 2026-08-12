#!/usr/bin/env node
/**
 * gen-nav-tree.mjs — Construye el árbol de dos niveles que ordena el panel
 * "Contenido del sitio" del admin.
 *
 * El Content Manager de Strapi lista los 150+ tipos de contenido en una sola
 * lista plana. Este script agrupa esa lista igual que el menú de navegación
 * del sitio, para que quien edita busque el contenido donde lo ve publicado y
 * no donde Strapi lo guarda.
 *
 * Fuentes (en orden de prioridad al clasificar):
 *   1. nav-tree-grupos.json                  → curación a mano; manda sobre todo
 *   2. src/content/settings/navigation.json  → menú principal y submenús
 *   3. El prefijo del displayName            → red de seguridad
 *
 * El cruce se hace por URL pública, tomada de slug-to-url.json.
 *
 * Salida: cms-strapi/src/admin/nav-tree.json
 *
 * Uso:
 *   node cms-strapi/scripts/gen-nav-tree.mjs           # genera
 *   node cms-strapi/scripts/gen-nav-tree.mjs --revisar # solo imprime el árbol
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '../..');

const DIR_API = path.join(RAIZ, 'cms-strapi/src/api');
const SLUG_A_URL = path.join(RAIZ, 'cms-strapi/src/admin/slug-to-url.json');
const NAVEGACION = path.join(RAIZ, 'src/content/settings/navigation.json');
const GRUPOS = path.join(AQUI, 'nav-tree-grupos.json');
const SALIDA = path.join(RAIZ, 'cms-strapi/src/admin/nav-tree.json');

/**
 * Páginas servidas por una ruta dinámica de Astro. El generador de
 * slug-to-url.json solo detecta el `strapiSlug` de las páginas estáticas, así
 * que estas hay que declararlas.
 */
const URLS_RUTAS_DINAMICAS = {
  // Cada noticia vive en /prensa/noticias/<su-slug>; esta es su página índice.
  noticia: '/prensa/noticias',
  'agencia-direccionamiento-informes': '/agencia/direccionamiento-estrategico/informes',
  'agencia-direccionamiento-planes': '/agencia/direccionamiento-estrategico/planes',
  'agencia-direccionamiento-politicas': '/agencia/direccionamiento-estrategico/politicas',
};

const leerJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

/** Rama a la que van los tipos de contenido que no cuelgan del menú principal. */
const RAMA_HUERFANOS = 'Mapa del sitio';

/** Ramas que van al final del primer selector, después de las del menú. */
const RAMAS_AL_FINAL = [RAMA_HUERFANOS, 'Configuración del sitio'];

// ---------------------------------------------------------------------------
// 1. Inventario de tipos de contenido
// ---------------------------------------------------------------------------

function leerTiposDeContenido() {
  const tipos = [];
  for (const dir of fs.readdirSync(DIR_API)) {
    const base = path.join(DIR_API, dir, 'content-types');
    if (!fs.existsSync(base)) continue;
    for (const sub of fs.readdirSync(base)) {
      const archivo = path.join(base, sub, 'schema.json');
      if (!fs.existsSync(archivo)) continue;
      const esquema = leerJson(archivo);
      const nombre = esquema.info?.singularName || sub;
      tipos.push({
        uid: `api::${nombre}.${nombre}`,
        slug: nombre,
        kind: esquema.kind === 'collectionType' ? 'collection' : 'single',
        displayName: esquema.info?.displayName || nombre,
      });
    }
  }
  return tipos.sort((a, b) => a.displayName.localeCompare(b.displayName, 'es'));
}

/** "06. Transparencia / Informes Empalme" → { rama: "Transparencia", hoja: "Informes Empalme" } */
function partirDisplayName(displayName) {
  const partes = displayName.split('/').map((p) => p.trim());
  const cabeza = partes[0].replace(/^\d+\.\s*/, '');
  const hoja = partes.length > 1 ? partes.slice(1).join(' / ') : cabeza;
  return { rama: cabeza, hoja };
}

// ---------------------------------------------------------------------------
// 2. Índices de clasificación
// ---------------------------------------------------------------------------

/** URL → { rama, grupo } a partir del menú de navegación. */
function indiceDelMenu(navegacion) {
  const indice = new Map();
  const ramas = [];
  for (const principal of navegacion.mainMenu || []) {
    ramas.push({ label: principal.label, url: principal.url });
    if (principal.url && !principal.external) {
      indice.set(normalizar(principal.url), { rama: principal.label, grupo: null });
    }
    for (const hijo of principal.children || []) {
      if (!hijo.url || hijo.external) continue;
      indice.set(normalizar(hijo.url), { rama: principal.label, grupo: hijo.label });
    }
  }
  return { indice, ramas };
}

const normalizar = (url) => (url || '').replace(/\/+$/, '') || '/';

/** El eje del Observatorio va en el slug: observatorio-eje-de-educacion-* */
function ejeDelObservatorio(slug) {
  const m = slug.match(/^observatorio-eje-de-([a-z]+)/);
  if (!m) return 'General';
  const nombres = { educacion: 'Eje de Educación', medicion: 'Eje de Medición', participacion: 'Eje de Participación' };
  return nombres[m[1]] || `Eje de ${m[1]}`;
}

// ---------------------------------------------------------------------------
// 3. Clasificación
// ---------------------------------------------------------------------------

function clasificar() {
  const tipos = leerTiposDeContenido();
  const slugAUrl = { ...leerJson(SLUG_A_URL), ...URLS_RUTAS_DINAMICAS };
  const navegacion = leerJson(NAVEGACION);
  const curado = leerJson(GRUPOS).asignaciones || {};

  const { indice: porMenu, ramas } = indiceDelMenu(navegacion);

  /** Busca el enlace del menú más específico que sea prefijo de la URL. */
  const ramaPorPrefijo = (url) => {
    let mejor = null;
    for (const [ruta, destino] of porMenu) {
      if (ruta === '/' ) continue;
      if (url === ruta || url.startsWith(`${ruta}/`)) {
        if (!mejor || ruta.length > mejor.ruta.length) mejor = { ruta, destino };
      }
    }
    return mejor?.destino || null;
  };

  const sinUbicar = [];

  for (const tipo of tipos) {
    const url = slugAUrl[tipo.slug] ? normalizar(slugAUrl[tipo.slug]) : null;
    const { rama: ramaNombre, hoja } = partirDisplayName(tipo.displayName);
    tipo.url = url;
    tipo.label = hoja;

    // (a) La curación a mano manda sobre cualquier deducción.
    if (curado[tipo.slug]) {
      const [rama, grupo] = curado[tipo.slug];
      tipo.rama = rama;
      tipo.grupo = grupo;
      continue;
    }

    // (b) El menú de navegación, del enlace más específico al más general.
    const delMenu = url ? porMenu.get(url) || ramaPorPrefijo(url) : null;
    if (delMenu) {
      tipo.rama = delMenu.rama;
      tipo.grupo = delMenu.grupo || 'Página principal';
      continue;
    }

    // (c) Red de seguridad: el prefijo del nombre.
    if (ramaNombre === 'Institucional' || ramaNombre === 'Sistema') {
      tipo.rama = RAMA_HUERFANOS;
      tipo.grupo = tipo.kind === 'collection' ? 'Listados' : 'Páginas sueltas';
    } else {
      tipo.rama = ramaNombre;
      tipo.grupo = tipo.kind === 'collection' ? 'Listados' : 'Otras páginas';
      if (!url) sinUbicar.push(tipo);
    }
  }

  // El Observatorio se subdivide por ejes: 23 de sus 25 tipos son de un eje.
  for (const tipo of tipos) {
    if (tipo.slug.startsWith('observatorio-') && !curado[tipo.slug]) {
      tipo.rama = 'Observatorio ITRC';
      tipo.grupo = ejeDelObservatorio(tipo.slug);
    }
  }

  return { tipos, ramas, sinUbicar };
}

// ---------------------------------------------------------------------------
// 4. Armado del árbol
// ---------------------------------------------------------------------------

function armarArbol({ tipos, ramas }) {
  const porRama = new Map();
  for (const tipo of tipos) {
    if (!porRama.has(tipo.rama)) porRama.set(tipo.rama, new Map());
    const grupos = porRama.get(tipo.rama);
    if (!grupos.has(tipo.grupo)) grupos.set(tipo.grupo, []);
    grupos.get(tipo.grupo).push(tipo);
  }

  // Orden de las ramas: el del menú del sitio; los huérfanos, al final.
  const ordenMenu = ramas.map((r) => r.label);
  const nombresRama = [...porRama.keys()].sort((a, b) => {
    const fa = RAMAS_AL_FINAL.indexOf(a);
    const fb = RAMAS_AL_FINAL.indexOf(b);
    if (fa !== -1 || fb !== -1) {
      if (fa !== -1 && fb !== -1) return fa - fb;
      return fa !== -1 ? 1 : -1;
    }
    const ia = ordenMenu.indexOf(a);
    const ib = ordenMenu.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b, 'es');
  });

  return nombresRama.map((nombre) => {
    const grupos = porRama.get(nombre);
    const url = ramas.find((r) => r.label === nombre)?.url || null;
    const nombresGrupo = [...grupos.keys()].sort((a, b) => {
      // Las secciones de transparencia van por su número, no alfabéticas.
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      if (a === 'Página principal') return -1;
      if (b === 'Página principal') return 1;
      return a.localeCompare(b, 'es');
    });
    return {
      label: nombre,
      url,
      grupos: nombresGrupo.map((g) => ({
        label: g,
        items: grupos.get(g)
          .map(({ uid, slug, kind, label, url: u }) => ({ uid, slug, kind, label, url: u }))
          .sort((a, b) => a.label.localeCompare(b.label, 'es')),
      })),
    };
  });
}

// ---------------------------------------------------------------------------

const datos = clasificar();
const arbol = armarArbol(datos);

const total = arbol.reduce((n, r) => n + r.grupos.reduce((m, g) => m + g.items.length, 0), 0);

if (process.argv.includes('--revisar')) {
  for (const rama of arbol) {
    const n = rama.grupos.reduce((m, g) => m + g.items.length, 0);
    console.log(`\n■ ${rama.label}  [${n}]`);
    for (const grupo of rama.grupos) {
      console.log(`    ${grupo.label}  (${grupo.items.length})`);
      for (const item of grupo.items) {
        const marca = item.kind === 'collection' ? '≡' : '·';
        console.log(`        ${marca} ${item.label}${item.url ? '' : '   [sin página pública]'}`);
      }
    }
  }
  console.log(`\nTotal: ${total} tipos de contenido en ${arbol.length} ramas.`);
} else {
  fs.writeFileSync(SALIDA, `${JSON.stringify({ ramas: arbol }, null, 2)}\n`, 'utf8');
  console.log(`✓ ${path.relative(RAIZ, SALIDA)} — ${total} tipos en ${arbol.length} ramas`);
}
