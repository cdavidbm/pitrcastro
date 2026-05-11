/**
 * Normaliza un campo Strapi media a una URL utilizable.
 *
 * En Strapi v5 los campos media populados se devuelven como objetos
 * { id, url, name, ext, mime, ... }. La URL es relativa al host del CMS
 * (ej. "/uploads/foo_abc.pdf").
 *
 * Casos de entrada manejados:
 *   - string (legacy URL ya escrita por migraciones previas) → devuelta tal cual
 *   - objeto media { url } → URL extraída (con prefijo absoluto en dev)
 *   - null / undefined / "" → ""
 *   - URL absoluta http(s):// → tal cual
 *
 * En modo dev (Astro corriendo en otro puerto que Strapi) se prefija con
 * STRAPI_URL para que el browser pueda resolverla. En build de producción
 * se asume que nginx proxyea /uploads/ al contenedor Strapi.
 */
export interface StrapiMediaLike {
  id?: number | string;
  url?: string;
  name?: string;
  ext?: string;
  mime?: string;
  data?: { id?: number; attributes?: { url?: string } } | null;
}

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://127.0.0.1:1337';
const DEV_PREFIX = import.meta.env.DEV ? STRAPI_URL : '';

export function mediaUrl(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return '';
  const v = value as StrapiMediaLike;
  // v5 directo
  let url = v.url || '';
  // v4 fallback (data/attributes)
  if (!url && v.data && v.data.attributes && v.data.attributes.url) {
    url = v.data.attributes.url;
  }
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return DEV_PREFIX + url;
}
