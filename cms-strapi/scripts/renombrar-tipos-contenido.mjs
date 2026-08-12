#!/usr/bin/env node
/**
 * renombrar-tipos-contenido.mjs — Deja los nombres de los tipos de contenido
 * en lenguaje natural, sin prefijos numéricos ni barras.
 *
 * Los nombres llevaban el camino completo delante —"06. Transparencia /
 * Informes Empalme"— porque el Content Manager los lista en plano y era la
 * única forma de agruparlos visualmente. Esa función la cumple ahora el panel
 * "Contenido del sitio", así que el prefijo solo estorba: en la lista se lee
 * la numeración antes que el nombre.
 *
 * Deja el último tramo del nombre, que es el que identifica la página.
 *
 * Solo cambia `info.displayName`, que es la etiqueta que se ve. **No toca**
 * `singularName`, `pluralName` ni `collectionName`, de los que dependen la API,
 * las tablas de la base de datos y los enlaces del panel.
 *
 * Uso:
 *   node cms-strapi/scripts/renombrar-tipos-contenido.mjs --revisar
 *   node cms-strapi/scripts/renombrar-tipos-contenido.mjs
 *
 * Después hay que regenerar el árbol del panel:
 *   node cms-strapi/scripts/gen-nav-tree.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIR_API = path.join(AQUI, '../src/api');
const SOLO_REVISAR = process.argv.includes('--revisar');

/**
 * Diez tipos quedarían con el mismo nombre que otro al quitar el prefijo.
 * Se les da uno propio para poder distinguirlos en la lista.
 */
const NOMBRES_PROPIOS = {
  'agencia-landing': 'Agencia (portada)',
  'atencion-landing': 'Atención y Servicios (portada)',
  'normativa-landing': 'Normativa (portada)',
  'prensa-landing': 'Prensa (portada)',
  participa: 'Participa (portada)',
  transparencia: 'Transparencia (portada)',
  'prensa-galeria': 'Galería',
  galeria: 'Álbumes de la galería',
  'observatorio-eje-de-educacion-memoria': 'Memorias de Educación',
  'observatorio-eje-de-participacion-memoria': 'Memorias de Participación',
};

/** "06. Transparencia / Informes Empalme" → "Informes Empalme" */
function nombreNatural(displayName) {
  const partes = displayName.split('/').map((p) => p.trim());
  const ultimo = partes[partes.length - 1];
  return ultimo.replace(/^\d+\.\s*/, '');
}

const cambios = [];
for (const dir of fs.readdirSync(DIR_API)) {
  const base = path.join(DIR_API, dir, 'content-types');
  if (!fs.existsSync(base)) continue;

  for (const sub of fs.readdirSync(base)) {
    const archivo = path.join(base, sub, 'schema.json');
    if (!fs.existsSync(archivo)) continue;

    const esquema = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    const slug = esquema.info?.singularName || sub;
    const antes = esquema.info?.displayName || '';
    const despues = NOMBRES_PROPIOS[slug] || nombreNatural(antes);

    if (antes === despues) continue;
    cambios.push({ archivo, slug, antes, despues, esquema });
  }
}

if (SOLO_REVISAR) {
  console.log(`Se renombrarían ${cambios.length} tipos de contenido:\n`);
  for (const c of cambios) {
    const marca = NOMBRES_PROPIOS[c.slug] ? ' *' : '';
    console.log(`  ${c.antes}`);
    console.log(`      → ${c.despues}${marca}`);
  }
  console.log('\n  * nombre propio, para no repetirse con otro');
  process.exit(0);
}

for (const c of cambios) {
  c.esquema.info.displayName = c.despues;
  fs.writeFileSync(c.archivo, `${JSON.stringify(c.esquema, null, 2)}\n`, 'utf8');
}

console.log(`✓ ${cambios.length} tipos renombrados.`);
console.log('  Siguiente paso: node cms-strapi/scripts/gen-nav-tree.mjs');
