import {
  pageHeader,
  documentSections,
  docFieldsUrl,
} from "../templates/fields.js";

export const normativa = {
  name: "normativa",
  label: "NORMATIVA",
  label_singular: "Pagina Normativa",
  folder: "src/content/pages/normativa",
  create: true,
  slug: "{{slug}}",
  format: "json",
  description: "Paginas de normatividad y marco legal",
  fields: [
    ...pageHeader({ icon: "fa-gavel", slugPattern: true }),
    documentSections(docFieldsUrl),
  ],
};
