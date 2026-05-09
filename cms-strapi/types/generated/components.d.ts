import type { Schema, Struct } from '@strapi/strapi';

export interface MarcoLegalDocumento extends Struct.ComponentSchema {
  collectionName: 'components_marco_legal_documentos';
  info: {
    description: 'Documento normativo individual: nombre, descripci\u00F3n, archivo (URL local o externo).';
    displayName: 'Documento de Marco Legal';
    icon: 'file-text';
  };
  attributes: {
    descripcion: Schema.Attribute.Text;
    externo: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    file: Schema.Attribute.String & Schema.Attribute.Required;
    nombre: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MarcoLegalSeccion extends Struct.ComponentSchema {
  collectionName: 'components_marco_legal_secciones';
  info: {
    description: 'Agrupa documentos normativos por tem\u00E1tica (Constituci\u00F3n, Decretos, etc.)';
    displayName: 'Secci\u00F3n de Marco Legal';
    icon: 'folder';
  };
  attributes: {
    documentos: Schema.Attribute.Component<'marco-legal.documento', true>;
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'fa-folder'>;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedRelatedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_related_links';
  info: {
    description: 'Tarjeta de enlace usada en la secci\u00F3n "Enlaces Relacionados" al pie de las p\u00E1ginas. Reusable en todos los content types.';
    displayName: 'Enlace relacionado';
    icon: 'link';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'fa-link'>;
    titulo: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'marco-legal.documento': MarcoLegalDocumento;
      'marco-legal.seccion': MarcoLegalSeccion;
      'shared.related-link': SharedRelatedLink;
    }
  }
}
