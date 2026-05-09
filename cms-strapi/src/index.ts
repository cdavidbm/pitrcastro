import type { Core } from '@strapi/strapi';

/**
 * Permisos públicos garantizados en cada arranque (idempotente).
 * Astro consume estos endpoints en build-time. Mantén la lista corta:
 * solo content types de páginas públicas.
 */
const PUBLIC_READ_PERMISSIONS: string[] = [
  'api::marco-legal.marco-legal.find',
  'api::marco-legal.marco-legal.findOne',
];

async function ensurePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) {
    strapi.log.warn('[bootstrap] role "public" no encontrado; saltando permisos');
    return;
  }

  for (const action of PUBLIC_READ_PERMISSIONS) {
    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });
    if (existing) continue;
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
