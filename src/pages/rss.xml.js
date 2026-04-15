import siteConfig from '../content/settings/site.json';

// Vite/Astro native file loader — works at build time
const newsModules = import.meta.glob('../content/news/*.md', { eager: true, query: '?raw', import: 'default' });

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      let value = kv[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      fm[kv[1]] = value;
    }
  }
  return { frontmatter: fm, body: m[2] };
}

function escapeXml(s) {
  return String(s || '').replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  })[c]);
}

export async function GET({ site }) {
  const siteUrl = (site || new URL(siteConfig.url || 'https://www.itrc.gov.co')).toString().replace(/\/$/, '');

  const items = Object.entries(newsModules)
    .map(([filepath, raw]) => {
      const parsed = parseFrontmatter(raw);
      if (!parsed) return null;
      if (parsed.frontmatter.draft === 'true') return null;
      const filename = filepath.split('/').pop().replace(/\.md$/, '');
      return {
        title: parsed.frontmatter.title || '(sin título)',
        date: parsed.frontmatter.date,
        excerpt: parsed.frontmatter.excerpt || '',
        slug: filename,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 50);

  const buildDate = new Date().toUTCString();
  const lastNewsDate = items[0]?.date ? new Date(items[0].date).toUTCString() : buildDate;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Noticias</title>
    <link>${siteUrl}/</link>
    <description>${escapeXml(siteConfig.description || '')}</description>
    <language>es-CO</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${lastNewsDate}</pubDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items.map((item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${siteUrl}/news/${item.slug}</link>
      <guid>${siteUrl}/news/${item.slug}</guid>
      <pubDate>${item.date ? new Date(item.date).toUTCString() : buildDate}</pubDate>
      <description>${escapeXml(item.excerpt)}</description>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
