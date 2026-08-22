#!/usr/bin/env node
/**
 * config-formulario-informacion-financiera.mjs — Deja el formulario de
 * Información Financiera en lenguaje natural.
 *
 * La página guarda sus documentos en catorce pestañas por año o por tipo. En el
 * panel, cada pestaña se mostraba plegada con su identificador tecnico
 * ("ef2026", "op-reciprocas", "ef-tri-2018") en vez de su nombre real, porque
 * el campo principal configurado era `idLogico`. Quien publicaba tenia que
 * abrir las pestañas una por una para saber cual era cual.
 *
 * Ahora la pestaña se identifica por su nombre y los campos se llaman como lo
 * que son.
 *
 * Solo cambia como se dibuja el formulario. NO toca el esquema, ni los datos,
 * ni el sitio publico.
 *
 * Uso:
 *   STRAPI_EMAIL=... STRAPI_PASSWORD=... node cms-strapi/scripts/config-formulario-informacion-financiera.mjs
 *   ... --revisar     # muestra como quedaria, sin guardar
 */

const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || '';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SOLO_REVISAR = process.argv.includes('--revisar');

const UID_PAGINA = 'api::agencia-informacion-financiera.agencia-informacion-financiera';
const UID_PESTANA = 'agencia-informacion-financiera.tab';
const UID_DOCUMENTO = 'agencia-informacion-financiera.item';

/**
 * Cada pestaña. El nombre va primero y ancho, porque es lo que identifica la
 * pestaña; el identificador queda detras y estrecho, con el aviso de no
 * tocarlo: la pagina lo usa para enlazar y cambiarlo romperia los enlaces.
 */
const PESTANA = {
  campos: {
    label: { label: 'Nombre de la pestaña', description: 'El que ven los visitantes. Ej.: Estados Financieros 2026' },
    idLogico: { label: 'Identificador interno', description: 'No cambiar: la pagina lo usa para enlazar a esta pestaña' },
    items: { label: 'Documentos de esta pestaña', description: '' },
  },
  filas: [[['label', 8], ['idLogico', 4]], [['items', 12]]],
  principal: 'label',
};

/** Cada documento dentro de una pestaña. */
const DOCUMENTO = {
  campos: {
    titulo: { label: 'Nombre del documento', description: 'El texto que se ve en la lista. Ej.: Estados Financieros a Junio 2026' },
    file: { label: 'Archivo', description: 'Suba aqui el PDF. Es la forma recomendada: no hace falta escribir ninguna ruta' },
    url: { label: 'O enlace a un archivo ya publicado', description: 'Solo si el documento ya esta en el servidor. Ej.: /documentos/agencia/mi-archivo.pdf. Si arriba subio un archivo, este campo se ignora' },
  },
  filas: [[['titulo', 12]], [['file', 12]], [['url', 12]]],
  principal: 'titulo',
};

/** El campo de la pagina que contiene las pestañas. */
const PAGINA = {
  campos: {
    tabs: { label: 'Pestañas de documentos', description: 'Cada pestaña agrupa los documentos de un año o un tipo' },
  },
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
      visible: true,
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

const r1 = await configurar(cabeceras, `${STRAPI}/content-manager/components/${UID_PESTANA}/configuration`, 'component', PESTANA);
const r2 = await configurar(cabeceras, `${STRAPI}/content-manager/components/${UID_DOCUMENTO}/configuration`, 'component', DOCUMENTO);
const r3 = await configurar(cabeceras, `${STRAPI}/content-manager/content-types/${UID_PAGINA}/configuration`, 'contentType', PAGINA);

if (SOLO_REVISAR) {
  console.log('Asi quedaria el formulario:\n');
  console.log('  PESTAÑA  (se identifica por: ' + r1.settings.mainField + ')');
  for (const fila of r1.layouts.edit) console.log('    ' + fila.map((c) => PESTANA.campos[c.name]?.label ?? c.name).join('   |   '));
  console.log('\n  DOCUMENTO  (se identifica por: ' + r2.settings.mainField + ')');
  for (const fila of r2.layouts.edit) console.log('    ' + fila.map((c) => DOCUMENTO.campos[c.name]?.label ?? c.name).join('   |   '));
  console.log('\n  (nada guardado: modo revision)');
  process.exit(0);
}

console.log(`✓ Formulario de Informacion Financiera actualizado en ${STRAPI}`);
console.log('  Las pestañas se identifican ahora por su nombre, no por su codigo.');
