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

export const atencion = {
  name: "atencion-servicios",
  label: "ATENCIÓN Y SERVICIOS",
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
