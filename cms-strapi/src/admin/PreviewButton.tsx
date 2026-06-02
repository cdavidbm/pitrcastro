/**
 * PreviewButton — botón "Ver en el sitio" que aparece en la barra
 * derecha del editor de Strapi v5 (editView / right-links).
 *
 * Funciona en dos pasos:
 *
 * 1. Lee el slug del content-type actual desde la URL del browser
 *    (Strapi v5 los URLs del admin tienen forma
 *    /admin/content-manager/(collection|single)-types/api::slug.slug/...).
 *
 * 2. Busca el slug en el mapping `slug-to-url.json` (generado por
 *    cms-strapi/scripts/gen-slug-to-url.mjs a partir del atributo
 *    `strapiSlug` de las páginas Astro). Si está, arma la URL completa
 *    usando el mismo host del admin (asume Astro en :4321 para dev y
 *    en raíz para server).
 *
 * Si el content-type no tiene URL pública (algunos son referenciados
 * desde otros, no son páginas en sí), el botón NO se renderiza.
 */

import React from 'react';
import { Link } from '@strapi/design-system';

import slugToUrl from './slug-to-url.json';

// Mapping inline para no depender del typeof JSON imports en TS strict
const MAP: Record<string, string> = slugToUrl as Record<string, string>;

/**
 * Parsea el slug del content-type desde la URL actual.
 * /admin/content-manager/single-types/api::ciprep.ciprep → "ciprep"
 * /admin/content-manager/collection-types/api::normativa-delito.normativa-delito/12 → "normativa-delito"
 * Devuelve null si no es una URL de content-type editor.
 */
function getCurrentSlug(): string | null {
  if (typeof window === 'undefined') return null;
  const m = window.location.pathname.match(
    /\/content-manager\/(?:single|collection)-types\/api::([^.]+)\./
  );
  return m ? m[1] : null;
}

/**
 * Compone la URL completa del sitio público.
 * - localhost (dev): http://localhost:4321 + path
 * - cualquier otro host (server/prod): mismo host + path
 *   (asume que el sitio Astro vive en raíz, no en :4321)
 */
function buildPublicUrl(path: string): string {
  if (typeof window === 'undefined') return path;
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return `http://localhost:4321${path}`;
  }
  return `${window.location.protocol}//${window.location.host}${path}`;
}

const PreviewButton: React.FC = () => {
  const slug = getCurrentSlug();
  if (!slug) return null;

  const sitePath = MAP[slug];
  if (!sitePath) return null;

  const url = buildPublicUrl(sitePath);

  return (
    <Link href={url} isExternal>
      Ver en el sitio ↗
    </Link>
  );
};

export default PreviewButton;
