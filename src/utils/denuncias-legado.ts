// Conexión del formulario nuevo de denuncias con el sistema PHP que las recibe
// en /denuncias/. Ese sistema no ofrece un servicio de datos: es una cadena de
// páginas que guardan lo recibido y redirigen a la siguiente. Aquí se recorre
// esa misma cadena desde el navegador, sin cambiar una sola línea del PHP.
//
// Recorrido de una denuncia en el sistema de /denuncias/:
//   1. denu{Natural|Juridica|Anonimo}.php?FORM_ID=N   POST  guarda los datos
//      del denunciante y redirige al formulario de la conducta.
//   2. <formulario de la conducta>.php?FORM_ID=N      POST  guarda respuestas
//      y adjunto, y redirige a integracion.php.
//   3. integracion-portal.php                         POST  envía la denuncia a
//      Forest (SIGI) y devuelve el radicado.
//
// El formulario antiguo, en el paso 3, sigue la redirección a integracion.php.
// Esa página arma lo que manda a Forest con una vista que empareja denuncia y
// denunciante por número interno, y esos números están desfasados: casi nunca
// encuentra la denuncia y a Forest le llega vacía. Este formulario no sigue la
// redirección y usa integracion-portal.php, que encuentra al denunciante por su
// documento y la hora del envío, y no reenvía lo que ya tiene radicado.
//
// Los pasos 1 y 2 guardan: después del 2 nunca se repiten. El 3 sí se puede
// repetir sin riesgo.

const BASE = '/denuncias/';

export const CORREO_CONTACTO = 'contactenos@itrc.gov.co';

/** Página PHP con las preguntas de cada conducta, por FORM_ID. */
const FORMULARIOS: Record<string, string> = {
  '1': 'general_1',
  '2': 'IncrPatrNoJust_2',
  '3': 'concusion_3',
  '4': 'FalsDocPubli_4',
  '5': 'FalsDocPubli_5',
  '6': 'AbuFunPubli_6',
  '7': 'Cohecho_7',
  '8': 'TrafInflu_8',
  '9': 'peculado_9',
  '10': 'peculado_10',
  '11': 'peculado_11',
  '12': 'prevaricato_12',
};

// El FORM_ID viaja a una consulta SQL del sistema antiguo sin sanear: solo se
// deja pasar uno de los doce conocidos.
export const esFormIdValido = (id: string) =>
  Object.prototype.hasOwnProperty.call(FORMULARIOS, id);

export type TipoPersona = 'natural' | 'juridica' | 'anonimo';

const PERSONA: Record<TipoPersona, { pagina: string; valor: string; mmInsert: string }> = {
  natural:  { pagina: 'denuNatural',  valor: 'Natural',  mmInsert: 'form14' },
  juridica: { pagina: 'denuJuridica', valor: 'Juridica', mmInsert: 'form15' },
  anonimo:  { pagina: 'denuAnonimo',  valor: 'anonimo',  mmInsert: 'form13' },
};

export interface DatosDenunciante {
  tipo: TipoPersona;
  TIPO_DOCUMENTO: string;
  TERCERO: string;
  NOMBRE: string;
  DEPTID: string;
  CITY: string;
  DIRECCION: string;
  TELEFONO: string;
  CORREO: string;
  MEDIO_RESPUESTA: string;
  ASUNTO: string;
}

// ============ Datos del denunciante entre pasos ============
// Van en sessionStorage y no en la dirección: así no quedan en el historial
// del navegador ni en los registros del servidor, y se borran al cerrar la
// pestaña.

const CLAVE_DATOS = 'itrc-denuncia-datos';

export function guardarDatos(datos: DatosDenunciante) {
  sessionStorage.setItem(CLAVE_DATOS, JSON.stringify(datos));
}

export function leerDatos(): DatosDenunciante | null {
  try {
    const raw = sessionStorage.getItem(CLAVE_DATOS);
    return raw ? (JSON.parse(raw) as DatosDenunciante) : null;
  } catch (_) {
    return null;
  }
}

export function borrarDatos() {
  try { sessionStorage.removeItem(CLAVE_DATOS); } catch (_) {}
}

// ============ Lectura de páginas del sistema antiguo ============

const aDocumento = (html: string) => new DOMParser().parseFromString(html, 'text/html');

// El proveedor de hospedaje responde con esta página cuando su filtro rechaza
// una petición.
const esBloqueo = (html: string) => /Web Page Blocked/i.test(html);

const limpiar = (texto: string) => texto.replace(/\s+/g, ' ').trim();

export interface Opcion {
  valor: string;
  texto: string;
}

export interface ListasDatos {
  tiposDocumento: Opcion[];
  departamentos: Opcion[];
  ciudades: Opcion[];
  medios: Opcion[];
}

/** Listas del formulario de datos personales, tal como las ofrece el backend. */
export async function cargarListas(formId: string): Promise<ListasDatos> {
  const r = await fetch(`${BASE}denuNatural.php?FORM_ID=${formId}`, { credentials: 'same-origin' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const doc = aDocumento(await r.text());

  const opciones = (name: string): Opcion[] =>
    Array.from(doc.querySelectorAll<HTMLOptionElement>(`select[name="${name}"] option`)).map(o => ({
      valor: o.getAttribute('value') ?? '',
      texto: limpiar(o.textContent || ''),
    }));

  const listas = {
    tiposDocumento: opciones('TIPO_DOCUMENTO'),
    departamentos: opciones('DEPTID'),
    ciudades: opciones('CITY'),
    // Una denuncia no se consulta: fuera la respuesta "por la web".
    medios: opciones('MEDIO_RESPUESTA').filter(m => !/consulta/i.test(m.valor)),
  };
  if (!listas.tiposDocumento.length || !listas.departamentos.length || !listas.ciudades.length) {
    throw new Error('Listas incompletas');
  }
  return listas;
}

/** Las ciudades se codifican con el código DANE: los miles son el departamento. */
export const ciudadesDe = (ciudades: Opcion[], deptId: string) =>
  ciudades.filter(c => Math.floor(Number(c.valor) / 1000) === Number(deptId));

export type TipoControl = 'opciones' | 'texto' | 'fecha' | 'archivo';

export interface Control {
  tipo: TipoControl;
  nombre: string;
  /** Campo oculto con el enunciado oficial que acompaña a este control. */
  preg: string;
  etiqueta: string;
  /** Valores que se envían, y el texto con que el formulario antiguo los muestra. */
  opciones: string[];
  textosOpciones: string[];
  obligatorio: boolean;
  /** Detalle de otra pregunta: solo aplica si en ella se eligió uno de `activaCon`. */
  dependeDe: string | null;
  activaCon: string[];
}

export interface Pregunta {
  controles: Control[];
  nota: string;
}

export interface Formulario {
  preguntas: Pregunta[];
  /** Enunciados reescritos: se envían así al expediente. */
  reescritos: Record<string, string>;
}

/**
 * Redacción revisada de una pregunta: cómo la pregunta el sistema que recibe
 * (`original`) y cómo se decidió escribirla en el panel (`texto`).
 */
export interface Reescritura {
  original: string;
  texto: string;
}

/**
 * Preguntas del formulario de una conducta. Se leen del backend en cada carga:
 * cada conducta tiene las suyas, y si el equipo del sistema antiguo las cambia,
 * el formulario nuevo las muestra sin tocar nada aquí.
 */
export async function cargarPreguntas(
  formId: string,
  reescrituras: Record<string, Reescritura> = {},
): Promise<Formulario> {
  const r = await fetch(`${BASE}${FORMULARIOS[formId]}.php?FORM_ID=${formId}`, { credentials: 'same-origin' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const doc = aDocumento(await r.text());

  // Enunciados oficiales, por número: PREGn_ID_VALUE acompaña a RESPn_ID_VALUE y a DESCRn.
  const enunciados = new Map<string, string>();
  doc.querySelectorAll<HTMLInputElement>('input[type="hidden"][name^="PREG"]').forEach(el => {
    const n = el.getAttribute('name')!.match(/^PREG(\d+)_ID_VALUE$/)?.[1];
    if (n) enunciados.set(n, limpiar(el.getAttribute('value') || ''));
  });
  const pregDe = (nombre: string) => {
    const n = nombre.match(/^RESP(\d+)_ID_VALUE$/)?.[1] ?? nombre.match(/^DESCR(\d*)$/)?.[1];
    if (n === undefined) return '';
    return `PREG${n || '1'}_ID_VALUE`;
  };
  const enunciadoDe = (nombre: string) =>
    enunciados.get(nombre.match(/^RESP(\d+)_ID_VALUE$/)?.[1] ?? nombre.match(/^DESCR(\d*)$/)?.[1] ?? '') ||
    (nombre === 'DESCR' ? enunciados.get('1') || '' : '');

  const preguntas: Pregunta[] = [];
  doc.querySelectorAll('.wrap-input100').forEach(bloque => {
    const controles: Control[] = [];
    let texto = '';
    let asterisco = false;
    let grupo: Control | null = null;   // última pregunta de opciones del bloque
    let radioPrevio = '';               // valor del radio recién leído, a la espera de su etiqueta
    let opcionPrevia = '';              // última opción leída, para los detalles que la siguen

    const walker = doc.createTreeWalker(bloque, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    for (let nodo = walker.nextNode(); nodo; nodo = walker.nextNode()) {
      if (nodo.nodeType === Node.TEXT_NODE) {
        let t = limpiar(nodo.textContent || '');
        if (!t || t === '*') continue;
        // El texto que sigue a un radio es su etiqueta visible ("SI", "El funcionario").
        if (radioPrevio && grupo) {
          if (t.startsWith(radioPrevio)) {
            t = limpiar(t.slice(radioPrevio.length));
          } else if (!['SI', 'NO'].includes(radioPrevio)) {
            grupo.textosOpciones[grupo.opciones.lastIndexOf(radioPrevio)] = t;
            t = '';
          }
          radioPrevio = '';
        }
        if (t) texto = limpiar(`${texto} ${t}`);
        continue;
      }

      const el = nodo as Element;
      if (el.matches('.red')) { asterisco = true; continue; }
      if (el.tagName !== 'INPUT') continue;

      const nombre = el.getAttribute('name') || '';
      const tipo = (el.getAttribute('type') || 'text').toLowerCase();
      if (tipo !== 'radio') radioPrevio = '';
      if (!nombre || tipo === 'hidden' || tipo === 'submit') continue;

      if (tipo === 'radio') {
        const valor = el.getAttribute('value') || '';
        if (grupo?.nombre === nombre) {
          grupo.opciones.push(valor);
          grupo.textosOpciones.push(valor);
        } else {
          grupo = {
            tipo: 'opciones', nombre, preg: pregDe(nombre), etiqueta: texto || enunciadoDe(nombre), opciones: [valor], textosOpciones: [valor],
            obligatorio: asterisco, dependeDe: null, activaCon: [],
          };
          controles.push(grupo);
          texto = '';
          asterisco = false;
        }
        radioPrevio = valor;
        opcionPrevia = valor;
        continue;
      }

      const etiqueta = texto;
      texto = '';
      const control: Control = {
        tipo: tipo === 'date' ? 'fecha' : tipo === 'file' ? 'archivo' : 'texto',
        nombre,
        preg: pregDe(nombre),
        etiqueta,
        opciones: [],
        textosOpciones: [],
        obligatorio: el.hasAttribute('required'),
        dependeDe: null,
        activaCon: [],
      };

      if (control.tipo === 'texto' && grupo) {
        const esSiNo = grupo.opciones.every(o => o === 'SI' || o === 'NO');
        if (esSiNo) {
          // "¿Cuál?", "En caso afirmativo…": aplica si se respondió SI.
          control.dependeDe = grupo.nombre;
          control.activaCon = ['SI'];
        } else if (!etiqueta) {
          // Campo sin enunciado pegado a una opción: es el detalle de esa opción.
          control.dependeDe = grupo.nombre;
          control.activaCon = [opcionPrevia];
          control.etiqueta = 'Precise su respuesta';
        }
      }

      // Un mismo campo repetido para varias opciones se dibuja una sola vez.
      const repetido = controles.find(c => c.nombre === nombre && c.tipo === control.tipo);
      if (repetido) {
        repetido.activaCon.push(...control.activaCon.filter(v => !repetido.activaCon.includes(v)));
        continue;
      }

      if (!control.etiqueta) control.etiqueta = enunciadoDe(nombre);
      controles.push(control);
    }

    if (controles.length) preguntas.push({ controles, nota: texto });
  });

  if (!preguntas.length) throw new Error('Formulario sin preguntas');

  // La redacción revisada solo se aplica si el sistema antiguo sigue
  // preguntando lo mismo: si allá cambiaron el texto, manda el suyo.
  const reescritos: Record<string, string> = {};
  for (const p of preguntas) {
    for (const c of p.controles) {
      const r = reescrituras[c.nombre];
      if (!r || limpiar(r.original) !== limpiar(c.etiqueta)) continue;
      // Si este control lleva el enunciado oficial, el expediente guarda lo
      // que la persona leyó, no la versión anterior.
      if (c.preg && limpiar(enunciadoDe(c.nombre)) === limpiar(c.etiqueta)) reescritos[c.preg] = r.texto;
      c.etiqueta = r.texto;
    }
  }

  return { preguntas, reescritos };
}

// ============ Envío ============

const CLAVE_RADICADO = 'itrc-denuncia-radicado';

/** Se guarda el de la última denuncia, o se borra si no hubo: nunca queda uno viejo. */
export function guardarRadicado(radicado: string | null) {
  try {
    if (radicado) sessionStorage.setItem(CLAVE_RADICADO, radicado);
    else sessionStorage.removeItem(CLAVE_RADICADO);
  } catch (_) {}
}

export function leerRadicadoGuardado(): string | null {
  try {
    const valor = sessionStorage.getItem(CLAVE_RADICADO);
    return valor && /^\d+-\d{4}-\d+$/.test(valor) ? valor : null;
  } catch (_) {
    return null;
  }
}

export type ResultadoEnvio =
  | { ok: true; radicado: string | null }
  | { ok: false; motivo: 'bloqueo' | 'datos' | 'respuestas' | 'cambio'; reintentable: boolean };

// Reintentar es seguro mientras falle el primer envío: como mucho queda un
// registro de datos sin respuestas, lo mismo que deja quien abandona el
// formulario antiguo a mitad. Después del segundo envío, nunca: duplicaría la
// denuncia y su radicado en Forest.

const soloDigitos = (texto: string) => texto.replace(/\D/g, '');

/** Caracteres que caben en la base para el enunciado de cada pregunta (RESPUESTAS.PREGn_ID_VALUE). */
const LIMITE_ENUNCIADO = 1000;

/**
 * El número de documento tal como lo guarda el sistema que recibe: sin puntos
 * ni espacios y, si trae dígito de verificación ("900123456-7"), sin él.
 */
export const numeroDocumento = (texto: string) => soloDigitos(texto.split('-')[0]);

/**
 * El sistema que recibe guarda el documento como número entero: más de
 * 2.147.483.647 no cabe y el envío falla. Una cédula colombiana cabe; un NIT
 * cabe si va sin el dígito de verificación.
 */
export const documentoCabe = (numero: string) =>
  /^\d{1,10}$/.test(numero) && Number(numero) > 0 && Number(numero) <= 2147483647;

function cuerpoDatos(datos: DatosDenunciante, formId: string) {
  const persona = PERSONA[datos.tipo];
  const anonimo = datos.tipo === 'anonimo';
  // Mismos campos y valores que envían los formularios de /denuncias/.
  const cuerpo = new URLSearchParams();
  cuerpo.append('TIPO_PERSONA', persona.valor);
  cuerpo.append('TIPO_DOCUMENTO', anonimo ? 'CC' : datos.TIPO_DOCUMENTO);
  cuerpo.append('TERCERO', anonimo ? '0' : numeroDocumento(datos.TERCERO));
  cuerpo.append('NOMBRE', anonimo ? '' : datos.NOMBRE);
  cuerpo.append('PAIS', anonimo ? '' : 'COL');
  cuerpo.append('DEPTID', anonimo ? '' : datos.DEPTID);
  cuerpo.append('CITY', anonimo ? '' : datos.CITY);
  cuerpo.append('DIRECCION', anonimo ? '' : datos.DIRECCION);
  cuerpo.append('TELEFONO', soloDigitos(datos.TELEFONO));
  cuerpo.append('CONTRASENIA', anonimo ? '' : '1');
  cuerpo.append('ASUNTO', anonimo ? '' : datos.ASUNTO);
  cuerpo.append('MEDIO_RESPUESTA', anonimo ? '' : datos.MEDIO_RESPUESTA);
  cuerpo.append('CORREO', datos.CORREO);
  if (!anonimo) {
    cuerpo.append('terms', 'service');
    cuerpo.append('enviar', 'Insertar registro');
  }
  cuerpo.append('FORM_ID', formId);
  cuerpo.append('MM_insert', persona.mmInsert);
  return cuerpo;
}

/**
 * Envía la denuncia completa. Los datos y las respuestas se mandan juntos, al
 * final: el formulario de respuestas toma como número de denuncia la última
 * guardada en el sistema, así que cuanto menos tiempo pase entre un envío y
 * otro, menos riesgo de que se cruce con la de otra persona. Es la misma
 * secuencia que sigue el formulario antiguo.
 */
export async function enviarDenuncia(
  datos: DatosDenunciante,
  formId: string,
  respuestas: Record<string, string>,
  archivo: File | null,
  enunciadosReescritos: Record<string, string> = {},
): Promise<ResultadoEnvio> {
  // ---- 1. Datos del denunciante ----
  let paginaRespuestas: Response;
  try {
    paginaRespuestas = await fetch(`${BASE}${PERSONA[datos.tipo].pagina}.php?FORM_ID=${formId}`, {
      method: 'POST',
      body: cuerpoDatos(datos, formId),
      credentials: 'same-origin',
      redirect: 'follow',
    });
  } catch (_) {
    return { ok: false, motivo: 'datos', reintentable: true };
  }
  const html = await paginaRespuestas.text();
  if (esBloqueo(html)) return { ok: false, motivo: 'bloqueo', reintentable: true };

  const doc = aDocumento(html);
  const idDenuncia = doc.querySelector('input[name="ID_DENUNCIA"]');
  const formulario = idDenuncia?.closest('form') ?? doc.querySelector('form');
  // Verificación antibots del proveedor en lugar de la página del sistema: la
  // petición no llegó al PHP, así que no se guardó nada.
  if (!idDenuncia && /bot_js_calc/.test(html)) return { ok: false, motivo: 'bloqueo', reintentable: true };
  if (!paginaRespuestas.ok || !idDenuncia || !formulario) {
    return { ok: false, motivo: 'datos', reintentable: true };
  }

  // Los campos ocultos (textos de las preguntas, número de denuncia, número de
  // respuesta) se toman de esta página recién servida, no de la que se mostró
  // al empezar: dependen de lo que el sistema acaba de guardar.
  const controles = Array.from(doc.querySelectorAll<HTMLInputElement>('input')).filter(
    el => el.closest('form') === formulario || el.getAttribute('form') === formulario.id || !el.closest('form'),
  );
  const nombresDisponibles = new Set(controles.map(el => el.getAttribute('name') || ''));
  if (Object.keys(respuestas).some(nombre => !nombresDisponibles.has(nombre))) {
    return { ok: false, motivo: 'cambio', reintentable: true };
  }

  const cuerpo = new FormData();
  const radiosVistos = new Set<string>();
  for (const el of controles) {
    const nombre = el.getAttribute('name');
    if (!nombre) continue;
    const tipo = (el.getAttribute('type') || 'text').toLowerCase();

    if (tipo === 'hidden' || tipo === 'submit') {
      const reescrito = enunciadosReescritos[nombre];
      // Una redacción más larga de lo que cabe en la base rompería el envío:
      // en ese caso viaja el enunciado original.
      const usar = reescrito !== undefined && reescrito.length <= LIMITE_ENUNCIADO;
      cuerpo.append(nombre, usar ? reescrito : el.getAttribute('value') ?? '');
    } else if (tipo === 'radio') {
      if (radiosVistos.has(nombre)) continue;
      radiosVistos.add(nombre);
      if (respuestas[nombre]) cuerpo.append(nombre, respuestas[nombre]);
    } else if (tipo === 'file') {
      // Sin adjunto, el navegador manda igualmente la parte vacía del archivo.
      cuerpo.append(nombre, archivo ?? new File([], ''), archivo?.name ?? '');
    } else {
      cuerpo.append(nombre, respuestas[nombre] ?? '');
    }
  }

  // ---- 2. Respuestas y adjunto. Desde aquí, nunca se reintenta. ----
  // Sin seguir la redirección: al terminar de guardar, el sistema manda a
  // integracion.php, que es justo lo que no se quiere abrir (ver arriba).
  const accion = new URL(formulario.getAttribute('action') || paginaRespuestas.url, paginaRespuestas.url).href;
  let final: Response;
  try {
    final = await fetch(accion, { method: 'POST', body: cuerpo, credentials: 'same-origin', redirect: 'manual' });
  } catch (_) {
    return { ok: false, motivo: 'respuestas', reintentable: false };
  }

  // La redirección es la señal de que la denuncia quedó guardada.
  if (final.type !== 'opaqueredirect') {
    const htmlFinal = await final.text().catch(() => '');
    if (esBloqueo(htmlFinal)) return { ok: false, motivo: 'bloqueo', reintentable: false };
    return { ok: false, motivo: 'respuestas', reintentable: false };
  }

  // ---- 3. Envío a Forest. Repetirlo es seguro: no duplica el radicado. ----
  const radicado = await enviarAForest(idDenuncia.getAttribute('value') || '', formId);
  return { ok: true, radicado };
}

/**
 * Pide a integracion-portal.php que envíe la denuncia a Forest y devuelve el
 * radicado, o null si no se obtuvo.
 *
 * La denuncia ya está guardada: si esto falla, se le confirma igual al
 * ciudadano, y queda en la base sin radicado para enviarla después.
 */
async function enviarAForest(idDenuncia: string, formId: string): Promise<string | null> {
  const cuerpo = new URLSearchParams({ ID_DENUNCIA: idDenuncia, FORM_ID: formId });
  for (let intento = 1; intento <= 3; intento++) {
    try {
      const r = await fetch(`${BASE}integracion-portal.php`, { method: 'POST', body: cuerpo, credentials: 'same-origin' });
      const j = await r.json().catch(() => null);
      if (j?.ok) return typeof j.radicado === 'string' && /^\d+-\d{4}-\d+$/.test(j.radicado) ? j.radicado : null;
      // Solo se reintenta si otra llamada por esta misma denuncia sigue esperando
      // a Forest. Si Forest no contestó, no: pudo haber creado el radicado sin
      // que llegara la respuesta, y repetir lo duplicaría en SIGI.
      if (j?.motivo !== 'en-curso') return null;
    } catch (_) {
      // Corte de red: se reintenta.
    }
    await new Promise(r => setTimeout(r, 3000 * intento));
  }
  return null;
}
