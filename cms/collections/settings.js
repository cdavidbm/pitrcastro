export const settings = {
  name: "settings",
  label: "CONFIGURACION",
  files: [
    // --- Datos de contacto ---
    {
      name: "contact",
      label: "Datos de Contacto",
      file: "src/content/settings/contact.json",
      fields: [
        { name: "address", label: "Direccion", widget: "string" },
        { name: "city", label: "Ciudad", widget: "string" },
        { name: "postalCode", label: "Codigo Postal", widget: "string", required: false },
        { name: "phone", label: "Telefono principal", widget: "string" },
        { name: "tollFree", label: "Linea gratuita", widget: "string", required: false },
        { name: "email", label: "Correo electronico", widget: "string" },
        { name: "emailNotifications", label: "Correo notificaciones", widget: "string", required: false },
        { name: "schedule", label: "Horario de atencion", widget: "text" },
        {
          name: "socialMedia",
          label: "Redes sociales",
          widget: "object",
          collapsed: true,
          fields: [
            { name: "facebook", label: "Facebook", widget: "string", required: false },
            { name: "twitter", label: "Twitter/X", widget: "string", required: false },
            { name: "youtube", label: "YouTube", widget: "string", required: false },
            { name: "instagram", label: "Instagram", widget: "string", required: false },
          ],
        },
      ],
    },

    // --- Menu de navegacion ---
    {
      name: "navigation",
      label: "Menu de Navegacion",
      file: "src/content/settings/navigation.json",
      fields: [
        {
          name: "mainMenu",
          label: "Menu principal",
          widget: "list",
          fields: [
            { name: "label", label: "Texto", widget: "string" },
            { name: "url", label: "URL", widget: "string" },
            { name: "external", label: "Enlace externo", widget: "boolean", default: false, required: false },
            { name: "highlighted", label: "Destacado (color especial)", widget: "boolean", default: false, required: false },
            {
              name: "children",
              label: "Submenu",
              widget: "list",
              required: false,
              fields: [
                { name: "label", label: "Texto", widget: "string" },
                { name: "url", label: "URL", widget: "string" },
                { name: "external", label: "Enlace externo", widget: "boolean", default: false, required: false },
              ],
            },
          ],
        },
        {
          name: "footerLinks",
          label: "Enlaces del pie de pagina",
          widget: "list",
          label_singular: "Enlace",
          required: false,
          collapsed: true,
          fields: [
            { name: "label", label: "Texto", widget: "string" },
            { name: "url", label: "URL", widget: "string" },
            { name: "external", label: "Enlace externo", widget: "boolean", default: false, required: false },
            { name: "highlighted", label: "Destacado", widget: "boolean", default: false, required: false },
          ],
        },
      ],
    },

    // --- Informacion institucional ---
    {
      name: "site",
      label: "Informacion del Sitio",
      file: "src/content/settings/site.json",
      fields: [
        { name: "name", label: "Nombre de la institucion", widget: "string" },
        { name: "fullName", label: "Nombre completo", widget: "string" },
        { name: "description", label: "Descripcion (SEO)", widget: "text", hint: "Descripcion para motores de busqueda" },
        { name: "keywords", label: "Palabras clave (SEO)", widget: "list", required: false },
        {
          name: "featuredVideo",
          label: "Video destacado (Home)",
          widget: "object",
          collapsed: true,
          fields: [
            { name: "url", label: "URL del video (YouTube embed)", widget: "string" },
            { name: "title", label: "Titulo del video", widget: "string" },
          ],
        },
      ],
    },

    // --- Accesos rapidos home ---
    {
      name: "quickAccess",
      label: "Accesos Rapidos (Home)",
      file: "src/content/settings/quickAccess.json",
      fields: [
        {
          name: "items",
          label: "Accesos rapidos",
          widget: "list",
          fields: [
            { name: "label", label: "Texto", widget: "string" },
            { name: "url", label: "URL", widget: "string" },
            { name: "icon", label: "Icono FontAwesome", widget: "string", hint: "Ejemplo: fa-file-alt, fa-gavel" },
            { name: "external", label: "Enlace externo", widget: "boolean", default: false },
            { name: "highlighted", label: "Destacado", widget: "boolean", default: false },
          ],
        },
      ],
    },
  ],
};
