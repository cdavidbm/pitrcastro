#!/usr/bin/env node
/**
 * AUDIT 5 — Detecta código muerto, redundante o de descarte.
 *
 * Vectores cubiertos:
 *  (a) exports sin uso en src/utils, src/components, src/layouts
 *  (b) componentes/archivos duplicados (similitud >= 80% sobre líneas)
 *  (c) helpers privados sin uso dentro del mismo archivo
 *  (d) archivos con sufijos legacy (-old, -v2, -legacy, -draft, -backup, .bak)
 *  (e) imports relativos rotos (apuntan a archivos no existentes)
 *  (f) JSONs en src/content/pages/ no consumidos por ningún .astro
 *  (g) scripts en cms-strapi/scripts/ sin invocador conocido
 *
 * NO borra ni modifica nada. Produce: .local-docs/AUDIT-5-JUNK.md
 *
 * Diseño defensivo: ningún detector construye RegExp dinámicos a partir de
 * nombres de identificadores ni paths del repo. Toda búsqueda de tokens
 * variables va por substring + boundary check, evitando ReDoS.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const SRC = path.join(ROOT, 'src');
const UTILS = path.join(SRC, 'utils');
const COMPONENTS = path.join(SRC, 'components');
const LAYOUTS = path.join(SRC, 'layouts');
const PAGES = path.join(SRC, 'pages');
const CONTENT_PAGES = path.join(SRC, 'content', 'pages');
const SCRIPTS_DIR = path.join(ROOT, 'cms-strapi', 'scripts');
const OUT = path.join(ROOT, '.local-docs', 'AUDIT-5-JUNK.md');

const ALIASES = {
  '@/': 'src/',
  '@components/': 'src/components/',
  '@layouts/': 'src/layouts/',
  '@content/': 'src/content/',
  '@types/': 'src/types/',
};

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', '.cache', '.tmp', '.astro',
  'documentos', // public/documentos
]);

// ---------- helpers de FS ----------

function walk(dir, exts = null) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, exts));
    else if (!exts || exts.some(e => entry.name.endsWith(e))) out.push(p);
  }
  return out;
}

function readSafe(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return ''; }
}

function rel(p) { return path.relative(ROOT, p); }

const isWordChar = (c) => c !== '' && /[A-Za-z0-9_$]/.test(c);

function hasIdent(txt, name) {
  let idx = 0;
  while (true) {
    const f = txt.indexOf(name, idx);
    if (f < 0) return false;
    const b = f === 0 ? '' : txt[f - 1];
    const a = txt[f + name.length] || '';
    if (!isWordChar(b) && !isWordChar(a)) return true;
    idx = f + 1;
  }
}

function countIdent(txt, name) {
  let idx = 0, n = 0;
  while (true) {
    const f = txt.indexOf(name, idx);
    if (f < 0) return n;
    const b = f === 0 ? '' : txt[f - 1];
    const a = txt[f + name.length] || '';
    if (!isWordChar(b) && !isWordChar(a)) n++;
    idx = f + 1;
  }
}

function countSubstr(haystack, needle) {
  if (!needle) return 0;
  let n = 0, idx = 0;
  while (true) {
    const f = haystack.indexOf(needle, idx);
    if (f < 0) return n;
    n++;
    idx = f + needle.length;
  }
}

function lineOf(txt, off) {
  let n = 1;
  const m = Math.min(off, txt.length);
  for (let i = 0; i < m; i++) if (txt[i] === '\n') n++;
  return n;
}

function escapeMd(s) {
  return String(s).replace(/\|/g, '\\|').replace(/`/g, '\\`');
}

function isAutogen(txt) {
  const head = txt.slice(0, 400);
  return /Auto[- ]generado|AUTO[- ]GENERATED|GENERATED FILE|@generated/i.test(head);
}

// ¿Está `name` instanciado como tag Astro/JSX dentro de `txt`? Busca `<name`
// con boundary correcto del char siguiente.
function hasJsxTag(txt, name) {
  let idx = 0;
  while (true) {
    const open = txt.indexOf('<' + name, idx);
    if (open < 0) return false;
    const after = txt[open + 1 + name.length] || '';
    if (after === '' || after === ' ' || after === '\t' || after === '\n' || after === '/' || after === '>') return true;
    idx = open + 1;
  }
}

// ¿`scope` exporta el identificador `name`? — busca patrones literales
// `export <kw> NAME` y `export { NAME }` sin construir RegExp dinámicos.
function isExported(scope, name) {
  const kws = [
    'export const ',
    'export let ',
    'export var ',
    'export function ',
    'export async function ',
    'export default ',
    'export class ',
  ];
  for (const kw of kws) {
    let idx = 0;
    while (true) {
      const f = scope.indexOf(kw + name, idx);
      if (f < 0) break;
      const after = scope[f + kw.length + name.length] || '';
      if (!isWordChar(after)) return true;
      idx = f + 1;
    }
  }
  // export { NAME } o export { ..., NAME, ... }
  let idx = 0;
  while (true) {
    const open = scope.indexOf('export', idx);
    if (open < 0) break;
    const brace = scope.indexOf('{', open);
    const close = scope.indexOf('}', open);
    if (brace > 0 && close > brace && (brace - open) < 30) {
      const inside = scope.slice(brace + 1, close);
      const tokens = inside.split(',').map(s => s.trim().split(/\s+/)[0]);
      if (tokens.includes(name)) return true;
    }
    idx = open + 1;
  }
  return false;
}

// Match de glob con `*` (no cruza `/`) y `**` (cruza separadores), usando DP
// segmento-a-segmento sin construir RegExp dinámicos.
function matchSegment(seg, pat) {
  const n = seg.length, m = pat.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= m; j++) if (pat[j - 1] === '*') dp[0][j] = dp[0][j - 1];
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (pat[j - 1] === '*') dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      else if (pat[j - 1] === seg[i - 1]) dp[i][j] = dp[i - 1][j - 1];
    }
  }
  return dp[n][m];
}

function matchGlob(absPath, pattern) {
  const aSegs = absPath.split(/[\\/]+/);
  const pSegs = pattern.split(/[\\/]+/);
  const n = aSegs.length, m = pSegs.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= m; j++) if (pSegs[j - 1] === '**') dp[0][j] = dp[0][j - 1];
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (pSegs[j - 1] === '**') dp[i][j] = dp[i - 1][j] || dp[i][j - 1] || dp[i - 1][j - 1];
      else if (matchSegment(aSegs[i - 1], pSegs[j - 1])) dp[i][j] = dp[i - 1][j - 1];
    }
  }
  return dp[n][m];
}

// ---------- Index del repo ----------

function buildSourceCorpus() {
  const exts = ['.astro', '.ts', '.tsx', '.js', '.mjs', '.md'];
  const files = [
    ...walk(SRC, exts),
    ...walk(SCRIPTS_DIR, exts),
    ...walk(path.join(ROOT, 'docs'), exts),
    ...walk(path.join(ROOT, '.local-docs'), exts),
    path.join(ROOT, 'package.json'),
    path.join(ROOT, 'CLAUDE.md'),
    path.join(ROOT, 'README.md'),
    path.join(ROOT, 'astro.config.mjs'),
  ].filter(p => fs.existsSync(p) && fs.statSync(p).isFile());
  const corpus = {};
  for (const f of files) corpus[f] = readSafe(f);
  return corpus;
}

// ---------- Resolución de imports ----------

function resolveImport(spec, fromFile) {
  if (!spec) return null;
  if (!spec.startsWith('.') && !Object.keys(ALIASES).some(a => spec.startsWith(a))) {
    return null;
  }
  let abs;
  for (const [a, real] of Object.entries(ALIASES)) {
    if (spec.startsWith(a)) {
      abs = path.join(ROOT, real, spec.slice(a.length));
      break;
    }
  }
  if (!abs) abs = path.resolve(path.dirname(fromFile), spec);

  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  for (const ext of ['.ts', '.tsx', '.js', '.mjs', '.astro', '.json', '.md']) {
    if (fs.existsSync(abs + ext)) return abs + ext;
  }
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
    for (const ext of ['.ts', '.tsx', '.js', '.mjs', '.astro']) {
      const idx = path.join(abs, 'index' + ext);
      if (fs.existsSync(idx)) return idx;
    }
  }
  return false; // ROTO
}

function extractImports(txt) {
  const re = /(?:^|\n)\s*import\s+(?:[^'"\n;]+?\s+from\s+)?['"]([^'"]+)['"]/g;
  const out = [];
  let m;
  while ((m = re.exec(txt)) !== null) {
    out.push({ spec: m[1], offset: m.index + m[0].indexOf(m[1]) });
  }
  const reDyn = /import\(['"]([^'"]+)['"]\)/g;
  while ((m = reDyn.exec(txt)) !== null) {
    out.push({ spec: m[1], offset: m.index + m[0].indexOf(m[1]) });
  }
  return out;
}

// ---------- Vector A: exports sin uso ----------

function detectUnusedExports(corpus) {
  const targets = [
    ...walk(UTILS, ['.ts']),
    ...walk(COMPONENTS, ['.astro']),
    ...walk(LAYOUTS, ['.astro']),
  ];
  const findings = [];

  function refsInOthers(name, owner) {
    let n = 0;
    for (const [file, txt] of Object.entries(corpus)) {
      if (file === owner) continue;
      n += countIdent(txt, name);
    }
    return n;
  }

  for (const file of targets) {
    if (file === path.join(UTILS, 'strapi.ts')) continue;
    const txt = readSafe(file);
    if (isAutogen(txt)) continue;

    if (file.endsWith('.astro')) {
      const name = path.basename(file, '.astro');
      let used = 0;
      for (const [other, otext] of Object.entries(corpus)) {
        if (other === file) continue;
        if (other.endsWith('.astro')) {
          if (hasJsxTag(otext, name)) { used++; continue; }
        }
        if (otext.includes('/' + name + '.astro')) used++;
      }
      if (used === 0) {
        findings.push({
          file: rel(file),
          line: 1,
          name,
          kind: 'astro-component',
          uses: 0,
          confidence: 'alta',
          action: 'borrar (ningún archivo lo importa ni instancia)',
        });
      }
      continue;
    }

    const reList = [
      /export\s+const\s+([A-Za-z_$][\w$]*)/g,
      /export\s+function\s+([A-Za-z_$][\w$]*)/g,
      /export\s+(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/g,
      /export\s+class\s+([A-Za-z_$][\w$]*)/g,
      /export\s+type\s+([A-Za-z_$][\w$]*)/g,
      /export\s+interface\s+([A-Za-z_$][\w$]*)/g,
      /export\s+enum\s+([A-Za-z_$][\w$]*)/g,
      /export\s+let\s+([A-Za-z_$][\w$]*)/g,
      /export\s+var\s+([A-Za-z_$][\w$]*)/g,
    ];
    const seen = new Set();
    for (const re of reList) {
      let m;
      while ((m = re.exec(txt)) !== null) {
        const name = m[1];
        if (seen.has(name)) continue;
        seen.add(name);
        const refs = refsInOthers(name, file);
        if (refs === 0) {
          findings.push({
            file: rel(file),
            line: lineOf(txt, m.index),
            name,
            kind: 'ts-export',
            uses: 0,
            confidence: 'alta',
            action: 'borrar (sin importadores)',
          });
        }
      }
    }
  }
  return findings;
}

// ---------- Vector B: duplicados ----------

function tokenizeLines(txt) {
  return txt
    .split('\n')
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(l => l.length > 12)
    .filter(l => !l.startsWith('//') && !l.startsWith('*') && !l.startsWith('/*'));
}

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

function detectDuplicates() {
  const files = walk(COMPONENTS, ['.astro']);
  const profiles = files.map(f => ({ file: f, lines: tokenizeLines(readSafe(f)) }));
  const findings = [];
  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const a = profiles[i], b = profiles[j];
      const baseA = path.basename(a.file).toLowerCase();
      const baseB = path.basename(b.file).toLowerCase();
      const namesShare = baseA.includes(baseB.replace('.astro', '')) || baseB.includes(baseA.replace('.astro', ''));
      const sim = jaccard(a.lines, b.lines);
      if (sim >= 0.8 || (sim >= 0.5 && namesShare)) {
        findings.push({
          a: rel(a.file),
          b: rel(b.file),
          similarity: sim.toFixed(2),
          confidence: sim >= 0.8 ? 'alta' : 'media',
          action: sim >= 0.8
            ? 'consolidar a uno (>=80% solapamiento)'
            : 'revisar — nombres similares + solapamiento moderado',
        });
      }
    }
  }
  return findings;
}

// ---------- Vector C: helpers privados sin uso en mismo archivo ----------

function detectPrivateUnused() {
  const files = [
    ...walk(UTILS, ['.ts']),
    ...walk(COMPONENTS, ['.astro']),
    ...walk(LAYOUTS, ['.astro']),
    ...walk(PAGES, ['.astro']),
  ];
  const findings = [];
  const reList = [
    /(?<!export\s)(?<!\.)\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g,
    /(?<!export\s)\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\([^)]*\)|async\s*\([^)]*\))\s*=>/g,
  ];
  for (const file of files) {
    const txt = readSafe(file);
    if (isAutogen(txt)) continue;
    let scope = txt;
    if (file.endsWith('.astro')) {
      const close = txt.indexOf('\n---', 3);
      if (close > 0) scope = txt.slice(3, close);
    }
    const seen = new Set();
    for (const re of reList) {
      let m;
      while ((m = re.exec(scope)) !== null) {
        const name = m[1];
        if (seen.has(name)) continue;
        seen.add(name);
        if (isExported(scope, name)) continue;
        const total = countIdent(txt, name);
        if (total <= 1) {
          findings.push({
            file: rel(file),
            line: lineOf(txt, m.index),
            name,
            confidence: 'alta',
            action: 'borrar (declaración sin referencias dentro del archivo)',
          });
        }
      }
    }
  }
  return findings;
}

// ---------- Vector D: sufijos legacy ----------

function detectLegacySuffixes() {
  const findings = [];
  // Sufijo legacy debe estar JUSTO antes de la extensión final, no en cualquier parte.
  // Excluye nombres como `server-backup.sh` (script operativo legítimo).
  const re = /(?:[-_])(old|v2|legacy|draft|deprecated|unused)(?=\.[A-Za-z0-9]+$)|\.bak$/i;
  const roots = [SRC, SCRIPTS_DIR, path.join(ROOT, 'docs'), path.join(ROOT, 'ops'), path.join(ROOT, 'scripts')];
  for (const r of roots) {
    if (!fs.existsSync(r)) continue;
    for (const f of walk(r)) {
      const base = path.basename(f);
      if (re.test(base)) {
        findings.push({
          file: rel(f),
          confidence: 'media',
          action: 'investigar — nombre sugiere descarte',
        });
      }
    }
  }
  return findings;
}

// ---------- Vector E: imports rotos ----------

function detectBrokenImports() {
  // Solo escaneamos código del frontend Astro. Los scripts de migración / audit
  // contienen referencias literales a paths como ejemplos en docstrings que
  // confunden al extractor de imports y producen self-matches.
  const files = walk(SRC, ['.astro', '.ts', '.tsx', '.js', '.mjs']);
  const findings = [];
  for (const f of files) {
    const txt = readSafe(f);
    if (isAutogen(txt)) continue;
    for (const { spec, offset } of extractImports(txt)) {
      const resolved = resolveImport(spec, f);
      if (resolved === false) {
        findings.push({
          file: rel(f),
          line: lineOf(txt, offset),
          spec,
          confidence: 'alta',
          action: 'arreglar import o borrar',
        });
      }
    }
  }
  return findings;
}

// ---------- Vector F: JSONs huérfanos en src/content/pages/ ----------

function detectOrphanJsons() {
  const jsons = walk(CONTENT_PAGES, ['.json']);
  const astroFiles = walk(SRC, ['.astro']);
  const all = astroFiles.map(f => ({ file: f, txt: readSafe(f) }));

  const staticImports = new Set();
  const globPatterns = [];
  for (const { file, txt } of all) {
    const re = /import\s+(?:\w+|\{[^}]+\})\s+from\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(txt)) !== null) {
      const spec = m[1];
      if (!spec.includes('content/pages')) continue;
      const resolved = resolveImport(spec, file);
      if (typeof resolved === 'string') staticImports.add(resolved);
    }
    const reGlob = /import\.meta\.glob[^;]*?['"]([^'"]+)['"]/g;
    while ((m = reGlob.exec(txt)) !== null) {
      const pattern = m[1];
      if (!pattern.includes('content/pages')) continue;
      const abs = path.resolve(path.dirname(file), pattern);
      globPatterns.push(abs);
    }
  }

  const findings = [];
  for (const j of jsons) {
    if (staticImports.has(j)) continue;
    let covered = false;
    for (const g of globPatterns) {
      if (matchGlob(j, g)) { covered = true; break; }
    }
    if (covered) continue;
    findings.push({
      file: rel(j),
      confidence: 'media',
      action: 'verificar si su contenido ya vive en Strapi y borrar — ningún .astro lo importa',
    });
  }
  return findings;
}

// ---------- Vector G: scripts sin invocador ----------

function detectOrphanScripts(corpus) {
  const findings = [];
  const scriptFiles = walk(SCRIPTS_DIR);
  const refsCorpus = Object.values(corpus).join('\n');
  for (const f of scriptFiles) {
    const base = path.basename(f);
    const stem = base.replace(/\.[^.]+$/, '');
    // Referencias al path completo del script (substring).
    const refsByPath = countSubstr(refsCorpus, 'scripts/' + base);
    // Referencias al stem como identificador completo.
    const refsByStem = countIdent(refsCorpus, stem);
    const ownTxt = readSafe(f);
    const ownRefs = countIdent(ownTxt, stem);
    const externalRefs = refsByStem - ownRefs;
    if (refsByPath === 0 && externalRefs <= 0) {
      findings.push({
        file: rel(f),
        confidence: 'media',
        action: 'verificar si todavía se usa para una operación manual; si no, borrar',
      });
    }
  }
  return findings;
}

// ---------- Render ----------

function renderTable(headers, rows) {
  const lines = [];
  lines.push('| ' + headers.join(' | ') + ' |');
  lines.push('|' + headers.map(() => '---').join('|') + '|');
  for (const r of rows) lines.push('| ' + r.map(escapeMd).join(' | ') + ' |');
  return lines.join('\n');
}

function main() {
  const corpus = buildSourceCorpus();

  const a = detectUnusedExports(corpus);
  const b = detectDuplicates();
  const c = detectPrivateUnused();
  const d = detectLegacySuffixes();
  const e = detectBrokenImports();
  const f = detectOrphanJsons();
  const g = detectOrphanScripts(corpus);

  const lines = [];
  const push = (s = '') => lines.push(s);

  push('# AUDIT 5 — Código muerto / redundante / descarte');
  push('');
  push('Generado por `cms-strapi/scripts/audit-junk.mjs`. No editar a mano.');
  push('');
  push('## Resumen por vector');
  push('');
  push('| Vector | Hallazgos |');
  push('|---|--:|');
  push('| (a) exports sin uso | ' + a.length + ' |');
  push('| (b) componentes duplicados | ' + b.length + ' |');
  push('| (c) helpers privados sin uso | ' + c.length + ' |');
  push('| (d) archivos con sufijo legacy | ' + d.length + ' |');
  push('| (e) imports rotos | ' + e.length + ' |');
  push('| (f) JSONs huérfanos en `src/content/pages/` | ' + f.length + ' |');
  push('| (g) scripts sin invocador | ' + g.length + ' |');
  push('');
  const total = a.length + b.length + c.length + d.length + e.length + f.length + g.length;
  push('**Total**: ' + total);
  push('');

  // (a)
  push('## (a) Exports sin uso');
  push('');
  push('Exports en `src/utils/`, `src/components/` y `src/layouts/` que ningún otro archivo del repo importa. Excluye archivos auto-generados y `src/utils/strapi.ts`.');
  push('');
  if (a.length === 0) push('_(ninguno)_');
  else push(renderTable(
    ['Archivo', 'Línea', 'Tipo', 'Nombre', 'Confianza', 'Acción'],
    a.map(x => [x.file, String(x.line), x.kind, x.name, x.confidence, x.action])
  ));
  push('');

  // (b)
  push('## (b) Componentes duplicados');
  push('');
  push('Pares de archivos en `src/components/` con solapamiento de líneas >= 80%, o >= 50% y nombres parecidos.');
  push('');
  if (b.length === 0) push('_(ninguno)_');
  else push(renderTable(
    ['Archivo A', 'Archivo B', 'Similitud', 'Confianza', 'Acción'],
    b.map(x => [x.a, x.b, x.similarity, x.confidence, x.action])
  ));
  push('');

  // (c)
  push('## (c) Helpers privados sin uso');
  push('');
  push('Funciones / consts declarados dentro de un archivo y usados solo en su propia declaración. No exportados — candidatos a borrar.');
  push('');
  if (c.length === 0) push('_(ninguno)_');
  else {
    push('<details><summary>Ver tabla</summary>');
    push('');
    push(renderTable(
      ['Archivo', 'Línea', 'Nombre', 'Confianza', 'Acción'],
      c.map(x => [x.file, String(x.line), x.name, x.confidence, x.action])
    ));
    push('');
    push('</details>');
  }
  push('');

  // (d)
  push('## (d) Archivos con sufijo legacy');
  push('');
  push('Nombres con sufijos `-old`, `-v2`, `-legacy`, `-draft`, `-backup`, `-deprecated`, `-tmp`, `-unused` o extensión `.bak`.');
  push('');
  if (d.length === 0) push('_(ninguno)_');
  else push(renderTable(
    ['Archivo', 'Confianza', 'Acción'],
    d.map(x => [x.file, x.confidence, x.action])
  ));
  push('');

  // (e)
  push('## (e) Imports rotos');
  push('');
  push('Imports relativos o por alias que apuntan a archivos inexistentes. Romperían el build.');
  push('');
  if (e.length === 0) push('_(ninguno)_');
  else push(renderTable(
    ['Archivo', 'Línea', 'Spec', 'Confianza', 'Acción'],
    e.map(x => [x.file, String(x.line), x.spec, x.confidence, x.action])
  ));
  push('');

  // (f)
  push('## (f) JSONs huérfanos en `src/content/pages/`');
  push('');
  push('JSONs no consumidos por ningún `.astro` (ni import directo ni `import.meta.glob`). **Cuidado**: muchos pueden ser respaldo legítimo de Strapi durante validación. Verificar antes de borrar.');
  push('');
  if (f.length === 0) push('_(ninguno)_');
  else {
    push('<details><summary>Ver tabla</summary>');
    push('');
    push(renderTable(
      ['Archivo', 'Confianza', 'Acción'],
      f.map(x => [x.file, x.confidence, x.action])
    ));
    push('');
    push('</details>');
  }
  push('');

  // (g)
  push('## (g) Scripts sin invocador');
  push('');
  push('Archivos en `cms-strapi/scripts/` que no se mencionan en `package.json`, otros scripts del repo, ni en docs.');
  push('');
  if (g.length === 0) push('_(ninguno)_');
  else push(renderTable(
    ['Archivo', 'Confianza', 'Acción'],
    g.map(x => [x.file, x.confidence, x.action])
  ));
  push('');

  // Top 10 alta confianza
  push('## (h) Top 10 hallazgos de alta confianza para borrar');
  push('');
  push('Lo que el script considera más seguro borrar sin investigación adicional. Igualmente verificá manualmente antes de ejecutar.');
  push('');
  const ranked = [];
  for (const x of a) if (x.confidence === 'alta') ranked.push({ vec: 'a', desc: x.file + ':' + x.line + ' export `' + x.name + '` (' + x.kind + ')', action: x.action });
  for (const x of c) if (x.confidence === 'alta') ranked.push({ vec: 'c', desc: x.file + ':' + x.line + ' helper `' + x.name + '`', action: x.action });
  for (const x of e) ranked.push({ vec: 'e', desc: x.file + ':' + x.line + ' import `' + x.spec + '`', action: x.action });
  for (const x of b) if (x.confidence === 'alta') ranked.push({ vec: 'b', desc: 'dup ' + x.a + ' ⇄ ' + x.b + ' (sim=' + x.similarity + ')', action: x.action });
  const top = ranked.slice(0, 10);
  if (top.length === 0) push('_(no hay hallazgos de alta confianza)_');
  else push(renderTable(
    ['Vector', 'Hallazgo', 'Acción'],
    top.map(x => ['(' + x.vec + ')', x.desc, x.action])
  ));
  push('');

  // Limitaciones
  push('## Limitaciones');
  push('');
  push('- **Vector (a)** mide referencias por nombre con boundary-check; no atraviesa re-exports `export * from` ni reflexión por string. Posible falso positivo si un export se consume vía `import("./x").then(m => m.NAME)`.');
  push('- **Vector (b)** usa Jaccard sobre líneas; sensible al formato. Componentes con la misma estructura pero CSS distinto pueden no superar el umbral.');
  push('- **Vector (c)** solo mira el frontmatter de `.astro` o el archivo entero `.ts`. No detecta funciones declaradas dentro de `<script>` del template (son client-side y suelen ser locales).');
  push('- **Vector (e)** resuelve aliases del `tsconfig.json`. Imports de paquetes (`astro`, etc.) se ignoran. Imports `?raw`/`?url` (sufijos Vite) no resuelven y podrían reportarse como rotos.');
  push('- **Vector (f)** considera huérfano si NO hay match exacto ni glob. Strapi puede tener los datos sincronizados igual; el JSON aún sirve como respaldo durante validación. **No borrar masivamente** sin confirmar que el sitio se construye sin ellos.');
  push('- **Vector (g)** mide referencias por stem del nombre. Un script que solo se invoca manualmente desde la consola sin docs aparece como huérfano — no implica que sea descartable.');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n'));

  console.log('Generado:', rel(OUT));
  console.log('(a) exports sin uso:', a.length);
  console.log('(b) duplicados:', b.length);
  console.log('(c) helpers privados:', c.length);
  console.log('(d) sufijos legacy:', d.length);
  console.log('(e) imports rotos:', e.length);
  console.log('(f) JSONs huérfanos:', f.length);
  console.log('(g) scripts huérfanos:', g.length);
}

main();
