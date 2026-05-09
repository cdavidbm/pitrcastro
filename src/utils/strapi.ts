/**
 * Fetcher para Strapi v5 usado durante el build de Astro.
 *
 * Convención: cada función getXxx() devuelve el objeto `data` ya desempacado
 * (sin la envoltura `{ data: ... }` de Strapi). Si Strapi está caído o el
 * endpoint falla, la función lanza un error que detiene el build con un
 * mensaje claro (mejor que producir HTML vacío silenciosamente).
 *
 * Variables de entorno (definidas en .env durante dev, en repo variables
 * del workflow durante build CI):
 *   STRAPI_URL   — URL base, ej: http://127.0.0.1:1337
 *   STRAPI_TOKEN — opcional, API token con read en los content types públicos.
 *                  No requerido si los endpoints están abiertos al rol Public.
 */

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://127.0.0.1:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;

export async function strapiGet<T>(pathWithQuery: string): Promise<T> {
  const url = `${STRAPI_URL}${pathWithQuery}`;
  const res = await fetch(url, {
    headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
  });
  if (!res.ok) {
    throw new Error(
      `[strapi] GET ${pathWithQuery} → ${res.status}: ${await res.text()}`
    );
  }
  const json = await res.json();
  return json.data as T;
}

// ============================================================
// Tipos de los content types (mantener en sync con cms-strapi/src/api)
// ============================================================

export interface RelatedLink {
  titulo: string;
  descripcion?: string;
  url: string;
  icon: string;
}

export interface MarcoLegalDocumento {
  nombre: string;
  descripcion?: string;
  file: string;
  externo: boolean;
}

export interface MarcoLegalSeccion {
  titulo: string;
  icon: string;
  documentos: MarcoLegalDocumento[];
}

export interface MarcoLegal {
  title: string;
  description: string;
  icon: string;
  secciones: MarcoLegalSeccion[];
  enlacesRelacionados: RelatedLink[];
}

// ============================================================
// Fetchers por content type
// ============================================================

export async function getMarcoLegal(): Promise<MarcoLegal> {
  return strapiGet<MarcoLegal>(
    '/api/marco-legal?populate[secciones][populate]=documentos&populate[enlacesRelacionados]=true'
  );
}
