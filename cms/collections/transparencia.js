import {
  pageHeader,
  documentSections,
  docFieldsWithDescription,
} from "../templates/fields.js";

export const transparencia = {
  name: "transparencia",
  label: "TRANSPARENCIA",
  files: [
    {
      name: "transparencia-principal",
      label: "Pagina de Transparencia",
      file: "src/content/pages/transparencia.json",
      fields: [
        ...pageHeader({
          icon: "fa-folder-open",
          extraFields: [
            { name: "order", label: "Orden de aparicion", widget: "number", required: false, default: 1 },
          ],
        }),
        documentSections(docFieldsWithDescription),
      ],
    },
  ],
};
