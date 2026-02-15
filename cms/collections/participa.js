export const participa = {
  name: "participa",
  label: "PARTICIPA",
  files: [
    {
      name: "participa-principal",
      label: "Pagina Participa",
      file: "src/content/pages/participa.json",
      fields: [
        { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
        { name: "slug", label: "URL (slug)", widget: "string", required: true },
        { name: "description", label: "Descripcion introductoria", widget: "markdown", required: false },
        { name: "published", label: "Publicado", widget: "boolean", default: true },
        {
          name: "mecanismos",
          label: "Mecanismos de participacion",
          widget: "list",
          label_singular: "Mecanismo",
          collapsed: true,
          fields: [
            { name: "titulo", label: "Titulo", widget: "string" },
            { name: "descripcion", label: "Descripcion", widget: "text" },
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
