// Colección CMS para el Observatorio de Fraude y Corrupción

import { postFields } from "../templates/fields.js";

const headerFields = [
  { name: "title", label: "Título", widget: "string", required: true },
  { name: "description", label: "Descripción SEO", widget: "text", required: false },
  { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
];

export const observatorio = {
  name: "observatorio",
  label: "OBSERVATORIO",
  files: [
    {
      name: "observatorio-landing",
      label: "Landing Observatorio",
      file: "src/content/pages/observatorio/observatorio.json",
      fields: [
        ...headerFields,
        { name: "intro", label: "Introducción", widget: "text", required: true },
        { name: "secciones", label: "Ejes (4)", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "icon", label: "Icono", widget: "string" },
          { name: "url", label: "URL", widget: "string" },
          { name: "color", label: "Color (navy/gold/green/purple)", widget: "string" },
        ]},
      ],
    },
    {
      name: "observatorio-del",
      label: "Del Observatorio",
      file: "src/content/pages/observatorio/del-observatorio.json",
      fields: [
        ...headerFields,
        { name: "tabs", label: "Pestañas (3)", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "contenido", label: "Contenido (markdown)", widget: "text" },
        ]},
      ],
    },
    {
      name: "observatorio-medicion",
      label: "Eje de Medición",
      file: "src/content/pages/observatorio/eje-de-medicion.json",
      fields: [
        ...headerFields,
        { name: "intro", label: "Introducción", widget: "text" },
        { name: "dashboards", label: "Dashboards PowerBI", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "url", label: "URL PowerBI", widget: "string" },
          { name: "icon", label: "Icono", widget: "string" },
        ]},
      ],
    },
    {
      name: "observatorio-educacion-landing",
      label: "Eje de Educación — Landing",
      file: "src/content/pages/observatorio/eje-de-educacion.json",
      fields: [
        ...headerFields,
        { name: "intro", label: "Introducción", widget: "text" },
        { name: "secciones", label: "Sub-secciones (7)", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "icon", label: "Icono", widget: "string" },
          { name: "url", label: "URL", widget: "string" },
          { name: "color", label: "Color", widget: "string" },
        ]},
      ],
    },
    {
      name: "observatorio-articulos",
      label: "Artículos y Publicaciones",
      file: "src/content/pages/observatorio/eje-de-educacion/articulos.json",
      fields: [
        ...headerFields,
        { name: "articulos", label: "Artículos", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "autor", label: "Autor", widget: "string" },
          { name: "url", label: "URL del PDF", widget: "string" },
          { name: "imagen", label: "URL de imagen", widget: "string" },
        ]},
      ],
    },
    {
      name: "observatorio-conociendo",
      label: "Conociendo más de ITRC",
      file: "src/content/pages/observatorio/eje-de-educacion/conociendo.json",
      fields: [
        ...headerFields,
        { name: "documentos", label: "Documentos", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "text" },
          { name: "url", label: "URL del PDF", widget: "string" },
        ]},
      ],
    },
    {
      name: "observatorio-juego-roles",
      label: "Juego de Roles",
      file: "src/content/pages/observatorio/eje-de-educacion/juego-de-roles.json",
      fields: [
        ...headerFields,
        { name: "bienvenida", label: "Bienvenida", widget: "string" },
        { name: "descripcion", label: "Descripción", widget: "text" },
        { name: "explicacion", label: "Explicación", widget: "text" },
        { name: "videoTutorial", label: "Video Tutorial", widget: "object", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "url", label: "URL del video MP4", widget: "string" },
          { name: "poster", label: "URL del poster", widget: "string" },
        ]},
        { name: "guionUrl", label: "URL del guión (PDF)", widget: "string" },
        { name: "juegoUrl", label: "URL del juego externo", widget: "string" },
      ],
    },
    {
      name: "observatorio-itrc-ninos",
      label: "ITRC para Niños — Landing",
      file: "src/content/pages/observatorio/eje-de-educacion/itrc-para-ninos.json",
      fields: [
        ...headerFields,
        { name: "intro", label: "Introducción", widget: "text" },
        { name: "secciones", label: "Sub-secciones", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "icon", label: "Icono", widget: "string" },
          { name: "url", label: "URL", widget: "string" },
          { name: "color", label: "Color (hex)", widget: "string" },
          { name: "externo", label: "¿Es enlace externo?", widget: "boolean", default: false, required: false },
        ]},
      ],
    },
    {
      name: "observatorio-video-ninos",
      label: "Video Niños",
      file: "src/content/pages/observatorio/eje-de-educacion/video-ninos.json",
      fields: [
        ...headerFields,
        { name: "videoUrl", label: "URL del video MP4", widget: "string" },
        { name: "descripcion", label: "Descripción", widget: "text" },
      ],
    },
    {
      name: "observatorio-glosario-ninos",
      label: "Glosario para Niños",
      file: "src/content/pages/observatorio/eje-de-educacion/glosario-ninos.json",
      fields: [
        ...headerFields,
        { name: "intro", label: "Introducción", widget: "text" },
        { name: "terminos", label: "Términos", widget: "list", collapsed: true, summary: "{{fields.termino}}", fields: [
          { name: "termino", label: "Término", widget: "string" },
          { name: "definicion", label: "Definición", widget: "text" },
        ]},
      ],
    },
    {
      name: "observatorio-libro-infantil",
      label: "Libro Infantil (Flipsnack)",
      file: "src/content/pages/observatorio/eje-de-educacion/libro-infantil.json",
      fields: [
        ...headerFields,
        { name: "embedUrl", label: "URL del embed Flipsnack", widget: "string" },
      ],
    },
    {
      name: "observatorio-cartilla-infantil",
      label: "Cartilla Infantil (Flipsnack)",
      file: "src/content/pages/observatorio/eje-de-educacion/cartilla-infantil.json",
      fields: [
        ...headerFields,
        { name: "embedUrl", label: "URL del embed Flipsnack", widget: "string" },
      ],
    },
    {
      name: "observatorio-repositorio",
      label: "Repositorio Jurídico",
      file: "src/content/pages/observatorio/eje-de-educacion/repositorio-juridico.json",
      fields: [
        ...headerFields,
        { name: "intro", label: "Introducción", widget: "text" },
        { name: "normas", label: "Normas", widget: "list", collapsed: true, summary: "{{fields.nombre}}", fields: [
          { name: "tipo", label: "Tipo", widget: "string" },
          { name: "numero", label: "Número", widget: "string" },
          { name: "nombre", label: "Nombre completo", widget: "string" },
          { name: "palabrasClave", label: "Palabras clave", widget: "text" },
        ]},
      ],
    },
    {
      name: "observatorio-memorias-educacion",
      label: "Memorias Eje Educación (listado)",
      file: "src/content/pages/observatorio/eje-de-educacion/memorias.json",
      fields: [
        ...headerFields,
        { name: "banner", label: "URL del banner", widget: "string", required: false },
        { name: "anios", label: "Memorias por año", widget: "list", collapsed: true, summary: "{{fields.anio}}", fields: [
          { name: "anio", label: "Año", widget: "string" },
          { name: "entradas", label: "Entradas", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
            { name: "titulo", label: "Título", widget: "string" },
            { name: "fecha", label: "Fecha", widget: "string" },
            { name: "imagen", label: "URL de imagen", widget: "string" },
            { name: "url", label: "URL interna a la ficha", widget: "string", required: false, hint: "Ej: /observatorio/eje-de-educacion/memorias/<slug>" },
          ]},
        ]},
      ],
    },
    {
      name: "observatorio-participacion-landing",
      label: "Eje de Participación — Landing",
      file: "src/content/pages/observatorio/eje-de-participacion.json",
      fields: [
        ...headerFields,
        { name: "intro", label: "Introducción", widget: "text" },
        { name: "secciones", label: "Sub-secciones (5)", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "icon", label: "Icono", widget: "string" },
          { name: "url", label: "URL", widget: "string" },
          { name: "color", label: "Color", widget: "string" },
        ]},
      ],
    },
    {
      name: "observatorio-cartillas",
      label: "Cartillas Divulgativas",
      file: "src/content/pages/observatorio/eje-de-participacion/cartillas.json",
      fields: [
        ...headerFields,
        { name: "cartillas", label: "Cartillas", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "url", label: "URL del PDF", widget: "string" },
          { name: "imagen", label: "URL de imagen", widget: "string" },
        ]},
      ],
    },
    {
      name: "observatorio-videos-tutoriales",
      label: "Videos Tutoriales",
      file: "src/content/pages/observatorio/eje-de-participacion/videos-tutoriales.json",
      fields: [
        ...headerFields,
        { name: "videos", label: "Videos", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "url", label: "URL del video MP4", widget: "string" },
          { name: "poster", label: "URL del poster", widget: "string" },
        ]},
      ],
    },
    {
      name: "observatorio-encuesta",
      label: "Encuesta Ciudadana",
      file: "src/content/pages/observatorio/eje-de-participacion/encuesta.json",
      fields: [
        ...headerFields,
        { name: "intro", label: "Introducción", widget: "text" },
        { name: "participar", label: "Bloque Participar", widget: "object", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "url", label: "URL MS Forms", widget: "string" },
          { name: "imagen", label: "URL de imagen", widget: "string" },
        ]},
        { name: "resultados", label: "Bloque Resultados", widget: "object", fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "url", label: "URL PowerBI", widget: "string" },
          { name: "imagen", label: "URL de imagen", widget: "string" },
        ]},
      ],
    },
    {
      name: "observatorio-noticias",
      label: "Noticias del Observatorio",
      file: "src/content/pages/observatorio/eje-de-participacion/noticias.json",
      fields: [
        ...headerFields,
        { name: "banner", label: "URL del banner", widget: "string", required: false },
        { name: "noticias", label: "Noticias", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
          { name: "slug", label: "Slug", widget: "string", required: false, hint: "kebab-case, sin tildes. Identificador interno." },
          { name: "fecha", label: "Fecha (humano)", widget: "string", hint: "Texto mostrado, ej. '15 de diciembre de 2021'." },
          { name: "fechaIso", label: "Fecha ISO", widget: "datetime", format: "YYYY-MM-DD", required: false, hint: "Fecha estructurada para ordenamiento (YYYY-MM-DD)." },
          { name: "titulo", label: "Título", widget: "string" },
          { name: "imagen", label: "URL de imagen", widget: "string" },
          { name: "resumen", label: "Resumen", widget: "text" },
          { name: "descripcion", label: "Descripción larga", widget: "text", required: false, hint: "Contenido ampliado para ficha de detalle (opcional)." },
        ]},
      ],
    },
    {
      name: "observatorio-memorias-participacion",
      label: "Memorias Eje Participación (listado)",
      file: "src/content/pages/observatorio/eje-de-participacion/memorias.json",
      fields: [
        ...headerFields,
        { name: "banner", label: "URL del banner", widget: "string", required: false },
        { name: "anios", label: "Memorias por año", widget: "list", collapsed: true, summary: "{{fields.anio}}", fields: [
          { name: "anio", label: "Año", widget: "string" },
          { name: "entradas", label: "Entradas", widget: "list", collapsed: true, summary: "{{fields.titulo}}", fields: [
            { name: "titulo", label: "Título", widget: "string" },
            { name: "fecha", label: "Fecha", widget: "string" },
            { name: "imagen", label: "URL de imagen", widget: "string" },
            { name: "url", label: "URL interna a la ficha", widget: "string", required: false, hint: "Ej: /observatorio/eje-de-participacion/memorias/<slug>" },
          ]},
        ]},
      ],
    },
  ],
};

// Folder collection: una ficha JSON por memoria (Lote B).
export const memoriasEducacion = {
  name: "memorias-educacion",
  label: "    > Memorias Educación — Fichas",
  label_singular: "Memoria",
  folder: "src/content/pages/observatorio/eje-de-educacion/memorias",
  create: true,
  slug: "{{slug}}",
  format: "json",
  sortable_fields: ["fecha", "titulo"],
  fields: postFields(),
};

// Folder collection: una ficha JSON por memoria (Lote C).
export const memoriasParticipacion = {
  name: "memorias-participacion",
  label: "    > Memorias Participación — Fichas",
  label_singular: "Memoria",
  folder: "src/content/pages/observatorio/eje-de-participacion/memorias",
  create: true,
  slug: "{{slug}}",
  format: "json",
  sortable_fields: ["fecha", "titulo"],
  fields: postFields(),
};
