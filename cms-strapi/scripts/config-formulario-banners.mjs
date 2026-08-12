#!/usr/bin/env node
/**
 * config-formulario-banners.mjs — Deja el formulario de los banners del inicio
 * con lo justo para publicar uno.
 *
 * Cada banner tenía doce campos. En los seis que hay publicados, ocho de esos
 * campos están vacíos desde siempre: son banners de imagen con un enlace, sin
 * título ni texto encima. Y otros dos (`orden` y `externo`) el sitio ya los
 * deduce solo — el orden es el de la lista y un enlace es externo si empieza
 * por http.
 *
 * Así que el formulario queda en cuatro campos, con nombres en español y una
 * explicación en cada uno.
 *
 * **No se borra ningún campo del esquema**: lo escrito antes sigue guardado y
 * el sitio lo sigue mostrando. Solo deja de pedirse al editar.
 *
 * Uso:
 *   STRAPI_EMAIL=... STRAPI_PASSWORD=... node cms-strapi/scripts/config-formulario-banners.mjs
 *   ... --revisar     # muestra cómo quedaría, sin guardar
 *
 * Variables:
 *   STRAPI_URL       por defecto http://127.0.0.1:1337
 *   STRAPI_EMAIL / STRAPI_PASSWORD  del administrador
 */

const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SOLO_REVISAR = process.argv.includes('--revisar');

const COMPONENTE = 'slider.slide';

/** Los cuatro campos que se piden, en el orden en que se rellenan. */
const VISIBLES = {
  image: {
    label: 'Imagen del banner',
    description:
      'La imagen que se ve en el carrusel del inicio. Formato apaisado, idealmente 1900 x 600 píxeles.',
    size: 12,
  },
  imageAlt: {
    label: 'Descripción de la imagen',
    description:
      'Qué se ve en la imagen, en pocas palabras. La leen las personas con lectores de pantalla y es obligatoria por accesibilidad.',
    size: 12,
  },
  link: {
    label: 'A dónde lleva',
    description:
      'Dirección que se abre al hacer clic. Del propio portal, empezando por barra (ejemplo: /ciprep2026), o completa si es de otra entidad (https://...).',
    size: 8,
  },
  active: {
    label: '¿Se muestra?',
    description: 'Desactívelo para quitar el banner del inicio sin borrarlo.',
    size: 4,
  },
  imageMobile: {
    label: 'Imagen para celular (opcional)',
    description:
      'Solo si la imagen principal se ve mal en pantallas pequeñas. Si se deja vacío se usa la principal.',
    size: 12,
  },
};

/** Se conservan con su dato, pero dejan de pedirse. */
const OCULTOS = {
  title: 'Nunca se usa: estos banners llevan el texto dentro de la imagen.',
  subtitle: 'Nunca se usa: estos banners llevan el texto dentro de la imagen.',
  description: 'Nunca se usa: estos banners llevan el texto dentro de la imagen.',
  linkText: 'Nunca se usa: el banner completo es el enlace.',
  external: 'El sitio lo deduce: es externo si el enlace empieza por http.',
  overlay: 'Veladura sobre la imagen; se deja como está.',
  order: 'El orden es el de esta lista: arrastre los banners para reordenarlos.',
};

/** Filas del formulario: cada una suma 12 de ancho. */
const FILAS = [
  [['image', 12]],
  [['imageAlt', 12]],
  [['link', 8], ['active', 4]],
  [['imageMobile', 12]],
];

async function entrar() {
  const r = await fetch(`${STRAPI}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`no se pudo entrar: ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

if (!EMAIL || !PASSWORD) {
  console.error('ERROR: faltan STRAPI_EMAIL y STRAPI_PASSWORD del administrador.');
  process.exit(1);
}

const token = await entrar();
const cabeceras = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

const actual = await fetch(`${STRAPI}/content-manager/components/${COMPONENTE}/configuration`, {
  headers: cabeceras,
}).then((r) => r.json());

const config = actual.data.component;
const metadatas = JSON.parse(JSON.stringify(config.metadatas));

for (const [campo, ajuste] of Object.entries(VISIBLES)) {
  if (!metadatas[campo]) continue;
  metadatas[campo].edit = {
    ...metadatas[campo].edit,
    label: ajuste.label,
    description: ajuste.description,
    visible: true,
    editable: true,
  };
}

for (const [campo, motivo] of Object.entries(OCULTOS)) {
  if (!metadatas[campo]) continue;
  metadatas[campo].edit = {
    ...metadatas[campo].edit,
    description: motivo,
    visible: false,
  };
}

const layoutEdit = FILAS.map((fila) => fila.map(([name, size]) => ({ name, size })));

if (SOLO_REVISAR) {
  console.log('El formulario quedaría así:\n');
  for (const fila of layoutEdit) {
    for (const celda of fila) {
      const a = VISIBLES[celda.name];
      console.log(`  ${a.label}`);
      console.log(`     ${a.description}`);
    }
  }
  console.log('\nSe dejan de pedir (el dato guardado no se toca):');
  for (const [campo, motivo] of Object.entries(OCULTOS)) console.log(`  · ${campo} — ${motivo}`);
  process.exit(0);
}

const r = await fetch(`${STRAPI}/content-manager/components/${COMPONENTE}/configuration`, {
  method: 'PUT',
  headers: cabeceras,
  body: JSON.stringify({
    settings: config.settings,
    metadatas,
    layouts: { ...config.layouts, edit: layoutEdit },
  }),
});

if (!r.ok) {
  console.error(`ERROR al guardar: ${r.status} ${await r.text()}`);
  process.exit(1);
}

console.log(`✓ Formulario de los banners actualizado en ${STRAPI}`);
console.log(`  Se piden ${Object.keys(VISIBLES).length} campos; ${Object.keys(OCULTOS).length} dejan de pedirse.`);
