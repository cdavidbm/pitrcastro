import {
  DISPLAY_MODE,
  SLUG_PATTERN,
  ID_PATTERN,
  pageHeader,
  documentSections,
  docFieldsFull,
  docFieldsMinimal,
  ctaSection,
} from "../templates/fields.js";

// ============================================================
// Equipo Directivo
// ============================================================

function equipoDirectivo() {
  const bioParrafos = {
    label: "Párrafo",
    name: "parrafo",
    widget: "text",
  };

  return {
    name: "equipo-directivo",
    label: "Equipo Directivo",
    file: "src/content/pages/agencia/equipo-directivo.json",
    fields: [
      { name: "title", label: "Título de la página", widget: "string", required: true },
      { name: "subtitle", label: "Subtítulo", widget: "string", required: false },
      {
        name: "directora",
        label: "Directora General",
        widget: "object",
        fields: [
          { name: "nombre", label: "Nombre completo", widget: "string" },
          { name: "cargo", label: "Cargo", widget: "string" },
          { name: "imagen", label: "Foto", widget: "image" },
          { name: "bio", label: "Biografía (párrafos)", widget: "list", field: bioParrafos },
        ],
      },
      {
        name: "subdirectores",
        label: "Subdirectores",
        widget: "list",
        label_singular: "Subdirector",
        collapsed: true,
        fields: [
          { name: "nombre", label: "Nombre completo", widget: "string" },
          { name: "cargo", label: "Cargo", widget: "string" },
          { name: "area", label: "Área/Dependencia", widget: "string" },
          { name: "imagen", label: "Foto", widget: "image" },
          { name: "bio", label: "Biografía (párrafos)", widget: "list", field: bioParrafos },
        ],
      },
    ],
  };
}

// ============================================================
// Mision, Vision y Proposito
// ============================================================

function misionVision() {
  return {
    name: "mision-vision",
    label: "Misión y Visión",
    file: "src/content/pages/agencia/mision-vision.json",
    fields: [
      { name: "title", label: "Título de la página", widget: "string", required: true },
      {
        name: "proposito",
        label: "Propósito Estratégico",
        widget: "object",
        fields: [
          { name: "badge", label: "Etiqueta", widget: "string" },
          { name: "titulo", label: "Título principal", widget: "string" },
          { name: "subtitulo", label: "Subtítulo", widget: "string" },
        ],
      },
      { name: "mision", label: "Misión", widget: "text", hint: "Puede incluir HTML para negritas: <strong>texto</strong>" },
      { name: "vision", label: "Visión", widget: "text", hint: "Puede incluir HTML para negritas: <strong>texto</strong>" },
      {
        name: "valores",
        label: "Valores Institucionales",
        widget: "list",
        label_singular: "Valor",
        fields: [
          { name: "nombre", label: "Nombre del valor", widget: "string" },
          { name: "icon", label: "Icono FontAwesome", widget: "string", hint: "Ej: fa-heart, fa-handshake" },
          { name: "descripcion", label: "Descripción", widget: "string" },
        ],
      },
      {
        name: "quienesSomos",
        label: "Quiénes Somos",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          {
            name: "intro",
            label: "Párrafos de introducción",
            widget: "list",
            label_singular: "Parrafo",
            field: { label: "Párrafo", name: "parrafo", widget: "text" },
          },
          {
            name: "capacidades",
            label: "Capacidades",
            widget: "list",
            label_singular: "Capacidad",
            field: { label: "Capacidad", name: "capacidad", widget: "string" },
          },
        ],
      },
      {
        name: "queHacemos",
        label: "Qué Hacemos",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          { name: "intro", label: "Texto introductorio", widget: "text", hint: "Puede incluir HTML para negritas: <strong>texto</strong>" },
          {
            name: "entidades",
            label: "Entidades vigiladas",
            widget: "list",
            label_singular: "Entidad",
            fields: [
              { name: "nombre", label: "Nombre", widget: "string" },
              { name: "descripcion", label: "Descripción", widget: "string" },
            ],
          },
          { name: "cierre", label: "Texto de cierre", widget: "text", hint: "Puede incluir HTML para negritas: <strong>texto</strong>" },
        ],
      },
      {
        name: "comoLoHacemos",
        label: "Cómo lo Hacemos",
        widget: "list",
        label_singular: "Método",
        required: false,
        collapsed: true,
        fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "icon", label: "Icono FontAwesome", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "text" },
        ],
      },
      {
        name: "funciones",
        label: "Funciones de la Agencia",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          { name: "intro", label: "Texto introductorio", widget: "text", hint: "Puede incluir HTML para negritas: <strong>texto</strong>" },
          {
            name: "items",
            label: "Lista de funciones",
            widget: "list",
            label_singular: "Función",
            fields: [
              { name: "title", label: "Título de la función", widget: "string" },
              { name: "content", label: "Descripción detallada", widget: "text" },
            ],
          },
          { name: "paragrafo", label: "Parágrafo", widget: "text", required: false },
        ],
      },
      {
        name: "mapaEstrategico",
        label: "Mapa Estratégico",
        widget: "object",
        fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "imagen", label: "Imagen del mapa", widget: "image" },
          { name: "pdf", label: "PDF descargable", widget: "file" },
        ],
      },
    ],
  };
}

// ============================================================
// Organigrama
// ============================================================

function organigrama() {
  return {
    name: "organigrama",
    label: "Organigrama",
    file: "src/content/pages/agencia/organigrama.json",
    fields: [
      { name: "title", label: "Título de la página", widget: "string", required: true },
      { name: "subtitle", label: "Subtítulo", widget: "string" },
      {
        name: "organigrama",
        label: "Imagen del Organigrama",
        widget: "object",
        fields: [
          { name: "imagen", label: "Imagen", widget: "image" },
          { name: "pdf", label: "PDF descargable", widget: "file" },
          { name: "alt", label: "Texto alternativo", widget: "string" },
        ],
      },
      {
        name: "funcionesPorArea",
        label: "Funciones por Área",
        widget: "object",
        fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "matrizUrl", label: "URL de la matriz PDF", widget: "file" },
        ],
      },
      {
        name: "resolucionesSeccion",
        label: "Sección de Resoluciones",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          { name: "titulo", label: "Título de la sección", widget: "string" },
          { name: "descripcion", label: "Descripción de la sección", widget: "string" },
        ],
      },
      {
        name: "resoluciones",
        label: "Resoluciones",
        widget: "list",
        label_singular: "Resolución",
        fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "url", label: "URL del documento", widget: "file" },
        ],
      },
      {
        name: "ctaDirectorio",
        label: "CTA Directorio de Servidores",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
        ],
      },
    ],
  };
}

// ============================================================
// Direccionamiento Estrategico (pagina principal)
// ============================================================

function direccionamientoEstrategico() {
  return {
    name: "direccionamiento-estrategico",
    label: "Direccionamiento Estratégico",
    file: "src/content/pages/agencia/direccionamiento-estrategico.json",
    fields: [
      { name: "title", label: "Título de la página", widget: "string", required: true },
      { name: "subtitle", label: "Subtítulo", widget: "string" },
      { name: "intro", label: "Texto de introducción", widget: "text" },
      {
        name: "sections",
        label: "Secciones principales",
        widget: "list",
        label_singular: "Sección",
        fields: [
          { name: "id", label: "ID", widget: "string", pattern: ID_PATTERN },
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "text" },
          { name: "icon", label: "Icono FontAwesome", widget: "string" },
          {
            name: "color",
            label: "Color",
            widget: "select",
            options: [
              { label: "Azul Navy", value: "navy" },
              { label: "Dorado", value: "gold" },
              { label: "Verde", value: "green" },
            ],
          },
          { name: "documentos", label: "Cantidad de documentos", widget: "number" },
        ],
      },
    ],
  };
}

// ============================================================
// Direccionamiento subpaginas (politicas, planes, informes)
// ============================================================

function direccionamientoSubpage(name, label, filename, defaultIcon) {
  return {
    name: `direccionamiento-${name}`,
    label: `    > ${label}`,
    file: `src/content/pages/agencia/direccionamiento/${filename}`,
    fields: [
      ...pageHeader({ icon: defaultIcon }),
      documentSections(docFieldsFull),
    ],
  };
}

// ============================================================
// Gestion Misional
// ============================================================

function gestionMisional() {
  return {
    name: "gestion-misional",
    label: "Gestión Misional",
    file: "src/content/pages/agencia/gestion-misional.json",
    fields: [
      { name: "title", label: "Título de la página", widget: "string", required: true },
      { name: "slug", label: "URL (slug)", widget: "string", required: true, pattern: SLUG_PATTERN },
      { name: "description", label: "Descripción", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-briefcase" },
      { name: "published", label: "Publicado", widget: "boolean", default: true },
      {
        name: "subdirecciones",
        label: "Subdirecciones",
        widget: "list",
        label_singular: "Subdirección",
        collapsed: true,
        fields: [
          { name: "id", label: "ID (para anclas)", widget: "string", pattern: ID_PATTERN },
          { name: "titulo", label: "Título completo", widget: "string" },
          { name: "sigla", label: "Sigla", widget: "string", hint: "Ej: SAGR, SID, SAL" },
          { name: "icon", label: "Icono FontAwesome", widget: "string" },
          {
            name: "color",
            label: "Color",
            widget: "select",
            options: [
              { label: "Azul Navy", value: "navy" },
              { label: "Dorado", value: "gold" },
              { label: "Verde", value: "green" },
            ],
            default: "navy",
          },
          { name: "descripcion", label: "Descripción", widget: "text" },
          {
            name: "observatorio",
            label: "Enlace a Observatorio (opcional)",
            widget: "object",
            required: false,
            collapsed: true,
            fields: [
              { name: "texto", label: "Texto introductorio", widget: "string" },
              { name: "url", label: "URL del enlace", widget: "string" },
              { name: "label", label: "Texto del botón", widget: "string" },
            ],
          },
          {
            name: "categorias",
            label: "Categorías de documentos",
            widget: "list",
            label_singular: "Categoría",
            collapsed: true,
            fields: [
              { name: "titulo", label: "Título de la categoría", widget: "string" },
              {
                name: "documentos",
                label: "Documentos",
                widget: "list",
                label_singular: "Documento",
                collapsed: true,
                fields: [
                  { name: "name", label: "Nombre del documento", widget: "string" },
                  { name: "file", label: "URL del archivo", widget: "string" },
                  { name: "anio", label: "Año", widget: "string", required: false },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

// ============================================================
// Informacion Financiera
// ============================================================

function informacionFinanciera() {
  return {
    name: "informacion-financiera",
    label: "Información Financiera",
    file: "src/content/pages/agencia/informacion-financiera.json",
    fields: [
      { name: "title", label: "Título de la página", widget: "string", required: true },
      { name: "slug", label: "URL (slug)", widget: "string", required: true, pattern: SLUG_PATTERN },
      { name: "subtitle", label: "Subtítulo", widget: "string", required: false },
      { name: "published", label: "Publicado", widget: "boolean", default: true },
      {
        name: "tabs",
        label: "Categorías (Tabs)",
        widget: "list",
        label_singular: "Categoría",
        collapsed: true,
        fields: [
          { name: "id", label: "ID (sin espacios)", widget: "string", pattern: SLUG_PATTERN },
          { name: "label", label: "Nombre de la categoría", widget: "string" },
          {
            name: "items",
            label: "Documentos",
            widget: "list",
            label_singular: "Documento",
            collapsed: true,
            fields: [
              { name: "titulo", label: "Título del documento", widget: "string" },
              { name: "url", label: "URL del archivo", widget: "string" },
              {
                name: "tipo",
                label: "Tipo de archivo",
                widget: "select",
                options: [
                  { label: "PDF", value: "pdf" },
                  { label: "Excel", value: "xls" },
                ],
                default: "pdf",
                required: false,
              },
            ],
          },
        ],
      },
      {
        name: "infoCards",
        label: "Tarjetas informativas",
        widget: "list",
        label_singular: "Tarjeta",
        required: false,
        collapsed: true,
        fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "text" },
          { name: "icon", label: "Icono FontAwesome", widget: "string", hint: "Ej: fa-scale-balanced, fa-landmark" },
        ],
      },
      ctaSection(),
    ],
  };
}

// ============================================================
// Sistema Integrado de Gestion
// ============================================================

function sistemaIntegradoGestion() {
  return {
    name: "sistema-integrado-gestion",
    label: "Sistema Integrado de Gestión",
    file: "src/content/pages/agencia/sistema-integrado-de-gestion.json",
    fields: [
      ...pageHeader({ icon: "fa-folder-open" }),
      documentSections(docFieldsMinimal),
    ],
  };
}

// ============================================================
// Sistema de Control Interno
// ============================================================

function sistemaControlInterno() {
  return {
    name: "sistema-control-interno",
    label: "Sistema de Control Interno",
    file: "src/content/pages/agencia/sistema-de-control-interno.json",
    fields: [
      { name: "title", label: "Título de la página", widget: "string", required: true },
      { name: "slug", label: "URL (slug)", widget: "string", required: true },
      { name: "subtitle", label: "Subtítulo", widget: "string", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-shield-halved" },
      { name: "published", label: "Publicado", widget: "boolean", default: true },
      { name: "introTitle", label: "Título de introducción", widget: "string", required: false },
      { name: "introContent", label: "Contenido de introducción", widget: "markdown", required: false },
      {
        name: "entidadesExternas",
        label: "Entidades de Control Externo",
        widget: "list",
        label_singular: "Entidad",
        collapsed: true,
        fields: [
          { name: "nombre", label: "Nombre de la entidad", widget: "string" },
          { name: "direccion", label: "Dirección", widget: "string" },
          { name: "telefono", label: "Teléfono", widget: "string" },
          { name: "lineaNacional", label: "Línea nacional", widget: "string", required: false },
          { name: "email", label: "Correo electrónico", widget: "string", required: false },
          { name: "web", label: "Sitio web", widget: "string" },
          { name: "control", label: "Tipo de control", widget: "string" },
          { name: "icon", label: "Icono FontAwesome", widget: "string" },
        ],
      },
      {
        name: "controlPolitico",
        label: "Órganos de Control Político",
        widget: "list",
        label_singular: "Órgano",
        required: false,
        collapsed: true,
        fields: [
          { name: "nombre", label: "Nombre", widget: "string" },
          { name: "direccion", label: "Dirección", widget: "string" },
          { name: "telefono", label: "Teléfono", widget: "string" },
          { name: "lineaNacional", label: "Línea nacional", widget: "string", required: false },
          { name: "email", label: "Correo electrónico", widget: "string", required: false },
          { name: "web", label: "Sitio web", widget: "string", required: false },
        ],
      },
      {
        name: "controlInterno",
        label: "Órganos de Control Interno",
        widget: "list",
        label_singular: "Órgano",
        required: false,
        collapsed: true,
        fields: [
          { name: "nombre", label: "Nombre", widget: "string" },
          { name: "control", label: "Tipo de control", widget: "string" },
          { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
        ],
      },
      {
        name: "contactoInterno",
        label: "Datos de Contacto Institucional",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          { name: "direccion", label: "Dirección", widget: "string" },
          { name: "telefono", label: "Teléfono", widget: "string" },
          { name: "lineaNacional", label: "Línea nacional", widget: "string", required: false },
          { name: "email", label: "Correo electrónico", widget: "string" },
        ],
      },
      {
        name: "informesLegales",
        label: "Informes Legales",
        widget: "list",
        label_singular: "Categoría",
        collapsed: true,
        fields: [
          { name: "titulo", label: "Título de la categoría", widget: "string" },
          {
            name: "documentos",
            label: "Documentos",
            widget: "list",
            label_singular: "Documento",
            collapsed: true,
            fields: [
              { name: "name", label: "Nombre del documento", widget: "string" },
              { name: "file", label: "URL del archivo", widget: "string" },
              { name: "anio", label: "Año", widget: "string", required: false },
            ],
          },
        ],
      },
      {
        name: "planesMejoramiento",
        label: "Planes de Mejoramiento",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "text" },
          { name: "linkUrl", label: "URL del enlace", widget: "string" },
          { name: "linkText", label: "Texto del botón", widget: "string" },
        ],
      },
      {
        name: "enlacesRelacionados",
        label: "Enlaces Relacionados",
        widget: "list",
        label_singular: "Enlace",
        required: false,
        collapsed: true,
        fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "descripcion", label: "Descripción", widget: "string" },
          { name: "url", label: "URL", widget: "string" },
          { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
        ],
      },
    ],
  };
}

// ============================================================
// Plan Institucional de Archivos (PINAR)
// ============================================================

function planInstitucionalArchivos() {
  return {
    name: "plan-institucional-de-archivos",
    label: "Plan Institucional de Archivos",
    file: "src/content/pages/agencia/plan-institucional-de-archivos.json",
    fields: [
      { name: "title", label: "Título", widget: "string", required: true },
      { name: "description", label: "Descripción SEO", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
      { name: "intro", label: "Texto introductorio", widget: "text", required: false },
      {
        name: "documentos",
        label: "Documentos PINAR",
        widget: "list",
        label_singular: "Documento",
        collapsed: true,
        summary: "{{fields.titulo}} ({{fields.anio}})",
        fields: [
          { name: "titulo", label: "Título", widget: "string", required: true },
          { name: "anio", label: "Año", widget: "string", required: false },
          { name: "url", label: "URL del PDF", widget: "string", required: true },
        ],
      },
    ],
  };
}

// ============================================================
// Directorio de Servidores y Contratistas
// ============================================================

function directorio() {
  return {
    name: "directorio",
    label: "Directorio de Servidores y Contratistas",
    file: "src/content/pages/agencia/directorio.json",
    fields: [
      { name: "title", label: "Título", widget: "string", required: true },
      { name: "description", label: "Descripción SEO", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
      {
        name: "directorios",
        label: "Tarjetas principales",
        widget: "list",
        label_singular: "Tarjeta",
        collapsed: true,
        summary: "{{fields.titulo}}",
        fields: [
          { name: "titulo", label: "Título", widget: "string", required: true },
          { name: "descripcion", label: "Descripción", widget: "text", required: false },
          { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
          { name: "url", label: "URL del recurso", widget: "string", required: true },
          { name: "color", label: "Color del acento", widget: "select", options: ["navy", "gold", "green"], default: "navy" },
          { name: "external", label: "Enlace externo", widget: "boolean", default: false },
        ],
      },
      {
        name: "escalaSalarial",
        label: "Escala Salarial",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          { name: "titulo", label: "Título", widget: "string" },
          { name: "subtitulo", label: "Subtítulo", widget: "string", required: false },
          { name: "url", label: "URL del PDF", widget: "string" },
        ],
      },
      {
        name: "infoAdicional",
        label: "Información adicional",
        widget: "list",
        label_singular: "Bloque",
        collapsed: true,
        summary: "{{fields.titulo}}",
        fields: [
          { name: "titulo", label: "Título", widget: "string", required: true },
          { name: "descripcion", label: "Descripción", widget: "text", required: false },
          { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
          { name: "enlace", label: "URL del enlace", widget: "string", required: true },
          { name: "textoEnlace", label: "Texto del botón", widget: "string" },
          { name: "externo", label: "Enlace externo", widget: "boolean", default: false },
        ],
      },
    ],
  };
}

// ============================================================
// Collection export
// ============================================================

export const agencia = {
  name: "agencia",
  label: "LA AGENCIA",
  label_singular: "Página Agencia",
  description: "Páginas institucionales de la Agencia ITRC",
  files: [
    equipoDirectivo(),
    misionVision(),
    organigrama(),
    direccionamientoEstrategico(),
    direccionamientoSubpage("politicas", "Políticas", "politicas.json", "fa-scale-balanced"),
    direccionamientoSubpage("planes", "Planes", "planes.json", "fa-clipboard-list"),
    direccionamientoSubpage("informes", "Informes", "informes.json", "fa-chart-line"),
    gestionMisional(),
    informacionFinanciera(),
    sistemaIntegradoGestion(),
    sistemaControlInterno(),
    directorio(),
    planInstitucionalArchivos(),
    // --- Lote Q — Empleo y RRHH ---
    loteQofertasEmpleo(),
    loteQnombramientos(),
    loteQmanualesInternos(),
    loteQmanualEspecifico(),
    loteQmanualIdentidad(),
  ],
};

// ============================================================
// Lote Q — Empleo y RRHH (5 páginas MEDIA)
// ============================================================

function loteQofertasEmpleo() {
  return {
    name: "ofertas-empleo",
    label: "Ofertas de empleo (CNSC)",
    file: "src/content/pages/agencia/empleo-rrhh/ofertas-empleo.json",
    fields: [
      { name: "title", label: "Título", widget: "string", required: true },
      { name: "description", label: "Descripción SEO", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-briefcase" },
      { name: "intro", label: "Texto introductorio", widget: "text", required: false },
      {
        name: "cta",
        label: "Botón CTA externo",
        widget: "object",
        collapsed: true,
        fields: [
          { name: "texto", label: "Texto", widget: "string", required: true },
          { name: "url", label: "URL", widget: "string", required: true },
          { name: "descripcion", label: "Descripción", widget: "text", required: false },
          { name: "external", label: "Es enlace externo", widget: "boolean", default: true },
          { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
        ],
      },
    ],
  };
}

function loteQnombramientos() {
  return {
    name: "nombramientos",
    label: "Nombramientos por vigencia",
    file: "src/content/pages/agencia/empleo-rrhh/nombramientos.json",
    fields: [
      { name: "title", label: "Título", widget: "string", required: true },
      { name: "description", label: "Descripción SEO", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-user-check" },
      { name: "intro", label: "Texto introductorio", widget: "text", required: false },
      {
        name: "vigencias",
        label: "Vigencias (por año)",
        widget: "list",
        label_singular: "Vigencia",
        collapsed: true,
        summary: "{{fields.anio}}",
        fields: [
          { name: "anio", label: "Año", widget: "string", required: true },
          {
            name: "documentos",
            label: "Resoluciones",
            widget: "list",
            label_singular: "Resolución",
            collapsed: true,
            summary: "{{fields.titulo}}",
            fields: [
              { name: "titulo", label: "Título", widget: "string", required: true },
              { name: "url", label: "URL del PDF", widget: "string", required: true },
            ],
          },
        ],
      },
    ],
  };
}

function loteQmanualesInternos() {
  return {
    name: "manuales-internos",
    label: "Manuales internos",
    file: "src/content/pages/agencia/empleo-rrhh/manuales-internos.json",
    fields: [
      { name: "title", label: "Título", widget: "string", required: true },
      { name: "description", label: "Descripción SEO", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-book" },
      { name: "intro", label: "Texto introductorio", widget: "text", required: false },
      {
        name: "informes",
        label: "Manuales",
        widget: "list",
        label_singular: "Manual",
        collapsed: true,
        summary: "{{fields.titulo}}",
        fields: [
          { name: "titulo", label: "Nombre del manual", widget: "string", required: true },
          { name: "url", label: "URL del PDF", widget: "string", required: true },
        ],
      },
    ],
  };
}

function loteQmanualEspecifico() {
  return {
    name: "manual-especifico-funciones",
    label: "Manual Específico de Funciones (resoluciones + fichas)",
    file: "src/content/pages/agencia/empleo-rrhh/manual-especifico-funciones.json",
    fields: [
      { name: "title", label: "Título", widget: "string", required: true },
      { name: "description", label: "Descripción SEO", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-user-tie" },
      { name: "intro", label: "Texto introductorio", widget: "text", required: false },
      {
        name: "secciones",
        label: "Secciones",
        widget: "list",
        label_singular: "Sección",
        collapsed: true,
        summary: "{{fields.titulo}}",
        fields: [
          { name: "titulo", label: "Título de la sección", widget: "string", required: true },
          { name: "descripcion", label: "Descripción breve", widget: "text", required: false },
          {
            name: "documentos",
            label: "Documentos",
            widget: "list",
            label_singular: "Documento",
            collapsed: true,
            summary: "{{fields.titulo}}",
            fields: [
              { name: "titulo", label: "Título", widget: "string", required: true },
              { name: "url", label: "URL del PDF", widget: "string", required: true },
            ],
          },
        ],
      },
    ],
  };
}

function loteQmanualIdentidad() {
  return {
    name: "manual-identidad-visual",
    label: "Manual de Identidad Visual ITRC",
    file: "src/content/pages/agencia/empleo-rrhh/manual-identidad-visual.json",
    fields: [
      { name: "title", label: "Título", widget: "string", required: true },
      { name: "description", label: "Descripción SEO", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-palette" },
      { name: "intro", label: "Texto introductorio", widget: "text", required: false },
      {
        name: "informes",
        label: "Archivos del Manual",
        widget: "list",
        label_singular: "Archivo",
        collapsed: true,
        summary: "{{fields.titulo}}",
        fields: [
          { name: "titulo", label: "Título", widget: "string", required: true },
          { name: "url", label: "URL", widget: "string", required: true },
        ],
      },
    ],
  };
}
