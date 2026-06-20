import type { APIRoute } from 'astro';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import navigation from '../content/settings/navigation.json';

interface SearchEntry {
  t: string;       // title
  u: string;       // url
  k: string;       // kind: p=page, s=section, n=news, d=dynamic, m=memoria/album
  p?: string;      // parent (breadcrumb hint)
}

interface PageJson {
  title?: string;
  description?: string;
  subtitle?: string;
  slug?: string;
  sections?: Array<{ sectionTitle?: string; titulo?: string }>;
  subdirecciones?: Array<{ titulo?: string; categorias?: Array<{ titulo?: string }> }>;
  categorias?: Array<{ titulo?: string }>;
  anios?: Array<{ anio?: string; label?: string }>;
}

// ---------------------------------------------------------------------------
// 1. Inventario de URLs estáticas (.astro) leído via Node fs en build time
// ---------------------------------------------------------------------------

interface AstroRoute {
  url: string;
  jsonPath?: string;     // 'agencia/mision-vision' (relativo a content/pages, sin .json)
  fallbackTitle?: string;
}

// process.cwd() en build apunta al root del proyecto (donde está package.json)
const PAGES_DIR = join(process.cwd(), 'src', 'pages');
const JSON_IMPORT_RE = /from\s+['"](?:\.\.\/)+content\/pages\/([^'"]+)\.json['"]/;
const BASE_TITLE_RE = /<Base[^>]+title=\{?["']([^"']+)["']/;

function walkAstro(dir: string): string[] {
  const out: string[] = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkAstro(p));
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      out.push(p);
    }
  }
  return out;
}

function pageRelativeUrl(absPath: string): string | null {
  let rel = absPath
    .slice(PAGES_DIR.length)
    .replace(/\\/g, '/')
    .replace(/^\//, '')
    .replace(/\.astro$/, '');
  if (!rel) return null;
  if (rel.includes('[')) return null;
  if (rel.startsWith('admin/') || rel === 'admin') return null;
  if (rel.split('/').some((p) => p.startsWith('_'))) return null;
  let url = '/' + rel;
  if (url.endsWith('/index')) url = url.slice(0, -6) || '/';
  return url;
}

function stripGlobPrefix(path: string, suffix: string): string | null {
  const cleaned = path.replace(/\/\.\//g, '/');
  const idx = cleaned.indexOf(suffix);
  if (idx === -1) return null;
  let rel = cleaned.slice(idx + suffix.length);
  rel = rel.replace(/^(\.\/)+/, '');
  return rel;
}

const astroRoutes: AstroRoute[] = [];
for (const filePath of walkAstro(PAGES_DIR)) {
  const url = pageRelativeUrl(filePath);
  if (!url) continue;
  let content = '';
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    // ignorar lecturas fallidas, igual emitimos la ruta
  }
  const jsonMatch = content.match(JSON_IMPORT_RE);
  const titleMatch = content.match(BASE_TITLE_RE);
  astroRoutes.push({
    url,
    jsonPath: jsonMatch?.[1],
    fallbackTitle: titleMatch?.[1],
  });
}

// ---------------------------------------------------------------------------
// 2. Carga de page JSONs
// ---------------------------------------------------------------------------

const pageJsons = import.meta.glob<PageJson>('../content/pages/**/*.json', {
  eager: true,
});

// Mapa: 'agencia/mision-vision' → PageJson
const pageJsonByPath: Record<string, PageJson> = {};
for (const [path, json] of Object.entries(pageJsons)) {
  const rel = stripGlobPrefix(path, 'content/pages/');
  if (!rel) continue;
  const key = rel.replace(/\.json$/, '');
  pageJsonByPath[key] = json;
}

// ---------------------------------------------------------------------------
// 3. News + colecciones dinámicas (mapeo URL ↔ JSON conocido)
// ---------------------------------------------------------------------------

const newsFiles = import.meta.glob<{
  frontmatter: { title: string; date?: string; draft?: boolean };
}>('../content/news/*.md', { eager: true });

interface DynamicItem {
  title?: string;
  titulo?: string;
  nombre?: string;
}

const memEduFiles = import.meta.glob<DynamicItem>(
  '../content/pages/observatorio/eje-de-educacion/memorias/*.json',
  { eager: true }
);
const memPartFiles = import.meta.glob<DynamicItem>(
  '../content/pages/observatorio/eje-de-participacion/memorias/*.json',
  { eager: true }
);
const galeriaFiles = import.meta.glob<DynamicItem>(
  '../content/pages/galeria/*.json',
  { eager: true }
);
const direccionamientoFiles = import.meta.glob<DynamicItem>(
  '../content/pages/agencia/direccionamiento/*.json',
  { eager: true }
);

function dynamicTitle(mod: DynamicItem): string | undefined {
  return mod.title || mod.titulo || mod.nombre;
}

// ---------------------------------------------------------------------------
// 4. Helpers
// ---------------------------------------------------------------------------

// Slugs cuya humanización por defecto produce textos torpes (ej.
// "Tu P Q R S Al Dia"). Mapeo manual a un título más legible para los hits
// de búsqueda que sólo tienen el URL como pista.
const SLUG_TITLE_OVERRIDES: Record<string, string> = {
  '/tu-p-q-r-s-al-dia': 'PQRSDF — Peticiones, Quejas, Reclamos y Solicitudes',
  '/p-q-r-s-servidores-agencia-itrc': 'PQRSDF para servidores de la Agencia ITRC',
  '/audiositrc': 'Audios ITRC',
  '/ciprep': 'Congreso CIPREP',
};

// Decodifica entidades HTML comunes que aparecen en títulos heredados del
// WP origen (en-dash, em-dash, comillas tipográficas, ampersand). Sin esto
// los hits muestran literalmente "&#8211;" en el panel del buscador.
function decodeEntities(s: string): string {
  if (!s) return s;
  return s
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8230;/g, '…')
    .replace(/&#0*39;/g, "'")
    .replace(/&#0*34;/g, '"')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&Ntilde;/g, 'Ñ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function deriveTitle(astroRoute: AstroRoute, json?: PageJson): string {
  if (SLUG_TITLE_OVERRIDES[astroRoute.url]) return SLUG_TITLE_OVERRIDES[astroRoute.url];
  if (json?.title) return json.title;
  if (astroRoute.fallbackTitle) return astroRoute.fallbackTitle;
  // Fallback: humanize URL last segment
  const segs = astroRoute.url.replace(/^\//, '').split('/');
  const last = segs[segs.length - 1] || 'Inicio';
  return last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function addSectionEntries(
  entries: SearchEntry[],
  json: PageJson,
  pageUrl: string,
  pageTitle: string
) {
  // sections[].sectionTitle
  for (const s of json.sections ?? []) {
    const t = s.sectionTitle || s.titulo;
    if (t) entries.push({ t, u: pageUrl, k: 's', p: pageTitle });
  }
  // subdirecciones (gestion-misional pattern)
  for (const sub of json.subdirecciones ?? []) {
    if (sub.titulo) entries.push({ t: sub.titulo, u: pageUrl, k: 's', p: pageTitle });
    for (const cat of sub.categorias ?? []) {
      if (cat.titulo)
        entries.push({ t: cat.titulo, u: pageUrl, k: 's', p: pageTitle });
    }
  }
  // categorias top-level
  for (const cat of json.categorias ?? []) {
    if (cat.titulo) entries.push({ t: cat.titulo, u: pageUrl, k: 's', p: pageTitle });
  }
}

// ---------------------------------------------------------------------------
// 5. Endpoint
// ---------------------------------------------------------------------------

export const GET: APIRoute = () => {
  const entries: SearchEntry[] = [];

  // 5.1 Items del menú principal y footer
  const navParents: Array<{ items: any[]; group?: string }> = [
    { items: navigation.mainMenu },
    { items: navigation.footerLinks ?? [], group: 'Footer' },
  ];
  for (const { items, group } of navParents) {
    for (const item of items) {
      if (item.url && item.url !== '#' && !item.external) {
        entries.push({ t: item.label, u: item.url, k: 'p', p: group });
      } else if (item.external && item.url) {
        entries.push({ t: item.label, u: item.url, k: 'p', p: group || 'Externo' });
      }
      if ('children' in item && item.children) {
        for (const child of item.children) {
          if (!child.external && child.url) {
            entries.push({ t: child.label, u: child.url, k: 'p', p: item.label });
          } else if (child.external && child.url) {
            entries.push({
              t: child.label,
              u: child.url,
              k: 'p',
              p: `${item.label} (externo)`,
            });
          }
        }
      }
    }
  }

  // 5.2 Páginas estáticas (.astro) con su JSON asociado
  for (const route of astroRoutes) {
    const json = route.jsonPath ? pageJsonByPath[route.jsonPath] : undefined;
    const title = deriveTitle(route, json);
    entries.push({ t: title, u: route.url, k: 'p' });

    // Aliases descriptivos: subtitle/description (si difieren del título)
    if (json?.subtitle && json.subtitle !== title) {
      entries.push({ t: json.subtitle, u: route.url, k: 's', p: title });
    }

    // Secciones internas
    if (json) {
      addSectionEntries(entries, json, route.url, title);
    }
  }

  // 5.3 News
  for (const [path, mod] of Object.entries(newsFiles)) {
    const fm = mod.frontmatter;
    if (fm.draft) continue;
    const slug = path.replace('../content/news/', '').replace('.md', '');
    entries.push({
      t: fm.title,
      u: `/prensa/noticias/${slug}`,
      k: 'n',
      p: 'Noticias',
    });
  }

  // 5.4 Memorias — Educación
  for (const [path, mod] of Object.entries(memEduFiles)) {
    const slug = path
      .replace('../content/pages/observatorio/eje-de-educacion/memorias/', '')
      .replace('.json', '');
    const t = dynamicTitle(mod);
    if (t) {
      entries.push({
        t,
        u: `/observatorio/eje-de-educacion/memorias/${slug}`,
        k: 'm',
        p: 'Memorias — Educación',
      });
    }
  }

  // 5.5 Memorias — Participación
  for (const [path, mod] of Object.entries(memPartFiles)) {
    const slug = path
      .replace('../content/pages/observatorio/eje-de-participacion/memorias/', '')
      .replace('.json', '');
    const t = dynamicTitle(mod);
    if (t) {
      entries.push({
        t,
        u: `/observatorio/eje-de-participacion/memorias/${slug}`,
        k: 'm',
        p: 'Memorias — Participación',
      });
    }
  }

  // 5.6 Galería (álbumes)
  for (const [path, mod] of Object.entries(galeriaFiles)) {
    const slug = path.replace('../content/pages/galeria/', '').replace('.json', '');
    const t = dynamicTitle(mod);
    if (t) {
      entries.push({ t, u: `/galeria/${slug}`, k: 'm', p: 'Galería' });
    }
  }

  // 5.7 Direccionamiento estratégico (planes/políticas/informes)
  for (const [path, mod] of Object.entries(direccionamientoFiles)) {
    const slug = path
      .replace('../content/pages/agencia/direccionamiento/', '')
      .replace('.json', '');
    const t = dynamicTitle(mod);
    if (t) {
      entries.push({
        t,
        u: `/agencia/direccionamiento-estrategico/${slug}`,
        k: 'd',
        p: 'Direccionamiento Estratégico',
      });
    }
  }

  // 5.8 Alias / sinónimos: términos que el ciudadano busca pero no están
  // en el título canónico de la página destino. Se inyectan como entradas
  // extra (no reemplazan al título oficial).
  const aliases: SearchEntry[] = [
    { t: 'Contacto', u: '/canales-de-atencion-al-ciudadano', k: 's', p: 'Alias' },
    { t: 'Sede principal', u: '/sede-y-horarios', k: 's', p: 'Alias' },
    { t: 'Horarios de atención', u: '/sede-y-horarios', k: 's', p: 'Alias' },
    { t: 'Trabajo en la Agencia', u: '/ofertas-de-empleo', k: 's', p: 'Alias' },
    { t: 'Empleo', u: '/ofertas-de-empleo', k: 's', p: 'Alias' },
    { t: 'Convocatorias', u: '/ofertas-de-empleo', k: 's', p: 'Alias' },
    { t: 'Salario', u: '/escala-salarial', k: 's', p: 'Alias' },
    { t: 'Sueldos', u: '/escala-salarial', k: 's', p: 'Alias' },
    { t: 'Sanciones disciplinarias', u: '/relatoria', k: 's', p: 'Alias' },
    { t: 'Fallos disciplinarios', u: '/relatoria', k: 's', p: 'Alias' },
    { t: 'PQRSDF', u: '/tu-p-q-r-s-al-dia', k: 's', p: 'Alias' },
    { t: 'Denuncias', u: 'https://www.itrc.gov.co/denuncias', k: 's', p: 'Alias (externo)' },
    { t: 'Hoja de vida funcionarios', u: '/agencia/directorio', k: 's', p: 'Alias' },
    { t: 'Contratos públicos', u: '/contratacion-suscrita', k: 's', p: 'Alias' },
    { t: 'SECOP', u: '/contratacion-suscrita', k: 's', p: 'Alias' },
    { t: 'Galería de fotos', u: '/galeria', k: 's', p: 'Alias' },
    { t: 'Información para niños', u: '/observatorio/eje-de-educacion/itrc-para-ninos', k: 's', p: 'Alias' },
    { t: 'Cartilla', u: '/cartilla-al-ciudadano', k: 's', p: 'Alias' },
    { t: 'Carta de trato digno', u: '/carta-trato-digno', k: 's', p: 'Alias' },
    { t: 'Organigrama', u: '/agencia/organigrama', k: 's', p: 'Alias' },
    { t: 'Director', u: '/agencia/equipo-directivo', k: 's', p: 'Alias' },
    { t: 'Equipo directivo', u: '/agencia/equipo-directivo', k: 's', p: 'Alias' },
  ];
  entries.push(...aliases);

  // 5.9 Normalizar títulos (decodificar entidades HTML legadas del WP origen)
  for (const e of entries) {
    e.t = decodeEntities(e.t);
    if (e.p) e.p = decodeEntities(e.p);
  }

  // 5.10 Dedupe: una entrada por URL. La primera entrada en una URL gana
  // (orden: menú principal → páginas → noticias → memorias → aliases).
  // Esto evita que el slug autogenerado "Cartilla Al Ciudadano" oculte al
  // título correcto del menú "Cartilla al ciudadano". Los aliases sólo
  // entran si su URL aún no apareció con un título oficial.
  const seenUrls = new Set<string>();
  const unique: SearchEntry[] = [];
  for (const e of entries) {
    // Secciones (k='s') sí permiten duplicar URL — son anclas distintas
    // dentro de la misma página y aportan al buscador.
    if (e.k === 's') {
      const key = `${e.t}|${e.u}`;
      if (seenUrls.has(key)) continue;
      seenUrls.add(key);
      unique.push(e);
      continue;
    }
    if (seenUrls.has(e.u)) continue;
    seenUrls.add(e.u);
    unique.push(e);
  }

  return new Response(JSON.stringify(unique), {
    headers: { 'Content-Type': 'application/json' },
  });
};
