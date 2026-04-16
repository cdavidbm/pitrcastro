/**
 * Base URL for document hosting.
 *
 * Controls where all PDFs, XLSX, images, and other binary documents are served from.
 * This is the SINGLE source of truth for document URLs across the entire portal.
 *
 * Values:
 *   "/documentos"                           → same-server (Nginx, datacenter, dev)
 *   "https://documentos.itrc.gov.co"        → Azure Blob Storage / CDN
 *   "https://portal.itrc.gov.co/documentos" → datacenter with subdomain
 *   ""                                      → keep original WP URLs (transitional)
 *
 * The build-time environment variable DOCS_BASE_URL overrides this default.
 */
export const DOCS_BASE_URL: string =
  import.meta.env.DOCS_BASE_URL || '/documentos';
