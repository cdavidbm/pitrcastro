/**
 * Contenido editable del formulario de denuncias (/denuncias).
 *
 * Los textos y las imágenes de las seis pantallas se administran en Strapi, en
 * "Denuncias (formulario)". Las preguntas sobre los hechos NO están ahí: las
 * entrega el sistema que recibe las denuncias, y se leen al cargar la página
 * (ver `denuncias-legado.ts`).
 *
 * Si Strapi no responde o el contenido está vacío, la compilación se detiene a
 * propósito: es preferible no publicar a publicar el canal oficial de denuncias
 * con las pantallas en blanco.
 */
import { getDenuncias, getPreguntasDenuncia } from './strapi-fetchers';

export async function cargarContenidoDenuncias(): Promise<any> {
  const cms: any = await getDenuncias();
  const falta = !cms || !cms.portada || !cms.pantallaEntidades || !cms.pantallaConducta
    || !cms.pantallaDatos || !cms.pantallaHechos || !cms.pantallaConfirmacion
    || !Array.isArray(cms.entidades) || cms.entidades.length === 0;
  if (falta) {
    throw new Error(
      'No se pudo leer el contenido de "Denuncias (formulario)" desde Strapi. ' +
      'Revise que el contenido exista y esté publicado antes de volver a publicar el sitio.'
    );
  }
  return cms;
}

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Convierte el texto de Strapi en HTML, permitiendo **negrita** y _cursiva_.
 *
 * Se escapa todo lo demás: lo que se escribe en el panel es texto, no HTML.
 */
export function conNegritas(texto: string | null | undefined): string {
  if (!texto) return '';
  const seguro = texto.replace(/[&<>"']/g, (c) => ESCAPES[c]);
  return seguro
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>');
}

/**
 * Preguntas de los hechos cuya redacción se corrigió en el panel, listas para
 * el formulario: `{ formulario: { campo: { original, texto } } }`.
 *
 * En el panel cada pregunta es UNA entrada, aunque varias conductas la hagan.
 * Aquí se reparte a cada casilla donde aparece, devolviéndole su número —que es
 * de la conducta, no de la pregunta: la misma es la 8 en Cohecho y la 14 en
 * Peculado—.
 *
 * Solo viajan las que de verdad se corrigieron. `original` es el texto tal como
 * lo pregunta el sistema que recibe las denuncias en esa casilla concreta; si
 * allá lo cambian, deja de coincidir y la corrección no se aplica ahí (ver
 * `denuncias-legado.ts`), aunque siga aplicándose en las demás conductas.
 *
 * Si el listado no se puede leer, el formulario muestra los textos del sistema
 * que recibe: la redacción es una mejora, no un requisito para denunciar.
 */
export async function reescriturasDePreguntas(): Promise<Record<string, Record<string, { original: string; texto: string }>>> {
  let preguntas: any[] = [];
  try {
    preguntas = (await getPreguntasDenuncia()) ?? [];
  } catch (_) {
    console.warn('[denuncias] no se pudo leer la redacción de las preguntas; se usarán los textos del sistema que las recibe.');
    return {};
  }

  const salida: Record<string, Record<string, { original: string; texto: string }>> = {};
  for (const p of preguntas) {
    if (!p?.texto || !p?.original || !Array.isArray(p.apariciones)) continue;
    if (p.texto.trim() === p.original.trim()) continue;   // nadie la ha corregido

    for (const a of p.apariciones) {
      if (!a?.formulario || !a?.campo || !a?.original) continue;
      const texto = a.numero ? `${a.numero} ${p.texto.trim()}` : p.texto.trim();
      (salida[a.formulario] ||= {})[a.campo] = { original: a.original, texto };
    }
  }
  return salida;
}
