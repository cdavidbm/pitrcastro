/**
 * Noticias — lectura desde el CMS.
 *
 * Antes cada noticia era un archivo de texto del repositorio y publicar una
 * exigía editar código y desplegar. Ahora viven en Strapi, donde la redacción
 * las crea sola. Este módulo las trae y las deja listas para las plantillas.
 *
 * Va aparte de `strapi-fetchers.ts` porque ese archivo se regenera solo y
 * borraría cualquier cosa escrita a mano.
 */

import { createMarkdownProcessor } from '@astrojs/markdown-remark';

import { strapiGet } from './strapi';
import { mediaUrl } from './strapi-media';

/** Imagen que se usa cuando la noticia se publica sin una propia. */
export const IMAGEN_POR_DEFECTO = '/images/noticia-placeholder.svg';

export interface Noticia {
  slug: string;
  titulo: string;
  fecha: string;
  resumen: string;
  /** URL de la imagen de portada; ya resuelta, nunca vacía. */
  imagen: string;
  /** Cuerpo en markdown, tal como lo escribió la redacción. */
  contenido: string;
  categoria: 'noticia' | 'periodico';
}

/**
 * Trae todas las noticias publicadas, de la más reciente a la más antigua.
 *
 * Se piden 1000 de una vez: el CMS admite hasta 5000 por llamada
 * (`maxLimit` en cms-strapi/config/api.ts) y hoy hay 83.
 */
export async function getNoticias(): Promise<Noticia[]> {
  const datos = await strapiGet<any[]>(
    '/api/noticias?populate=imagen&sort=fecha:desc&pagination[pageSize]=1000'
  );

  if (!Array.isArray(datos)) return [];

  return datos
    .filter((n) => n?.slug)
    .map((n) => ({
      slug: n.slug,
      titulo: n.titulo || '',
      fecha: n.fecha || '',
      resumen: n.resumen || '',
      imagen: mediaUrl(n.imagen) || IMAGEN_POR_DEFECTO,
      contenido: n.contenido || '',
      categoria: n.categoria === 'periodico' ? 'periodico' : 'noticia',
    }));
}

/**
 * Convierte el cuerpo de la noticia a HTML.
 *
 * Usa el mismo motor con el que Astro venía procesando los archivos de texto,
 * para que lo publicado desde el panel se vea exactamente igual que antes.
 * El procesador se crea una sola vez y se reutiliza durante todo el build.
 */
let procesador: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;

export async function contenidoAHtml(markdown: string): Promise<string> {
  if (!markdown?.trim()) return '';
  procesador ??= await createMarkdownProcessor({});
  const { code } = await procesador.render(markdown);
  return code;
}
