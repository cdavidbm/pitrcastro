/**
 * Pegar desde Word (o desde una página web, Google Docs, Outlook) en los campos de texto largo
 * del panel, que se escriben en Markdown.
 *
 * Sin esto, el editor recibe solo el texto plano: se pierden negrillas, cursivas, enlaces y
 * listas, y los párrafos llegan separados por un único salto de línea, que en Markdown NO separa
 * párrafos (la noticia se vería como un solo bloque). Aquí se lee la versión con formato del
 * portapapeles y se convierte a Markdown antes de insertarla.
 *
 * Solo actúa sobre el editor Markdown del panel (CodeMirror); el resto de campos pega como
 * siempre. Si el portapapeles no trae formato, separa los párrafos con una línea en blanco.
 */

type CodeMirror = { replaceSelection: (texto: string) => void };

const BLOQUES = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'UL', 'OL', 'TABLE', 'TR', 'BLOCKQUOTE', 'SECTION', 'ARTICLE']);
const IGNORAR = new Set(['STYLE', 'SCRIPT', 'META', 'LINK', 'TITLE', 'XML', 'IMG', 'svg']);

const estilo = (el: Element) => (el.getAttribute('style') ?? '').toLowerCase();
const esNegrilla = (el: Element) => {
  const s = estilo(el);
  if (/font-weight\s*:\s*(normal|400)/.test(s)) return false; // Google Docs envuelve todo en <b style="font-weight:normal">
  return el.tagName === 'B' || el.tagName === 'STRONG' || /font-weight\s*:\s*(bold|[6-9]00)/.test(s);
};
const esCursiva = (el: Element) => el.tagName === 'I' || el.tagName === 'EM' || /font-style\s*:\s*italic/.test(estilo(el));

/** Envuelve en marcas (** o *) dejando fuera los espacios de los bordes, como exige Markdown. */
function marcar(texto: string, marca: string) {
  const m = texto.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  return m[2] ? `${m[1]}${marca}${m[2]}${marca}${m[3]}` : texto;
}

function enLinea(nodo: Node): string {
  if (nodo.nodeType === Node.TEXT_NODE) return (nodo.textContent ?? '').replace(/\s+/g, ' ');
  if (nodo.nodeType !== Node.ELEMENT_NODE) return '';
  const el = nodo as Element;
  if (IGNORAR.has(el.tagName)) return '';
  // Viñetas y números que Word escribe a mano en sus listas
  if (/mso-list\s*:\s*ignore/.test(estilo(el))) return '';
  if (el.tagName === 'BR') return '  \n';
  let texto = Array.from(el.childNodes).map(enLinea).join('');
  if (el.tagName === 'A' && el.getAttribute('href') && !el.getAttribute('href')!.startsWith('#') && texto.trim()) {
    return `[${texto.trim()}](${el.getAttribute('href')})`;
  }
  if (esNegrilla(el)) texto = marcar(texto, '**');
  if (esCursiva(el)) texto = marcar(texto, '*');
  return texto;
}

function aMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const salida: string[] = [];

  const recorrer = (padre: Element, lista: 'ul' | 'ol' | null, numero = { n: 1 }) => {
    let enCurso = '';
    const cerrar = () => {
      const t = enCurso.replace(/[ \t]+\n/g, (m) => (m.startsWith('  ') ? '  \n' : '\n')).trim();
      if (t) salida.push(t);
      enCurso = '';
    };
    for (const hijo of Array.from(padre.childNodes)) {
      const el = hijo.nodeType === Node.ELEMENT_NODE ? (hijo as Element) : null;
      if (!el || !BLOQUES.has(el.tagName)) {
        enCurso += enLinea(hijo);
        continue;
      }
      cerrar();
      const tag = el.tagName;
      if (tag === 'UL' || tag === 'OL') {
        recorrer(el, tag === 'UL' ? 'ul' : 'ol', { n: 1 });
        continue;
      }
      if (tag === 'TABLE' || tag === 'TR' || tag === 'DIV' || tag === 'SECTION' || tag === 'ARTICLE' || tag === 'BLOCKQUOTE') {
        recorrer(el, lista, numero);
        continue;
      }
      // Un bloque con contenido de bloque adentro (p. ej. un <li> con <p>) se recorre por dentro
      const texto = Array.from(el.childNodes).some((n) => n.nodeType === Node.ELEMENT_NODE && BLOQUES.has((n as Element).tagName))
        ? (() => { const antes = salida.length; recorrer(el, lista, numero); return salida.splice(antes).join(' '); })()
        : enLinea(el).trim();
      if (!texto.replace(/ /g, '').trim()) continue;
      const clase = el.getAttribute('class') ?? '';
      if (/^H[1-6]$/.test(tag)) salida.push(`${'#'.repeat(Math.min(Math.max(Number(tag[1]), 2), 4))} ${texto.replace(/\*\*/g, '')}`);
      else if (tag === 'LI') salida.push(lista === 'ol' ? `${numero.n++}. ${texto}` : `- ${texto}`);
      else if (/MsoListParagraph/i.test(clase)) salida.push(`- ${texto}`);
      else salida.push(texto);
    }
    cerrar();
  };

  recorrer(doc.body, null);
  // Los elementos de una misma lista van seguidos; el resto, separados por una línea en blanco
  let md = '';
  salida.forEach((b, i) => {
    const esItem = /^(- |\d+\. )/.test(b);
    const anteriorItem = i > 0 && /^(- |\d+\. )/.test(salida[i - 1]!);
    md += i === 0 ? b : esItem && anteriorItem ? `\n${b}` : `\n\n${b}`;
  });
  return md.replace(/ /g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

/** Texto plano: cada línea es un párrafo (salvo listas y tablas, que se dejan como vienen). */
function planoAMarkdown(texto: string): string {
  const lineas = texto.replace(/\r\n?/g, '\n').split('\n');
  if (lineas.some((l) => /^\s*\|/.test(l))) return texto;
  return lineas
    .map((l) => l.trimEnd())
    .reduce<string[]>((acc, l, i) => {
      const lista = /^\s*([-*+]|\d+\.)\s/.test(l) && i > 0 && /^\s*([-*+]|\d+\.)\s/.test(lineas[i - 1]!);
      if (acc.length && l && acc[acc.length - 1] !== '' && !lista) acc.push('');
      acc.push(l);
      return acc;
    }, [])
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

let instalado = false;

export function instalarPegadoDesdeWord() {
  if (instalado || typeof document === 'undefined') return;
  instalado = true;
  document.addEventListener(
    'paste',
    (ev) => {
      const objetivo = ev.target as Element | null;
      const contenedor = objetivo?.closest?.('.CodeMirror') as (Element & { CodeMirror?: CodeMirror }) | null;
      const cm = contenedor?.CodeMirror;
      const datos = ev.clipboardData;
      if (!cm || !datos) return;
      const html = datos.getData('text/html');
      const plano = datos.getData('text/plain');
      let md = '';
      try {
        md = html ? aMarkdown(html) : planoAMarkdown(plano);
      } catch {
        return; // ante cualquier sorpresa, el editor pega como siempre
      }
      if (!md) return;
      ev.preventDefault();
      ev.stopPropagation();
      cm.replaceSelection(md);
    },
    true,
  );
}
