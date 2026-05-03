import { albumFields, SLUG_PATTERN } from "../templates/fields.js";

// ============================================================
// Pagina principal de Prensa
// ============================================================

const prensaPrincipal = {
  name: "prensa",
  label: "PRENSA",
  files: [
    {
      name: "prensa-principal",
      label: "Página de Prensa",
      file: "src/content/pages/prensa.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "subtitle", label: "Subtítulo", widget: "string", required: false },
        {
          name: "sections",
          label: "Secciones",
          widget: "list",
          label_singular: "Sección",
          collapsed: true,
          fields: [
            { name: "id", label: "ID", widget: "string" },
            { name: "titulo", label: "Título", widget: "string" },
            { name: "descripcion", label: "Descripción", widget: "string" },
            { name: "icon", label: "Icono FontAwesome", widget: "string" },
            { name: "url", label: "URL", widget: "string" },
          ],
        },
      ],
    },
    {
      name: "comunicados-institucionales",
      label: "Comunicados Institucionales (PDFs)",
      file: "src/content/pages/prensa/comunicados-institucionales.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        {
          name: "anios",
          label: "Años",
          widget: "list",
          label_singular: "Año",
          collapsed: true,
          summary: "{{fields.anio}} ({{fields.items.length}})",
          fields: [
            { name: "anio", label: "Año", widget: "string", required: true },
            { name: "items", label: "Comunicados", widget: "list", label_singular: "Comunicado", collapsed: true, summary: "{{fields.nombre}}", fields: [
              { name: "nombre", label: "Nombre", widget: "string", required: true },
              { name: "url", label: "URL del PDF", widget: "string", required: true },
              { name: "tipo", label: "Tipo", widget: "select", options: ["pdf"], default: "pdf" },
            ] },
          ],
        },
      ],
    },
    {
      name: "videos-pagina",
      label: "Página Videos ITRC",
      file: "src/content/pages/prensa/videos.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
        { name: "videos", label: "Videos", widget: "list", label_singular: "Video", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "slug", label: "Slug", widget: "string", required: false, hint: "kebab-case, sin tildes. Identificador interno.", pattern: SLUG_PATTERN },
          { name: "titulo", label: "Título", widget: "string", required: true },
          { name: "descripcion", label: "Descripción", widget: "text", required: false },
          { name: "fecha", label: "Fecha", widget: "datetime", format: "YYYY-MM-DD", required: false },
          { name: "thumbnail", label: "Miniatura (poster)", widget: "string", required: false, hint: "URL de la miniatura mostrada antes del play." },
          { name: "url", label: "URL del video (MP4)", widget: "string", required: true },
          { name: "transcripcion", label: "URL transcripción (PDF)", widget: "string", required: false },
        ] },
        { name: "enlaces", label: "Enlaces externos", widget: "list", label_singular: "Enlace", collapsed: true, summary: "{{fields.texto}}", fields: [
          { name: "texto", label: "Texto", widget: "string", required: true },
          { name: "url", label: "URL", widget: "string", required: true },
          { name: "icon", label: "Icono", widget: "string", default: "fa-youtube" },
        ] },
      ],
    },
    {
      name: "galeria-pagina",
      label: "Página Galería",
      file: "src/content/pages/prensa/galeria.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
        { name: "albums", label: "Álbumes", widget: "list", label_singular: "Álbum", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string", required: true },
          { name: "imagen", label: "URL imagen de portada", widget: "string", required: true },
          { name: "slug", label: "Slug del álbum interno", widget: "string", required: false, hint: "Debe coincidir con un archivo en src/content/pages/galeria/. Vacío si el álbum está pendiente.", pattern: SLUG_PATTERN },
          { name: "disabled", label: "Pendiente (no clickeable)", widget: "boolean", default: false, required: false },
          { name: "nota", label: "Nota visible cuando está pendiente", widget: "string", required: false },
        ] },
      ],
    },
    {
      name: "capsulas-pagina",
      label: "Página Cápsulas Informativas",
      file: "src/content/pages/prensa/capsulas.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
        { name: "capsulas", label: "Cápsulas", widget: "list", label_singular: "Cápsula", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "slug", label: "Slug", widget: "string", required: false, hint: "kebab-case, sin tildes. Identificador interno.", pattern: SLUG_PATTERN },
          { name: "titulo", label: "Título", widget: "string", required: true },
          { name: "descripcion", label: "Descripción", widget: "text", required: false },
          { name: "fecha", label: "Fecha", widget: "datetime", format: "YYYY-MM-DD", required: false },
          { name: "posterImagen", label: "Imagen poster (thumbnail)", widget: "string", required: false, hint: "URL de la miniatura mostrada antes del play." },
          { name: "url", label: "URL del video (MP4)", widget: "string", required: true },
        ] },
      ],
    },
  ],
};

// ============================================================
// Noticias
// ============================================================

const news = {
  name: "news",
  label: "    > Noticias",
  label_singular: "Noticia",
  folder: "src/content/news",
  create: true,
  slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
  format: "frontmatter",
  sortable_fields: ["date", "title"],
  fields: [
    { name: "title", label: "Título", widget: "string", required: true },
    { name: "date", label: "Fecha de publicacion", widget: "datetime", format: "YYYY-MM-DD", required: true },
    { name: "categoria", label: "Categoría", widget: "select", required: true, default: "noticia",
      options: [
        { label: "Noticia (cotidiana, informal)", value: "noticia" },
        { label: "Comunicado de prensa (oficial, periódico)", value: "comunicado" },
        { label: "Boletín (formato legacy, antiguo)", value: "boletin" },
      ],
      hint: "Determina el badge visual y el filtro en /prensa/noticias" },
    { name: "image", label: "Imagen destacada", widget: "image", required: false },
    { name: "excerpt", label: "Extracto", widget: "text", required: false, hint: "Resumen corto para listados (max 160 caracteres)" },
    { name: "body", label: "Contenido", widget: "markdown", required: true },
    { name: "tags", label: "Etiquetas", widget: "list", required: false, allow_add: true },
    { name: "draft", label: "Borrador", widget: "boolean", default: false, hint: "Los borradores no se publican" },
  ],
};

// ============================================================
// Eventos
// ============================================================

const events = {
  name: "events",
  label: "    > Eventos",
  label_singular: "Evento",
  folder: "src/content/events",
  create: true,
  slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
  format: "json",
  sortable_fields: ["startDate", "title"],
  fields: [
    { name: "title", label: "Nombre del evento", widget: "string", required: true },
    { name: "startDate", label: "Fecha y hora de inicio", widget: "datetime", format: "YYYY-MM-DDTHH:mm:ss", required: true },
    { name: "endDate", label: "Fecha y hora de fin", widget: "datetime", format: "YYYY-MM-DDTHH:mm:ss", required: false },
    { name: "location", label: "Lugar", widget: "string", required: false },
    { name: "description", label: "Descripción", widget: "markdown", required: true },
    { name: "image", label: "Imagen del evento", widget: "image", required: false },
    { name: "virtualLink", label: "Enlace virtual (Meet, Zoom, etc.)", widget: "string", required: false },
    { name: "published", label: "Publicado", widget: "boolean", default: true },
  ],
};

// ============================================================
// Videos
// ============================================================

const videos = {
  name: "videos",
  label: "    > Videos",
  label_singular: "Video",
  folder: "src/content/videos",
  create: true,
  slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
  format: "json",
  sortable_fields: ["date", "title"],
  fields: [
    { name: "title", label: "Título", widget: "string", required: true },
    { name: "date", label: "Fecha de publicacion", widget: "datetime", format: "YYYY-MM-DD", required: true },
    { name: "videoUrl", label: "URL del video (YouTube embed)", widget: "string", required: true, hint: "Usar URL de embed: https://www.youtube.com/embed/VIDEO_ID" },
    { name: "thumbnail", label: "Miniatura (opcional)", widget: "image", required: false },
    { name: "description", label: "Descripción", widget: "text", required: false },
    { name: "duration", label: "Duracion", widget: "string", required: false, hint: "Ej: 5:30, 1:02:15" },
    { name: "published", label: "Publicado", widget: "boolean", default: true },
  ],
};

// ============================================================
// Galeria
// ============================================================

const galeriaAlbumes = {
  name: "galeria-albumes",
  label: "    > Galería — Álbumes",
  label_singular: "Álbum",
  folder: "src/content/pages/galeria",
  create: true,
  slug: "{{slug}}",
  format: "json",
  sortable_fields: ["fecha", "titulo"],
  fields: albumFields(),
};

// ============================================================
// Capsulas Informativas
// ============================================================

const capsulas = {
  name: "capsulas",
  label: "    > Capsulas Informativas",
  label_singular: "Capsula",
  folder: "src/content/capsulas",
  create: true,
  slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
  format: "json",
  sortable_fields: ["date", "title"],
  fields: [
    { name: "title", label: "Título", widget: "string", required: true },
    { name: "date", label: "Fecha de publicacion", widget: "datetime", format: "YYYY-MM-DD", required: true },
    { name: "image", label: "Imagen", widget: "image", required: false },
    { name: "videoUrl", label: "URL del video (opcional)", widget: "string", required: false },
    { name: "content", label: "Contenido", widget: "markdown", required: true },
    { name: "category", label: "Categoria", widget: "string", required: false },
    { name: "published", label: "Publicado", widget: "boolean", default: true },
  ],
};

// ============================================================
// CIPREP — Congreso Internacional para la Protección de los Recursos Públicos
// ============================================================

const ciprepPagina = {
  name: "ciprep-pagina",
  label: "    > CIPREP — Página principal",
  files: [
    {
      name: "ciprep",
      label: "Landing CIPREP",
      file: "src/content/pages/ciprep.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "shortTitle", label: "Título corto", widget: "string", required: false },
        { name: "subtitle", label: "Subtítulo", widget: "string", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
        { name: "edicion", label: "Número de edición", widget: "number", required: true, value_type: "int" },
        { name: "estado", label: "Estado", widget: "select", options: ["proximo", "abierto", "en-curso", "realizado"], default: "proximo" },
        { name: "fechas", label: "Fechas (texto)", widget: "string", hint: "Ej: 20 y 21 de octubre de 2025" },
        { name: "lugar", label: "Lugar", widget: "string", required: true },
        { name: "direccion", label: "Dirección", widget: "string", required: false },
        { name: "organizador", label: "Organizador", widget: "string", required: true },
        { name: "aliadoEstrategico", label: "Aliado estratégico", widget: "string", required: false },
        { name: "youtubeId", label: "YouTube ID (video principal)", widget: "string", required: false },
        { name: "mapsUrl", label: "URL Google Maps", widget: "string", required: false },
        { name: "wazeUrl", label: "URL Waze", widget: "string", required: false },
        {
          name: "porQue",
          label: "¿Por qué el Congreso? (párrafos)",
          widget: "list",
          field: { name: "parrafo", label: "Párrafo", widget: "text" },
        },
        {
          name: "agenda",
          label: "Agenda",
          widget: "object",
          fields: ["dia1", "dia2"].map((d) => ({
            name: d,
            label: `Día ${d.slice(-1)}`,
            widget: "object",
            fields: [
              { name: "fecha", label: "Fecha", widget: "string" },
              { name: "fechaCorta", label: "Fecha corta", widget: "string" },
              {
                name: "items",
                label: "Bloques",
                widget: "list",
                collapsed: true,
                summary: "{{fields.hora}} — {{fields.titulo}}",
                fields: [
                  { name: "hora", label: "Hora", widget: "string" },
                  { name: "titulo", label: "Título", widget: "string", required: true },
                  { name: "franja", label: "Franja", widget: "string", required: false },
                  { name: "moderador", label: "Moderador", widget: "string", required: false },
                  {
                    name: "ponentes",
                    label: "Ponentes",
                    widget: "list",
                    required: false,
                    collapsed: true,
                    fields: [
                      { name: "nombre", label: "Nombre", widget: "string" },
                      { name: "cargo", label: "Cargo", widget: "string", required: false },
                      { name: "slug", label: "Slug speaker", widget: "string", required: false, hint: "Slug del archivo en speakers/ (opcional)" },
                    ],
                  },
                ],
              },
            ],
          })),
        },
        {
          name: "aliados",
          label: "Aliados",
          widget: "object",
          fields: [
            {
              name: "estrategico",
              label: "Aliado estratégico",
              widget: "list",
              fields: [
                { name: "logo", label: "Logo", widget: "image" },
                { name: "nombre", label: "Nombre", widget: "string" },
              ],
            },
            {
              name: "integridad",
              label: "Aliados para la integridad",
              widget: "list",
              fields: [
                { name: "logo", label: "Logo", widget: "image" },
                { name: "nombre", label: "Nombre", widget: "string", required: false },
              ],
            },
          ],
        },
        {
          name: "memorias",
          label: "Memorias",
          widget: "object",
          fields: [
            { name: "descripcion", label: "Descripción", widget: "text" },
            { name: "youtubeId", label: "Video destacado (YouTube ID)", widget: "string", required: false },
            {
              name: "recursos",
              label: "Recursos descargables",
              widget: "list",
              fields: [
                { name: "titulo", label: "Título", widget: "string" },
                { name: "descripcion", label: "Descripción", widget: "string" },
                { name: "tipo", label: "Tipo", widget: "select", options: ["video", "descarga"] },
                { name: "url", label: "URL/archivo", widget: "string", required: false, hint: "Dejar vacío para mostrar 'Próximamente'" },
              ],
            },
          ],
        },
        {
          name: "cta",
          label: "Llamado a la acción (próxima edición)",
          widget: "object",
          required: false,
          fields: [
            { name: "titulo", label: "Título", widget: "string" },
            { name: "descripcion", label: "Descripción", widget: "text" },
            { name: "enlaceLabel", label: "Texto del enlace", widget: "string" },
            { name: "enlaceAncla", label: "URL/ancla", widget: "string" },
          ],
        },
      ],
    },
  ],
};

const ciprepSpeakers = {
  name: "ciprep-speakers",
  label: "    > CIPREP — Speakers",
  label_singular: "Speaker",
  folder: "src/content/pages/ciprep/speakers",
  create: true,
  slug: "{{slug}}",
  format: "json",
  sortable_fields: ["order", "name"],
  fields: [
    { name: "order", label: "Orden de aparición", widget: "number", value_type: "int", required: true },
    { name: "slug", label: "Slug", widget: "string", required: true, pattern: SLUG_PATTERN, hint: "Identificador URL (solo minúsculas, números y guiones)" },
    { name: "name", label: "Nombre completo", widget: "string", required: true },
    { name: "shortName", label: "Nombre corto", widget: "string", required: false },
    { name: "cargo", label: "Cargo y entidad", widget: "string", required: true },
    { name: "bio", label: "Biografía", widget: "text", required: true },
    { name: "photo", label: "Foto", widget: "image", required: true },
  ],
};

export const prensaCollections = [
  prensaPrincipal,
  news,
  events,
  videos,
  galeriaAlbumes,
  capsulas,
  ciprepPagina,
  ciprepSpeakers,
];
