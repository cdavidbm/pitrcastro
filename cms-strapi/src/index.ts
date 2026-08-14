import type { Core } from '@strapi/strapi';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Permisos públicos garantizados en cada arranque (idempotente).
 * Astro consume estos endpoints en build-time. Se construyen
 * dinámicamente desde el manifest del autogen (scripts/.autogen-manifest.json).
 * Si el manifest no existe, cae a la lista mínima histórica.
 */
function loadPublicReadPermissions(): string[] {
  // Strapi develop compila a dist/ y ejecuta desde dist/src, así que __dirname
  // varía entre dev y build. process.cwd() siempre apunta al root del proyecto
  // (cms-strapi/) cuando el comando se invoca con npm run develop|start.
  const manifestPath = path.resolve(process.cwd(), 'scripts/.autogen-manifest.json');
  // Settings globales hardcoded — fuera del autogen porque no salen de JSONs
  // de pages. Se administran como single-types en Strapi.
  const settings = [
    'api::site.site.find',
    'api::site.site.findOne',
    'api::contact.contact.find',
    'api::contact.contact.findOne',
    'api::navigation.navigation.find',
    'api::navigation.navigation.findOne',
    'api::quick-access.quick-access.find',
    'api::quick-access.quick-access.findOne',
    // Noticias: creada a mano para que la redacción publique desde el panel,
    // así que no aparece en el manifest del autogen.
    'api::noticia.noticia.find',
    'api::noticia.noticia.findOne',
  ];
  const fallback = [
    'api::marco-legal.marco-legal.find',
    'api::marco-legal.marco-legal.findOne',
    ...settings,
  ];
  if (!fs.existsSync(manifestPath)) return fallback;
  try {
    const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const perms: string[] = [];
    for (const sp of m.singlePages || []) {
      perms.push(`api::${sp.slug}.${sp.slug}.find`);
      perms.push(`api::${sp.slug}.${sp.slug}.findOne`);
    }
    for (const c of m.collections || []) {
      perms.push(`api::${c.slug}.${c.slug}.find`);
      perms.push(`api::${c.slug}.${c.slug}.findOne`);
    }
    // Siempre incluimos las settings hardcoded, incluso si el manifest existe.
    return perms.length > 0 ? [...perms, ...settings] : fallback;
  } catch {
    return fallback;
  }
}

const PUBLIC_READ_PERMISSIONS: string[] = loadPublicReadPermissions();

async function ensurePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) {
    strapi.log.warn('[bootstrap] role "public" no encontrado; saltando permisos');
    return;
  }

  // Una sola query para todos los permisos del rol public. Sin esto el
  // arranque hacía 2N+1 queries secuenciales (con N=144 content types
  // = ~290 queries) — pesaba ~30-60s del "Loading Strapi" en cada start.
  const existing = await strapi.db.query('plugin::users-permissions.permission').findMany({
    where: { role: publicRole.id, action: { $in: PUBLIC_READ_PERMISSIONS } },
    select: ['action'],
  });
  const existingActions = new Set<string>(existing.map((p: { action: string }) => p.action));

  const missing = PUBLIC_READ_PERMISSIONS.filter((a) => !existingActions.has(a));
  if (missing.length === 0) return;

  for (const action of missing) {
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action, role: publicRole.id },
    });
    strapi.log.info(`[bootstrap] permiso público concedido: ${action}`);
  }
}


export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublicPermissions(strapi);
  },
};
