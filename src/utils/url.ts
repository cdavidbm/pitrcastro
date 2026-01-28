const base = import.meta.env.BASE_URL;

export function resolveUrl(url: string, external?: boolean): string {
  if (!url || external) return url;
  if (url.startsWith('http') || url.startsWith('//') || url === '#') return url;
  if (url.startsWith('/')) return `${base}${url.slice(1)}`;
  return url;
}
