#!/usr/bin/env node
/**
 * config-formulario-notificaciones.mjs — Deja el formulario de Notificaciones y
 * Traslados con los mismos nombres que la tabla del correo.
 *
 * Cada notificación llega por correo con un PDF y una tabla de siete columnas.
 * Quien publica tiene que pasar esa tabla al panel. Antes los campos se
 * llamaban `tipoAuto`, `pdfUrl`, `fechaAuto`… y había que adivinar la
 * correspondencia. Ahora cada campo se llama igual que su columna en el correo,
 * en el mismo orden, para que sea copiar y pegar de arriba abajo.
 *
 * También ordena la lista por fecha de publicación descendente, para que lo
 * recién cargado quede arriba y sea fácil comprobarlo.
 *
 * Uso:
 *   STRAPI_EMAIL=... STRAPI_PASSWORD=... node cms-strapi/scripts/config-formulario-notificaciones.mjs
 *   ... --revisar     # muestra cómo quedaría, sin guardar
 */

const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SOLO_REVISAR = process.argv.includes('--revisar');

const UID = 'api::notificacion.notificacion';

/**
 * Nombre de cada campo, igual que su columna en el correo. El orden es el de la
 * tabla, con la categoría y el PDF al principio porque son lo primero que se
 * decide. Sin textos de ayuda: la tabla se explica sola.
 */
const CAMPOS = {
  categoria: { label: 'Tipo de publicación' },
  pdfUrl: { label: 'Documento (PDF)' },
  expediente: { label: 'Número del expediente' },
  tipoAuto: { label: 'Tipo de Auto' },
  tipoNotificacion: { label: 'Tipo de notificación / Tipo de traslado' },
  dependencia: { label: 'Dependencia que profiere el acto' },
  fechaAuto: { label: 'Fecha de expedición' },
  desde: { label: 'Desde' },
  hasta: { label: 'Hasta' },
  vigencia: { label: 'Vigencia (año)' },
};

/** Filas del formulario; cada una suma 12 de ancho. */
const FILAS = [
  [['categoria', 6], ['vigencia', 6]],
  [['pdfUrl', 12]],
  [['expediente', 6], ['tipoAuto', 6]],
  [['tipoNotificacion', 6], ['dependencia', 6]],
  [['fechaAuto', 4], ['desde', 4], ['hasta', 4]],
];

/** Columnas del listado: las que sirven para reconocer un registro. */
const COLUMNAS = ['expediente', 'categoria', 'tipoAuto', 'dependencia', 'desde'];

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
const ruta = `${STRAPI}/content-manager/content-types/${UID}/configuration`;

const actual = await fetch(ruta, { headers: cabeceras }).then((r) => r.json());
const config = actual.data.contentType;

const metadatas = JSON.parse(JSON.stringify(config.metadatas));

// Strapi devuelve `mainField` dentro de la metadata de los campos de relación
// (createdBy, updatedBy) pero rechaza esa misma clave al guardar. Se quita.
for (const meta of Object.values(metadatas)) {
  if (meta?.list && 'mainField' in meta.list) delete meta.list.mainField;
}

for (const [campo, ajuste] of Object.entries(CAMPOS)) {
  if (!metadatas[campo]) continue;
  metadatas[campo].edit = {
    ...metadatas[campo].edit,
    label: ajuste.label,
    description: '',
    visible: true,
    editable: true,
  };
  metadatas[campo].list = { ...metadatas[campo].list, label: ajuste.label };
}

// Buscar por número de expediente, que es como se identifica una notificación.
if (metadatas.expediente) metadatas.expediente.list.searchable = true;

const layouts = {
  ...config.layouts,
  edit: FILAS.map((fila) => fila.map(([name, size]) => ({ name, size }))),
  list: COLUMNAS,
};

const settings = {
  ...config.settings,
  mainField: 'expediente',
  // Lo último cargado, arriba: así se comprueba de un vistazo.
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'DESC',
  pageSize: 25,
};

if (SOLO_REVISAR) {
  console.log('El formulario quedaría así:\n');
  for (const fila of layouts.edit) {
    console.log('  ' + fila.map((c) => CAMPOS[c.name].label).join('   |   '));
  }
  console.log(`\nColumnas del listado: ${COLUMNAS.join(', ')}`);
  console.log(`Orden por defecto: lo más reciente primero. ${settings.pageSize} por página.`);
  process.exit(0);
}

const r = await fetch(ruta, {
  method: 'PUT',
  headers: cabeceras,
  body: JSON.stringify({ settings, metadatas, layouts }),
});

if (!r.ok) {
  console.error(`ERROR al guardar: ${r.status} ${await r.text()}`);
  process.exit(1);
}

console.log(`✓ Formulario de Notificaciones actualizado en ${STRAPI}`);
