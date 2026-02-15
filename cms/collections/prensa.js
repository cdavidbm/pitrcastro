import { publicationCollection } from "../templates/fields.js";

// ============================================================
// Pagina principal de Prensa
// ============================================================

const prensaPrincipal = {
  name: "prensa",
  label: "PRENSA",
  files: [
    {
      name: "prensa-principal",
      label: "Pagina de Prensa",
      file: "src/content/pages/prensa.json",
      fields: [
        { name: "title", label: "Titulo", widget: "string", required: true },
        { name: "subtitle", label: "Subtitulo", widget: "string", required: false },
        {
          name: "sections",
          label: "Secciones",
          widget: "list",
          label_singular: "Seccion",
          collapsed: true,
          fields: [
            { name: "id", label: "ID", widget: "string" },
            { name: "titulo", label: "Titulo", widget: "string" },
            { name: "descripcion", label: "Descripcion", widget: "string" },
            { name: "icon", label: "Icono FontAwesome", widget: "string" },
            { name: "url", label: "URL", widget: "string" },
          ],
        },
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
    { name: "title", label: "Titulo", widget: "string", required: true },
    { name: "date", label: "Fecha de publicacion", widget: "datetime", format: "YYYY-MM-DD", required: true },
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
    { name: "description", label: "Descripcion", widget: "markdown", required: true },
    { name: "image", label: "Imagen del evento", widget: "image", required: false },
    { name: "virtualLink", label: "Enlace virtual (Meet, Zoom, etc.)", widget: "string", required: false },
    { name: "published", label: "Publicado", widget: "boolean", default: true },
  ],
};

// ============================================================
// Boletines y Comunicados (misma estructura)
// ============================================================

const archivoPdf = { name: "archivo", label: "Archivo PDF (opcional)", widget: "file", required: false };

const boletines = publicationCollection({
  name: "boletines",
  label: "    > Boletines",
  labelSingular: "Boletin",
  folder: "src/content/boletines",
  extraFields: [archivoPdf],
});

const comunicados = publicationCollection({
  name: "comunicados",
  label: "    > Comunicados",
  labelSingular: "Comunicado",
  folder: "src/content/comunicados",
  extraFields: [archivoPdf],
});

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
    { name: "title", label: "Titulo", widget: "string", required: true },
    { name: "date", label: "Fecha de publicacion", widget: "datetime", format: "YYYY-MM-DD", required: true },
    { name: "videoUrl", label: "URL del video (YouTube embed)", widget: "string", required: true, hint: "Usar URL de embed: https://www.youtube.com/embed/VIDEO_ID" },
    { name: "thumbnail", label: "Miniatura (opcional)", widget: "image", required: false },
    { name: "description", label: "Descripcion", widget: "text", required: false },
    { name: "duration", label: "Duracion", widget: "string", required: false, hint: "Ej: 5:30, 1:02:15" },
    { name: "published", label: "Publicado", widget: "boolean", default: true },
  ],
};

// ============================================================
// Galeria
// ============================================================

const galeria = {
  name: "galeria",
  label: "    > Galeria",
  label_singular: "Album",
  folder: "src/content/galeria",
  create: true,
  slug: "{{slug}}",
  format: "json",
  fields: [
    { name: "title", label: "Titulo del album", widget: "string", required: true },
    { name: "date", label: "Fecha", widget: "datetime", format: "YYYY-MM-DD", required: true },
    { name: "description", label: "Descripcion", widget: "text", required: false },
    { name: "coverImage", label: "Imagen de portada", widget: "image", required: true },
    {
      name: "images",
      label: "Imagenes",
      widget: "list",
      label_singular: "Imagen",
      fields: [
        { name: "image", label: "Imagen", widget: "image", required: true },
        { name: "caption", label: "Descripcion", widget: "string", required: false },
        { name: "alt", label: "Texto alternativo", widget: "string", required: true },
      ],
    },
    { name: "published", label: "Publicado", widget: "boolean", default: true },
  ],
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
    { name: "title", label: "Titulo", widget: "string", required: true },
    { name: "date", label: "Fecha de publicacion", widget: "datetime", format: "YYYY-MM-DD", required: true },
    { name: "image", label: "Imagen", widget: "image", required: false },
    { name: "videoUrl", label: "URL del video (opcional)", widget: "string", required: false },
    { name: "content", label: "Contenido", widget: "markdown", required: true },
    { name: "category", label: "Categoria", widget: "string", required: false },
    { name: "published", label: "Publicado", widget: "boolean", default: true },
  ],
};

export const prensaCollections = [
  prensaPrincipal,
  news,
  events,
  boletines,
  comunicados,
  videos,
  galeria,
  capsulas,
];
