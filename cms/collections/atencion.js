import { docFieldsUrlSimple } from "../templates/fields.js";

const DISPLAY_MODE_SIMPLE = {
  name: "displayMode",
  label: "Modo de visualización",
  widget: "select",
  options: [
    { label: "Acordeón", value: "accordion" },
    { label: "Lista simple", value: "list" },
  ],
  default: "list",
};

// ============================================================
// Campos compartidos para notificaciones (edictos, estados, traslados)
// ============================================================

const notificacionFields = [
  { name: "expediente", label: "Número del expediente", widget: "string", required: true },
  { name: "tipoAuto", label: "Tipo de auto", widget: "string", required: true },
  { name: "tipoNotificacion", label: "Tipo de notificación / traslado", widget: "string", required: true },
  { name: "dependencia", label: "Dependencia que profiere el acto", widget: "string", required: true },
  { name: "fechaAuto", label: "Fecha del auto", widget: "string", required: false, hint: "Formato: DD/MM/AAAA" },
  { name: "desde", label: "Desde", widget: "string", required: false, hint: "Formato: DD/MM/AAAA" },
  { name: "hasta", label: "Hasta", widget: "string", required: false, hint: "Formato: DD/MM/AAAA" },
  { name: "pdfUrl", label: "URL del auto (PDF)", widget: "string", required: false },
  { name: "vigencia", label: "Vigencia (Año)", widget: "number", value_type: "int", required: true, hint: "Año de la vigencia: 2026, 2025, etc." },
];

// ============================================================
// Notificaciones y Traslados (file collection)
// ============================================================

const notificaciones = {
  name: "notificaciones-traslados",
  label: "ATENCIÓN Y SERVICIOS",
  files: [
    {
      name: "edictos",
      label: "Edictos (Notificaciones Supletorias)",
      file: "src/content/notificaciones/edictos.json",
      fields: [
        {
          name: "entries",
          label: "Edictos",
          widget: "list",
          label_singular: "Edicto",
          collapsed: true,
          summary: "{{fields.expediente}} — {{fields.tipoAuto}} ({{fields.vigencia}})",
          fields: notificacionFields,
        },
      ],
    },
    {
      name: "estados",
      label: "Estados (Notificaciones Supletorias)",
      file: "src/content/notificaciones/estados.json",
      fields: [
        {
          name: "entries",
          label: "Estados",
          widget: "list",
          label_singular: "Estado",
          collapsed: true,
          summary: "{{fields.expediente}} — {{fields.tipoAuto}} ({{fields.vigencia}})",
          fields: notificacionFields,
        },
      ],
    },
    {
      name: "traslados",
      label: "Traslados",
      file: "src/content/notificaciones/traslados.json",
      fields: [
        {
          name: "entries",
          label: "Traslados",
          widget: "list",
          label_singular: "Traslado",
          collapsed: true,
          summary: "{{fields.expediente}} — {{fields.tipoAuto}} ({{fields.vigencia}})",
          fields: notificacionFields,
        },
      ],
    },
    {
      name: "glosario",
      label: "Glosario Institucional",
      file: "src/content/pages/atencion/glosario.json",
      fields: [
        { name: "title", label: "Título de la página", widget: "string", required: true },
        { name: "description", label: "Descripción", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-book" },
        {
          name: "terminos",
          label: "Términos del glosario",
          widget: "list",
          label_singular: "Término",
          collapsed: true,
          summary: "{{fields.termino}}",
          fields: [
            { name: "termino", label: "Término", widget: "string", required: true },
            { name: "definicion", label: "Definición", widget: "text", required: true },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// Páginas genéricas de Atención (folder collection)
// ============================================================

const atencionGeneral = {
  name: "atencion-servicios",
  label: "    > Otras Páginas de Atención",
  label_singular: "Página de Atención",
  folder: "src/content/pages/atencion",
  create: true,
  slug: "{{slug}}",
  format: "json",
  description: "Páginas de atención al ciudadano y servicios",
  fields: [
    { name: "title", label: "Título de la página", widget: "string", required: true },
    { name: "slug", label: "URL (slug)", widget: "string", required: true, pattern: ["^[a-z0-9-]+$", "Solo minúsculas, números y guiones"] },
    { name: "description", label: "Descripción", widget: "markdown", required: false },
    { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-headset" },
    { name: "published", label: "Publicado", widget: "boolean", default: true },
    { name: "content", label: "Contenido principal", widget: "markdown", required: false, hint: "Contenido HTML/Markdown de la página" },
    {
      name: "sections",
      label: "Secciones de documentos (opcional)",
      widget: "list",
      label_singular: "Sección",
      collapsed: true,
      required: false,
      fields: [
        { name: "sectionTitle", label: "Título de la sección", widget: "string", required: true },
        { name: "sectionDescription", label: "Descripción de la sección", widget: "text", required: false },
        DISPLAY_MODE_SIMPLE,
        {
          name: "documents",
          label: "Documentos",
          widget: "list",
          label_singular: "Documento",
          fields: docFieldsUrlSimple(),
        },
      ],
    },
    {
      name: "faqs",
      label: "Preguntas frecuentes (opcional)",
      widget: "list",
      label_singular: "Pregunta",
      collapsed: true,
      required: false,
      fields: [
        { name: "pregunta", label: "Pregunta", widget: "string" },
        { name: "respuesta", label: "Respuesta", widget: "markdown" },
      ],
    },
  ],
};

export const atencionCollections = [notificaciones, atencionGeneral];
