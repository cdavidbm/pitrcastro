import {
  DISPLAY_MODE,
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
    label: "Parrafo",
    name: "parrafo",
    widget: "text",
  };

  return {
    name: "equipo-directivo",
    label: "Equipo Directivo",
    file: "src/content/pages/agencia/equipo-directivo.json",
    fields: [
      { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
      { name: "subtitle", label: "Subtitulo", widget: "string", required: false },
      {
        name: "directora",
        label: "Directora General",
        widget: "object",
        fields: [
          { name: "nombre", label: "Nombre completo", widget: "string" },
          { name: "cargo", label: "Cargo", widget: "string" },
          { name: "imagen", label: "Foto", widget: "image" },
          { name: "bio", label: "Biografia (parrafos)", widget: "list", field: bioParrafos },
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
          { name: "area", label: "Area/Dependencia", widget: "string" },
          { name: "imagen", label: "Foto", widget: "image" },
          { name: "bio", label: "Biografia (parrafos)", widget: "list", field: bioParrafos },
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
    label: "Mision y Vision",
    file: "src/content/pages/agencia/mision-vision.json",
    fields: [
      { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
      {
        name: "proposito",
        label: "Proposito Estrategico",
        widget: "object",
        fields: [
          { name: "badge", label: "Etiqueta", widget: "string" },
          { name: "titulo", label: "Titulo principal", widget: "string" },
          { name: "subtitulo", label: "Subtitulo", widget: "string" },
        ],
      },
      { name: "mision", label: "Mision", widget: "text", hint: "Puede incluir HTML para negritas: <strong>texto</strong>" },
      { name: "vision", label: "Vision", widget: "text", hint: "Puede incluir HTML para negritas: <strong>texto</strong>" },
      {
        name: "valores",
        label: "Valores Institucionales",
        widget: "list",
        label_singular: "Valor",
        fields: [
          { name: "nombre", label: "Nombre del valor", widget: "string" },
          { name: "icon", label: "Icono FontAwesome", widget: "string", hint: "Ej: fa-heart, fa-handshake" },
          { name: "descripcion", label: "Descripcion", widget: "string" },
        ],
      },
      {
        name: "quienesSomos",
        label: "Quienes Somos",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          {
            name: "intro",
            label: "Parrafos de introduccion",
            widget: "list",
            label_singular: "Parrafo",
            field: { label: "Parrafo", name: "parrafo", widget: "text" },
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
        label: "Que Hacemos",
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
              { name: "descripcion", label: "Descripcion", widget: "string" },
            ],
          },
          { name: "cierre", label: "Texto de cierre", widget: "text", hint: "Puede incluir HTML para negritas: <strong>texto</strong>" },
        ],
      },
      {
        name: "comoLoHacemos",
        label: "Como lo Hacemos",
        widget: "list",
        label_singular: "Metodo",
        required: false,
        collapsed: true,
        fields: [
          { name: "titulo", label: "Titulo", widget: "string" },
          { name: "icon", label: "Icono FontAwesome", widget: "string" },
          { name: "descripcion", label: "Descripcion", widget: "text" },
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
            label_singular: "Funcion",
            fields: [
              { name: "title", label: "Titulo de la funcion", widget: "string" },
              { name: "content", label: "Descripcion detallada", widget: "text" },
            ],
          },
          { name: "paragrafo", label: "Paragrafo", widget: "text", required: false },
        ],
      },
      {
        name: "mapaEstrategico",
        label: "Mapa Estrategico",
        widget: "object",
        fields: [
          { name: "titulo", label: "Titulo", widget: "string" },
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
      { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
      { name: "subtitle", label: "Subtitulo", widget: "string" },
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
        label: "Funciones por Area",
        widget: "object",
        fields: [
          { name: "titulo", label: "Titulo", widget: "string" },
          { name: "descripcion", label: "Descripcion", widget: "string" },
          { name: "matrizUrl", label: "URL de la matriz PDF", widget: "file" },
        ],
      },
      {
        name: "resolucionesSeccion",
        label: "Seccion de Resoluciones",
        widget: "object",
        required: false,
        collapsed: true,
        fields: [
          { name: "titulo", label: "Titulo de la seccion", widget: "string" },
          { name: "descripcion", label: "Descripcion de la seccion", widget: "string" },
        ],
      },
      {
        name: "resoluciones",
        label: "Resoluciones",
        widget: "list",
        label_singular: "Resolucion",
        fields: [
          { name: "titulo", label: "Titulo", widget: "string" },
          { name: "descripcion", label: "Descripcion", widget: "string" },
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
          { name: "titulo", label: "Titulo", widget: "string" },
          { name: "descripcion", label: "Descripcion", widget: "string" },
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
    label: "Direccionamiento Estrategico",
    file: "src/content/pages/agencia/direccionamiento-estrategico.json",
    fields: [
      { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
      { name: "subtitle", label: "Subtitulo", widget: "string" },
      { name: "intro", label: "Texto de introduccion", widget: "text" },
      {
        name: "sections",
        label: "Secciones principales",
        widget: "list",
        label_singular: "Seccion",
        fields: [
          { name: "id", label: "ID", widget: "string", pattern: ["^[a-z0-9-]+$", "Solo minusculas y guiones"] },
          { name: "titulo", label: "Titulo", widget: "string" },
          { name: "descripcion", label: "Descripcion", widget: "text" },
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
    label: "Gestion Misional",
    file: "src/content/pages/agencia/gestion-misional.json",
    fields: [
      { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
      { name: "slug", label: "URL (slug)", widget: "string", required: true, pattern: ["^[a-z0-9-]+$", "Solo minusculas, numeros y guiones"] },
      { name: "description", label: "Descripcion", widget: "text", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-briefcase" },
      { name: "published", label: "Publicado", widget: "boolean", default: true },
      {
        name: "subdirecciones",
        label: "Subdirecciones",
        widget: "list",
        label_singular: "Subdireccion",
        collapsed: true,
        fields: [
          { name: "id", label: "ID (para anclas)", widget: "string", pattern: ["^[a-z0-9-]+$", "Solo minusculas y guiones"] },
          { name: "titulo", label: "Titulo completo", widget: "string" },
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
          { name: "descripcion", label: "Descripcion", widget: "text" },
          {
            name: "observatorio",
            label: "Enlace a Observatorio (opcional)",
            widget: "object",
            required: false,
            collapsed: true,
            fields: [
              { name: "texto", label: "Texto introductorio", widget: "string" },
              { name: "url", label: "URL del enlace", widget: "string" },
              { name: "label", label: "Texto del boton", widget: "string" },
            ],
          },
          {
            name: "categorias",
            label: "Categorias de documentos",
            widget: "list",
            label_singular: "Categoria",
            collapsed: true,
            fields: [
              { name: "titulo", label: "Titulo de la categoria", widget: "string" },
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
    label: "Informacion Financiera",
    file: "src/content/pages/agencia/informacion-financiera.json",
    fields: [
      { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
      { name: "slug", label: "URL (slug)", widget: "string", required: true, pattern: ["^[a-z0-9-]+$", "Solo minusculas, numeros y guiones"] },
      { name: "subtitle", label: "Subtitulo", widget: "string", required: false },
      { name: "published", label: "Publicado", widget: "boolean", default: true },
      {
        name: "tabs",
        label: "Categorias (Tabs)",
        widget: "list",
        label_singular: "Categoria",
        collapsed: true,
        fields: [
          { name: "id", label: "ID (sin espacios)", widget: "string", pattern: ["^[a-z0-9-]+$", "Solo minusculas, numeros y guiones"] },
          { name: "label", label: "Nombre de la categoria", widget: "string" },
          {
            name: "items",
            label: "Documentos",
            widget: "list",
            label_singular: "Documento",
            collapsed: true,
            fields: [
              { name: "titulo", label: "Titulo del documento", widget: "string" },
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
          { name: "titulo", label: "Titulo", widget: "string" },
          { name: "descripcion", label: "Descripcion", widget: "text" },
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
    label: "Sistema Integrado de Gestion",
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

function controlEntityFields(includeExtras = true) {
  const fields = [
    { name: "nombre", label: "Nombre", widget: "string" },
    { name: "direccion", label: "Direccion", widget: "string" },
    { name: "telefono", label: "Telefono", widget: "string" },
    { name: "lineaNacional", label: "Linea nacional", widget: "string", required: false },
    { name: "email", label: "Correo electronico", widget: "string", required: false },
  ];

  if (includeExtras) {
    fields.push(
      { name: "web", label: "Sitio web", widget: "string" },
      { name: "control", label: "Tipo de control", widget: "string" },
      { name: "icon", label: "Icono FontAwesome", widget: "string" },
    );
  } else {
    fields.push(
      { name: "web", label: "Sitio web", widget: "string", required: false },
    );
  }

  return fields;
}

function sistemaControlInterno() {
  return {
    name: "sistema-control-interno",
    label: "Sistema de Control Interno",
    file: "src/content/pages/agencia/sistema-de-control-interno.json",
    fields: [
      { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
      { name: "slug", label: "URL (slug)", widget: "string", required: true },
      { name: "subtitle", label: "Subtitulo", widget: "string", required: false },
      { name: "icon", label: "Icono FontAwesome", widget: "string", default: "fa-shield-halved" },
      { name: "published", label: "Publicado", widget: "boolean", default: true },
      { name: "introTitle", label: "Titulo de introduccion", widget: "string", required: false },
      { name: "introContent", label: "Contenido de introduccion", widget: "markdown", required: false },
      {
        name: "entidadesExternas",
        label: "Entidades de Control Externo",
        widget: "list",
        label_singular: "Entidad",
        collapsed: true,
        fields: [
          { name: "nombre", label: "Nombre de la entidad", widget: "string" },
          { name: "direccion", label: "Direccion", widget: "string" },
          { name: "telefono", label: "Telefono", widget: "string" },
          { name: "lineaNacional", label: "Linea nacional", widget: "string", required: false },
          { name: "email", label: "Correo electronico", widget: "string", required: false },
          { name: "web", label: "Sitio web", widget: "string" },
          { name: "control", label: "Tipo de control", widget: "string" },
          { name: "icon", label: "Icono FontAwesome", widget: "string" },
        ],
      },
      {
        name: "controlPolitico",
        label: "Organos de Control Politico",
        widget: "list",
        label_singular: "Organo",
        required: false,
        collapsed: true,
        fields: [
          { name: "nombre", label: "Nombre", widget: "string" },
          { name: "direccion", label: "Direccion", widget: "string" },
          { name: "telefono", label: "Telefono", widget: "string" },
          { name: "lineaNacional", label: "Linea nacional", widget: "string", required: false },
          { name: "email", label: "Correo electronico", widget: "string", required: false },
          { name: "web", label: "Sitio web", widget: "string", required: false },
        ],
      },
      {
        name: "controlInterno",
        label: "Organos de Control Interno",
        widget: "list",
        label_singular: "Organo",
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
          { name: "direccion", label: "Direccion", widget: "string" },
          { name: "telefono", label: "Telefono", widget: "string" },
          { name: "lineaNacional", label: "Linea nacional", widget: "string", required: false },
          { name: "email", label: "Correo electronico", widget: "string" },
        ],
      },
      {
        name: "informesLegales",
        label: "Informes Legales",
        widget: "list",
        label_singular: "Categoria",
        collapsed: true,
        fields: [
          { name: "titulo", label: "Titulo de la categoria", widget: "string" },
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
          { name: "titulo", label: "Titulo", widget: "string" },
          { name: "descripcion", label: "Descripcion", widget: "text" },
          { name: "linkUrl", label: "URL del enlace", widget: "string" },
          { name: "linkText", label: "Texto del boton", widget: "string" },
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
          { name: "titulo", label: "Titulo", widget: "string" },
          { name: "descripcion", label: "Descripcion", widget: "string" },
          { name: "url", label: "URL", widget: "string" },
          { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
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
  label_singular: "Pagina Agencia",
  description: "Paginas institucionales de la Agencia ITRC",
  files: [
    equipoDirectivo(),
    misionVision(),
    organigrama(),
    direccionamientoEstrategico(),
    direccionamientoSubpage("politicas", "Politicas", "politicas.json", "fa-scale-balanced"),
    direccionamientoSubpage("planes", "Planes", "planes.json", "fa-clipboard-list"),
    direccionamientoSubpage("informes", "Informes", "informes.json", "fa-chart-line"),
    gestionMisional(),
    informacionFinanciera(),
    sistemaIntegradoGestion(),
    sistemaControlInterno(),
  ],
};
