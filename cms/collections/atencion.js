import { docFieldsUrlSimple, SLUG_PATTERN } from "../templates/fields.js";

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

// ============================================================
// Campos compartidos para notificaciones (edictos, estados, traslados)
// ============================================================

const notificacionFields = [
  { name: "expediente", label: "Número del expediente", widget: "string", required: true },
  { name: "tipoAuto", label: "Tipo de auto", widget: "string", required: true },
  { name: "tipoNotificacion", label: "Tipo de notificación / traslado", widget: "string", required: true },
  { name: "dependencia", label: "Dependencia que profiere el acto", widget: "string", required: true },
  { name: "fechaAuto", label: "Fecha del auto", widget: "string", required: false, hint: "Formato: DD/MM/AAAA" },
  { name: "desde", label: "Desde", widget: "string", required: false, hint: "Formato: DD/MM/AAAA" },
  { name: "hasta", label: "Hasta", widget: "string", required: false, hint: "Formato: DD/MM/AAAA" },
  { name: "pdfUrl", label: "URL del auto (PDF)", widget: "string", required: false },
  { name: "vigencia", label: "Vigencia (Año)", widget: "number", value_type: "int", required: true, hint: "Año de la vigencia: 2026, 2025, etc." },
];

// ============================================================
// Notificaciones y Traslados (file collection)
// ============================================================

const notificaciones = {
  name: "notificaciones-traslados",
  label: "ATENCIÓN Y SERVICIOS",
  files: [
    {
      name: "edictos",
      label: "Edictos (Notificaciones Supletorias)",
      file: "src/content/notificaciones/edictos.json",
      fields: [
        {
          name: "entries",
          label: "Edictos",
          widget: "list",
          label_singular: "Edicto",
          collapsed: true,
          summary: "{{fields.expediente}} — {{fields.tipoAuto}} ({{fields.vigencia}})",
          fields: notificacionFields,
        },
      ],
    },
    {
      name: "estados",
      label: "Estados (Notificaciones Supletorias)",
      file: "src/content/notificaciones/estados.json",
      fields: [
        {
          name: "entries",
          label: "Estados",
          widget: "list",
          label_singular: "Estado",
          collapsed: true,
          summary: "{{fields.expediente}} — {{fields.tipoAuto}} ({{fields.vigencia}})",
          fields: notificacionFields,
        },
      ],
    },
    {
      name: "traslados",
      label: "Traslados",
      file: "src/content/notificaciones/traslados.json",
      fields: [
        {
          name: "entries",
          label: "Traslados",
          widget: "list",
          label_singular: "Traslado",
          collapsed: true,
          summary: "{{fields.expediente}} — {{fields.tipoAuto}} ({{fields.vigencia}})",
          fields: notificacionFields,
        },
      ],
    },
    {
      name: "notificaciones-aviso",
      label: "Notificaciones por Aviso",
      file: "src/content/pages/atencion/notificaciones-por-aviso.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-bullhorn" },
        { name: "textoLegal", label: "Texto introductorio", widget: "text", required: true },
        { name: "citaLegal", label: "Cita legal (blockquote)", widget: "text", required: true },
      ],
    },
    {
      name: "correo-notificaciones",
      label: "Correo Notificaciones Judiciales",
      file: "src/content/pages/atencion/correo-notificaciones-judiciales.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-envelope-open-text" },
        { name: "texto", label: "Texto introductorio", widget: "text", required: true },
        { name: "email", label: "Correo electrónico", widget: "string", required: true },
      ],
    },
    {
      name: "vinculacion-terceros",
      label: "Vinculación a Terceros",
      file: "src/content/pages/atencion/vinculacion-a-terceros.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-user-xmark" },
        {
          name: "documentos",
          label: "Documentos",
          widget: "list",
          label_singular: "Documento",
          collapsed: true,
          summary: "{{fields.nombre}} — {{fields.fecha}}",
          fields: [
            { name: "nombre", label: "Nombre", widget: "string", required: true },
            { name: "fecha", label: "Fecha", widget: "string", required: true },
            { name: "file", label: "URL del PDF", widget: "string", required: true },
          ],
        },
      ],
    },
    {
      name: "canales-atencion",
      label: "Canales de Atención",
      file: "src/content/pages/atencion/canales-de-atencion.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-headset" },
        { name: "intro", label: "Texto introductorio", widget: "text", required: true },
        {
          name: "canales",
          label: "Canales",
          widget: "list",
          label_singular: "Canal",
          collapsed: true,
          summary: "{{fields.nombre}}",
          fields: [
            { name: "nombre", label: "Nombre del canal", widget: "string", required: true },
            { name: "icon", label: "Icono FontAwesome", widget: "string", required: true },
            { name: "color", label: "Color (gold, blue, green, red, purple)", widget: "string", default: "gold" },
            {
              name: "items",
              label: "Datos del canal",
              widget: "list",
              label_singular: "Dato",
              summary: "{{fields.label}}: {{fields.valor}}",
              fields: [
                { name: "label", label: "Etiqueta", widget: "string", required: true },
                { name: "valor", label: "Valor", widget: "string", required: true },
                { name: "icon", label: "Icono", widget: "string", required: false },
                { name: "url", label: "URL (opcional)", widget: "string", required: false },
                { name: "destacado", label: "Destacar valor", widget: "boolean", default: false, required: false },
              ],
            },
          ],
        },
        {
          name: "portafolio",
          label: "Portafolio de servicios",
          widget: "object",
          required: false,
          fields: [
            { name: "nombre", label: "Nombre", widget: "string" },
            { name: "file", label: "URL del PDF", widget: "string" },
          ],
        },
      ],
    },
    {
      name: "preguntas-frecuentes",
      label: "Preguntas Frecuentes",
      file: "src/content/pages/atencion/preguntas-frecuentes.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-circle-question" },
        {
          name: "faqs",
          label: "Preguntas frecuentes",
          widget: "list",
          label_singular: "Pregunta",
          collapsed: true,
          summary: "{{fields.pregunta}}",
          fields: [
            { name: "pregunta", label: "Pregunta", widget: "string", required: true },
            { name: "respuesta", label: "Respuesta", widget: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "pqrs",
      label: "P.Q.R.S",
      file: "src/content/pages/atencion/pqrs.json",
      fields: [
        { name: "title", label: "Título", widget: "string", required: true },
        { name: "description", label: "Descripción SEO", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-comments" },
        { name: "intro", label: "Texto introductorio", widget: "text", required: true },
        { name: "tramitesUrl", label: "URL formulario PQRS", widget: "string", required: true },
        { name: "consultaUrl", label: "URL consulta estado", widget: "string", required: true },
        {
          name: "definiciones",
          label: "Definiciones P.Q.R.S",
          widget: "list",
          label_singular: "Definición",
          collapsed: true,
          summary: "{{fields.letra}} — {{fields.titulo}}",
          fields: [
            { name: "letra", label: "Letra", widget: "string", required: true },
            { name: "titulo", label: "Título", widget: "string", required: true },
            { name: "color", label: "Color (blue, gold, red, green)", widget: "string", default: "blue" },
            { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
            { name: "descripcion", label: "Descripción", widget: "text", required: true },
          ],
        },
        {
          name: "informes",
          label: "Informes trimestrales",
          widget: "list",
          label_singular: "Grupo de año",
          collapsed: true,
          summary: "{{fields.label}} ({{fields.reportes.length}} informes)",
          fields: [
            { name: "anio", label: "Identificador del año", widget: "string", required: true },
            { name: "label", label: "Etiqueta visible", widget: "string", required: true },
            {
              name: "reportes",
              label: "Reportes",
              widget: "list",
              label_singular: "Reporte",
              collapsed: true,
              summary: "{{fields.nombre}} ({{fields.tipo}})",
              fields: [
                { name: "nombre", label: "Nombre del informe", widget: "string", required: true },
                { name: "file", label: "URL del archivo", widget: "string", required: true },
                { name: "tipo", label: "Tipo de archivo", widget: "select", options: ["pdf", "pptx", "xlsx"], default: "pdf" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "glosario",
      label: "Glosario Institucional",
      file: "src/content/pages/atencion/glosario.json",
      fields: [
        { name: "title", label: "Título de la página", widget: "string", required: true },
        { name: "description", label: "Descripción", widget: "text", required: false },
        { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-book" },
        {
          name: "terminos",
          label: "Términos del glosario",
          widget: "list",
          label_singular: "Término",
          collapsed: true,
          summary: "{{fields.termino}}",
          fields: [
            { name: "termino", label: "Término", widget: "string", required: true },
            { name: "definicion", label: "Definición", widget: "text", required: true },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// Páginas genéricas de Atención (folder collection)
// ============================================================

const atencionGeneral = {
  name: "atencion-servicios",
  label: "    > Otras Páginas de Atención",
  label_singular: "Página de Atención",
  folder: "src/content/pages/atencion",
  create: true,
  slug: "{{slug}}",
  format: "json",
  description: "Páginas de atención al ciudadano y servicios",
  fields: [
    { name: "title", label: "Título de la página", widget: "string", required: true },
    { name: "slug", label: "URL (slug)", widget: "string", required: true, pattern: SLUG_PATTERN },
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

// ============================================================
// Lote S — Participación + Atención pendientes (4 páginas MEDIA)
// ============================================================

const loteS_hub = {
  name: "otros-grupos-interes",
  label: "Otros grupos de interés (hub)",
  file: "src/content/pages/participa-atencion/otros-grupos-interes.json",
  fields: [
    { name: "title", label: "Título", widget: "string", required: true },
    { name: "description", label: "Descripción SEO", widget: "text", required: false },
    { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-users-line" },
    { name: "intro", label: "Texto introductorio", widget: "text", required: false },
    {
      name: "enlaces",
      label: "Enlaces / recursos",
      widget: "list",
      label_singular: "Enlace",
      collapsed: true,
      summary: "{{fields.titulo}}",
      fields: [
        { name: "titulo", label: "Título", widget: "string", required: true },
        { name: "descripcion", label: "Descripción", widget: "text", required: false },
        { name: "url", label: "URL", widget: "string", required: true },
        { name: "tipo", label: "Tipo", widget: "select", options: ["internal", "external", "pdf"], default: "internal" },
        { name: "icon", label: "Icono", widget: "string", required: false },
      ],
    },
  ],
};

const loteS_comiteConciliacion = {
  name: "informe-comite-conciliacion",
  label: "Informe Gestión Comité de Conciliación",
  file: "src/content/pages/participa-atencion/informe-comite-conciliacion.json",
  fields: [
    { name: "title", label: "Título", widget: "string", required: true },
    { name: "description", label: "Descripción SEO", widget: "text", required: false },
    { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-handshake" },
    { name: "intro", label: "Texto introductorio", widget: "text", required: false },
    {
      name: "informes",
      label: "Informes semestrales",
      widget: "list",
      label_singular: "Informe",
      collapsed: true,
      summary: "{{fields.titulo}}",
      fields: [
        { name: "titulo", label: "Título", widget: "string", required: true },
        { name: "url", label: "URL del PDF", widget: "string", required: true },
      ],
    },
  ],
};

const loteS_chat = {
  name: "chat-itrc",
  label: "Chat ITRC",
  file: "src/content/pages/participa-atencion/chat-itrc.json",
  fields: [
    { name: "title", label: "Título", widget: "string", required: true },
    { name: "description", label: "Descripción SEO", widget: "text", required: false },
    { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-comments" },
    { name: "intro", label: "Texto introductorio", widget: "text", required: false },
    { name: "condicionesUso", label: "Condiciones de uso", widget: "list", required: false, field: { name: "condicion", label: "Condición", widget: "string" } },
    {
      name: "cta",
      label: "Botón CTA al chat externo",
      widget: "object",
      collapsed: true,
      fields: [
        { name: "texto", label: "Texto", widget: "string", required: true },
        { name: "url", label: "URL", widget: "string", required: true },
        { name: "descripcion", label: "Descripción", widget: "text", required: false },
        { name: "external", label: "Enlace externo", widget: "boolean", default: true },
        { name: "icon", label: "Icono", widget: "string", required: false },
      ],
    },
  ],
};

const loteS_respuestaAnonimos = {
  name: "respuesta-anonimos",
  label: "Respuesta a Anónimos (Notificación por Aviso)",
  file: "src/content/pages/participa-atencion/respuesta-anonimos.json",
  fields: [
    { name: "title", label: "Título", widget: "string", required: true },
    { name: "description", label: "Descripción SEO", widget: "text", required: false },
    { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-bell" },
    { name: "aviso", label: "Aviso legal (Art. 69 Ley 1437/2011)", widget: "text", required: false },
    {
      name: "notificaciones",
      label: "Notificaciones por aviso",
      widget: "list",
      label_singular: "Notificación",
      collapsed: true,
      summary: "{{fields.fecha}} — {{fields.radicadoRespuesta}}",
      fields: [
        { name: "fecha", label: "Fecha de publicación", widget: "string", required: true, hint: "Ej: 17/01/2024" },
        { name: "radicadoPqrs", label: "Radicado PQRS", widget: "string", required: false },
        { name: "radicadoRespuesta", label: "Radicado de respuesta", widget: "string", required: true },
        { name: "url", label: "URL del PDF", widget: "string", required: true },
      ],
    },
  ],
};

const loteSCollection = {
  name: "participa-atencion-pendientes",
  label: "PARTICIPA + ATENCIÓN (pendientes — Lote S)",
  description: "Páginas agregadas en Lote S: hub de grupos de interés, informe Comité Conciliación, Chat ITRC, Respuesta a Anónimos.",
  files: [loteS_hub, loteS_comiteConciliacion, loteS_chat, loteS_respuestaAnonimos],
};

export const atencionCollections = [notificaciones, atencionGeneral, loteSCollection];
