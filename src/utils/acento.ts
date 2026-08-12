/**
 * Traduce el color de acento que viene del CMS a uno de los tokens
 * institucionales.
 *
 * Hace falta porque el color no se puede escribir dentro del HTML: la política
 * de seguridad que el proveedor aplica sobre el dominio bloquea los atributos
 * `style="..."`, y el acento se perdía (los iconos quedaban blancos sobre
 * blanco). En su lugar se pinta un atributo `data-acento` y el color lo pone la
 * hoja de estilos, que sí está permitida.
 *
 * Uso en una plantilla:
 *   <a class="hub-card" data-acento={acento(sec.color)}>
 *
 * Los tokens válidos están definidos en `src/styles/global.css`. Para admitir
 * un color nuevo hay que agregarlo en los dos sitios.
 */

export type Acento =
  | 'gold'
  | 'navy'
  | 'blue'
  | 'green'
  | 'red'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'cyan'
  | 'gray';

/** Cómo se ha escrito cada acento en el contenido a lo largo del tiempo. */
const EQUIVALENCIAS: Record<string, Acento> = {
  gold: 'gold',
  'var(--itrc-gold)': 'gold',
  '#b38b40': 'gold',

  navy: 'navy',
  'var(--itrc-navy)': 'navy',
  '#002147': 'navy',

  blue: 'blue',
  'var(--govco-blue)': 'blue',
  '#0943b5': 'blue',
  '#0d6efd': 'blue',
  '#1d3557': 'blue',

  green: 'green',
  'var(--file-excel)': 'green',
  '#198754': 'green',
  '#386641': 'green',

  red: 'red',
  'var(--file-pdf)': 'red',
  '#dc3545': 'red',
  '#e63946': 'red',

  purple: 'purple',
  'var(--file-zip)': 'purple',
  '#6f42c1': 'purple',

  orange: 'orange',
  'var(--file-powerpoint)': 'orange',
  '#fd7e14': 'orange',

  teal: 'teal',
  '#2a9d8f': 'teal',

  cyan: 'cyan',
  '#0dcaf0': 'cyan',

  gray: 'gray',
  'var(--gray-600)': 'gray',
};

/** Acento por defecto cuando el contenido trae un color desconocido. */
const POR_DEFECTO: Acento = 'navy';

export function acento(valor?: string | null): Acento {
  if (!valor) return POR_DEFECTO;
  return EQUIVALENCIAS[valor.trim().toLowerCase()] ?? POR_DEFECTO;
}
