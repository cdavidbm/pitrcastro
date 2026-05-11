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
  const fallback = [
    'api::marco-legal.marco-legal.find',
    'api::marco-legal.marco-legal.findOne',
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
    return perms.length > 0 ? perms : fallback;
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

/**
 * Notifica a GitHub Actions cuando un editor publica/despublica/elimina
 * contenido, para disparar un rebuild + deploy del sitio Astro.
 *
 * Variables de entorno requeridas (en cms-strapi/.env):
 *   GITHUB_REPO         (e.g. "cdavidbm/pitrcastro")
 *   GITHUB_DISPATCH_TOKEN   PAT con scope Actions:write
 *
 * Si las dos no están definidas, esto es no-op (útil en dev sin tokens).
 *
 * Eventos de interés:
 *   - documents.publish   → publica un contenido
 *   - documents.unpublish → lo despublica
 *   - documents.delete    → lo borra
 *   (un .update sin publish ya está en draft, no afecta sitio público)
 */
function registerGithubDispatch(strapi: Core.Strapi) {
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_DISPATCH_TOKEN;

  if (!repo || !token) {
    strapi.log.info(
      '[github-dispatch] GITHUB_REPO o GITHUB_DISPATCH_TOKEN no configurados; rebuild automático deshabilitado'
    );
    return;
  }

  strapi.documents.use(async (ctx, next) => {
    const result = await next();
    const triggerActions = ['publish', 'unpublish', 'delete'];
    if (triggerActions.includes(ctx.action)) {
      // No esperamos al fetch — fire and forget para no bloquear al editor.
      void fetch(`https://api.github.com/repos/${repo}/dispatches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          event_type: 'strapi-publish',
          client_payload: {
            action: ctx.action,
            uid: ctx.uid,
            timestamp: new Date().toISOString(),
          },
        }),
      })
        .then((res) => {
          if (res.ok) {
            strapi.log.info(`[github-dispatch] ${ctx.action} ${ctx.uid} → 204 (build disparado)`);
          } else {
            strapi.log.error(`[github-dispatch] ${ctx.action} ${ctx.uid} → ${res.status}`);
          }
        })
        .catch((e) => {
          strapi.log.error(`[github-dispatch] error: ${e.message}`);
        });
    }
    return result;
  });

  strapi.log.info(`[bootstrap] github-dispatch activo → ${repo}`);
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublicPermissions(strapi);
    registerGithubDispatch(strapi);
  },
};
