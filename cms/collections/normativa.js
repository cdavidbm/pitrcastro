import {
  pageHeader,
  documentSections,
  docFieldsUrl,
} from "../templates/fields.js";

// ============================================================
// Normativa Aplicable (Normograma - 264 normas)
// ============================================================

const TIPOS_NORMA = [
  "Acuerdo",
  "Circular",
  "Circular Conjunta",
  "Circular Externa",
  "Circular Interna",
  "Circular Presidencial",
  "Decreto",
  "Directiva Presidencial",
  "Ley",
  "Otra",
  "Resolución",
  "Resolución Externa",
  "Resolución Interna",
];

const normaFields = [
  { name: "tipo", label: "Tipo de norma", widget: "select", options: TIPOS_NORMA, required: true },
  { name: "numero", label: "Número", widget: "string", required: true },
  { name: "normaUrl", label: "URL de la norma (PDF o enlace)", widget: "string", required: false },
  { name: "anio", label: "Año", widget: "number", value_type: "int", required: true },
  {
    name: "vigencia",
    label: "Vigencia",
    widget: "select",
    options: [
      { label: "Vigente", value: "VIGENTE" },
      { label: "Derrogada", value: "DERROGADA" },
      { label: "Vigente parcialmente", value: "VIGENTE-PARCIALMENTE" },
    ],
    default: "VIGENTE",
  },
  { name: "fichaUrl", label: "URL ficha técnica (PDF)", widget: "string", required: false },
  { name: "descripcion", label: "Descripción (Epígrafe)", widget: "text", required: true },
  { name: "proceso", label: "Proceso institucional", widget: "string", required: true, hint: "Separar múltiples procesos con \" - \"" },
];

// ============================================================
// Unificación Normativa SUIN Juriscol (14 normas)
// ============================================================

const suinNormaFields = [
  {
    name: "tipo",
    label: "Tipo de norma",
    widget: "select",
    options: ["Decreto", "Decreto Único", "Ley"],
    required: true,
  },
  { name: "numero", label: "Número", widget: "string", required: true },
  { name: "anio", label: "Año", widget: "number", value_type: "int", required: true },
  { name: "estado", label: "Estado", widget: "string", required: true, hint: "Ej: VIGENTE, VIGENTE - PRÓXIMAMENTE DEROGADO POR LEY 1952" },
  { name: "epigrafe", label: "Epígrafe (Descripción)", widget: "text", required: true },
  { name: "entidadEmisora", label: "Entidad emisora", widget: "string", required: true },
  { name: "diarioOficial", label: "Diario Oficial", widget: "string", required: true },
  { name: "pdfUrl", label: "URL del PDF", widget: "string", required: false },
  { name: "suinUrl", label: "URL en SUIN Juriscol", widget: "string", required: false },
];

// ============================================================
// Colecciones
// ============================================================

const normativaPaginas = {
  name: "normativa-paginas",
  label: "NORMATIVA",
  files: [
    {
      name: "normograma",
      label: "Normativa Aplicable (Normograma)",
      file: "src/content/pages/normograma.json",
      fields: [
        {
          name: "normas",
          label: "Normas del normograma",
          widget: "list",
          label_singular: "Norma",
          collapsed: true,
          summary: "{{fields.tipo}} {{fields.numero}} de {{fields.anio}} — {{fields.vigencia}}",
          fields: normaFields,
        },
      ],
    },
    {
      name: "decretos",
      label: "Decretos",
      file: "src/content/pages/normativa/decretos.json",
      fields: [
        { name: "title", label: "Título de la página", widget: "string", required: true },
        { name: "description", label: "Descripción introductoria", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-file-lines" },
        {
          name: "decretos",
          label: "Decretos",
          widget: "list",
          label_singular: "Decreto",
          collapsed: true,
          summary: "{{fields.nombre}}",
          fields: [
            { name: "nombre", label: "Nombre del decreto", widget: "string", required: true },
            { name: "fecha", label: "Fecha", widget: "string", required: false },
            { name: "descripcion", label: "Descripción", widget: "text", required: false },
            { name: "file", label: "URL del archivo PDF", widget: "string", required: true },
          ],
        },
      ],
    },
    {
      name: "resoluciones-circulares",
      label: "Resoluciones, Circulares y Otros Actos",
      file: "src/content/pages/normativa/resoluciones.json",
      fields: [
        { name: "title", label: "Título de la página", widget: "string", required: true },
        { name: "description", label: "Descripción introductoria", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-file-signature" },
        {
          name: "actos",
          label: "Actos administrativos",
          widget: "list",
          label_singular: "Acto",
          collapsed: true,
          summary: "{{fields.tipo}} {{fields.numero}} ({{fields.vigencia}}) — {{fields.motivacion}}",
          fields: [
            {
              name: "tipo",
              label: "Tipo de acto",
              widget: "select",
              options: ["RESOLUCION", "CIRCULAR"],
              required: true,
            },
            { name: "numero", label: "Número", widget: "string", required: true },
            { name: "fecha", label: "Fecha", widget: "string", required: false },
            { name: "vigencia", label: "Vigencia (Año)", widget: "number", value_type: "int", required: true },
            { name: "dependencia", label: "Dependencia que profiere", widget: "string", required: false },
            { name: "motivacion", label: "Motivación / Descripción", widget: "text", required: true },
            {
              name: "interes",
              label: "Interés",
              widget: "select",
              options: ["GENERAL", "PARTICULAR"],
              default: "GENERAL",
            },
            { name: "pdfUrl", label: "URL del PDF", widget: "string", required: false },
          ],
        },
      ],
    },
    {
      name: "suin-juriscol",
      label: "Unificación Normativa SUIN Juriscol",
      file: "src/content/pages/normativa/unificacion-suin-juriscol.json",
      fields: [
        { name: "title", label: "Título de la página", widget: "string", required: true },
        { name: "description", label: "Descripción introductoria", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-landmark-dome" },
        {
          name: "normas",
          label: "Normas registradas",
          widget: "list",
          label_singular: "Norma",
          collapsed: true,
          summary: "{{fields.tipo}} {{fields.numero}} de {{fields.anio}} — {{fields.estado}}",
          fields: suinNormaFields,
        },
      ],
    },
    {
      name: "marco-legal",
      label: "Marco Legal",
      file: "src/content/pages/normativa/marco-legal.json",
      fields: [
        { name: "title", label: "Título de la página", widget: "string", required: true },
        { name: "description", label: "Descripción introductoria", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-landmark" },
        {
          name: "secciones",
          label: "Secciones",
          widget: "list",
          label_singular: "Sección",
          collapsed: true,
          summary: "{{fields.titulo}} ({{fields.documentos.length}} docs)",
          fields: [
            { name: "titulo", label: "Título de la sección", widget: "string", required: true },
            { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
            {
              name: "documentos",
              label: "Documentos",
              widget: "list",
              label_singular: "Documento",
              collapsed: true,
              summary: "{{fields.nombre}}",
              fields: [
                { name: "nombre", label: "Nombre del documento", widget: "string", required: true },
                { name: "descripcion", label: "Descripción", widget: "text", required: false },
                { name: "file", label: "URL del archivo", widget: "string", required: true },
                { name: "externo", label: "Es enlace externo", widget: "boolean", default: false, required: false },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** Folder collection for other generic normativa pages */
const normativaGeneral = {
  name: "normativa-general",
  label: "    > Otras Páginas Normativas",
  label_singular: "Página Normativa",
  folder: "src/content/pages/normativa/paginas",
  create: true,
  slug: "{{slug}}",
  format: "json",
  description: "Páginas genéricas de normatividad (Decretos, Marco Legal, etc.)",
  fields: [
    ...pageHeader({ icon: "fa-gavel", slugPattern: true }),
    documentSections(docFieldsUrl),
  ],
};

// ============================================================
// Lote P — Normativa Temática (15 delitos / políticas)
// ============================================================

function normativaDelitosFactory() {
  const items = [
    ["normatividad-cohecho", "Cohecho", "fa-handshake-slash"],
    ["normatividad-concusion", "Concusión", "fa-triangle-exclamation"],
    ["normatividad-peculado", "Peculado", "fa-money-bill-wave"],
    ["normatividad-abuso-de-funcion-publica", "Abuso de Función Pública", "fa-gavel"],
    ["normatividad-falsedad-en-documento-publico", "Falsedad en Documento Público", "fa-file-circle-xmark"],
    ["normativa-prevaricato", "Prevaricato", "fa-scale-unbalanced"],
    ["normatividad-conductas-que-integran-un-delito", "Conductas que integran un delito", "fa-list-check"],
    ["normatividad-faltas-relacionadas-con-la-contratacion-publica", "Faltas en contratación pública", "fa-file-contract"],
    ["normatividad-favorecimiento-de-la-evasion-de-impuestos", "Favorecimiento de la evasión", "fa-coins"],
    ["normatividad-alteracion-o-falsificacion-de-informacion", "Alteración o falsificación de información", "fa-pen-nib"],
    ["normatividad-incremento-patrimonial-injustificado", "Incremento patrimonial injustificado", "fa-chart-line"],
    ["normatividad-trafico-de-influencias", "Tráfico de influencias", "fa-people-arrows"],
    ["normativa-incumplimiento-al-regimen-cambiario-y-aduanero", "Incumplimiento cambiario y aduanero", "fa-money-bill-transfer"],
    ["normatividad-funcion-publica", "Función pública", "fa-building-columns"],
    ["politicas-y-lineamientos-sectoriales", "Políticas y lineamientos sectoriales", "fa-compass"],
  ];
  return items.map(([slug, label, icon]) => ({
    name: slug,
    label,
    file: `src/content/pages/normativa/delitos/${slug}.json`,
    fields: [
      { name: "title", label: "Título", widget: "string", required: true },
      { name: "description", label: "Descripción SEO", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: icon },
      { name: "intro", label: "Introducción", widget: "text", required: false },
      { name: "contenido", label: "Contenido normativo (HTML)", widget: "text", required: false, hint: "HTML limpio con artículos citados. Se renderiza con set:html." },
      {
        name: "normasRelacionadas",
        label: "Normas relacionadas (opcional)",
        widget: "list",
        label_singular: "Norma",
        collapsed: true,
        required: false,
        summary: "{{fields.titulo}}",
        fields: [
          { name: "titulo", label: "Título", widget: "string", required: true },
          { name: "url", label: "URL", widget: "string", required: true },
          { name: "tipo", label: "Tipo", widget: "select", options: ["internal", "external", "pdf"], default: "external" },
        ],
      },
    ],
  }));
}

const normativaDelitos = {
  name: "normativa-delitos",
  label: "NORMATIVA TEMÁTICA",
  label_singular: "Página de normativa temática",
  description: "Páginas por tipo de delito o área normativa (Lote P del análisis secundario)",
  files: normativaDelitosFactory(),
};

// ============================================================
// Lote U — Vigencias históricas 2012-2021 (10 páginas BAJA)
// ============================================================

function vigenciasHistoricasFactory() {
  const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
  return years.map((year) => ({
    name: `vigencia-${year}`,
    label: `Vigencia ${year}`,
    file: `src/content/pages/normativa/vigencias/vigencia-${year}.json`,
    fields: [
      { name: "title", label: "Título", widget: "string", required: true },
      { name: "description", label: "Descripción SEO", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-calendar" },
      { name: "intro", label: "Texto introductorio", widget: "text", required: false },
      {
        name: "informes",
        label: "Resoluciones / actos administrativos",
        widget: "list",
        label_singular: "Acto administrativo",
        collapsed: true,
        summary: "{{fields.titulo}}",
        fields: [
          { name: "titulo", label: "Título", widget: "string", required: true },
          { name: "url", label: "URL del PDF", widget: "string", required: true },
        ],
      },
    ],
  }));
}

const vigenciasHistoricas = {
  name: "vigencias-historicas",
  label: "VIGENCIAS HISTÓRICAS",
  label_singular: "Vigencia",
  description: "Archivo histórico de resoluciones por año (Lote U — 2012-2021)",
  files: vigenciasHistoricasFactory(),
};

export const normativaCollections = [normativaPaginas, normativaGeneral, normativaDelitos, vigenciasHistoricas];
