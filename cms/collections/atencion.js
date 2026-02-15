import { docFieldsUrlSimple } from "../templates/fields.js";

const DISPLAY_MODE_SIMPLE = {
  name: "displayMode",
  label: "Modo de visualizacion",
  widget: "select",
  options: [
    { label: "Acordeon", value: "accordion" },
    { label: "Lista simple", value: "list" },
  ],
  default: "list",
};

export const atencion = {
  name: "atencion-servicios",
  label: "ATENCION Y SERVICIOS",
  label_singular: "Pagina de Atencion",
  folder: "src/content/pages/atencion",
  create: true,
  slug: "{{slug}}",
  format: "json",
  description: "Paginas de atencion al ciudadano y servicios",
  fields: [
    { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
    { name: "slug", label: "URL (slug)", widget: "string", required: true, pattern: ["^[a-z0-9-]+$", "Solo minusculas, numeros y guiones"] },
    { name: "description", label: "Descripcion", widget: "markdown", required: false },
    { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-headset" },
    { name: "published", label: "Publicado", widget: "boolean", default: true },
    { name: "content", label: "Contenido principal", widget: "markdown", required: false, hint: "Contenido HTML/Markdown de la pagina" },
    {
      name: "sections",
      label: "Secciones de documentos (opcional)",
      widget: "list",
      label_singular: "Seccion",
      collapsed: true,
      required: false,
      fields: [
        { name: "sectionTitle", label: "Titulo de la seccion", widget: "string", required: true },
        { name: "sectionDescription", label: "Descripcion de la seccion", widget: "text", required: false },
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
