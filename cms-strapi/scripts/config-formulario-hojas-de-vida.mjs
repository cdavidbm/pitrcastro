#!/usr/bin/env node
/**
 * config-formulario-hojas-de-vida.mjs — Deja el formulario de "Publicación
 * Hojas de Vida" en lenguaje natural, con el aviso a la ciudadanía arriba.
 *
 * La página ganó dos campos para el aviso de la convocatoria (título y texto).
 * Sin esta configuración, el panel los muestra como "Aviso Titulo" y "Aviso",
 * sin explicar para qué sirven ni dónde salen.
 *
 * Solo cambia cómo se dibuja el formulario. NO toca el esquema, ni los datos,
 * ni el sitio público.
 *
 * Uso:
 *   STRAPI_URL=https://www.itrc.gov.co STRAPI_EMAIL=... STRAPI_PASSWORD=... \
 *     node cms-strapi/scripts/config-formulario-hojas-de-vida.mjs
 *   ... --revisar     # muestra cómo quedaría, sin guardar
 */

const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SOLO_REVISAR = process.argv.includes('--revisar');

const UID_PAGINA = 'api::transparencia-hojas-de-vida.transparencia-hojas-de-vida';
const UID_ASPIRANTE = 'transparencia-hojas-de-vida.aspirant';

const PAGINA = {
  campos: {
    title: { label: 'Título de la página', description: 'El titular grande del encabezado' },
    description: { label: 'Frase del encabezado', description: 'La línea que acompaña al título. Una sola frase corta' },
    avisoTitulo: {
      label: 'Título del aviso a la ciudadanía',
      description: 'Encabezado del bloque que explica la publicación. Si lo deja vacío junto con el texto, el bloque no aparece en la página',
    },
    aviso: {
      label: 'Texto del aviso a la ciudadanía',
      description: 'Sale debajo del encabezado, antes del enlace a Presidencia. Admite negrita, listas y enlaces. El correo escríbalo así: [talento_humano@itrc.gov.co](mailto:talento_humano@itrc.gov.co)',
    },
    icon: { label: 'Ícono del encabezado', description: 'Nombre del ícono de Font Awesome. Ej.: fa-id-card' },
    enlaceExterno: { label: 'Enlace a Presidencia', description: 'Dirección del botón "Enlace Publicación de Hojas de Vida — Presidencia de la República"' },
    aspirantes: { label: 'Aspirantes publicados', description: 'Cada fila de la tabla. Se muestran en el orden en que estén aquí' },
  },
  filas: [
    [['title', 6], ['icon', 6]],
    [['description', 12]],
    [['avisoTitulo', 12]],
    [['aviso', 12]],
    [['enlaceExterno', 12]],
    [['aspirantes', 12]],
  ],
};

const ASPIRANTE = {
  campos: {
    nombre: { label: 'Nombre del aspirante', description: 'Como debe verse en la tabla' },
    cargo: { label: 'Cargo al que aspira', description: 'Ej.: Director General de Agencia Código E3 Grado 07' },
    fechaFijacion: { label: 'Fecha de fijación', description: 'En palabras, como se ve en la tabla. Ej.: 2 de octubre del 2026' },
    fechaDesfijacion: { label: 'Fecha de desfijación', description: 'Tres días calendario después. Si se deja vacía, la tabla muestra una raya' },
    pdf: { label: 'Hoja de vida (PDF)', description: 'El archivo que se abre al pulsar el nombre' },
  },
  filas: [[['nombre', 12]], [['cargo', 12]], [['fechaFijacion', 6], ['fechaDesfijacion', 6]], [['pdf', 12]]],
  principal: 'nombre',
};

async function entrar() {
  const r = await fetch(`${STRAPI}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`no se pudo entrar: ${r.status} ${await r.text()}`);
  return (await r.json()).data.token;
}

/** Strapi devuelve `mainField` dentro de la metadata de relaciones pero lo
 *  rechaza al guardar. Se limpia antes de enviar. */
function limpiar(metadatas) {
  for (const meta of Object.values(metadatas)) {
    if (meta?.list && 'mainField' in meta.list) delete meta.list.mainField;
  }
  return metadatas;
}

async function configurar(cabeceras, ruta, clave, def) {
  const actual = await fetch(ruta, { headers: cabeceras }).then((r) => r.json());
  const config = actual.data[clave];
  if (!config) throw new Error(`no se pudo leer la configuracion de ${ruta}`);

  const metadatas = limpiar(JSON.parse(JSON.stringify(config.metadatas)));

  for (const [campo, ajuste] of Object.entries(def.campos)) {
    if (!metadatas[campo]) continue;
    metadatas[campo].edit = {
      ...metadatas[campo].edit,
      label: ajuste.label,
      description: ajuste.description ?? '',
      visible: ajuste.visible !== false,
      editable: true,
    };
    metadatas[campo].list = { ...metadatas[campo].list, label: ajuste.label };
  }

  const layouts = { ...config.layouts };
  if (def.filas) layouts.edit = def.filas.map((f) => f.map(([name, size]) => ({ name, size })));

  const settings = { ...config.settings };
  if (def.principal) settings.mainField = def.principal;

  if (SOLO_REVISAR) return { settings, metadatas, layouts, guardado: false };

  const r = await fetch(ruta, {
    method: 'PUT',
    headers: cabeceras,
    body: JSON.stringify({ settings, metadatas, layouts }),
  });
  if (!r.ok) throw new Error(`al guardar ${ruta}: ${r.status} ${await r.text()}`);
  return { settings, metadatas, layouts, guardado: true };
}

if (!EMAIL || !PASSWORD) {
  console.error('ERROR: faltan STRAPI_EMAIL y STRAPI_PASSWORD del administrador.');
  process.exit(1);
}

const token = await entrar();
const cabeceras = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

const r1 = await configurar(cabeceras, `${STRAPI}/content-manager/content-types/${UID_PAGINA}/configuration`, 'contentType', PAGINA);
const r2 = await configurar(cabeceras, `${STRAPI}/content-manager/components/${UID_ASPIRANTE}/configuration`, 'component', ASPIRANTE);

if (SOLO_REVISAR) {
  console.log('Asi quedaria el formulario:\n');
  console.log('  PÁGINA');
  for (const fila of r1.layouts.edit) console.log('    ' + fila.map((c) => PAGINA.campos[c.name]?.label ?? c.name).join('   |   '));
  console.log('\n  ASPIRANTE  (se identifica por: ' + r2.settings.mainField + ')');
  for (const fila of r2.layouts.edit) console.log('    ' + fila.map((c) => ASPIRANTE.campos[c.name]?.label ?? c.name).join('   |   '));
  console.log('\n  (nada guardado: modo revision)');
  process.exit(0);
}

console.log(`✓ Formulario de Publicacion Hojas de Vida actualizado en ${STRAPI}`);
console.log('  Los campos del aviso quedaron arriba, con su explicacion.');
