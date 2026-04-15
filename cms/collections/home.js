// ============================================================
// Pagina de Inicio (home)
// ============================================================

export const home = {
  name: "home",
  label: "INICIO",
  label_singular: "Página de Inicio",
  description: "Contenido editorial de la página principal",
  files: [
    {
      name: "home-pagina",
      label: "Página de Inicio",
      file: "src/content/pages/home.json",
      fields: [
        {
          name: "entidadesVigiladas",
          label: "Entidades vigiladas",
          widget: "list",
          label_singular: "Entidad",
          collapsed: true,
          summary: "{{fields.nombre}}",
          fields: [
            { name: "nombre", label: "Nombre corto", widget: "string", required: true },
            { name: "url", label: "URL externa", widget: "string", required: true },
            { name: "logo", label: "Archivo del logo", widget: "string", required: true, hint: "Nombre del archivo dentro de public/images/entidades/ (ej. dian.png)" },
            { name: "alt", label: "Texto alternativo (accesibilidad)", widget: "string", required: true },
          ],
        },
        {
          name: "columnasServicios",
          label: "Columnas 'Servicios a la Ciudadanía'",
          widget: "list",
          label_singular: "Columna",
          collapsed: true,
          fields: [
            {
              name: "items",
              label: "Enlaces",
              widget: "list",
              label_singular: "Enlace",
              collapsed: true,
              summary: "{{fields.texto}}",
              fields: [
                { name: "texto", label: "Texto del enlace", widget: "string", required: true },
                { name: "url", label: "URL", widget: "string", required: true, hint: "Internos: ruta sin slash inicial (ej. glosario). Externos: URL completa con https://" },
                { name: "tipo", label: "Tipo", widget: "select", options: ["internal", "external"], default: "internal" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
