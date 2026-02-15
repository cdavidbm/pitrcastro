// ============================================================
// Shared field templates for Sveltia CMS collections.
//
// DISPLAY_MODE is a shared JS reference — js-yaml generates a
// YAML anchor (&display_mode) and aliases (*display_mode) for it.
// Template functions return new objects each call (no anchors,
// but DRY source code).
// ============================================================

/**
 * Display mode selector — shared object reference across all
 * collections that use document sections with accordion/tabs/list.
 * js-yaml detects the shared reference and emits a YAML anchor.
 */
export const DISPLAY_MODE = {
  name: "displayMode",
  label: "Modo de visualizacion",
  widget: "select",
  options: [
    { label: "Acordeon", value: "accordion" },
    { label: "Pestanas (Tabs)", value: "tabs" },
    { label: "Lista simple", value: "list" },
  ],
  default: "accordion",
};

// ============================================================
// Document field presets
// ============================================================

/** name + file(widget:file) + category + anio — used in politicas, planes, informes */
export function docFieldsFull() {
  return [
    { name: "name", label: "Nombre del documento", widget: "string", required: true },
    { name: "file", label: "Archivo", widget: "file", required: true },
    { name: "category", label: "Categoria (para tabs)", widget: "string", required: false },
    { name: "anio", label: "Año", widget: "string", required: false },
  ];
}

/** name + file(widget:file) + description + category + anio — transparencia */
export function docFieldsWithDescription() {
  return [
    { name: "name", label: "Nombre del documento", widget: "string", required: true },
    { name: "file", label: "Archivo", widget: "file", required: true },
    { name: "description", label: "Descripcion del documento", widget: "string", required: false },
    { name: "category", label: "Categoria (para tabs)", widget: "string", required: false },
    { name: "anio", label: "Año", widget: "string", required: false },
  ];
}

/** name + file(widget:file) only — SIG */
export function docFieldsMinimal() {
  return [
    { name: "name", label: "Nombre del documento", widget: "string" },
    { name: "file", label: "Archivo", widget: "file" },
  ];
}

/** name + file(widget:string) + anio + externo — normativa */
export function docFieldsUrl() {
  return [
    { name: "name", label: "Nombre del documento", widget: "string", required: true },
    { name: "file", label: "Archivo o URL", widget: "string", required: true },
    { name: "anio", label: "Año", widget: "string", required: false },
    { name: "externo", label: "Es enlace externo", widget: "boolean", default: false },
  ];
}

/** name + file(widget:string) only — atencion */
export function docFieldsUrlSimple() {
  return [
    { name: "name", label: "Nombre del documento", widget: "string", required: true },
    { name: "file", label: "Archivo o URL", widget: "string", required: true },
  ];
}

// ============================================================
// Document sections builder
// ============================================================

/**
 * Builds the "sections" list field used by document pages.
 *
 * @param {Function} docFieldsFn - Function returning the document fields array
 * @param {Object} [opts]
 * @param {string} [opts.label] - Override sections label
 * @param {boolean} [opts.required] - Set to false to make sections optional
 * @param {boolean} [opts.includeSectionIcon] - Include sectionIcon field (default: true)
 * @param {boolean} [opts.includeSectionDescription] - Include sectionDescription field (default: true)
 * @param {Object} [opts.displayMode] - Override displayMode field (default: DISPLAY_MODE shared ref)
 */
export function documentSections(docFieldsFn, opts = {}) {
  const {
    label = "Secciones de documentos",
    required,
    includeSectionIcon = true,
    includeSectionDescription = true,
    displayMode = DISPLAY_MODE,
  } = opts;

  const sectionFields = [
    { name: "sectionTitle", label: "Titulo de la seccion", widget: "string", required: true },
  ];

  if (includeSectionDescription) {
    sectionFields.push(
      { name: "sectionDescription", label: "Descripcion de la seccion", widget: "text", required: false },
    );
  }

  if (includeSectionIcon) {
    sectionFields.push(
      { name: "sectionIcon", label: "Icono de la seccion", widget: "string", required: false },
    );
  }

  sectionFields.push(displayMode);

  sectionFields.push({
    name: "documents",
    label: "Documentos",
    widget: "list",
    label_singular: "Documento",
    fields: docFieldsFn(),
  });

  const field = {
    name: "sections",
    label,
    widget: "list",
    label_singular: "Seccion",
    collapsed: true,
    fields: sectionFields,
  };

  if (required === false) {
    field.required = false;
  }

  return field;
}

// ============================================================
// Page header builder
// ============================================================

/**
 * Common page header fields: title, slug, description, icon, published.
 *
 * @param {Object} opts
 * @param {string} [opts.icon] - Default icon value
 * @param {boolean} [opts.slugPattern] - Add slug validation pattern
 * @param {string} [opts.descriptionWidget] - "text" | "markdown" (default: "markdown")
 * @param {string} [opts.descriptionLabel] - Override description label
 * @param {boolean} [opts.noIcon] - Omit icon field
 * @param {Array} [opts.extraFields] - Additional fields before published
 * @returns {Array} Array of field objects
 */
export function pageHeader(opts = {}) {
  const {
    icon,
    slugPattern = false,
    descriptionWidget = "markdown",
    descriptionLabel = "Descripcion",
    noIcon = false,
    extraFields = [],
  } = opts;

  const fields = [
    { name: "title", label: "Titulo de la pagina", widget: "string", required: true },
  ];

  const slugField = { name: "slug", label: "URL (slug)", widget: "string", required: true };
  if (slugPattern) {
    slugField.pattern = ["^[a-z0-9-]+$", "Solo minusculas, numeros y guiones"];
  }
  fields.push(slugField);

  fields.push({
    name: "description",
    label: descriptionLabel,
    widget: descriptionWidget,
    required: false,
  });

  if (!noIcon) {
    const iconField = { name: "icon", label: "Icono FontAwesome", widget: "string" };
    if (icon) iconField.default = icon;
    fields.push(iconField);
  }

  fields.push(...extraFields);

  fields.push({ name: "published", label: "Publicado", widget: "boolean", default: true });

  return fields;
}

// ============================================================
// CTA section builder
// ============================================================

/** CTA (call to action) object with titulo, descripcion, linkUrl, linkText, icon */
export function ctaSection(name = "ctaSection", label = "Seccion de enlace externo (CTA)") {
  return {
    name,
    label,
    widget: "object",
    required: false,
    collapsed: true,
    fields: [
      { name: "titulo", label: "Titulo", widget: "string" },
      { name: "descripcion", label: "Descripcion", widget: "text" },
      { name: "linkUrl", label: "URL del enlace", widget: "string" },
      { name: "linkText", label: "Texto del boton", widget: "string" },
      { name: "icon", label: "Icono FontAwesome", widget: "string", required: false },
    ],
  };
}

// ============================================================
// Publication collection builder (news/boletines/comunicados)
// ============================================================

/**
 * Frontmatter folder collection for date-based publications.
 *
 * @param {Object} opts - Collection metadata
 * @param {string} opts.name
 * @param {string} opts.label
 * @param {string} opts.labelSingular
 * @param {string} opts.folder
 * @param {Array} [opts.extraFields] - Fields inserted before draft
 */
export function publicationCollection({ name, label, labelSingular, folder, extraFields = [] }) {
  return {
    name,
    label,
    label_singular: labelSingular,
    folder,
    create: true,
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
    format: "frontmatter",
    sortable_fields: ["date", "title"],
    fields: [
      { name: "title", label: "Titulo", widget: "string", required: true },
      { name: "date", label: "Fecha de publicacion", widget: "datetime", format: "YYYY-MM-DD", required: true },
      { name: "image", label: "Imagen destacada", widget: "image", required: false },
      { name: "excerpt", label: "Extracto", widget: "text", required: false },
      { name: "body", label: "Contenido", widget: "markdown", required: true },
      ...extraFields,
      { name: "draft", label: "Borrador", widget: "boolean", default: false },
    ],
  };
}
