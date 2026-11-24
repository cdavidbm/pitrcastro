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
    // Denuncias: textos e imágenes del formulario de /denuncias. También se
    // creó a mano, porque no sale de un JSON de pages.
    'api::denuncias.denuncias.find',
    'api::denuncias.denuncias.findOne',
    'api::pregunta-denuncia.pregunta-denuncia.find',
    'api::pregunta-denuncia.pregunta-denuncia.findOne',
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


/**
 * Dirección (slug) automática de las noticias: al guardar, si falta, se genera del título
 * (única); en una actualización se conserva la que ya tenía, para que los enlaces no se rompan.
 * En el panel el campo queda de solo lectura (`formularios`).
 */
const CON_SLUG_AUTOMATICO = ['api::noticia.noticia'];

function slugAutomatico(strapi: Core.Strapi) {
  strapi.documents.use(async (ctx, next) => {
    if (!CON_SLUG_AUTOMATICO.includes(ctx.uid) || (ctx.action !== 'create' && ctx.action !== 'update')) return next();
    const params = ctx.params as { data?: Record<string, unknown>; documentId?: string };
    if (!params.data || params.data.slug) return next();
    if (ctx.action === 'update' && params.documentId) {
      const actual = await strapi.documents(ctx.uid as 'api::noticia.noticia').findOne({ documentId: params.documentId, fields: ['slug'] });
      if (actual?.slug) {
        params.data.slug = actual.slug;
        return next();
      }
    }
    params.data.slug = await strapi.plugin('content-manager').service('uid').generateUIDField({
      contentTypeUID: ctx.uid, field: 'slug', data: params.data,
    });
    return next();
  });
}

/**
 * Formularios de la oficina de prensa (noticias y banners) en español y en el orden en que se
 * llenan. Se aplica en cada arranque y solo escribe si algo cambió.
 */
type Fila = { name: string; size: number }[];
type Campo = { etiqueta: string; ayuda?: string; oculto?: boolean };
const FORMULARIOS: Record<string, { campos: Record<string, Campo>; filas: Fila[]; ajustes?: Record<string, unknown> }> = {
  'api::noticia.noticia': {
    campos: {
      titulo: { etiqueta: 'Título', ayuda: 'El titular completo, tal como debe leerse en el sitio.' },
      slug: { etiqueta: 'Dirección (slug)', ayuda: 'Se genera sola a partir del título al guardar. No se puede cambiar, para que los enlaces no se rompan.' },
      fecha: { etiqueta: 'Fecha de publicación', ayuda: 'La de la noticia, no la del día en que se carga. Ordena el listado.' },
      categoria: { etiqueta: 'Categoría', ayuda: '«noticia» casi siempre; «periodico» solo para las ediciones del periódico.' },
      resumen: { etiqueta: 'Resumen', ayuda: 'Una o dos frases para la tarjeta del listado. Opcional.' },
      imagen: { etiqueta: 'Imagen principal', ayuda: 'La foto de la noticia, horizontal. Si no hay, el sitio pone la imagen institucional.' },
      contenido: { etiqueta: 'Contenido', ayuda: 'El cuerpo de la noticia. Puede pegarlo directamente desde Word: se conservan los párrafos, las negrillas, las cursivas, los enlaces y las listas.' },
    },
    filas: [
      [{ name: 'titulo', size: 12 }],
      [{ name: 'fecha', size: 6 }, { name: 'categoria', size: 6 }],
      [{ name: 'resumen', size: 12 }],
      [{ name: 'imagen', size: 12 }],
      [{ name: 'contenido', size: 12 }],
      [{ name: 'slug', size: 12 }],
    ],
    // La lista del panel, de la más reciente a la más antigua
    ajustes: { defaultSortBy: 'fecha', defaultSortOrder: 'DESC' },
  },
  'api::slider.slider': {
    campos: {
      slides: { etiqueta: 'Banners', ayuda: 'Salen en este orden: arrastre cada uno por sus seis puntos para moverlo. Use «¿Se muestra?» para retirarlo sin borrarlo.' },
      autoplay: { etiqueta: 'Pasan solos' },
      interval: { etiqueta: 'Duración de cada banner (milisegundos)', ayuda: '6000 son seis segundos.' },
      name: { etiqueta: 'Nombre', oculto: true },
      description: { etiqueta: 'Descripción', oculto: true },
    },
    filas: [
      [{ name: 'slides', size: 12 }],
      [{ name: 'autoplay', size: 6 }, { name: 'interval', size: 6 }],
    ],
  },
};

async function formularios(strapi: Core.Strapi) {
  const servicio = strapi.plugin('content-manager').service('content-types');
  for (const [uid, f] of Object.entries(FORMULARIOS)) {
    const modelo = (strapi.contentTypes as unknown as Record<string, unknown>)[uid];
    if (!modelo) continue;
    const actual = await servicio.findConfiguration(modelo);
    const metadatas = structuredClone(actual.metadatas ?? {});
    for (const [campo, c] of Object.entries(f.campos)) {
      const m = metadatas[campo];
      if (!m) continue;
      metadatas[campo] = {
        ...m,
        edit: {
          ...m.edit, label: c.etiqueta, description: c.ayuda ?? '',
          ...(c.oculto ? { visible: false } : {}),
          ...(campo === 'slug' && CON_SLUG_AUTOMATICO.includes(uid) ? { editable: false } : {}),
        },
        list: m.list ? { ...m.list, label: c.etiqueta } : m.list,
      };
    }
    const settings = { ...actual.settings, ...(f.ajustes ?? {}) };
    if (JSON.stringify(metadatas) === JSON.stringify(actual.metadatas) && JSON.stringify(f.filas) === JSON.stringify(actual.layouts.edit)
      && JSON.stringify(settings) === JSON.stringify(actual.settings)) continue;
    await servicio.updateConfiguration(modelo, { settings, metadatas, layouts: { ...actual.layouts, edit: f.filas } });
    strapi.log.info(`[bootstrap] formulario ordenado: ${uid}`);
  }
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    slugAutomatico(strapi);
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublicPermissions(strapi);
    await formularios(strapi);
  },
};
