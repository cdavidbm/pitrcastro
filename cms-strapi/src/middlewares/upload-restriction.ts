/**
 * Middleware de restriccion de uploads.
 *
 * Bloquea la subida de archivos ejecutables o scripts (webshells, malware)
 * y solo permite extensiones de documentos, imagenes y media institucional.
 *
 * Aplica solo a POST /upload (Media Library) — no afecta otras rutas.
 *
 * Si un editor intenta subir un .exe / .php / .js / .html / .sh / etc.,
 * recibe 400 Bad Request con explicacion clara.
 */

import type { Core } from '@strapi/strapi';

const ALLOWED: ReadonlySet<string> = new Set([
  // Documentos institucionales
  'pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt',
  'odt', 'ods', 'odp', 'rtf', 'txt', 'csv',
  // Imagenes
  'jpg', 'jpeg', 'png', 'gif', 'webp',
  // Video y audio institucional
  'mp4', 'mp3', 'ogg', 'webm', 'wav',
  // Compactos (rara vez, pero util)
  'zip',
]);

// Bloqueo explicito incluso si por error estuvieran en ALLOWED.
const BLOCKED: ReadonlySet<string> = new Set([
  'exe', 'msi', 'app', 'bat', 'cmd', 'sh', 'ps1', 'vbs', 'wsf',
  'php', 'phtml', 'phar', 'php3', 'php4', 'php5', 'phps',
  'js', 'mjs', 'jsx', 'ts', 'tsx',
  'html', 'htm', 'xhtml', 'svg', 'svgz',
  'asp', 'aspx', 'jsp', 'jspx',
  'pl', 'py', 'rb',
  'so', 'dll', 'jar', 'war', 'class',
]);

const isUploadEndpoint = (url: string): boolean => {
  const path = url.split('?')[0];
  return path === '/upload' || path === '/upload/';
};

const getExt = (filename: string): string => {
  const idx = filename.lastIndexOf('.');
  if (idx < 0) return '';
  return filename.slice(idx + 1).toLowerCase().trim();
};

interface UploadedFile {
  originalFilename?: string;
  name?: string;
  filepath?: string;
  mimetype?: string;
  size?: number;
}

const collectFiles = (ctxFiles: unknown): UploadedFile[] => {
  if (!ctxFiles || typeof ctxFiles !== 'object') return [];
  const files = (ctxFiles as { files?: UploadedFile | UploadedFile[] }).files;
  if (!files) return [];
  return Array.isArray(files) ? files : [files];
};

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    if (ctx.method !== 'POST' || !isUploadEndpoint(ctx.url)) {
      await next();
      return;
    }

    const files = collectFiles(ctx.request?.files);
    for (const f of files) {
      const name = String(f.originalFilename || f.name || '');
      const ext = getExt(name);
      if (!ext) {
        strapi.log.warn(`[upload-restriction] rechazado: sin extension (${name})`);
        return ctx.badRequest(
          'Archivo sin extension. Renombra el archivo con una extension valida (.pdf, .docx, .jpg, etc.) e intenta de nuevo.'
        );
      }
      if (BLOCKED.has(ext) || !ALLOWED.has(ext)) {
        strapi.log.warn(`[upload-restriction] rechazado: ${name} (.${ext})`);
        return ctx.badRequest(
          `Tipo de archivo no permitido: .${ext}. Solo se aceptan documentos (pdf, docx, xlsx, pptx, etc.), imagenes (jpg, png, webp) y media institucional (mp4, mp3).`
        );
      }
    }

    await next();
  };
};
