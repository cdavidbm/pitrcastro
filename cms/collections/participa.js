export const participa = {
  name: "participa",
  label: "PARTICIPA",
  files: [
    {
      name: "participa-principal",
      label: "Página Participa",
      file: "src/content/pages/participa.json",
      fields: [
        { name: "title", label: "Título de la página", widget: "string", required: true },
        { name: "slug", label: "URL (slug)", widget: "string", required: true },
        { name: "description", label: "Descripción introductoria", widget: "markdown", required: false },
        { name: "published", label: "Publicado", widget: "boolean", default: true },
        {
          name: "mecanismos",
          label: "Mecanismos de participación",
          widget: "list",
          label_singular: "Mecanismo",
          collapsed: true,
          fields: [
            { name: "titulo", label: "Título", widget: "string" },
            { name: "descripcion", label: "Descripción", widget: "text" },
            { name: "icon", label: "Icono FontAwesome", widget: "string" },
            { name: "url", label: "Enlace (opcional)", widget: "string", required: false },
            { name: "externo", label: "Es enlace externo", widget: "boolean", default: false },
          ],
        },
        {
          name: "documentos",
          label: "Documentos relacionados",
          widget: "list",
          label_singular: "Documento",
          collapsed: true,
          required: false,
          fields: [
            { name: "name", label: "Nombre", widget: "string" },
            { name: "file", label: "Archivo", widget: "file" },
          ],
        },
      ],
    },
  ],
};
