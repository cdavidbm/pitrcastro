import type { APIRoute } from 'astro';
import navigation from '../content/settings/navigation.json';

interface SearchEntry {
  t: string;   // title
  u: string;   // url
  k: string;   // kind: p=page, s=section, n=news
  p?: string;  // parent page title
}

interface PageJson {
  title?: string;
  sections?: Array<{ sectionTitle?: string }>;
}

function addNavItems(entries: SearchEntry[], items: typeof navigation.mainMenu) {
  for (const item of items) {
    if (item.url && item.url !== '#') {
      entries.push({ t: item.label, u: item.url, k: 'p' });
    }
    if ('children' in item && item.children) {
      for (const child of item.children) {
        entries.push({ t: child.label, u: child.url, k: 'p', p: item.label });
      }
    }
  }
}

function addPageSections(entries: SearchEntry[], page: PageJson, pageUrl: string) {
  for (const section of page.sections ?? []) {
    if (section.sectionTitle) {
      entries.push({ t: section.sectionTitle, u: pageUrl, k: 's', p: page.title });
    }
  }
}

const pageFiles = import.meta.glob<PageJson>('../content/pages/**/*.json', { eager: true });

const pageUrlMap: Record<string, string> = {
  'transparencia.json': '/transparencia',
  'participa.json': '/participa',
  'prensa.json': '/prensa/noticias',
  'mision-vision.json': '/agencia/mision-vision',
  'organigrama.json': '/agencia/organigrama',
  'equipo-directivo.json': '/agencia/equipo-directivo',
  'direccionamiento-estrategico.json': '/agencia/direccionamiento-estrategico',
  'sistema-integrado-de-gestion.json': '/agencia/sistema-integrado-de-gestion',
  'gestion-misional.json': '/agencia/gestion-misional',
  'sistema-de-control-interno.json': '/agencia/control-interno',
  'informacion-financiera.json': '/agencia/informacion-financiera',
  'politicas.json': '/agencia/direccionamiento-estrategico/politicas',
  'planes.json': '/agencia/direccionamiento-estrategico/planes',
  'informes.json': '/agencia/direccionamiento-estrategico/informes',
};

const newsFiles = import.meta.glob<{ frontmatter: { title: string; draft?: boolean } }>(
  '../content/news/*.md',
  { eager: true }
);

export const GET: APIRoute = () => {
  const entries: SearchEntry[] = [];

  addNavItems(entries, navigation.mainMenu);

  for (const [path, page] of Object.entries(pageFiles)) {
    const filename = path.split('/').pop() || '';
    const url = pageUrlMap[filename];
    if (url) addPageSections(entries, page, url);
  }

  for (const [path, mod] of Object.entries(newsFiles)) {
    const { frontmatter } = mod;
    if (frontmatter.draft) continue;
    const slug = path.replace('../content/news/', '').replace('.md', '');
    entries.push({ t: frontmatter.title, u: `/prensa/noticias/${slug}`, k: 'n', p: 'Noticias' });
  }

  const seen = new Set<string>();
  const unique = entries.filter((e) => {
    const key = `${e.t}|${e.u}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return new Response(JSON.stringify(unique), {
    headers: { 'Content-Type': 'application/json' },
  });
};
