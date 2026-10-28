#!/usr/bin/env node
/**
 * Normograma — actualización pedida por la Subdirección de Asuntos Legales (Laura Olarte, 8-oct-2026;
 * Wiliam Villamil reenvió el Excel «Anexos del normograma_Final» y las fichas el 28-oct-2026).
 *
 *   1. Inclusiones: las normas nuevas que llegaron con su ficha técnica (17), con su ficha en PDF.
 *   2. Eliminación: la Resolución 652 de 2012, derogada por la Resolución 3461 de 2025. Se retira de la
 *      lista (no se borra ningún archivo) y lo retirado queda guardado en normograma-2026-10-retiradas.json.
 *   3. Circulares con «#VALUE!» en el número (error de importación): se corrige con el número del Excel.
 *   4. Duplicidad señalada («Circular Interna 049 de 2021»): se conserva una fila y se retira la repetida.
 *
 * Los datos están en normograma-2026-10-datos.json. Las fichas deben estar ya en
 * public/documentos/normograma/ (copia local y árbol de trabajo del servidor). Es repetible.
 *
 *   STRAPI_URL=http://127.0.0.1:1337 STRAPI_PASSWORD=… node scripts/normograma-2026-10.mjs --seco
 *
 * Después hay que recompilar el sitio.
 */
import fs from 'node:fs';

const BASE = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const EMAIL = process.env.STRAPI_EMAIL || 'admin@itrc.local';
const PASSWORD = process.env.STRAPI_PASSWORD || '';
const SECO = process.argv.includes('--seco');
if (!PASSWORD) { console.error('Falta STRAPI_PASSWORD'); process.exit(1); }

const UID = 'api::normograma.normograma';
const D = JSON.parse(fs.readFileSync(new URL('./normograma-2026-10-datos.json', import.meta.url), 'utf8'));
const enArbol = (rel) => new URL(`../../public${rel}`, import.meta.url).pathname;

const sinIds = (o) => Array.isArray(o) ? o.map(sinIds)
  : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'id').map(([k, v]) => [k, sinIds(v)])) : o;
const norm = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const num = (s = '') => { const m = String(s).match(/\d+/); return m ? String(parseInt(m[0], 10)) : norm(s); };
const mismoTipo = (a, b) => norm(a) === norm(b);

const j = async (r) => { if (!r.ok) throw new Error(`${r.status} ${r.url} ${(await r.text()).slice(0, 300)}`); return r.json(); };
const token = (await j(await fetch(`${BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) }))).data.token;
const H = { Authorization: `Bearer ${token}` };
const CM = `${BASE}/content-manager/single-types/${UID}`;

const doc = (await j(await fetch(CM, { headers: H }))).data;
let normas = doc.normas.map(({ id, ...r }) => r);
const antes = normas.length;
console.log(`Normas publicadas antes: ${antes}`);
const cambios = { incluidas: 0, quitadas: 0, numeros: 0, duplicada: 0 };
const retiradas = [];

// ── 1. Inclusiones ────────────────────────────────────────────────────────────────────────
console.log('\n1. Inclusiones');
const nuevas = [];
for (const n of D.incluir) {
  const ya = normas.find((r) => mismoTipo(r.tipo, n.tipo) && num(r.numero) === num(n.numero) && Number(r.anio) === n.anio);
  const ficha = enArbol(n.fichaUrl);
  if (!fs.existsSync(ficha)) { console.log(`   ⚠ falta la ficha ${n.fichaUrl}: se omite`); continue; }
  if (ya) { console.log(`   · ya está: ${n.tipo} ${n.numero}/${n.anio}`); continue; }
  console.log(`   + ${n.tipo} ${n.numero}/${n.anio} · ${n.proceso}${n.normaUrl ? '' : ' · (sin enlace a la norma)'}`);
  nuevas.push({ tipo: n.tipo, numero: n.numero, anio: n.anio, vigencia: n.vigencia, descripcion: n.descripcion, proceso: n.proceso, fichaUrl: n.fichaUrl, normaUrl: n.normaUrl || null });
  cambios.incluidas++;
}
normas = [...nuevas, ...normas];

// ── 2. Eliminación ────────────────────────────────────────────────────────────────────────
console.log('\n2. Eliminación');
for (const q of D.quitar) {
  const i = normas.findIndex((r) => mismoTipo(r.tipo, q.tipo) && num(r.numero) === num(q.numero) && Number(r.anio) === q.anio);
  if (i < 0) { console.log(`   · ya no está: ${q.tipo} ${q.numero}/${q.anio}`); continue; }
  console.log(`   − ${q.tipo} ${q.numero}/${q.anio}: ${q.motivo}`);
  retiradas.push({ motivo: q.motivo, fila: normas[i] }); normas.splice(i, 1); cambios.quitadas++;
}

// ── 3. Números con «#VALUE!» ──────────────────────────────────────────────────────────────
console.log('\n3. Números con «#VALUE!»');
for (const c of D.numero) {
  const r = normas.find((x) => mismoTipo(x.tipo, c.tipo) && Number(x.anio) === c.anio && /#VALUE/i.test(x.numero ?? '') && norm(x.descripcion ?? '').startsWith(norm(c.desc)));
  if (!r) { console.log(`   · no hay «#VALUE!» pendiente en ${c.tipo} ${c.anio} (${c.desc.slice(0, 40)}…)`); continue; }
  console.log(`   ✎ ${c.tipo} ${c.anio} «${c.desc.slice(0, 44)}…»: «${r.numero}» → «${c.nuevo}»`);
  r.numero = c.nuevo; cambios.numeros++;
}

// ── 4. Duplicidad (Circular Interna 049 de 2021) ──────────────────────────────────────────
console.log('\n4. Duplicidad');
{
  const { conservar: c, quitar: q } = D.duplicada;
  const ic = normas.findIndex((x) => mismoTipo(x.tipo, c.tipo) && Number(x.anio) === c.anio && norm(x.descripcion ?? '').startsWith(norm(c.desc)));
  const iq = normas.findIndex((x) => mismoTipo(x.tipo, q.tipo) && Number(x.anio) === q.anio && norm(x.descripcion ?? '').startsWith(norm(q.desc)));
  if (ic < 0 || iq < 0) console.log('   · ya está resuelta (no hay dos filas para esa circular)');
  else {
    console.log(`   − se retira la fila repetida («${normas[iq].tipo}», ficha ${normas[iq].fichaUrl?.split('/').pop()}) y se conserva «${normas[ic].tipo}» como Circular ${c.nuevo}/${c.anio}`);
    retiradas.push({ motivo: 'Duplicidad documental señalada por el SDL: Circular Interna 049 de 2021', fila: normas[iq] });
    normas[ic].numero = c.nuevo;
    normas.splice(iq, 1); cambios.duplicada++;
  }
}

console.log(`\nResumen: +${cambios.incluidas} incluidas · −${cambios.quitadas} eliminadas · ${cambios.numeros} números corregidos · ${cambios.duplicada} duplicidad  →  ${antes} → ${normas.length} normas`);
if (!Object.values(cambios).some(Boolean)) { console.log('Nada que cambiar.'); process.exit(0); }
if (SECO) { console.log('(en seco: no se guardó nada)'); process.exit(0); }

const cuerpo = sinIds({ title: doc.title, normas, enlacesRelacionados: doc.enlacesRelacionados });
await j(await fetch(CM, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) }));
await j(await fetch(`${CM}/actions/publish`, { method: 'POST', headers: H }));
const despues = (await j(await fetch(CM, { headers: H }))).data;
console.log(`✓ guardado y publicado: ${despues.normas.length} normas. Falta recompilar el sitio.`);
// va al final: escribir dentro de cms-strapi/ reinicia Strapi en desarrollo y cortaría el guardado
if (retiradas.length) {
  const f = new URL('./normograma-2026-10-retiradas.json', import.meta.url).pathname;
  const previas = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
  fs.writeFileSync(f, JSON.stringify([...previas, ...retiradas], null, 1));
  console.log(`Retiradas guardadas en ${f}`);
}

process.exit(0);
