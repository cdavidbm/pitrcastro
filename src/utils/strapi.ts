/**
 * Fetcher para Strapi v5 usado durante el build de Astro.
 *
 * Convención: cada función getXxx() devuelve el objeto `data` ya desempacado
 * (sin la envoltura `{ data: ... }` de Strapi). Cualquier respuesta no-2xx
 * (404, 400, 403, 5xx) y los fetch que tiran se tratan como "data no
 * disponible": se devuelve null con un warning detallado en stdout, en vez
 * de matar el build.
 *
 * Por qué tolerar todo error: el build genera 360 páginas que dependen de
 * Strapi prod. Schemas en transición, permisos del rol Public, queries que
 * referencian campos que existen local pero no en prod, etc. — cualquiera
 * tira 4xx. Si el build muere en la primera página fallida, ningún cambio
 * llega a prod hasta que se arregle. Es preferible que el build complete
 * con páginas degradadas y un log visible del problema, y que cada consumer
 * .astro maneje null defensivamente.
 *
 * Los warnings quedan en el log de GitHub Actions y son la señal para
 * investigar deuda de schema/permisos sin bloquear deploys.
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
  let res: Response;
  try {
    res = await fetch(url, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
    });
  } catch (e) {
    console.warn(
      `[strapi] GET ${pathWithQuery} → fetch falló (${(e as Error).message}); devuelvo null.`
    );
    return null as T;
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.warn(
      `[strapi] GET ${pathWithQuery} → ${res.status}: ${body.slice(0, 200)}; devuelvo null.`
    );
    return null as T;
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
