// ============================================================
// Campos compartidos para items de transparencia
// ============================================================

const itemFields = [
  { name: "num", label: "Número (ej: 1.1)", widget: "string", required: false },
  { name: "texto", label: "Texto del enlace", widget: "string", required: true },
  { name: "url", label: "URL", widget: "string", required: false, hint: "Dejar vacío si es solo etiqueta (label)" },
  { name: "tipo", label: "Tipo", widget: "select", options: ["internal", "external", "pdf", "xlsx", "label"], default: "internal" },
  {
    name: "children",
    label: "Sub-items (opcional)",
    widget: "list",
    label_singular: "Sub-item",
    collapsed: true,
    required: false,
    summary: "{{fields.num}} {{fields.texto}}",
    fields: [
      { name: "num", label: "Número", widget: "string", required: false },
      { name: "texto", label: "Texto", widget: "string", required: true },
      { name: "url", label: "URL", widget: "string", required: true },
      { name: "tipo", label: "Tipo", widget: "select", options: ["internal", "external", "pdf", "xlsx"], default: "internal" },
    ],
  },
];

export const transparencia = {
  name: "transparencia",
  label: "TRANSPARENCIA",
  files: [
    {
      name: "transparencia-principal",
      label: "Página de Transparencia",
      file: "src/content/pages/transparencia.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-eye" },
        { name: "introTexto", label: "Texto introductorio", widget: "text", required: true },
        { name: "ley1712Url", label: "URL del PDF Ley 1712", widget: "string", required: false },
        {
          name: "secciones",
          label: "Secciones de Transparencia",
          widget: "list",
          label_singular: "Sección",
          collapsed: true,
          summary: "{{fields.numero}}. {{fields.titulo}}",
          fields: [
            { name: "numero", label: "Número de sección", widget: "string", required: true },
            { name: "titulo", label: "Título", widget: "string", required: true },
            { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
            { name: "tituloUrl", label: "URL del título (opcional)", widget: "string", required: false },
            { name: "descripcion", label: "Descripción (opcional)", widget: "text", required: false },
            {
              name: "items",
              label: "Items",
              widget: "list",
              label_singular: "Item",
              collapsed: true,
              summary: "{{fields.num}} {{fields.texto}}",
              fields: itemFields,
            },
          ],
        },
      ],
    },
    {
      name: "directorio-entidades",
      label: "Directorio de Entidades",
      file: "src/content/pages/transparencia/directorio-entidades.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-building" },
        {
          name: "grupos",
          label: "Grupos de entidades",
          widget: "list",
          label_singular: "Grupo",
          collapsed: true,
          summary: "{{fields.nombre}} ({{fields.entidades.length}})",
          fields: [
            { name: "nombre", label: "Nombre del grupo", widget: "string", required: true },
            {
              name: "entidades",
              label: "Entidades",
              widget: "list",
              label_singular: "Entidad",
              collapsed: true,
              summary: "{{fields.nombre}}",
              fields: [
                { name: "nombre", label: "Nombre", widget: "string", required: true },
                { name: "url", label: "URL del sitio web", widget: "string", required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "hojas-de-vida",
      label: "Publicación Hojas de Vida",
      file: "src/content/pages/transparencia/hojas-de-vida.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-id-card" },
        { name: "enlaceExterno", label: "URL enlace Presidencia", widget: "string", required: false },
        {
          name: "aspirantes",
          label: "Aspirantes",
          widget: "list",
          label_singular: "Aspirante",
          collapsed: true,
          summary: "{{fields.nombre}} — {{fields.cargo}}",
          fields: [
            { name: "nombre", label: "Nombre completo", widget: "string", required: true },
            { name: "cargo", label: "Cargo", widget: "string", required: true },
            { name: "fechaFijacion", label: "Fecha de fijación", widget: "string", required: true },
            { name: "fechaDesfijacion", label: "Fecha de desfijación", widget: "string", required: false },
            { name: "pdf", label: "URL del PDF de hoja de vida", widget: "string", required: true },
          ],
        },
      ],
    },
  ],
};
