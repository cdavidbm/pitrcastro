import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  // Bloqueo de uploads ejecutables/scripts en /upload (webshells, malware).
  // Solo permite documentos, imagenes y media institucional.
  'global::upload-restriction',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
