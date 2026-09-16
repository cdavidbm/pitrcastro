#!/usr/bin/env node
/**
 * config-formulario-preguntas-denuncia.mjs — Deja claro, en el panel, qué se
 * puede corregir de las preguntas de una denuncia y qué no.
 *
 * Solo hay un campo que se edita: cómo se le pregunta al ciudadano. Todo lo
 * demás lo pone el guion `sync-preguntas-denuncias.mjs` leyendo el sistema que
 * recibe las denuncias, y se muestra apagado para que nadie lo cambie por error:
 * si el texto original no coincide con el del sistema que recibe, la corrección
 * deja de aplicarse.
 *
 * Cada entrada es una pregunta, aunque varias conductas la hagan: se corrige
 * una vez y queda corregida en todas. La lista "Dónde se hace esta pregunta"
 * muestra en cuáles, con el número que tiene en cada una.
 *
 * Uso:
 *   STRAPI_EMAIL=... STRAPI_PASSWORD=... node cms-strapi/scripts/config-formulario-preguntas-denuncia.mjs
 *   ... --revisar     # muestra cómo quedaría, sin guardar
 */

const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SOLO_REVISAR = process.argv.includes('--revisar');

const UID = 'api::pregunta-denuncia.pregunta-denuncia';

const CAMPOS = {
  texto: {
    label: 'Cómo se le pregunta al ciudadano',
    description:
      'Esto es lo único que se corrige aquí: ortografía, claridad, una explicación que falte. ' +
      'Escríbala SIN el número: el número se lo pone cada conducta, porque la misma pregunta es ' +
      'la 8 en una y la 14 en otra. La pregunta tiene que seguir preguntando lo mismo — el ' +
      'expediente guardará este texto, que es el que la persona leyó al responder.',
    editable: true,
  },
  original: {
    label: 'Como la pregunta el sistema que recibe las denuncias',
    description:
      'Texto de referencia, no se edita. Si ese equipo cambia la pregunta, este campo se actualiza ' +
      'solo, la corrección de arriba queda en pausa donde cambió y se marca «Revisar».',
    editable: false,
  },
  revisar: {
    label: 'Revisar: la pregunta cambió en el sistema que recibe',
    description:
      'Se enciende solo. Donde haya cambiado, el ciudadano ve la pregunta del sistema que recibe. ' +
      'Al ajustar la corrección, apáguela.',
    editable: true,
  },
  donde: {
    label: 'Dónde se hace',
    description: 'En cuántas conductas se hace esta misma pregunta. Lo pone el sistema.',
    editable: false,
  },
  apariciones: {
    label: 'Dónde se hace esta pregunta',
    description:
      'Cada conducta que hace esta pregunta, con el número que tiene ahí y el texto original de esa ' +
      'casilla. Lo llena el sistema; no se edita.',
    editable: false,
  },
  clave: { label: 'Clave (dato técnico)', description: 'Con esto se reconoce la pregunta entre conductas.', editable: false },
  orden: { label: 'Orden (dato técnico)', description: 'Lo pone el sistema.', editable: false },
};

const FILAS = [
  [['donde', 8], ['revisar', 4]],
  [['texto', 12]],
  [['original', 12]],
  [['apariciones', 12]],
  [['clave', 8], ['orden', 4]],
];

const COLUMNAS = ['texto', 'donde', 'revisar'];

async function entrar() {
  const r = await fetch(`${STRAPI}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`no se pudo entrar: ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

if (!SOLO_REVISAR && (!EMAIL || !PASSWORD)) {
  console.error('ERROR: faltan STRAPI_EMAIL y STRAPI_PASSWORD del administrador.');
  process.exit(1);
}

if (SOLO_REVISAR) {
  console.log('El formulario quedaría así:\n');
  for (const fila of FILAS) console.log('  ' + fila.map(([n]) => CAMPOS[n].label).join('   |   '));
  console.log(`\nColumnas del listado: ${COLUMNAS.join(', ')}`);
  console.log('Orden por defecto: como aparecen la primera vez en el formulario.');
  process.exit(0);
}

const token = await entrar();
const cabeceras = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
const ruta = `${STRAPI}/content-manager/content-types/${UID}/configuration`;

const actual = await fetch(ruta, { headers: cabeceras }).then((r) => r.json());
const config = actual.data.contentType;
const metadatas = JSON.parse(JSON.stringify(config.metadatas));

// Strapi devuelve `mainField` en la metadata de los campos de relación
// (createdBy, updatedBy) pero rechaza esa misma clave al guardar.
for (const meta of Object.values(metadatas)) {
  if (meta?.list && 'mainField' in meta.list) delete meta.list.mainField;
}

for (const [campo, ajuste] of Object.entries(CAMPOS)) {
  if (!metadatas[campo]) continue;
  metadatas[campo].edit = {
    ...metadatas[campo].edit,
    label: ajuste.label,
    description: ajuste.description,
    visible: true,
    editable: ajuste.editable,
  };
  metadatas[campo].list = { ...metadatas[campo].list, label: ajuste.label };
}

// Se busca por el texto de la pregunta, que es como se la recuerda.
if (metadatas.texto) metadatas.texto.list.searchable = true;

const r = await fetch(ruta, {
  method: 'PUT',
  headers: cabeceras,
  body: JSON.stringify({
    settings: {
      ...config.settings,
      mainField: 'texto',
      defaultSortBy: 'orden',
      defaultSortOrder: 'ASC',
      pageSize: 50,
    },
    metadatas,
    layouts: {
      ...config.layouts,
      edit: FILAS.map((fila) => fila.map(([name, size]) => ({ name, size }))),
      list: COLUMNAS,
    },
  }),
});

if (!r.ok) {
  console.error(`ERROR al guardar: ${r.status} ${await r.text()}`);
  process.exit(1);
}

console.log(`✓ Formulario de "Preguntas de los hechos" actualizado en ${STRAPI}`);
