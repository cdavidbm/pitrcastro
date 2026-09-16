#!/usr/bin/env node
/**
 * sync-preguntas-denuncias.mjs — Pone en el panel, para revisar su redacción,
 * las preguntas sobre los hechos del formulario de denuncias.
 *
 * Las preguntas NO se inventan aquí: las define el sistema que recibe las
 * denuncias. Este guion las lee de ese sistema —con el mismo lector que usa el
 * formulario en el navegador, para que los textos coincidan al carácter— y crea
 * UNA entrada por pregunta, no una por casilla.
 *
 * Las doce conductas comparten la mayoría de las preguntas: "¿Cuál(es)?"
 * aparece cuarenta veces, y el bloque de "¿Conoce el cargo…?" está en las doce.
 * Escrito, eso sí, de hasta nueve maneras distintas: con el número pegado o
 * separado, en minúscula, sin el signo de apertura. Agrupadas, se corrigen una
 * sola vez y quedan corregidas en todas.
 *
 * Para poder agruparlas se separa el NÚMERO de la FRASE. El número es
 * posicional —la misma pregunta es la 8 en Cohecho y la 14 en Peculado— así que
 * cada aparición conserva el suyo y lo que se edita es solo la frase.
 *
 * Las preguntas de detalle ("¿Cuál?", "¿Por qué?", "Precise su respuesta") no
 * se agrupan por su texto, que no dice nada por sí solo, sino por la pregunta
 * de la que dependen: hay cuatro "¿Cuál(es)?" distintos y cada uno pregunta por
 * algo diferente. Así, además, las tres maneras de escribir el mismo detalle
 * ("¿Cual?", "¿Cuales?", "¿Cuál(es)?") quedan en una sola entrada.
 *
 *   texto        la frase, tal como la lee el ciudadano  ← esto es lo que se corrige
 *   original     la frase tal como la pregunta el sistema que recibe
 *   detalleDe    la pregunta de la que cuelga, si es un detalle
 *   apariciones  cada conducta donde se hace, con su número y su texto original
 *
 * La corrección se aplica aparición por aparición, y solo mientras el texto
 * original de esa aparición siga siendo el del sistema que recibe. Si ese
 * equipo cambia una de las doce, solo esa vuelve a su texto; las otras once
 * siguen corregidas.
 *
 * Uso:
 *   STRAPI_EMAIL=... STRAPI_PASSWORD=... node cms-strapi/scripts/sync-preguntas-denuncias.mjs
 *   ... --revisar     # muestra qué haría, sin escribir nada
 *   ORIGEN=https://www.itrc.gov.co  (por defecto)
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMParser, Node, NodeFilter } from 'linkedom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const ORIGEN = (process.env.ORIGEN || 'https://www.itrc.gov.co').replace(/\/$/, '');
const SOLO_REVISAR = process.argv.includes('--revisar');
const UID = 'api::pregunta-denuncia.pregunta-denuncia';

// ---- El lector del formulario corre aquí igual que en el navegador ----------
// Se reutiliza tal cual (no una copia) para que los textos originales sean
// exactamente los que ve el visitante; si fueran dos lectores distintos, una
// diferencia de un espacio bastaría para que la corrección no se aplicara nunca.
globalThis.DOMParser = DOMParser;
globalThis.Node = Node;
globalThis.NodeFilter = NodeFilter;

const fetchReal = globalThis.fetch;

/** La red del portal corta de vez en cuando; una lectura fallida no es el final. */
async function conReintento(url, opciones, intentos = 4) {
  for (let i = 1; ; i++) {
    try { return await fetchReal(url, opciones); } catch (e) {
      if (i >= intentos) throw new Error(`no se pudo leer ${url}: ${e.message}`);
      await new Promise(r => setTimeout(r, 2000 * i));
    }
  }
}

globalThis.fetch = (url, opciones) => {
  const destino = String(url).startsWith('/') ? ORIGEN + url : String(url);
  return conReintento(destino, {
    ...opciones,
    // El filtro del proveedor de hospedaje rechaza las peticiones sin navegador.
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
      ...(opciones?.headers || {}),
    },
  });
};

const { cargarPreguntas } = await import(
  path.join(__dirname, '../../src/utils/denuncias-legado.ts')
);
const contenido = (await import(path.join(__dirname, 'denuncias-contenido.json'), { with: { type: 'json' } })).default;

// ---- Número y frase --------------------------------------------------------

/**
 * Separa el número de la frase: "12.¿Tiene algo más…" → "12." + "¿Tiene algo más…".
 *
 * El número es de la conducta, no de la pregunta: la misma pregunta es la 8 en
 * una y la 14 en otra. Se guarda aparte para poder agruparlas.
 */
export function partir(etiqueta) {
  const m = etiqueta.match(/^\s*(\d+(?:\.\d+)*\.?)\s*/);
  return m
    ? { numero: m[1], frase: etiqueta.slice(m[0].length).trim() }
    : { numero: '', frase: etiqueta.trim() };
}

/**
 * Clave con la que dos frases se consideran la misma pregunta. Ignora acentos,
 * mayúsculas y puntuación, que es justo en lo que el sistema antiguo es
 * inconsistente ("¿sabe" en minúscula, "denuncia?." con punto de más).
 */
const claveDe = (frase) => frase
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^\p{L}\p{N} ]+/gu, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/**
 * La primera palabra decide si dos detalles son el mismo escrito de otra forma.
 * En singular: "¿Cual?", "¿Cuales?" y "¿Cuál(es)?" son el mismo "¿cuál?".
 */
const primeraPalabra = (clave) => clave.split(' ')[0].replace(/(es|s)$/, '');

/** Nombre de la conducta (o conductas) que usa cada formulario. */
function conductasPorFormulario() {
  const mapa = new Map();
  const apuntar = (c) => {
    if (!c?.formulario) return;
    const id = String(c.formulario);
    mapa.set(id, [...(mapa.get(id) || []), c.nombre]);
  };
  apuntar(contenido.pantallaConducta.destacada);
  for (const g of contenido.pantallaConducta.grupos) g.conductas.forEach(apuntar);
  return new Map([...mapa].map(([id, nombres]) => [id, nombres.join(' · ')]));
}

// ---- Lectura del sistema que recibe ----------------------------------------

async function leerPreguntas() {
  const conductas = conductasPorFormulario();
  const casillas = [];

  for (const formulario of [...conductas.keys()].sort((a, b) => Number(a) - Number(b))) {
    const { preguntas } = await cargarPreguntas(formulario);
    const porNombre = new Map();
    for (const p of preguntas) for (const c of p.controles) porNombre.set(c.nombre, c);

    const vistos = new Set();
    const hijosDe = new Map();
    let posicion = 0;

    for (const p of preguntas) {
      for (const c of p.controles) {
        if (!c.etiqueta || c.tipo === 'archivo') continue;
        if (vistos.has(c.nombre)) continue;
        vistos.add(c.nombre);
        posicion += 10;

        const { numero, frase } = partir(c.etiqueta);
        const clave = claveDe(frase);
        if (!clave) continue;

        // ¿Cuelga de otra pregunta? El formulario antiguo lo marca: ese "¿Cuál?"
        // solo aparece si antes se respondió que sí. Se numeran los detalles de
        // cada pregunta, porque alguna tiene más de uno.
        const padre = c.dependeDe ? porNombre.get(c.dependeDe) : null;
        const fraseMadre = padre ? partir(padre.etiqueta).frase : '';
        const claveMadre = fraseMadre ? claveDe(fraseMadre) : '';
        let rama = '';
        if (claveMadre && claveMadre !== clave) {
          const orden = hijosDe.get(c.dependeDe) || 0;
          hijosDe.set(c.dependeDe, orden + 1);
          rama = `${claveMadre}#${orden}`;
        }

        casillas.push({
          conducta: conductas.get(formulario),
          numero,
          original: c.etiqueta,
          formulario,
          campo: c.nombre,
          frase,
          clave,
          rama,
          fraseMadre: rama ? fraseMadre : '',
          orden: Number(formulario) * 1000 + posicion,
        });
      }
    }
    console.log(`   formulario ${formulario.padStart(2)} · ${conductas.get(formulario)}: ${posicion / 10} preguntas`);
  }

  // Dentro de una misma rama, los detalles se juntan solo si son el mismo
  // escrito de otra forma. Si de verdad preguntan cosas distintas —"Describa"
  // frente a "¿Sabe dónde labora ese tercero?"— cada uno va por su lado.
  const ramas = new Map();
  for (const c of casillas) {
    if (!c.rama) continue;
    if (!ramas.has(c.rama)) ramas.set(c.rama, new Set());
    ramas.get(c.rama).add(c.clave);
  }
  const ramaUnifica = new Map();
  for (const [rama, claves] of ramas) {
    ramaUnifica.set(rama, new Set([...claves].map(primeraPalabra)).size === 1);
  }

  const grupos = new Map();
  for (const c of casillas) {
    const llave = !c.rama ? c.clave
      : ramaUnifica.get(c.rama) ? `⟵ ${c.rama}`
      : `${c.clave} ⟵ ${c.rama}`;

    if (!grupos.has(llave)) grupos.set(llave, { clave: llave, apariciones: [], orden: c.orden });
    grupos.get(llave).apariciones.push(c);
  }

  // De las varias maneras en que el sistema antiguo escribe la misma pregunta,
  // se ofrece para corregir la mejor escrita, no la más repetida: entre
  // "¿Cuales?" (5 veces), "¿Cual?" (4) y "¿Cuál(es)?" (3), la buena es la
  // tercera. El punto de partida debería ser el menos malo.
  const bienEscrita = (f) =>
    (/[áéíóúüñ]/i.test(f) ? 2 : 0) +
    (f.startsWith('¿') && f.endsWith('?') ? 1 : 0);

  const masComun = (valores) => {
    const cuenta = new Map();
    for (const v of valores) if (v) cuenta.set(v, (cuenta.get(v) || 0) + 1);
    if (!cuenta.size) return '';
    return [...cuenta.entries()].sort((a, b) =>
      bienEscrita(b[0]) - bienEscrita(a[0]) || b[1] - a[1] || a[0].localeCompare(b[0])
    )[0][0];
  };

  for (const g of grupos.values()) {
    g.original = masComun(g.apariciones.map(a => a.frase));
    g.detalleDe = masComun(g.apariciones.map(a => a.fraseMadre));

    const nombres = new Set(g.apariciones.map(a => a.conducta));
    g.donde = nombres.size === 1
      ? [...nombres][0]
      : `${nombres.size} conductas · ${g.apariciones.length} veces`;
    g.apariciones = g.apariciones.map(({ conducta, numero, original, formulario, campo }) =>
      ({ conducta, numero, original, formulario, campo }));
  }

  return [...grupos.values()].sort((a, b) => a.orden - b.orden);
}

// ---- Panel -----------------------------------------------------------------

async function login() {
  const r = await fetchReal(`${STRAPI}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`login → ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

const api = (token) => async (metodo, ruta, cuerpo) => {
  const r = await fetchReal(`${STRAPI}/content-manager/collection-types/${UID}${ruta}`, {
    method: metodo,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  if (!r.ok) throw new Error(`${metodo} ${ruta} → ${r.status} ${await r.text()}`);
  return r.json();
};

/** Dos listas de apariciones son iguales si dicen lo mismo, en el mismo orden. */
const mismasApariciones = (a = [], b = []) =>
  a.length === b.length &&
  a.every((x, i) => ['conducta', 'numero', 'original', 'formulario', 'campo']
    .every(k => (x[k] ?? '') === (b[i][k] ?? '')));

async function main() {
  if (!SOLO_REVISAR && (!EMAIL || !PASSWORD)) throw new Error('faltan STRAPI_EMAIL y STRAPI_PASSWORD');
  console.log(`Sistema que recibe: ${ORIGEN}/denuncias/`);
  const grupos = await leerPreguntas();
  const casillas = grupos.reduce((n, g) => n + g.apariciones.length, 0);
  console.log(`Preguntas distintas: ${grupos.length}  (en ${casillas} casillas del formulario)`);

  if (SOLO_REVISAR) {
    for (const g of grupos) {
      console.log(`   ${String(g.apariciones.length).padStart(3)}× ${g.donde.padEnd(38)} ${g.original.slice(0, 60)}`);
      if (g.detalleDe) console.log(`        detalle de: ${g.detalleDe.slice(0, 74)}`);
    }
    console.log('No se escribió nada.');
    return;
  }

  const token = await login();
  const pedir = api(token);
  const existentes = (await pedir('GET', '?pageSize=500&status=draft&populate=apariciones')).results || [];
  const porClave = new Map(existentes.map(e => [e.clave, e]));

  let nuevas = 0, cambiadas = 0, iguales = 0;
  for (const g of grupos) {
    const ya = porClave.get(g.clave);
    porClave.delete(g.clave);
    const datos = {
      clave: g.clave, original: g.original, detalleDe: g.detalleDe,
      donde: g.donde, orden: g.orden, apariciones: g.apariciones,
    };

    if (!ya) {
      // Nace con la misma redacción que tiene hoy: nadie ve un cambio hasta que
      // alguien decida corregirla.
      const creada = await pedir('POST', '', { ...datos, texto: g.original, revisar: false });
      await pedir('POST', `/${creada.data.documentId}/actions/publish`);
      nuevas++;
      continue;
    }

    if (ya.original === g.original && ya.detalleDe === g.detalleDe && ya.donde === g.donde
        && ya.orden === g.orden && mismasApariciones(ya.apariciones, g.apariciones)) { iguales++; continue; }

    if (ya.original !== g.original || !mismasApariciones(ya.apariciones, g.apariciones)) {
      // El sistema que recibe cambió algo. Su texto manda; la corrección
      // guardada sigue aplicándose donde el original no haya cambiado.
      datos.revisar = true;
      console.log(`   ⚠ cambió en el sistema que recibe · ${g.donde}`);
      console.log(`     antes:  ${ya.original}`);
      console.log(`     ahora:  ${g.original}`);
      if (ya.texto !== ya.original) console.log(`     corrección guardada: ${ya.texto}`);
    }
    await pedir('PUT', `/${ya.documentId}`, datos);
    await pedir('POST', `/${ya.documentId}/actions/publish`);
    cambiadas++;
  }

  for (const [clave, sobra] of porClave) {
    // No se borra nada: una pregunta que ya no aparece puede ser un fallo de
    // lectura de un día concreto, y el texto corregido costó trabajo.
    console.log(`   ⚠ ya no aparece en el sistema que recibe: "${clave.slice(0, 50)}…" (se conserva, id ${sobra.documentId})`);
  }

  console.log(`Nuevas: ${nuevas} · actualizadas: ${cambiadas} · sin cambios: ${iguales}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(e => { console.error(e.message); process.exit(1); });
}
