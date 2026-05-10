import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    adminPermissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    adminUserOwner: Schema.Attribute.Relation<'manyToOne', 'admin::user'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    kind: Schema.Attribute.Enumeration<['content-api', 'admin']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'content-api'>;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::api-token-permission'>;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token-permission'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    apiToken: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> & Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    deviceId: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime & Schema.Attribute.Required & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    origin: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    userId: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::transfer-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::transfer-token-permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::transfer-token-permission'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    apiTokens: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> & Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAgenciaDireccionamientoEstrategicoAgenciaDireccionamientoEstrategico
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_direccionamiento_estrategico';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/direccionamiento-estrategico.json';
    displayName: '02. Agencia / Direccionamiento Estrategico';
    pluralName: 'agencia-direccionamiento-estrategicos';
    singularName: 'agencia-direccionamiento-estrategico';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-direccionamiento-estrategico.agencia-direccionamiento-estrategico'
    > &
      Schema.Attribute.Private;
    marcoNormativo: Schema.Attribute.Component<
      'agencia-direccionamiento-estrategico.marconormativo',
      false
    >;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.Component<'agencia-direccionamiento-estrategico.section', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaDireccionamientoInformesAgenciaDireccionamientoInformes
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_direccionamiento_informes';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/direccionamiento/informes.json';
    displayName: '02. Agencia / Direccionamiento Informes';
    pluralName: 'agencia-direccionamiento-informeses';
    singularName: 'agencia-direccionamiento-informes';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-direccionamiento-informes.agencia-direccionamiento-informes'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.Component<'agencia-direccionamiento-informes.section', true>;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaDireccionamientoPlanesAgenciaDireccionamientoPlanes
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_direccionamiento_planes';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/direccionamiento/planes.json';
    displayName: '02. Agencia / Direccionamiento Planes';
    pluralName: 'agencia-direccionamiento-planeses';
    singularName: 'agencia-direccionamiento-planes';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-direccionamiento-planes.agencia-direccionamiento-planes'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.Component<'agencia-direccionamiento-planes.section', true>;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaDireccionamientoPoliticasAgenciaDireccionamientoPoliticas
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_direccionamiento_politicas';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/direccionamiento/politicas.json';
    displayName: '02. Agencia / Direccionamiento Politicas';
    pluralName: 'agencia-direccionamiento-politicases';
    singularName: 'agencia-direccionamiento-politicas';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-direccionamiento-politicas.agencia-direccionamiento-politicas'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.Component<'agencia-direccionamiento-politicas.section', true>;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaDirectorioAgenciaDirectorio extends Struct.SingleTypeSchema {
  collectionName: 'agencia_directorio';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/directorio.json';
    displayName: '02. Agencia / Directorio';
    pluralName: 'agencia-directorios';
    singularName: 'agencia-directorio';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    directorios: Schema.Attribute.Component<'agencia-directorio.directorio', true>;
    escalaSalarial: Schema.Attribute.Component<'agencia-directorio.escalasalarial', false>;
    icon: Schema.Attribute.String;
    infoAdicional: Schema.Attribute.Component<'agencia-directorio.infoadicional', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-directorio.agencia-directorio'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaEmpleoRrhhManualEspecificoFuncionesAgenciaEmpleoRrhhManualEspecificoFunciones
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_empleo_rrhh_manual_especifico_funciones';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/empleo-rrhh/manual-especifico-funciones.json';
    displayName: '02. Agencia / Empleo Rrhh Manual Especifico Funciones';
    pluralName: 'agencia-empleo-rrhh-manual-especifico-funcioneses';
    singularName: 'agencia-empleo-rrhh-manual-especifico-funciones';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-empleo-rrhh-manual-especifico-funciones.agencia-empleo-rrhh-manual-especifico-funciones'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<
      'agencia-empleo-rrhh-manual-especifico-funciones.seccion',
      true
    >;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaEmpleoRrhhManualIdentidadVisualAgenciaEmpleoRrhhManualIdentidadVisual
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_empleo_rrhh_manual_identidad_visual';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/empleo-rrhh/manual-identidad-visual.json';
    displayName: '02. Agencia / Empleo Rrhh Manual Identidad Visual';
    pluralName: 'agencia-empleo-rrhh-manual-identidad-visuals';
    singularName: 'agencia-empleo-rrhh-manual-identidad-visual';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<
      'agencia-empleo-rrhh-manual-identidad-visual.inform',
      true
    >;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-empleo-rrhh-manual-identidad-visual.agencia-empleo-rrhh-manual-identidad-visual'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaEmpleoRrhhManualesInternosAgenciaEmpleoRrhhManualesInternos
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_empleo_rrhh_manuales_internos';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/empleo-rrhh/manuales-internos.json';
    displayName: '02. Agencia / Empleo Rrhh Manuales Internos';
    pluralName: 'agencia-empleo-rrhh-manuales-internoses';
    singularName: 'agencia-empleo-rrhh-manuales-internos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'agencia-empleo-rrhh-manuales-internos.inform', true>;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-empleo-rrhh-manuales-internos.agencia-empleo-rrhh-manuales-internos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaEmpleoRrhhNombramientosAgenciaEmpleoRrhhNombramientos
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_empleo_rrhh_nombramientos';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/empleo-rrhh/nombramientos.json';
    displayName: '02. Agencia / Empleo Rrhh Nombramientos';
    pluralName: 'agencia-empleo-rrhh-nombramientoses';
    singularName: 'agencia-empleo-rrhh-nombramientos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesExternos: Schema.Attribute.JSON;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-empleo-rrhh-nombramientos.agencia-empleo-rrhh-nombramientos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    vigencias: Schema.Attribute.Component<'agencia-empleo-rrhh-nombramientos.vigencia', true>;
  };
}

export interface ApiAgenciaEmpleoRrhhOfertasEmpleoAgenciaEmpleoRrhhOfertasEmpleo
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_empleo_rrhh_ofertas_empleo';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/empleo-rrhh/ofertas-empleo.json';
    displayName: '02. Agencia / Empleo Rrhh Ofertas Empleo';
    pluralName: 'agencia-empleo-rrhh-ofertas-empleos';
    singularName: 'agencia-empleo-rrhh-ofertas-empleo';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    cta: Schema.Attribute.Component<'agencia-empleo-rrhh-ofertas-empleo.cta', false>;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-empleo-rrhh-ofertas-empleo.agencia-empleo-rrhh-ofertas-empleo'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaEquipoDirectivoAgenciaEquipoDirectivo extends Struct.SingleTypeSchema {
  collectionName: 'agencia_equipo_directivo';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/equipo-directivo.json';
    displayName: '02. Agencia / Equipo Directivo';
    pluralName: 'agencia-equipo-directivos';
    singularName: 'agencia-equipo-directivo';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    directora: Schema.Attribute.Component<'agencia-equipo-directivo.directora', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-equipo-directivo.agencia-equipo-directivo'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subdirectores: Schema.Attribute.Component<'agencia-equipo-directivo.subdirector', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaGestionMisionalAgenciaGestionMisional extends Struct.SingleTypeSchema {
  collectionName: 'agencia_gestion_misional';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/gestion-misional.json';
    displayName: '02. Agencia / Gestion Misional';
    pluralName: 'agencia-gestion-misionals';
    singularName: 'agencia-gestion-misional';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-gestion-misional.agencia-gestion-misional'
    > &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    subdirecciones: Schema.Attribute.Component<'agencia-gestion-misional.subdireccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaInformacionFinancieraAgenciaInformacionFinanciera
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_informacion_financiera';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/informacion-financiera.json';
    displayName: '02. Agencia / Informacion Financiera';
    pluralName: 'agencia-informacion-financieras';
    singularName: 'agencia-informacion-financiera';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    ctaSection: Schema.Attribute.Component<'agencia-informacion-financiera.ctasection', false>;
    infoCards: Schema.Attribute.Component<'agencia-informacion-financiera.infocard', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-informacion-financiera.agencia-informacion-financiera'
    > &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    tabs: Schema.Attribute.Component<'agencia-informacion-financiera.tab', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaLandingAgenciaLanding extends Struct.SingleTypeSchema {
  collectionName: 'agencia_landing';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/landing.json';
    displayName: '02. Agencia / Landing';
    pluralName: 'agencia-landings';
    singularName: 'agencia-landing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::agencia-landing.agencia-landing'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'agencia-landing.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaMisionVisionAgenciaMisionVision extends Struct.SingleTypeSchema {
  collectionName: 'agencia_mision_vision';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/mision-vision.json';
    displayName: '02. Agencia / Mision Vision';
    pluralName: 'agencia-mision-visions';
    singularName: 'agencia-mision-vision';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    comoLoHacemos: Schema.Attribute.Component<'agencia-mision-vision.comolohacemo', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    funciones: Schema.Attribute.Component<'agencia-mision-vision.funciones', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-mision-vision.agencia-mision-vision'
    > &
      Schema.Attribute.Private;
    mapaEstrategico: Schema.Attribute.Component<'agencia-mision-vision.mapaestrategico', false>;
    mision: Schema.Attribute.Text;
    proposito: Schema.Attribute.Component<'agencia-mision-vision.proposito', false>;
    publishedAt: Schema.Attribute.DateTime;
    queHacemos: Schema.Attribute.Component<'agencia-mision-vision.quehacemos', false>;
    quienesSomos: Schema.Attribute.Component<'agencia-mision-vision.quienessomos', false>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    valores: Schema.Attribute.Component<'agencia-mision-vision.valor', true>;
    vision: Schema.Attribute.Text;
  };
}

export interface ApiAgenciaOrganigramaAgenciaOrganigrama extends Struct.SingleTypeSchema {
  collectionName: 'agencia_organigrama';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/organigrama.json';
    displayName: '02. Agencia / Organigrama';
    pluralName: 'agencia-organigramas';
    singularName: 'agencia-organigrama';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    ctaDirectorio: Schema.Attribute.Component<'agencia-organigrama.ctadirectorio', false>;
    funcionesPorArea: Schema.Attribute.Component<'agencia-organigrama.funcionesporarea', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-organigrama.agencia-organigrama'
    > &
      Schema.Attribute.Private;
    organigrama: Schema.Attribute.Component<'agencia-organigrama.organigrama', false>;
    publishedAt: Schema.Attribute.DateTime;
    resoluciones: Schema.Attribute.Component<'agencia-organigrama.resolucion', true>;
    resolucionesSeccion: Schema.Attribute.Component<
      'agencia-organigrama.resolucionesseccion',
      false
    >;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaPlanInstitucionalDeArchivosAgenciaPlanInstitucionalDeArchivos
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_plan_institucional_de_archivos';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/plan-institucional-de-archivos.json';
    displayName: '02. Agencia / Plan Institucional De Archivos';
    pluralName: 'agencia-plan-institucional-de-archivoses';
    singularName: 'agencia-plan-institucional-de-archivos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<
      'agencia-plan-institucional-de-archivos.documento',
      true
    >;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-plan-institucional-de-archivos.agencia-plan-institucional-de-archivos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaSistemaDeControlInternoAgenciaSistemaDeControlInterno
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_sistema_de_control_interno';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/sistema-de-control-interno.json';
    displayName: '02. Agencia / Sistema De Control Interno';
    pluralName: 'agencia-sistema-de-control-internos';
    singularName: 'agencia-sistema-de-control-interno';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contactoInterno: Schema.Attribute.Component<
      'agencia-sistema-de-control-interno.contactointerno',
      false
    >;
    controlInterno: Schema.Attribute.Component<
      'agencia-sistema-de-control-interno.controlinterno',
      true
    >;
    controlPolitico: Schema.Attribute.Component<
      'agencia-sistema-de-control-interno.controlpolitico',
      true
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    entidadesExternas: Schema.Attribute.Component<
      'agencia-sistema-de-control-interno.entidadesexterna',
      true
    >;
    icon: Schema.Attribute.String;
    informesLegales: Schema.Attribute.Component<
      'agencia-sistema-de-control-interno.informeslegal',
      true
    >;
    introContent: Schema.Attribute.Text;
    introTitle: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-sistema-de-control-interno.agencia-sistema-de-control-interno'
    > &
      Schema.Attribute.Private;
    planesMejoramiento: Schema.Attribute.Component<
      'agencia-sistema-de-control-interno.planesmejoramiento',
      false
    >;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaSistemaIntegradoDeGestionAgenciaSistemaIntegradoDeGestion
  extends Struct.SingleTypeSchema {
  collectionName: 'agencia_sistema_integrado_de_gestion';
  info: {
    description: 'Auto-generado desde src/content/pages/agencia/sistema-integrado-de-gestion.json';
    displayName: '02. Agencia / Sistema Integrado De Gestion';
    pluralName: 'agencia-sistema-integrado-de-gestions';
    singularName: 'agencia-sistema-integrado-de-gestion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::agencia-sistema-integrado-de-gestion.agencia-sistema-integrado-de-gestion'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.Component<'agencia-sistema-integrado-de-gestion.section', true>;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionCanalesDeAtencionAtencionCanalesDeAtencion
  extends Struct.SingleTypeSchema {
  collectionName: 'atencion_canales_de_atencion';
  info: {
    description: 'Auto-generado desde src/content/pages/atencion/canales-de-atencion.json';
    displayName: '04. Atenci\u00F3n y Servicios / Canales De Atencion';
    pluralName: 'atencion-canales-de-atencions';
    singularName: 'atencion-canales-de-atencion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    canales: Schema.Attribute.Component<'atencion-canales-de-atencion.canal', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::atencion-canales-de-atencion.atencion-canales-de-atencion'
    > &
      Schema.Attribute.Private;
    portafolio: Schema.Attribute.Component<'atencion-canales-de-atencion.portafolio', false>;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionCorreoNotificacionesJudicialesAtencionCorreoNotificacionesJudiciales
  extends Struct.SingleTypeSchema {
  collectionName: 'atencion_correo_notificaciones_judiciales';
  info: {
    description: 'Auto-generado desde src/content/pages/atencion/correo-notificaciones-judiciales.json';
    displayName: '04. Atenci\u00F3n y Servicios / Correo Notificaciones Judiciales';
    pluralName: 'atencion-correo-notificaciones-judicialeses';
    singularName: 'atencion-correo-notificaciones-judiciales';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    email: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::atencion-correo-notificaciones-judiciales.atencion-correo-notificaciones-judiciales'
    > &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    texto: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionGlosarioAtencionGlosario extends Struct.SingleTypeSchema {
  collectionName: 'atencion_glosario';
  info: {
    description: 'Auto-generado desde src/content/pages/atencion/glosario.json';
    displayName: '04. Atenci\u00F3n y Servicios / Glosario';
    pluralName: 'atencion-glosarios';
    singularName: 'atencion-glosario';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::atencion-glosario.atencion-glosario'
    > &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    terminos: Schema.Attribute.Component<'atencion-glosario.termino', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionLandingAtencionLanding extends Struct.SingleTypeSchema {
  collectionName: 'atencion_landing';
  info: {
    description: 'Auto-generado desde src/content/pages/atencion/landing.json';
    displayName: '04. Atenci\u00F3n y Servicios / Landing';
    pluralName: 'atencion-landings';
    singularName: 'atencion-landing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesExternos: Schema.Attribute.Component<'atencion-landing.enlacesexterno', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::atencion-landing.atencion-landing'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'atencion-landing.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionNotificacionesPorAvisoAtencionNotificacionesPorAviso
  extends Struct.SingleTypeSchema {
  collectionName: 'atencion_notificaciones_por_aviso';
  info: {
    description: 'Auto-generado desde src/content/pages/atencion/notificaciones-por-aviso.json';
    displayName: '04. Atenci\u00F3n y Servicios / Notificaciones Por Aviso';
    pluralName: 'atencion-notificaciones-por-avisos';
    singularName: 'atencion-notificaciones-por-aviso';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    citaLegal: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::atencion-notificaciones-por-aviso.atencion-notificaciones-por-aviso'
    > &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    textoLegal: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionPqrsServidoresAtencionPqrsServidores extends Struct.SingleTypeSchema {
  collectionName: 'atencion_pqrs_servidores';
  info: {
    description: 'Auto-generado desde src/content/pages/atencion/pqrs-servidores.json';
    displayName: '04. Atenci\u00F3n y Servicios / Pqrs Servidores';
    pluralName: 'atencion-pqrs-servidoreses';
    singularName: 'atencion-pqrs-servidores';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'atencion-pqrs-servidores.inform', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::atencion-pqrs-servidores.atencion-pqrs-servidores'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionPqrsAtencionPqrs extends Struct.SingleTypeSchema {
  collectionName: 'atencion_pqrs';
  info: {
    description: 'Auto-generado desde src/content/pages/atencion/pqrs.json';
    displayName: '04. Atenci\u00F3n y Servicios / Pqrs';
    pluralName: 'atencion-pqrses';
    singularName: 'atencion-pqrs';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    consultaUrl: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    definiciones: Schema.Attribute.Component<'atencion-pqrs.definicion', true>;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'atencion-pqrs.inform', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::atencion-pqrs.atencion-pqrs'> &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    tramitesUrl: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionPreguntasFrecuentesAtencionPreguntasFrecuentes
  extends Struct.SingleTypeSchema {
  collectionName: 'atencion_preguntas_frecuentes';
  info: {
    description: 'Auto-generado desde src/content/pages/atencion/preguntas-frecuentes.json';
    displayName: '04. Atenci\u00F3n y Servicios / Preguntas Frecuentes';
    pluralName: 'atencion-preguntas-frecuenteses';
    singularName: 'atencion-preguntas-frecuentes';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    faqs: Schema.Attribute.Component<'atencion-preguntas-frecuentes.faq', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::atencion-preguntas-frecuentes.atencion-preguntas-frecuentes'
    > &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionVinculacionATercerosAtencionVinculacionATerceros
  extends Struct.SingleTypeSchema {
  collectionName: 'atencion_vinculacion_a_terceros';
  info: {
    description: 'Auto-generado desde src/content/pages/atencion/vinculacion-a-terceros.json';
    displayName: '04. Atenci\u00F3n y Servicios / Vinculacion A Terceros';
    pluralName: 'atencion-vinculacion-a-terceroses';
    singularName: 'atencion-vinculacion-a-terceros';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<'atencion-vinculacion-a-terceros.documento', true>;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::atencion-vinculacion-a-terceros.atencion-vinculacion-a-terceros'
    > &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiCiprepSpeakerCiprepSpeaker extends Struct.CollectionTypeSchema {
  collectionName: 'ciprep_speakers_items';
  info: {
    description: 'Auto-generado desde src/content/pages/ciprep/speakers';
    displayName: '08. Prensa / Congreso CIPREP / Speakers';
    pluralName: 'ciprep-speakers';
    singularName: 'ciprep-speaker';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bio: Schema.Attribute.Text;
    cargo: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::ciprep-speaker.ciprep-speaker'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    order: Schema.Attribute.Integer;
    photo: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    shortName: Schema.Attribute.String;
    slug: Schema.Attribute.UID & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiCiprepCiprep extends Struct.SingleTypeSchema {
  collectionName: 'ciprep';
  info: {
    description: 'Auto-generado desde src/content/pages/ciprep.json';
    displayName: '08. Prensa / Congreso CIPREP';
    pluralName: 'cipreps';
    singularName: 'ciprep';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    agenda: Schema.Attribute.Component<'ciprep.agenda', false>;
    aliadoEstrategico: Schema.Attribute.String;
    aliados: Schema.Attribute.Component<'ciprep.aliados', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    cta: Schema.Attribute.Component<'ciprep.cta', false>;
    direccion: Schema.Attribute.String;
    edicion: Schema.Attribute.Integer;
    estado: Schema.Attribute.String;
    fechas: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::ciprep.ciprep'> &
      Schema.Attribute.Private;
    lugar: Schema.Attribute.String;
    mapsUrl: Schema.Attribute.String;
    memorias: Schema.Attribute.Component<'ciprep.memorias', false>;
    organizador: Schema.Attribute.String;
    porQue: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    shortTitle: Schema.Attribute.String;
    speakersIndex: Schema.Attribute.Component<'ciprep.speakersindex', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    wazeUrl: Schema.Attribute.String;
    youtubeId: Schema.Attribute.String;
  };
}

export interface ApiGaleriaGaleria extends Struct.CollectionTypeSchema {
  collectionName: 'galeria_items';
  info: {
    description: 'Auto-generado desde src/content/pages/galeria';
    displayName: '08. Prensa / Galer\u00EDa';
    pluralName: 'galerias';
    singularName: 'galeria';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    descripcion: Schema.Attribute.String;
    fecha: Schema.Attribute.String;
    imagenes: Schema.Attribute.Component<'galeria.imagen', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::galeria.galeria'> &
      Schema.Attribute.Private;
    originalUrl: Schema.Attribute.String;
    portada: Schema.Attribute.Component<'galeria.portada', false>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID & Schema.Attribute.Required;
    titulo: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiHomeHome extends Struct.SingleTypeSchema {
  collectionName: 'home';
  info: {
    description: 'Auto-generado desde src/content/pages/home.json';
    displayName: '01. Inicio';
    pluralName: 'homes';
    singularName: 'home';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    columnasServicios: Schema.Attribute.Component<'home.columnasservicio', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    entidadesVigiladas: Schema.Attribute.Component<'home.entidadesvigilada', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::home.home'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiInstitucionalAudiosItrcInstitucionalAudiosItrc extends Struct.SingleTypeSchema {
  collectionName: 'institucional_audios_itrc';
  info: {
    description: 'Auto-generado desde src/content/pages/institucional/audios-itrc.json';
    displayName: '09. Institucional / Audios Itrc';
    pluralName: 'institucional-audios-itrcs';
    singularName: 'institucional-audios-itrc';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    audios: Schema.Attribute.Component<'institucional-audios-itrc.audio', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::institucional-audios-itrc.institucional-audios-itrc'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiInstitucionalCalendarioEventosInstitucionalCalendarioEventos
  extends Struct.SingleTypeSchema {
  collectionName: 'institucional_calendario_eventos';
  info: {
    description: 'Auto-generado desde src/content/pages/institucional/calendario-eventos.json';
    displayName: '09. Institucional / Calendario Eventos';
    pluralName: 'institucional-calendario-eventoses';
    singularName: 'institucional-calendario-eventos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    cta: Schema.Attribute.Component<'institucional-calendario-eventos.cta', false>;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::institucional-calendario-eventos.institucional-calendario-eventos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiInstitucionalDefensaJudicialInstitucionalDefensaJudicial
  extends Struct.SingleTypeSchema {
  collectionName: 'institucional_defensa_judicial';
  info: {
    description: 'Auto-generado desde src/content/pages/institucional/defensa-judicial.json';
    displayName: '09. Institucional / Defensa Judicial';
    pluralName: 'institucional-defensa-judicials';
    singularName: 'institucional-defensa-judicial';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'institucional-defensa-judicial.inform', true>;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::institucional-defensa-judicial.institucional-defensa-judicial'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiInstitucionalEstadosInstitucionalEstados extends Struct.SingleTypeSchema {
  collectionName: 'institucional_estados';
  info: {
    description: 'Auto-generado desde src/content/pages/institucional/estados.json';
    displayName: '09. Institucional / Estados';
    pluralName: 'institucional-estadoses';
    singularName: 'institucional-estados';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    aviso: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::institucional-estados.institucional-estados'
    > &
      Schema.Attribute.Private;
    notificaciones: Schema.Attribute.Component<'institucional-estados.notificacion', true>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiInstitucionalEstudiosInvestigacionesInstitucionalEstudiosInvestigaciones
  extends Struct.SingleTypeSchema {
  collectionName: 'institucional_estudios_investigaciones';
  info: {
    description: 'Auto-generado desde src/content/pages/institucional/estudios-investigaciones.json';
    displayName: '09. Institucional / Estudios Investigaciones';
    pluralName: 'institucional-estudios-investigacioneses';
    singularName: 'institucional-estudios-investigaciones';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'institucional-estudios-investigaciones.inform', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::institucional-estudios-investigaciones.institucional-estudios-investigaciones'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiInstitucionalHistoricoInvestigacionesDisciplinariasInstitucionalHistoricoInvestigacionesDisciplinarias
  extends Struct.SingleTypeSchema {
  collectionName: 'institucional_historico_investigaciones_disciplinarias';
  info: {
    description: 'Auto-generado desde src/content/pages/institucional/historico-investigaciones-disciplinarias.json';
    displayName: '09. Institucional / Historico Investigaciones Disciplinarias';
    pluralName: 'institucional-historico-investigaciones-disciplinariases';
    singularName: 'institucional-historico-investigaciones-disciplinarias';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<
      'institucional-historico-investigaciones-disciplinarias.inform',
      true
    >;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::institucional-historico-investigaciones-disciplinarias.institucional-historico-investigaciones-disciplinarias'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiInstitucionalHistoricoSistemaControlInternoInstitucionalHistoricoSistemaControlInterno
  extends Struct.SingleTypeSchema {
  collectionName: 'institucional_historico_sistema_control_interno';
  info: {
    description: 'Auto-generado desde src/content/pages/institucional/historico-sistema-control-interno.json';
    displayName: '09. Institucional / Historico Sistema Control Interno';
    pluralName: 'institucional-historico-sistema-control-internos';
    singularName: 'institucional-historico-sistema-control-interno';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::institucional-historico-sistema-control-interno.institucional-historico-sistema-control-interno'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<
      'institucional-historico-sistema-control-interno.seccion',
      true
    >;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiInstitucionalPublicacionDatosAbiertosInstitucionalPublicacionDatosAbiertos
  extends Struct.SingleTypeSchema {
  collectionName: 'institucional_publicacion_datos_abiertos';
  info: {
    description: 'Auto-generado desde src/content/pages/institucional/publicacion-datos-abiertos.json';
    displayName: '09. Institucional / Publicacion Datos Abiertos';
    pluralName: 'institucional-publicacion-datos-abiertoses';
    singularName: 'institucional-publicacion-datos-abiertos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    cta: Schema.Attribute.Component<'institucional-publicacion-datos-abiertos.cta', false>;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::institucional-publicacion-datos-abiertos.institucional-publicacion-datos-abiertos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiMapaDelSitioMapaDelSitio extends Struct.SingleTypeSchema {
  collectionName: 'mapa_del_sitio';
  info: {
    description: 'Auto-generado desde src/content/pages/mapa-del-sitio.json';
    displayName: '99. Sistema / Mapa del sitio';
    pluralName: 'mapa-del-sitios';
    singularName: 'mapa-del-sitio';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    branchDescriptions: Schema.Attribute.JSON;
    branchIcons: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    extras: Schema.Attribute.Component<'mapa-del-sitio.extras', false>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::mapa-del-sitio.mapa-del-sitio'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiNormativaDecretosNormativaDecretos extends Struct.SingleTypeSchema {
  collectionName: 'normativa_decretos';
  info: {
    description: 'Auto-generado desde src/content/pages/normativa/decretos.json';
    displayName: '03. Normativa / Decretos';
    pluralName: 'normativa-decretoses';
    singularName: 'normativa-decretos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    decretos: Schema.Attribute.Component<'normativa-decretos.decreto', true>;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::normativa-decretos.normativa-decretos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiNormativaDelitoNormativaDelito extends Struct.CollectionTypeSchema {
  collectionName: 'normativa_delitos_items';
  info: {
    description: 'Auto-generado desde src/content/pages/normativa/delitos';
    displayName: '03. Normativa / Delitos';
    pluralName: 'normativa-delitos';
    singularName: 'normativa-delito';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contenido: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::normativa-delito.normativa-delito'
    > &
      Schema.Attribute.Private;
    normasRelacionadas: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiNormativaLandingNormativaLanding extends Struct.SingleTypeSchema {
  collectionName: 'normativa_landing';
  info: {
    description: 'Auto-generado desde src/content/pages/normativa/landing.json';
    displayName: '03. Normativa / Landing';
    pluralName: 'normativa-landings';
    singularName: 'normativa-landing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::normativa-landing.normativa-landing'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'normativa-landing.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiNormativaMarcoLegalNormativaMarcoLegal extends Struct.SingleTypeSchema {
  collectionName: 'normativa_marco_legal';
  info: {
    description: 'Auto-generado desde src/content/pages/normativa/marco-legal.json';
    displayName: '03. Normativa / Marco Legal';
    pluralName: 'normativa-marco-legals';
    singularName: 'normativa-marco-legal';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::normativa-marco-legal.normativa-marco-legal'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'normativa-marco-legal.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiNormativaResolucionesNormativaResoluciones extends Struct.SingleTypeSchema {
  collectionName: 'normativa_resoluciones';
  info: {
    description: 'Auto-generado desde src/content/pages/normativa/resoluciones.json';
    displayName: '03. Normativa / Resoluciones';
    pluralName: 'normativa-resolucioneses';
    singularName: 'normativa-resoluciones';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    actos: Schema.Attribute.Component<'normativa-resoluciones.acto', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::normativa-resoluciones.normativa-resoluciones'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiNormativaUnificacionSuinJuriscolNormativaUnificacionSuinJuriscol
  extends Struct.SingleTypeSchema {
  collectionName: 'normativa_unificacion_suin_juriscol';
  info: {
    description: 'Auto-generado desde src/content/pages/normativa/unificacion-suin-juriscol.json';
    displayName: '03. Normativa / Unificacion Suin Juriscol';
    pluralName: 'normativa-unificacion-suin-juriscols';
    singularName: 'normativa-unificacion-suin-juriscol';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::normativa-unificacion-suin-juriscol.normativa-unificacion-suin-juriscol'
    > &
      Schema.Attribute.Private;
    normas: Schema.Attribute.Component<'normativa-unificacion-suin-juriscol.norma', true>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiNormativaVigenciaNormativaVigencia extends Struct.CollectionTypeSchema {
  collectionName: 'normativa_vigencias_items';
  info: {
    description: 'Auto-generado desde src/content/pages/normativa/vigencias';
    displayName: '03. Normativa / Vigencias';
    pluralName: 'normativa-vigencias';
    singularName: 'normativa-vigencia';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'normativa-vigencias.inform', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::normativa-vigencia.normativa-vigencia'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiNormogramaNormograma extends Struct.SingleTypeSchema {
  collectionName: 'normograma';
  info: {
    description: 'Auto-generado desde src/content/pages/normograma.json';
    displayName: '03. Normativa / Normograma';
    pluralName: 'normogramas';
    singularName: 'normograma';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::normograma.normograma'> &
      Schema.Attribute.Private;
    normas: Schema.Attribute.Component<'normograma.norma', true>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioDelObservatorioObservatorioDelObservatorio
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_del_observatorio';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/del-observatorio.json';
    displayName: '07. Observatorio ITRC / Del Observatorio';
    pluralName: 'observatorio-del-observatorios';
    singularName: 'observatorio-del-observatorio';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-del-observatorio.observatorio-del-observatorio'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    tabs: Schema.Attribute.Component<'observatorio-del-observatorio.tab', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionArticulosObservatorioEjeDeEducacionArticulos
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_articulos';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/articulos.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Articulos';
    pluralName: 'observatorio-eje-de-educacion-articuloses';
    singularName: 'observatorio-eje-de-educacion-articulos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    articulos: Schema.Attribute.Component<'observatorio-eje-de-educacion-articulos.articulo', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-articulos.observatorio-eje-de-educacion-articulos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionCartillaInfantilObservatorioEjeDeEducacionCartillaInfantil
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_cartilla_infantil';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/cartilla-infantil.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Cartilla Infantil';
    pluralName: 'observatorio-eje-de-educacion-cartilla-infantils';
    singularName: 'observatorio-eje-de-educacion-cartilla-infantil';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    embedUrl: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-cartilla-infantil.observatorio-eje-de-educacion-cartilla-infantil'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionConociendoObservatorioEjeDeEducacionConociendo
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_conociendo';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/conociendo.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Conociendo';
    pluralName: 'observatorio-eje-de-educacion-conociendos';
    singularName: 'observatorio-eje-de-educacion-conociendo';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<
      'observatorio-eje-de-educacion-conociendo.documento',
      true
    >;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-conociendo.observatorio-eje-de-educacion-conociendo'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionCuentoObservatorioEjeDeEducacionCuento
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_cuento';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/cuento.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Cuento';
    pluralName: 'observatorio-eje-de-educacion-cuentos';
    singularName: 'observatorio-eje-de-educacion-cuento';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    embedUrl: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-cuento.observatorio-eje-de-educacion-cuento'
    > &
      Schema.Attribute.Private;
    pdfPaginas: Schema.Attribute.Integer;
    pdfSize: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionGlosarioNinosObservatorioEjeDeEducacionGlosarioNinos
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_glosario_ninos';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/glosario-ninos.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Glosario Ninos';
    pluralName: 'observatorio-eje-de-educacion-glosario-ninoses';
    singularName: 'observatorio-eje-de-educacion-glosario-ninos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-glosario-ninos.observatorio-eje-de-educacion-glosario-ninos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    terminos: Schema.Attribute.Component<
      'observatorio-eje-de-educacion-glosario-ninos.termino',
      true
    >;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionItrcParaNinosObservatorioEjeDeEducacionItrcParaNinos
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_itrc_para_ninos';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/itrc-para-ninos.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Itrc Para Ninos';
    pluralName: 'observatorio-eje-de-educacion-itrc-para-ninoses';
    singularName: 'observatorio-eje-de-educacion-itrc-para-ninos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-itrc-para-ninos.observatorio-eje-de-educacion-itrc-para-ninos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<
      'observatorio-eje-de-educacion-itrc-para-ninos.seccion',
      true
    >;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionJuegoDeRolesObservatorioEjeDeEducacionJuegoDeRoles
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_juego_de_roles';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/juego-de-roles.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Juego De Roles';
    pluralName: 'observatorio-eje-de-educacion-juego-de-roleses';
    singularName: 'observatorio-eje-de-educacion-juego-de-roles';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    juegos: Schema.Attribute.Component<'observatorio-eje-de-educacion-juego-de-roles.juego', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-juego-de-roles.observatorio-eje-de-educacion-juego-de-roles'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionLibroInfantilObservatorioEjeDeEducacionLibroInfantil
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_libro_infantil';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/libro-infantil.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Libro Infantil';
    pluralName: 'observatorio-eje-de-educacion-libro-infantils';
    singularName: 'observatorio-eje-de-educacion-libro-infantil';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-libro-infantil.observatorio-eje-de-educacion-libro-infantil'
    > &
      Schema.Attribute.Private;
    pdfPaginas: Schema.Attribute.Integer;
    pdfSize: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionMemoriaObservatorioEjeDeEducacionMemoria
  extends Struct.CollectionTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_memorias_items';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/memorias';
    displayName: '07. Observatorio ITRC / Eje De Educacion Memorias';
    pluralName: 'observatorio-eje-de-educacion-memorias';
    singularName: 'observatorio-eje-de-educacion-memoria';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contenido: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    fecha: Schema.Attribute.String;
    galeria: Schema.Attribute.Component<'observatorio-eje-de-educacion-memorias.galeria', true>;
    imagenDestacada: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-memoria.observatorio-eje-de-educacion-memoria'
    > &
      Schema.Attribute.Private;
    originalUrl: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    resumen: Schema.Attribute.Text;
    slug: Schema.Attribute.UID & Schema.Attribute.Required;
    titulo: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionMemoriasInfoObservatorioEjeDeEducacionMemoriasInfo
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_memorias_info';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/memorias.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Memorias Info';
    pluralName: 'observatorio-eje-de-educacion-memorias-infos';
    singularName: 'observatorio-eje-de-educacion-memorias-info';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    anios: Schema.Attribute.Component<'observatorio-eje-de-educacion-memorias-info.anio', true>;
    banner: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-memorias-info.observatorio-eje-de-educacion-memorias-info'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionQuizObservatorioEjeDeEducacionQuiz
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_quiz';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/quiz.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Quiz';
    pluralName: 'observatorio-eje-de-educacion-quices';
    singularName: 'observatorio-eje-de-educacion-quiz';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-quiz.observatorio-eje-de-educacion-quiz'
    > &
      Schema.Attribute.Private;
    preguntas: Schema.Attribute.Component<'observatorio-eje-de-educacion-quiz.pregunta', true>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionRepositorioJuridicoObservatorioEjeDeEducacionRepositorioJuridico
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_repositorio_juridico';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/repositorio-juridico.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Repositorio Juridico';
    pluralName: 'observatorio-eje-de-educacion-repositorio-juridicos';
    singularName: 'observatorio-eje-de-educacion-repositorio-juridico';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-repositorio-juridico.observatorio-eje-de-educacion-repositorio-juridico'
    > &
      Schema.Attribute.Private;
    normas: Schema.Attribute.Component<
      'observatorio-eje-de-educacion-repositorio-juridico.norma',
      true
    >;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionSopaDeLetrasObservatorioEjeDeEducacionSopaDeLetras
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_sopa_de_letras';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/sopa-de-letras.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Sopa De Letras';
    pluralName: 'observatorio-eje-de-educacion-sopa-de-letrases';
    singularName: 'observatorio-eje-de-educacion-sopa-de-letras';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-sopa-de-letras.observatorio-eje-de-educacion-sopa-de-letras'
    > &
      Schema.Attribute.Private;
    palabras: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeEducacionVideoNinosObservatorioEjeDeEducacionVideoNinos
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion_video_ninos';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion/video-ninos.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion Video Ninos';
    pluralName: 'observatorio-eje-de-educacion-video-ninoses';
    singularName: 'observatorio-eje-de-educacion-video-ninos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    descripcion: Schema.Attribute.String;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion-video-ninos.observatorio-eje-de-educacion-video-ninos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    videoUrl: Schema.Attribute.String;
    youtubeId: Schema.Attribute.String;
  };
}

export interface ApiObservatorioEjeDeEducacionObservatorioEjeDeEducacion
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_educacion';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-educacion.json';
    displayName: '07. Observatorio ITRC / Eje De Educacion';
    pluralName: 'observatorio-eje-de-educacions';
    singularName: 'observatorio-eje-de-educacion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-educacion.observatorio-eje-de-educacion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'observatorio-eje-de-educacion.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeMedicionObservatorioEjeDeMedicion
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_medicion';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-medicion.json';
    displayName: '07. Observatorio ITRC / Eje De Medicion';
    pluralName: 'observatorio-eje-de-medicions';
    singularName: 'observatorio-eje-de-medicion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    dashboards: Schema.Attribute.Component<'observatorio-eje-de-medicion.dashboard', true>;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-medicion.observatorio-eje-de-medicion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeParticipacionCartillasObservatorioEjeDeParticipacionCartillas
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_participacion_cartillas';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-participacion/cartillas.json';
    displayName: '07. Observatorio ITRC / Eje De Participacion Cartillas';
    pluralName: 'observatorio-eje-de-participacion-cartillases';
    singularName: 'observatorio-eje-de-participacion-cartillas';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cartillas: Schema.Attribute.Component<
      'observatorio-eje-de-participacion-cartillas.cartilla',
      true
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-participacion-cartillas.observatorio-eje-de-participacion-cartillas'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeParticipacionEncuestaObservatorioEjeDeParticipacionEncuesta
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_participacion_encuesta';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-participacion/encuesta.json';
    displayName: '07. Observatorio ITRC / Eje De Participacion Encuesta';
    pluralName: 'observatorio-eje-de-participacion-encuestas';
    singularName: 'observatorio-eje-de-participacion-encuesta';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-participacion-encuesta.observatorio-eje-de-participacion-encuesta'
    > &
      Schema.Attribute.Private;
    participar: Schema.Attribute.Component<
      'observatorio-eje-de-participacion-encuesta.participar',
      false
    >;
    publishedAt: Schema.Attribute.DateTime;
    resultados: Schema.Attribute.Component<
      'observatorio-eje-de-participacion-encuesta.resultados',
      false
    >;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeParticipacionMemoriaObservatorioEjeDeParticipacionMemoria
  extends Struct.CollectionTypeSchema {
  collectionName: 'observatorio_eje_de_participacion_memorias_items';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-participacion/memorias';
    displayName: '07. Observatorio ITRC / Eje De Participacion Memorias';
    pluralName: 'observatorio-eje-de-participacion-memorias';
    singularName: 'observatorio-eje-de-participacion-memoria';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contenido: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    fecha: Schema.Attribute.String;
    galeria: Schema.Attribute.Component<'observatorio-eje-de-participacion-memorias.galeria', true>;
    imagenDestacada: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-participacion-memoria.observatorio-eje-de-participacion-memoria'
    > &
      Schema.Attribute.Private;
    originalUrl: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    resumen: Schema.Attribute.Text;
    slug: Schema.Attribute.UID & Schema.Attribute.Required;
    titulo: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeParticipacionMemoriasInfoObservatorioEjeDeParticipacionMemoriasInfo
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_participacion_memorias_info';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-participacion/memorias.json';
    displayName: '07. Observatorio ITRC / Eje De Participacion Memorias Info';
    pluralName: 'observatorio-eje-de-participacion-memorias-infos';
    singularName: 'observatorio-eje-de-participacion-memorias-info';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    anios: Schema.Attribute.Component<'observatorio-eje-de-participacion-memorias-info.anio', true>;
    banner: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-participacion-memorias-info.observatorio-eje-de-participacion-memorias-info'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeParticipacionNoticiasObservatorioEjeDeParticipacionNoticias
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_participacion_noticias';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-participacion/noticias.json';
    displayName: '07. Observatorio ITRC / Eje De Participacion Noticias';
    pluralName: 'observatorio-eje-de-participacion-noticiases';
    singularName: 'observatorio-eje-de-participacion-noticias';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    banner: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-participacion-noticias.observatorio-eje-de-participacion-noticias'
    > &
      Schema.Attribute.Private;
    noticias: Schema.Attribute.Component<
      'observatorio-eje-de-participacion-noticias.noticia',
      true
    >;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioEjeDeParticipacionVideosTutorialesObservatorioEjeDeParticipacionVideosTutoriales
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_participacion_videos_tutoriales';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-participacion/videos-tutoriales.json';
    displayName: '07. Observatorio ITRC / Eje De Participacion Videos Tutoriales';
    pluralName: 'observatorio-eje-de-participacion-videos-tutorialeses';
    singularName: 'observatorio-eje-de-participacion-videos-tutoriales';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-participacion-videos-tutoriales.observatorio-eje-de-participacion-videos-tutoriales'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    videos: Schema.Attribute.Component<
      'observatorio-eje-de-participacion-videos-tutoriales.video',
      true
    >;
  };
}

export interface ApiObservatorioEjeDeParticipacionObservatorioEjeDeParticipacion
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_eje_de_participacion';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/eje-de-participacion.json';
    displayName: '07. Observatorio ITRC / Eje De Participacion';
    pluralName: 'observatorio-eje-de-participacions';
    singularName: 'observatorio-eje-de-participacion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-eje-de-participacion.observatorio-eje-de-participacion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'observatorio-eje-de-participacion.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiObservatorioObservatorioObservatorioObservatorio
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_observatorio';
  info: {
    description: 'Auto-generado desde src/content/pages/observatorio/observatorio.json';
    displayName: '07. Observatorio ITRC / Observatorio';
    pluralName: 'observatorio-observatorios';
    singularName: 'observatorio-observatorio';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::observatorio-observatorio.observatorio-observatorio'
    > &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'observatorio-observatorio.seccion', true>;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaAtencionInformeComiteConciliacionParticipaAtencionInformeComiteConciliacion
  extends Struct.SingleTypeSchema {
  collectionName: 'participa_atencion_informe_comite_conciliacion';
  info: {
    description: 'Auto-generado desde src/content/pages/participa-atencion/informe-comite-conciliacion.json';
    displayName: '05. Participa / Atencion Informe Comite Conciliacion';
    pluralName: 'participa-atencion-informe-comite-conciliacions';
    singularName: 'participa-atencion-informe-comite-conciliacion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<
      'participa-atencion-informe-comite-conciliacion.inform',
      true
    >;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::participa-atencion-informe-comite-conciliacion.participa-atencion-informe-comite-conciliacion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaAtencionOtrosGruposInteresParticipaAtencionOtrosGruposInteres
  extends Struct.SingleTypeSchema {
  collectionName: 'participa_atencion_otros_grupos_interes';
  info: {
    description: 'Auto-generado desde src/content/pages/participa-atencion/otros-grupos-interes.json';
    displayName: '05. Participa / Atencion Otros Grupos Interes';
    pluralName: 'participa-atencion-otros-grupos-intereses';
    singularName: 'participa-atencion-otros-grupos-interes';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'participa-atencion-otros-grupos-interes.enlaz', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::participa-atencion-otros-grupos-interes.participa-atencion-otros-grupos-interes'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaAtencionRespuestaAnonimosParticipaAtencionRespuestaAnonimos
  extends Struct.SingleTypeSchema {
  collectionName: 'participa_atencion_respuesta_anonimos';
  info: {
    description: 'Auto-generado desde src/content/pages/participa-atencion/respuesta-anonimos.json';
    displayName: '05. Participa / Atencion Respuesta Anonimos';
    pluralName: 'participa-atencion-respuesta-anonimoses';
    singularName: 'participa-atencion-respuesta-anonimos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    aviso: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::participa-atencion-respuesta-anonimos.participa-atencion-respuesta-anonimos'
    > &
      Schema.Attribute.Private;
    notificaciones: Schema.Attribute.Component<
      'participa-atencion-respuesta-anonimos.notificacion',
      true
    >;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaColaboracionParticipaColaboracion extends Struct.SingleTypeSchema {
  collectionName: 'participa_colaboracion';
  info: {
    description: 'Auto-generado desde src/content/pages/participa/colaboracion.json';
    displayName: '05. Participa / Colaboracion';
    pluralName: 'participa-colaboracions';
    singularName: 'participa-colaboracion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    iniciativas: Schema.Attribute.Component<'participa-colaboracion.iniciativa', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::participa-colaboracion.participa-colaboracion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    textoAdicional: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaConsultaCiudadanaParticipaConsultaCiudadana
  extends Struct.SingleTypeSchema {
  collectionName: 'participa_consulta_ciudadana';
  info: {
    description: 'Auto-generado desde src/content/pages/participa/consulta-ciudadana.json';
    displayName: '05. Participa / Consulta Ciudadana';
    pluralName: 'participa-consulta-ciudadanas';
    singularName: 'participa-consulta-ciudadana';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contenido: Schema.Attribute.Component<'participa-consulta-ciudadana.contenido', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'participa-consulta-ciudadana.enlaz', true>;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::participa-consulta-ciudadana.participa-consulta-ciudadana'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaControlSocialParticipaControlSocial extends Struct.SingleTypeSchema {
  collectionName: 'participa_control_social';
  info: {
    description: 'Auto-generado desde src/content/pages/participa/control-social.json';
    displayName: '05. Participa / Control Social';
    pluralName: 'participa-control-socials';
    singularName: 'participa-control-social';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'participa-control-social.enlaz', true>;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::participa-control-social.participa-control-social'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaDiagnosticoParticipaDiagnostico extends Struct.SingleTypeSchema {
  collectionName: 'participa_diagnostico';
  info: {
    description: 'Auto-generado desde src/content/pages/participa/diagnostico.json';
    displayName: '05. Participa / Diagnostico';
    pluralName: 'participa-diagnosticos';
    singularName: 'participa-diagnostico';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cajaHerramientas: Schema.Attribute.Component<'participa-diagnostico.cajaherramienta', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'participa-diagnostico.enlaz', true>;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::participa-diagnostico.participa-diagnostico'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaPlaneacionParticipaPlaneacion extends Struct.SingleTypeSchema {
  collectionName: 'participa_planeacion';
  info: {
    description: 'Auto-generado desde src/content/pages/participa/planeacion.json';
    displayName: '05. Participa / Planeacion';
    pluralName: 'participa-planeacions';
    singularName: 'participa-planeacion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'participa-planeacion.enlaz', true>;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::participa-planeacion.participa-planeacion'
    > &
      Schema.Attribute.Private;
    nota: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaRendicionDeCuentasParticipaRendicionDeCuentas
  extends Struct.SingleTypeSchema {
  collectionName: 'participa_rendicion_de_cuentas';
  info: {
    description: 'Auto-generado desde src/content/pages/participa/rendicion-de-cuentas.json';
    displayName: '05. Participa / Rendicion De Cuentas';
    pluralName: 'participa-rendicion-de-cuentases';
    singularName: 'participa-rendicion-de-cuentas';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    anios: Schema.Attribute.Component<'participa-rendicion-de-cuentas.anio', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::participa-rendicion-de-cuentas.participa-rendicion-de-cuentas'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    textoAdicional: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiParticipaParticipa extends Struct.SingleTypeSchema {
  collectionName: 'participa';
  info: {
    description: 'Auto-generado desde src/content/pages/participa.json';
    displayName: '05. Participa / Inicio';
    pluralName: 'participas';
    singularName: 'participa';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::participa.participa'> &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'participa.seccion', true>;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiPrensaCapsulasPrensaCapsulas extends Struct.SingleTypeSchema {
  collectionName: 'prensa_capsulas';
  info: {
    description: 'Auto-generado desde src/content/pages/prensa/capsulas.json';
    displayName: '08. Prensa / Capsulas';
    pluralName: 'prensa-capsulases';
    singularName: 'prensa-capsulas';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    capsulas: Schema.Attribute.Component<'prensa-capsulas.capsula', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::prensa-capsulas.prensa-capsulas'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiPrensaComunicadosInstitucionalesPrensaComunicadosInstitucionales
  extends Struct.SingleTypeSchema {
  collectionName: 'prensa_comunicados_institucionales';
  info: {
    description: 'Auto-generado desde src/content/pages/prensa/comunicados-institucionales.json';
    displayName: '08. Prensa / Comunicados Institucionales';
    pluralName: 'prensa-comunicados-institucionaleses';
    singularName: 'prensa-comunicados-institucionales';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    anios: Schema.Attribute.Component<'prensa-comunicados-institucionales.anio', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::prensa-comunicados-institucionales.prensa-comunicados-institucionales'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiPrensaGaleriaPrensaGaleria extends Struct.SingleTypeSchema {
  collectionName: 'prensa_galeria';
  info: {
    description: 'Auto-generado desde src/content/pages/prensa/galeria.json';
    displayName: '08. Prensa / Galeria';
    pluralName: 'prensa-galerias';
    singularName: 'prensa-galeria';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    albums: Schema.Attribute.Component<'prensa-galeria.album', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::prensa-galeria.prensa-galeria'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiPrensaLandingPrensaLanding extends Struct.SingleTypeSchema {
  collectionName: 'prensa_landing';
  info: {
    description: 'Auto-generado desde src/content/pages/prensa/landing.json';
    displayName: '08. Prensa / Landing';
    pluralName: 'prensa-landings';
    singularName: 'prensa-landing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::prensa-landing.prensa-landing'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'prensa-landing.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiPrensaVideosPrensaVideos extends Struct.SingleTypeSchema {
  collectionName: 'prensa_videos';
  info: {
    description: 'Auto-generado desde src/content/pages/prensa/videos.json';
    displayName: '08. Prensa / Videos';
    pluralName: 'prensa-videoses';
    singularName: 'prensa-videos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'prensa-videos.enlaz', true>;
    enlacesRelacionados: Schema.Attribute.Component<'shared.related-link', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::prensa-videos.prensa-videos'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    videos: Schema.Attribute.Component<'prensa-videos.video', true>;
  };
}

export interface ApiPrensaPrensa extends Struct.SingleTypeSchema {
  collectionName: 'prensa';
  info: {
    description: 'Auto-generado desde src/content/pages/prensa.json';
    displayName: '08. Prensa / Inicio';
    pluralName: 'prensas';
    singularName: 'prensa';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::prensa.prensa'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.Component<'prensa.section', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaAccesibilidadTransparenciaAccesibilidad
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_accesibilidad';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/accesibilidad.json';
    displayName: '06. Transparencia / Accesibilidad';
    pluralName: 'transparencia-accesibilidads';
    singularName: 'transparencia-accesibilidad';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<'transparencia-accesibilidad.documento', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-accesibilidad.transparencia-accesibilidad'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    texto: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaAgremiacionesTransparenciaAgremiaciones
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_agremiaciones';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/agremiaciones.json';
    displayName: '06. Transparencia / Agremiaciones';
    pluralName: 'transparencia-agremiacioneses';
    singularName: 'transparencia-agremiaciones';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-agremiaciones.transparencia-agremiaciones'
    > &
      Schema.Attribute.Private;
    pdfNombre: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaComiteConciliacionTransparenciaComiteConciliacion
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_comite_conciliacion';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/comite-conciliacion.json';
    displayName: '06. Transparencia / Comite Conciliacion';
    pluralName: 'transparencia-comite-conciliacions';
    singularName: 'transparencia-comite-conciliacion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    anios: Schema.Attribute.Component<'transparencia-comite-conciliacion.anio', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-comite-conciliacion.transparencia-comite-conciliacion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaContratacionContratacionSuscritaTransparenciaContratacionContratacionSuscrita
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_contratacion_contratacion_suscrita';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/contratacion/contratacion-suscrita.json';
    displayName: '06. Transparencia / Contratacion Contratacion Suscrita';
    pluralName: 'transparencia-contratacion-contratacion-suscritas';
    singularName: 'transparencia-contratacion-contratacion-suscrita';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contratacionSuscrita: Schema.Attribute.Component<
      'transparencia-contratacion-contratacion-suscrita.contratacionsuscrita',
      true
    >;
    convocatorias: Schema.Attribute.Component<
      'transparencia-contratacion-contratacion-suscrita.convocatoria',
      true
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-contratacion-contratacion-suscrita.transparencia-contratacion-contratacion-suscrita'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secopI: Schema.Attribute.String;
    secopII: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaContratacionEjecucionContratosTransparenciaContratacionEjecucionContratos
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_contratacion_ejecucion_contratos';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/contratacion/ejecucion-contratos.json';
    displayName: '06. Transparencia / Contratacion Ejecucion Contratos';
    pluralName: 'transparencia-contratacion-ejecucion-contratoses';
    singularName: 'transparencia-contratacion-ejecucion-contratos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesExternos: Schema.Attribute.Component<
      'transparencia-contratacion-ejecucion-contratos.enlacesexterno',
      true
    >;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-contratacion-ejecucion-contratos.transparencia-contratacion-ejecucion-contratos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    vigencias: Schema.Attribute.Component<
      'transparencia-contratacion-ejecucion-contratos.vigencia',
      true
    >;
  };
}

export interface ApiTransparenciaContratacionEjecucionTransparenciaContratacionEjecucion
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_contratacion_ejecucion';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/contratacion/ejecucion.json';
    displayName: '06. Transparencia / Contratacion Ejecucion';
    pluralName: 'transparencia-contratacion-ejecucions';
    singularName: 'transparencia-contratacion-ejecucion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-contratacion-ejecucion.transparencia-contratacion-ejecucion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secopI: Schema.Attribute.String;
    secopII: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaContratacionFormatosTransparenciaContratacionFormatos
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_contratacion_formatos';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/contratacion/formatos.json';
    displayName: '06. Transparencia / Contratacion Formatos';
    pluralName: 'transparencia-contratacion-formatoses';
    singularName: 'transparencia-contratacion-formatos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    formatos: Schema.Attribute.Component<'transparencia-contratacion-formatos.formato', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-contratacion-formatos.transparencia-contratacion-formatos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaContratacionManualTransparenciaContratacionManual
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_contratacion_manual';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/contratacion/manual.json';
    displayName: '06. Transparencia / Contratacion Manual';
    pluralName: 'transparencia-contratacion-manuals';
    singularName: 'transparencia-contratacion-manual';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<'transparencia-contratacion-manual.documento', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-contratacion-manual.transparencia-contratacion-manual'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaContratacionPlanAdquisicionesTransparenciaContratacionPlanAdquisiciones
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_contratacion_plan_adquisiciones';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/contratacion/plan-adquisiciones.json';
    displayName: '06. Transparencia / Contratacion Plan Adquisiciones';
    pluralName: 'transparencia-contratacion-plan-adquisicioneses';
    singularName: 'transparencia-contratacion-plan-adquisiciones';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    anios: Schema.Attribute.Component<'transparencia-contratacion-plan-adquisiciones.anio', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-contratacion-plan-adquisiciones.transparencia-contratacion-plan-adquisiciones'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secopUrl: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaContratacionProcedimientosAdquisicionTransparenciaContratacionProcedimientosAdquisicion
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_contratacion_procedimientos_adquisicion';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/contratacion/procedimientos-adquisicion.json';
    displayName: '06. Transparencia / Contratacion Procedimientos Adquisicion';
    pluralName: 'transparencia-contratacion-procedimientos-adquisicions';
    singularName: 'transparencia-contratacion-procedimientos-adquisicion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<
      'transparencia-contratacion-procedimientos-adquisicion.documento',
      true
    >;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-contratacion-procedimientos-adquisicion.transparencia-contratacion-procedimientos-adquisicion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaDatosAbiertosTransparenciaDatosAbiertos
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_datos_abiertos';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/datos-abiertos.json';
    displayName: '06. Transparencia / Datos Abiertos';
    pluralName: 'transparencia-datos-abiertoses';
    singularName: 'transparencia-datos-abiertos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlace: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-datos-abiertos.transparencia-datos-abiertos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    texto: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaDecretoUnicoTransparenciaDecretoUnico
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_decreto_unico';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/decreto-unico.json';
    displayName: '06. Transparencia / Decreto Unico';
    pluralName: 'transparencia-decreto-unicos';
    singularName: 'transparencia-decreto-unico';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<'transparencia-decreto-unico.documento', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-decreto-unico.transparencia-decreto-unico'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaDecretosEstructuraTransparenciaDecretosEstructura
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_decretos_estructura';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/decretos-estructura.json';
    displayName: '06. Transparencia / Decretos Estructura';
    pluralName: 'transparencia-decretos-estructuras';
    singularName: 'transparencia-decretos-estructura';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-decretos-estructura.transparencia-decretos-estructura'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'transparencia-decretos-estructura.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaDefensaPublicaTransparenciaDefensaPublica
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_defensa_publica';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/defensa-publica.json';
    displayName: '06. Transparencia / Defensa Publica';
    pluralName: 'transparencia-defensa-publicas';
    singularName: 'transparencia-defensa-publica';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'transparencia-defensa-publica.enlaz', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-defensa-publica.transparencia-defensa-publica'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaDirectorioEntidadesTransparenciaDirectorioEntidades
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_directorio_entidades';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/directorio-entidades.json';
    displayName: '06. Transparencia / Directorio Entidades';
    pluralName: 'transparencia-directorio-entidadeses';
    singularName: 'transparencia-directorio-entidades';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    grupos: Schema.Attribute.Component<'transparencia-directorio-entidades.grupo', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-directorio-entidades.transparencia-directorio-entidades'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaDocumentacionEsquemaPublicacionTransparenciaDocumentacionEsquemaPublicacion
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_documentacion_esquema_publicacion';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/documentacion/esquema-publicacion.json';
    displayName: '06. Transparencia / Documentacion Esquema Publicacion';
    pluralName: 'transparencia-documentacion-esquema-publicacions';
    singularName: 'transparencia-documentacion-esquema-publicacion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<
      'transparencia-documentacion-esquema-publicacion.inform',
      true
    >;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-documentacion-esquema-publicacion.transparencia-documentacion-esquema-publicacion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaDocumentacionFormatoGruposEtnicosTransparenciaDocumentacionFormatoGruposEtnicos
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_documentacion_formato_grupos_etnicos';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/documentacion/formato-grupos-etnicos.json';
    displayName: '06. Transparencia / Documentacion Formato Grupos Etnicos';
    pluralName: 'transparencia-documentacion-formato-grupos-etnicoses';
    singularName: 'transparencia-documentacion-formato-grupos-etnicos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<
      'transparencia-documentacion-formato-grupos-etnicos.inform',
      true
    >;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-documentacion-formato-grupos-etnicos.transparencia-documentacion-formato-grupos-etnicos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaDocumentacionProteccionDatosTransparenciaDocumentacionProteccionDatos
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_documentacion_proteccion_datos';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/documentacion/proteccion-datos.json';
    displayName: '06. Transparencia / Documentacion Proteccion Datos';
    pluralName: 'transparencia-documentacion-proteccion-datoses';
    singularName: 'transparencia-documentacion-proteccion-datos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<
      'transparencia-documentacion-proteccion-datos.documento',
      true
    >;
    enlacesExternos: Schema.Attribute.Component<
      'transparencia-documentacion-proteccion-datos.enlacesexterno',
      true
    >;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-documentacion-proteccion-datos.transparencia-documentacion-proteccion-datos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaDocumentacionRegistroPublicacionesTransparenciaDocumentacionRegistroPublicaciones
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_documentacion_registro_publicaciones';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/documentacion/registro-publicaciones.json';
    displayName: '06. Transparencia / Documentacion Registro Publicaciones';
    pluralName: 'transparencia-documentacion-registro-publicacioneses';
    singularName: 'transparencia-documentacion-registro-publicaciones';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<
      'transparencia-documentacion-registro-publicaciones.inform',
      true
    >;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-documentacion-registro-publicaciones.transparencia-documentacion-registro-publicaciones'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaEsquemaPublicacionTransparenciaEsquemaPublicacion
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_esquema_publicacion';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/esquema-publicacion.json';
    displayName: '06. Transparencia / Esquema Publicacion';
    pluralName: 'transparencia-esquema-publicacions';
    singularName: 'transparencia-esquema-publicacion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-esquema-publicacion.transparencia-esquema-publicacion'
    > &
      Schema.Attribute.Private;
    pdfNombre: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaEvaluacionIndependienteTransparenciaEvaluacionIndependiente
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_evaluacion_independiente';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/evaluacion-independiente.json';
    displayName: '06. Transparencia / Evaluacion Independiente';
    pluralName: 'transparencia-evaluacion-independientes';
    singularName: 'transparencia-evaluacion-independiente';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<
      'transparencia-evaluacion-independiente.documento',
      true
    >;
    enlaceRelacionado: Schema.Attribute.Component<
      'transparencia-evaluacion-independiente.enlacerelacionado',
      false
    >;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-evaluacion-independiente.transparencia-evaluacion-independiente'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaFormatosContratosPliegosTipoTransparenciaFormatosContratosPliegosTipo
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_formatos_contratos_pliegos_tipo';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/formatos-contratos-pliegos-tipo.json';
    displayName: '06. Transparencia / Formatos Contratos Pliegos Tipo';
    pluralName: 'transparencia-formatos-contratos-pliegos-tipos';
    singularName: 'transparencia-formatos-contratos-pliegos-tipo';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<
      'transparencia-formatos-contratos-pliegos-tipo.inform',
      true
    >;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-formatos-contratos-pliegos-tipo.transparencia-formatos-contratos-pliegos-tipo'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaFormatosFormulariosTransparenciaFormatosFormularios
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_formatos_formularios';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/formatos-formularios.json';
    displayName: '06. Transparencia / Formatos Formularios';
    pluralName: 'transparencia-formatos-formularioses';
    singularName: 'transparencia-formatos-formularios';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-formatos-formularios.transparencia-formatos-formularios'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'transparencia-formatos-formularios.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaHojasDeVidaTransparenciaHojasDeVida
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_hojas_de_vida';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/hojas-de-vida.json';
    displayName: '06. Transparencia / Hojas De Vida';
    pluralName: 'transparencia-hojas-de-vidas';
    singularName: 'transparencia-hojas-de-vida';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    aspirantes: Schema.Attribute.Component<'transparencia-hojas-de-vida.aspirant', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaceExterno: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-hojas-de-vida.transparencia-hojas-de-vida'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaIndiceInformacionClasificadaTransparenciaIndiceInformacionClasificada
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_indice_informacion_clasificada';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/indice-informacion-clasificada.json';
    displayName: '06. Transparencia / Indice Informacion Clasificada';
    pluralName: 'transparencia-indice-informacion-clasificadas';
    singularName: 'transparencia-indice-informacion-clasificada';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<
      'transparencia-indice-informacion-clasificada.inform',
      true
    >;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-indice-informacion-clasificada.transparencia-indice-informacion-clasificada'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaInformacionMujeresTransparenciaInformacionMujeres
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_informacion_mujeres';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/informacion-mujeres.json';
    displayName: '06. Transparencia / Informacion Mujeres';
    pluralName: 'transparencia-informacion-mujereses';
    singularName: 'transparencia-informacion-mujeres';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-informacion-mujeres.transparencia-informacion-mujeres'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'transparencia-informacion-mujeres.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaInformeTransparenciaInforme extends Struct.CollectionTypeSchema {
  collectionName: 'transparencia_informes_items';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/informes';
    displayName: '06. Transparencia / Informes';
    pluralName: 'transparencia-informes';
    singularName: 'transparencia-informe';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    categorias: Schema.Attribute.Component<'transparencia-informes.categoria', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'transparencia-informes.inform', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-informe.transparencia-informe'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaInformesEmpalmeTransparenciaInformesEmpalme
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_informes_empalme';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/informes-empalme.json';
    displayName: '06. Transparencia / Informes Empalme';
    pluralName: 'transparencia-informes-empalmes';
    singularName: 'transparencia-informes-empalme';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<'transparencia-informes-empalme.documento', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-informes-empalme.transparencia-informes-empalme'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaInformesLegalesTransparenciaInformesLegales
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_informes_legales';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/informes-legales.json';
    displayName: '06. Transparencia / Informes Legales';
    pluralName: 'transparencia-informes-legaleses';
    singularName: 'transparencia-informes-legales';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-informes-legales.transparencia-informes-legales'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'transparencia-informes-legales.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaInformesOrganismosIvcTransparenciaInformesOrganismosIvc
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_informes_organismos_ivc';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/informes-organismos-ivc.json';
    displayName: '06. Transparencia / Informes Organismos Ivc';
    pluralName: 'transparencia-informes-organismos-ivcs';
    singularName: 'transparencia-informes-organismos-ivc';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'transparencia-informes-organismos-ivc.enlaz', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-informes-organismos-ivc.transparencia-informes-organismos-ivc'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaInformesOrganismosTransparenciaInformesOrganismos
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_informes_organismos';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/informes-organismos.json';
    displayName: '06. Transparencia / Informes Organismos';
    pluralName: 'transparencia-informes-organismoses';
    singularName: 'transparencia-informes-organismos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'transparencia-informes-organismos.enlaz', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-informes-organismos.transparencia-informes-organismos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaLeyesTransparenciaLeyes extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_leyes';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/leyes.json';
    displayName: '06. Transparencia / Leyes';
    pluralName: 'transparencia-leyeses';
    singularName: 'transparencia-leyes';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    leyes: Schema.Attribute.Component<'transparencia-leyes.ley', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-leyes.transparencia-leyes'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaNormasServicioTransparenciaNormasServicio
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_normas_servicio';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/normas-servicio.json';
    displayName: '06. Transparencia / Normas Servicio';
    pluralName: 'transparencia-normas-servicios';
    singularName: 'transparencia-normas-servicio';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-normas-servicio.transparencia-normas-servicio'
    > &
      Schema.Attribute.Private;
    normas: Schema.Attribute.Component<'transparencia-normas-servicio.norma', true>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaNormatividadEspecialTransparenciaNormatividadEspecial
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_normatividad_especial';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/normatividad-especial.json';
    displayName: '06. Transparencia / Normatividad Especial';
    pluralName: 'transparencia-normatividad-especials';
    singularName: 'transparencia-normatividad-especial';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-normatividad-especial.transparencia-normatividad-especial'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'transparencia-normatividad-especial.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaOtrosGruposTransparenciaOtrosGrupos
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_otros_grupos';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/otros-grupos.json';
    displayName: '06. Transparencia / Otros Grupos';
    pluralName: 'transparencia-otros-gruposes';
    singularName: 'transparencia-otros-grupos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'transparencia-otros-grupos.enlaz', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-otros-grupos.transparencia-otros-grupos'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaPlanesMejoramientoTransparenciaPlanesMejoramiento
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_planes_mejoramiento';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/planes-mejoramiento.json';
    displayName: '06. Transparencia / Planes Mejoramiento';
    pluralName: 'transparencia-planes-mejoramientos';
    singularName: 'transparencia-planes-mejoramiento';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-planes-mejoramiento.transparencia-planes-mejoramiento'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'transparencia-planes-mejoramiento.seccion', true>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaPoliticasManualesTransparenciaPoliticasManuales
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_politicas_manuales';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/politicas-manuales.json';
    displayName: '06. Transparencia / Politicas Manuales';
    pluralName: 'transparencia-politicas-manualeses';
    singularName: 'transparencia-politicas-manuales';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    derechosAutor: Schema.Attribute.Component<
      'transparencia-politicas-manuales.derechosautor',
      false
    >;
    description: Schema.Attribute.String;
    enlaces: Schema.Attribute.Component<'transparencia-politicas-manuales.enlaz', true>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-politicas-manuales.transparencia-politicas-manuales'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaProcedimientosDecisionesTransparenciaProcedimientosDecisiones
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_procedimientos_decisiones';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/procedimientos-decisiones.json';
    displayName: '06. Transparencia / Procedimientos Decisiones';
    pluralName: 'transparencia-procedimientos-decisioneses';
    singularName: 'transparencia-procedimientos-decisiones';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'transparencia-procedimientos-decisiones.inform', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-procedimientos-decisiones.transparencia-procedimientos-decisiones'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaProcedimientosTransparenciaProcedimientos
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_procedimientos';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/procedimientos.json';
    displayName: '06. Transparencia / Procedimientos';
    pluralName: 'transparencia-procedimientoses';
    singularName: 'transparencia-procedimientos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-procedimientos.transparencia-procedimientos'
    > &
      Schema.Attribute.Private;
    pdfNombre: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaProgramaGestionDocumentalTransparenciaProgramaGestionDocumental
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_programa_gestion_documental';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/programa-gestion-documental.json';
    displayName: '06. Transparencia / Programa Gestion Documental';
    pluralName: 'transparencia-programa-gestion-documentals';
    singularName: 'transparencia-programa-gestion-documental';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'transparencia-programa-gestion-documental.inform', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-programa-gestion-documental.transparencia-programa-gestion-documental'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaProtocoloAtencionTransparenciaProtocoloAtencion
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_protocolo_atencion';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/protocolo-atencion.json';
    displayName: '06. Transparencia / Protocolo Atencion';
    pluralName: 'transparencia-protocolo-atencions';
    singularName: 'transparencia-protocolo-atencion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-protocolo-atencion.transparencia-protocolo-atencion'
    > &
      Schema.Attribute.Private;
    pdfNombre: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaProyectosInversionTransparenciaProyectosInversion
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_proyectos_inversion';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/proyectos-inversion.json';
    displayName: '06. Transparencia / Proyectos Inversion';
    pluralName: 'transparencia-proyectos-inversions';
    singularName: 'transparencia-proyectos-inversion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesExternos: Schema.Attribute.Component<
      'transparencia-proyectos-inversion.enlacesexterno',
      true
    >;
    fichasEbi: Schema.Attribute.Component<'transparencia-proyectos-inversion.fichasebi', true>;
    fichasEbiNota: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'transparencia-proyectos-inversion.inform', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-proyectos-inversion.transparencia-proyectos-inversion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    resumenEjecutivo: Schema.Attribute.Component<
      'transparencia-proyectos-inversion.resumenejecutivo',
      true
    >;
    seguimientosSPI: Schema.Attribute.Component<
      'transparencia-proyectos-inversion.seguimientosspi',
      true
    >;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaProyectosNormasComentariosTransparenciaProyectosNormasComentarios
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_proyectos_normas_comentarios';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/proyectos-normas-comentarios.json';
    displayName: '06. Transparencia / Proyectos Normas Comentarios';
    pluralName: 'transparencia-proyectos-normas-comentarioses';
    singularName: 'transparencia-proyectos-normas-comentarios';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    enlacesExternos: Schema.Attribute.Component<
      'transparencia-proyectos-normas-comentarios.enlacesexterno',
      true
    >;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-proyectos-normas-comentarios.transparencia-proyectos-normas-comentarios'
    > &
      Schema.Attribute.Private;
    proyectosLocales: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaRegistroActivosTransparenciaRegistroActivos
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_registro_activos';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/registro-activos.json';
    displayName: '06. Transparencia / Registro Activos';
    pluralName: 'transparencia-registro-activoses';
    singularName: 'transparencia-registro-activos';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-registro-activos.transparencia-registro-activos'
    > &
      Schema.Attribute.Private;
    pdfNombre: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    tipoArchivo: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaRelatoriaTransparenciaRelatoria extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_relatoria';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/relatoria.json';
    displayName: '06. Transparencia / Relatoria';
    pluralName: 'transparencia-relatorias';
    singularName: 'transparencia-relatoria';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    criteriosSeleccion: Schema.Attribute.Text;
    description: Schema.Attribute.String;
    fichas: Schema.Attribute.Component<'transparencia-relatoria.ficha', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-relatoria.transparencia-relatoria'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    resolucion: Schema.Attribute.Component<'transparencia-relatoria.resolucion', false>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaRendicionCuentaContraloriaTransparenciaRendicionCuentaContraloria
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_rendicion_cuenta_contraloria';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/rendicion-cuenta-contraloria.json';
    displayName: '06. Transparencia / Rendicion Cuenta Contraloria';
    pluralName: 'transparencia-rendicion-cuenta-contralorias';
    singularName: 'transparencia-rendicion-cuenta-contraloria';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<
      'transparencia-rendicion-cuenta-contraloria.documento',
      true
    >;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-rendicion-cuenta-contraloria.transparencia-rendicion-cuenta-contraloria'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaReporteAusteridadGastoTransparenciaReporteAusteridadGasto
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_reporte_austeridad_gasto';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/reporte-austeridad-gasto.json';
    displayName: '06. Transparencia / Reporte Austeridad Gasto';
    pluralName: 'transparencia-reporte-austeridad-gastos';
    singularName: 'transparencia-reporte-austeridad-gasto';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    informes: Schema.Attribute.Component<'transparencia-reporte-austeridad-gasto.inform', true>;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-reporte-austeridad-gasto.transparencia-reporte-austeridad-gasto'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaSedeHorariosTransparenciaSedeHorarios
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_sede_horarios';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/sede-horarios.json';
    displayName: '06. Transparencia / Sede Horarios';
    pluralName: 'transparencia-sede-horarioses';
    singularName: 'transparencia-sede-horarios';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contacto: Schema.Attribute.Component<'transparencia-sede-horarios.contacto', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    horario: Schema.Attribute.Component<'transparencia-sede-horarios.horario', false>;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-sede-horarios.transparencia-sede-horarios'
    > &
      Schema.Attribute.Private;
    mapa: Schema.Attribute.Component<'transparencia-sede-horarios.mapa', false>;
    publishedAt: Schema.Attribute.DateTime;
    sede: Schema.Attribute.Component<'transparencia-sede-horarios.sede', false>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaSupervisionVigilanciaTransparenciaSupervisionVigilancia
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_supervision_vigilancia';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/supervision-vigilancia.json';
    displayName: '06. Transparencia / Supervision Vigilancia';
    pluralName: 'transparencia-supervision-vigilancias';
    singularName: 'transparencia-supervision-vigilancia';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    entidades: Schema.Attribute.Component<'transparencia-supervision-vigilancia.entidad', true>;
    icon: Schema.Attribute.String;
    intro: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-supervision-vigilancia.transparencia-supervision-vigilancia'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaTablasRetencionTransparenciaTablasRetencion
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_tablas_retencion';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/tablas-retencion.json';
    displayName: '06. Transparencia / Tablas Retencion';
    pluralName: 'transparencia-tablas-retencions';
    singularName: 'transparencia-tablas-retencion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-tablas-retencion.transparencia-tablas-retencion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    versiones: Schema.Attribute.Component<'transparencia-tablas-retencion.version', true>;
  };
}

export interface ApiTransparenciaTramitesTransparenciaTramites extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_tramites';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia/tramites.json';
    displayName: '06. Transparencia / Tramites';
    pluralName: 'transparencia-tramiteses';
    singularName: 'transparencia-tramites';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    costosUrl: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transparencia-tramites.transparencia-tramites'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    texto: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaTransparencia extends Struct.SingleTypeSchema {
  collectionName: 'transparencia';
  info: {
    description: 'Auto-generado desde src/content/pages/transparencia.json';
    displayName: '06. Transparencia / Inicio';
    pluralName: 'transparencias';
    singularName: 'transparencia';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    introTexto: Schema.Attribute.Text;
    ley1712Url: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::transparencia.transparencia'> &
      Schema.Attribute.Private;
    published: Schema.Attribute.Boolean;
    publishedAt: Schema.Attribute.DateTime;
    secciones: Schema.Attribute.Component<'transparencia.seccion', true>;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<'oneToMany', 'plugin::content-releases.release-action'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::content-releases.release'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<['ready', 'blocked', 'failed', 'done', 'empty']> &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<'manyToOne', 'plugin::content-releases.release'>;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::i18n.locale'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::review-workflows.workflow'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<'oneToMany', 'plugin::review-workflows.workflow-stage'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<'manyToOne', 'plugin::review-workflows.workflow'>;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    focalPoint: Schema.Attribute.JSON;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'> &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.Text;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    url: Schema.Attribute.Text & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer & Schema.Attribute.Required & Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.permission'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'plugin::users-permissions.role'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.permission'>;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.user'>;
  };
}

export interface PluginUsersPermissionsUser extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'plugin::users-permissions.user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<'manyToOne', 'plugin::users-permissions.role'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::agencia-direccionamiento-estrategico.agencia-direccionamiento-estrategico': ApiAgenciaDireccionamientoEstrategicoAgenciaDireccionamientoEstrategico;
      'api::agencia-direccionamiento-informes.agencia-direccionamiento-informes': ApiAgenciaDireccionamientoInformesAgenciaDireccionamientoInformes;
      'api::agencia-direccionamiento-planes.agencia-direccionamiento-planes': ApiAgenciaDireccionamientoPlanesAgenciaDireccionamientoPlanes;
      'api::agencia-direccionamiento-politicas.agencia-direccionamiento-politicas': ApiAgenciaDireccionamientoPoliticasAgenciaDireccionamientoPoliticas;
      'api::agencia-directorio.agencia-directorio': ApiAgenciaDirectorioAgenciaDirectorio;
      'api::agencia-empleo-rrhh-manual-especifico-funciones.agencia-empleo-rrhh-manual-especifico-funciones': ApiAgenciaEmpleoRrhhManualEspecificoFuncionesAgenciaEmpleoRrhhManualEspecificoFunciones;
      'api::agencia-empleo-rrhh-manual-identidad-visual.agencia-empleo-rrhh-manual-identidad-visual': ApiAgenciaEmpleoRrhhManualIdentidadVisualAgenciaEmpleoRrhhManualIdentidadVisual;
      'api::agencia-empleo-rrhh-manuales-internos.agencia-empleo-rrhh-manuales-internos': ApiAgenciaEmpleoRrhhManualesInternosAgenciaEmpleoRrhhManualesInternos;
      'api::agencia-empleo-rrhh-nombramientos.agencia-empleo-rrhh-nombramientos': ApiAgenciaEmpleoRrhhNombramientosAgenciaEmpleoRrhhNombramientos;
      'api::agencia-empleo-rrhh-ofertas-empleo.agencia-empleo-rrhh-ofertas-empleo': ApiAgenciaEmpleoRrhhOfertasEmpleoAgenciaEmpleoRrhhOfertasEmpleo;
      'api::agencia-equipo-directivo.agencia-equipo-directivo': ApiAgenciaEquipoDirectivoAgenciaEquipoDirectivo;
      'api::agencia-gestion-misional.agencia-gestion-misional': ApiAgenciaGestionMisionalAgenciaGestionMisional;
      'api::agencia-informacion-financiera.agencia-informacion-financiera': ApiAgenciaInformacionFinancieraAgenciaInformacionFinanciera;
      'api::agencia-landing.agencia-landing': ApiAgenciaLandingAgenciaLanding;
      'api::agencia-mision-vision.agencia-mision-vision': ApiAgenciaMisionVisionAgenciaMisionVision;
      'api::agencia-organigrama.agencia-organigrama': ApiAgenciaOrganigramaAgenciaOrganigrama;
      'api::agencia-plan-institucional-de-archivos.agencia-plan-institucional-de-archivos': ApiAgenciaPlanInstitucionalDeArchivosAgenciaPlanInstitucionalDeArchivos;
      'api::agencia-sistema-de-control-interno.agencia-sistema-de-control-interno': ApiAgenciaSistemaDeControlInternoAgenciaSistemaDeControlInterno;
      'api::agencia-sistema-integrado-de-gestion.agencia-sistema-integrado-de-gestion': ApiAgenciaSistemaIntegradoDeGestionAgenciaSistemaIntegradoDeGestion;
      'api::atencion-canales-de-atencion.atencion-canales-de-atencion': ApiAtencionCanalesDeAtencionAtencionCanalesDeAtencion;
      'api::atencion-correo-notificaciones-judiciales.atencion-correo-notificaciones-judiciales': ApiAtencionCorreoNotificacionesJudicialesAtencionCorreoNotificacionesJudiciales;
      'api::atencion-glosario.atencion-glosario': ApiAtencionGlosarioAtencionGlosario;
      'api::atencion-landing.atencion-landing': ApiAtencionLandingAtencionLanding;
      'api::atencion-notificaciones-por-aviso.atencion-notificaciones-por-aviso': ApiAtencionNotificacionesPorAvisoAtencionNotificacionesPorAviso;
      'api::atencion-pqrs-servidores.atencion-pqrs-servidores': ApiAtencionPqrsServidoresAtencionPqrsServidores;
      'api::atencion-pqrs.atencion-pqrs': ApiAtencionPqrsAtencionPqrs;
      'api::atencion-preguntas-frecuentes.atencion-preguntas-frecuentes': ApiAtencionPreguntasFrecuentesAtencionPreguntasFrecuentes;
      'api::atencion-vinculacion-a-terceros.atencion-vinculacion-a-terceros': ApiAtencionVinculacionATercerosAtencionVinculacionATerceros;
      'api::ciprep-speaker.ciprep-speaker': ApiCiprepSpeakerCiprepSpeaker;
      'api::ciprep.ciprep': ApiCiprepCiprep;
      'api::galeria.galeria': ApiGaleriaGaleria;
      'api::home.home': ApiHomeHome;
      'api::institucional-audios-itrc.institucional-audios-itrc': ApiInstitucionalAudiosItrcInstitucionalAudiosItrc;
      'api::institucional-calendario-eventos.institucional-calendario-eventos': ApiInstitucionalCalendarioEventosInstitucionalCalendarioEventos;
      'api::institucional-defensa-judicial.institucional-defensa-judicial': ApiInstitucionalDefensaJudicialInstitucionalDefensaJudicial;
      'api::institucional-estados.institucional-estados': ApiInstitucionalEstadosInstitucionalEstados;
      'api::institucional-estudios-investigaciones.institucional-estudios-investigaciones': ApiInstitucionalEstudiosInvestigacionesInstitucionalEstudiosInvestigaciones;
      'api::institucional-historico-investigaciones-disciplinarias.institucional-historico-investigaciones-disciplinarias': ApiInstitucionalHistoricoInvestigacionesDisciplinariasInstitucionalHistoricoInvestigacionesDisciplinarias;
      'api::institucional-historico-sistema-control-interno.institucional-historico-sistema-control-interno': ApiInstitucionalHistoricoSistemaControlInternoInstitucionalHistoricoSistemaControlInterno;
      'api::institucional-publicacion-datos-abiertos.institucional-publicacion-datos-abiertos': ApiInstitucionalPublicacionDatosAbiertosInstitucionalPublicacionDatosAbiertos;
      'api::mapa-del-sitio.mapa-del-sitio': ApiMapaDelSitioMapaDelSitio;
      'api::normativa-decretos.normativa-decretos': ApiNormativaDecretosNormativaDecretos;
      'api::normativa-delito.normativa-delito': ApiNormativaDelitoNormativaDelito;
      'api::normativa-landing.normativa-landing': ApiNormativaLandingNormativaLanding;
      'api::normativa-marco-legal.normativa-marco-legal': ApiNormativaMarcoLegalNormativaMarcoLegal;
      'api::normativa-resoluciones.normativa-resoluciones': ApiNormativaResolucionesNormativaResoluciones;
      'api::normativa-unificacion-suin-juriscol.normativa-unificacion-suin-juriscol': ApiNormativaUnificacionSuinJuriscolNormativaUnificacionSuinJuriscol;
      'api::normativa-vigencia.normativa-vigencia': ApiNormativaVigenciaNormativaVigencia;
      'api::normograma.normograma': ApiNormogramaNormograma;
      'api::observatorio-del-observatorio.observatorio-del-observatorio': ApiObservatorioDelObservatorioObservatorioDelObservatorio;
      'api::observatorio-eje-de-educacion-articulos.observatorio-eje-de-educacion-articulos': ApiObservatorioEjeDeEducacionArticulosObservatorioEjeDeEducacionArticulos;
      'api::observatorio-eje-de-educacion-cartilla-infantil.observatorio-eje-de-educacion-cartilla-infantil': ApiObservatorioEjeDeEducacionCartillaInfantilObservatorioEjeDeEducacionCartillaInfantil;
      'api::observatorio-eje-de-educacion-conociendo.observatorio-eje-de-educacion-conociendo': ApiObservatorioEjeDeEducacionConociendoObservatorioEjeDeEducacionConociendo;
      'api::observatorio-eje-de-educacion-cuento.observatorio-eje-de-educacion-cuento': ApiObservatorioEjeDeEducacionCuentoObservatorioEjeDeEducacionCuento;
      'api::observatorio-eje-de-educacion-glosario-ninos.observatorio-eje-de-educacion-glosario-ninos': ApiObservatorioEjeDeEducacionGlosarioNinosObservatorioEjeDeEducacionGlosarioNinos;
      'api::observatorio-eje-de-educacion-itrc-para-ninos.observatorio-eje-de-educacion-itrc-para-ninos': ApiObservatorioEjeDeEducacionItrcParaNinosObservatorioEjeDeEducacionItrcParaNinos;
      'api::observatorio-eje-de-educacion-juego-de-roles.observatorio-eje-de-educacion-juego-de-roles': ApiObservatorioEjeDeEducacionJuegoDeRolesObservatorioEjeDeEducacionJuegoDeRoles;
      'api::observatorio-eje-de-educacion-libro-infantil.observatorio-eje-de-educacion-libro-infantil': ApiObservatorioEjeDeEducacionLibroInfantilObservatorioEjeDeEducacionLibroInfantil;
      'api::observatorio-eje-de-educacion-memoria.observatorio-eje-de-educacion-memoria': ApiObservatorioEjeDeEducacionMemoriaObservatorioEjeDeEducacionMemoria;
      'api::observatorio-eje-de-educacion-memorias-info.observatorio-eje-de-educacion-memorias-info': ApiObservatorioEjeDeEducacionMemoriasInfoObservatorioEjeDeEducacionMemoriasInfo;
      'api::observatorio-eje-de-educacion-quiz.observatorio-eje-de-educacion-quiz': ApiObservatorioEjeDeEducacionQuizObservatorioEjeDeEducacionQuiz;
      'api::observatorio-eje-de-educacion-repositorio-juridico.observatorio-eje-de-educacion-repositorio-juridico': ApiObservatorioEjeDeEducacionRepositorioJuridicoObservatorioEjeDeEducacionRepositorioJuridico;
      'api::observatorio-eje-de-educacion-sopa-de-letras.observatorio-eje-de-educacion-sopa-de-letras': ApiObservatorioEjeDeEducacionSopaDeLetrasObservatorioEjeDeEducacionSopaDeLetras;
      'api::observatorio-eje-de-educacion-video-ninos.observatorio-eje-de-educacion-video-ninos': ApiObservatorioEjeDeEducacionVideoNinosObservatorioEjeDeEducacionVideoNinos;
      'api::observatorio-eje-de-educacion.observatorio-eje-de-educacion': ApiObservatorioEjeDeEducacionObservatorioEjeDeEducacion;
      'api::observatorio-eje-de-medicion.observatorio-eje-de-medicion': ApiObservatorioEjeDeMedicionObservatorioEjeDeMedicion;
      'api::observatorio-eje-de-participacion-cartillas.observatorio-eje-de-participacion-cartillas': ApiObservatorioEjeDeParticipacionCartillasObservatorioEjeDeParticipacionCartillas;
      'api::observatorio-eje-de-participacion-encuesta.observatorio-eje-de-participacion-encuesta': ApiObservatorioEjeDeParticipacionEncuestaObservatorioEjeDeParticipacionEncuesta;
      'api::observatorio-eje-de-participacion-memoria.observatorio-eje-de-participacion-memoria': ApiObservatorioEjeDeParticipacionMemoriaObservatorioEjeDeParticipacionMemoria;
      'api::observatorio-eje-de-participacion-memorias-info.observatorio-eje-de-participacion-memorias-info': ApiObservatorioEjeDeParticipacionMemoriasInfoObservatorioEjeDeParticipacionMemoriasInfo;
      'api::observatorio-eje-de-participacion-noticias.observatorio-eje-de-participacion-noticias': ApiObservatorioEjeDeParticipacionNoticiasObservatorioEjeDeParticipacionNoticias;
      'api::observatorio-eje-de-participacion-videos-tutoriales.observatorio-eje-de-participacion-videos-tutoriales': ApiObservatorioEjeDeParticipacionVideosTutorialesObservatorioEjeDeParticipacionVideosTutoriales;
      'api::observatorio-eje-de-participacion.observatorio-eje-de-participacion': ApiObservatorioEjeDeParticipacionObservatorioEjeDeParticipacion;
      'api::observatorio-observatorio.observatorio-observatorio': ApiObservatorioObservatorioObservatorioObservatorio;
      'api::participa-atencion-informe-comite-conciliacion.participa-atencion-informe-comite-conciliacion': ApiParticipaAtencionInformeComiteConciliacionParticipaAtencionInformeComiteConciliacion;
      'api::participa-atencion-otros-grupos-interes.participa-atencion-otros-grupos-interes': ApiParticipaAtencionOtrosGruposInteresParticipaAtencionOtrosGruposInteres;
      'api::participa-atencion-respuesta-anonimos.participa-atencion-respuesta-anonimos': ApiParticipaAtencionRespuestaAnonimosParticipaAtencionRespuestaAnonimos;
      'api::participa-colaboracion.participa-colaboracion': ApiParticipaColaboracionParticipaColaboracion;
      'api::participa-consulta-ciudadana.participa-consulta-ciudadana': ApiParticipaConsultaCiudadanaParticipaConsultaCiudadana;
      'api::participa-control-social.participa-control-social': ApiParticipaControlSocialParticipaControlSocial;
      'api::participa-diagnostico.participa-diagnostico': ApiParticipaDiagnosticoParticipaDiagnostico;
      'api::participa-planeacion.participa-planeacion': ApiParticipaPlaneacionParticipaPlaneacion;
      'api::participa-rendicion-de-cuentas.participa-rendicion-de-cuentas': ApiParticipaRendicionDeCuentasParticipaRendicionDeCuentas;
      'api::participa.participa': ApiParticipaParticipa;
      'api::prensa-capsulas.prensa-capsulas': ApiPrensaCapsulasPrensaCapsulas;
      'api::prensa-comunicados-institucionales.prensa-comunicados-institucionales': ApiPrensaComunicadosInstitucionalesPrensaComunicadosInstitucionales;
      'api::prensa-galeria.prensa-galeria': ApiPrensaGaleriaPrensaGaleria;
      'api::prensa-landing.prensa-landing': ApiPrensaLandingPrensaLanding;
      'api::prensa-videos.prensa-videos': ApiPrensaVideosPrensaVideos;
      'api::prensa.prensa': ApiPrensaPrensa;
      'api::transparencia-accesibilidad.transparencia-accesibilidad': ApiTransparenciaAccesibilidadTransparenciaAccesibilidad;
      'api::transparencia-agremiaciones.transparencia-agremiaciones': ApiTransparenciaAgremiacionesTransparenciaAgremiaciones;
      'api::transparencia-comite-conciliacion.transparencia-comite-conciliacion': ApiTransparenciaComiteConciliacionTransparenciaComiteConciliacion;
      'api::transparencia-contratacion-contratacion-suscrita.transparencia-contratacion-contratacion-suscrita': ApiTransparenciaContratacionContratacionSuscritaTransparenciaContratacionContratacionSuscrita;
      'api::transparencia-contratacion-ejecucion-contratos.transparencia-contratacion-ejecucion-contratos': ApiTransparenciaContratacionEjecucionContratosTransparenciaContratacionEjecucionContratos;
      'api::transparencia-contratacion-ejecucion.transparencia-contratacion-ejecucion': ApiTransparenciaContratacionEjecucionTransparenciaContratacionEjecucion;
      'api::transparencia-contratacion-formatos.transparencia-contratacion-formatos': ApiTransparenciaContratacionFormatosTransparenciaContratacionFormatos;
      'api::transparencia-contratacion-manual.transparencia-contratacion-manual': ApiTransparenciaContratacionManualTransparenciaContratacionManual;
      'api::transparencia-contratacion-plan-adquisiciones.transparencia-contratacion-plan-adquisiciones': ApiTransparenciaContratacionPlanAdquisicionesTransparenciaContratacionPlanAdquisiciones;
      'api::transparencia-contratacion-procedimientos-adquisicion.transparencia-contratacion-procedimientos-adquisicion': ApiTransparenciaContratacionProcedimientosAdquisicionTransparenciaContratacionProcedimientosAdquisicion;
      'api::transparencia-datos-abiertos.transparencia-datos-abiertos': ApiTransparenciaDatosAbiertosTransparenciaDatosAbiertos;
      'api::transparencia-decreto-unico.transparencia-decreto-unico': ApiTransparenciaDecretoUnicoTransparenciaDecretoUnico;
      'api::transparencia-decretos-estructura.transparencia-decretos-estructura': ApiTransparenciaDecretosEstructuraTransparenciaDecretosEstructura;
      'api::transparencia-defensa-publica.transparencia-defensa-publica': ApiTransparenciaDefensaPublicaTransparenciaDefensaPublica;
      'api::transparencia-directorio-entidades.transparencia-directorio-entidades': ApiTransparenciaDirectorioEntidadesTransparenciaDirectorioEntidades;
      'api::transparencia-documentacion-esquema-publicacion.transparencia-documentacion-esquema-publicacion': ApiTransparenciaDocumentacionEsquemaPublicacionTransparenciaDocumentacionEsquemaPublicacion;
      'api::transparencia-documentacion-formato-grupos-etnicos.transparencia-documentacion-formato-grupos-etnicos': ApiTransparenciaDocumentacionFormatoGruposEtnicosTransparenciaDocumentacionFormatoGruposEtnicos;
      'api::transparencia-documentacion-proteccion-datos.transparencia-documentacion-proteccion-datos': ApiTransparenciaDocumentacionProteccionDatosTransparenciaDocumentacionProteccionDatos;
      'api::transparencia-documentacion-registro-publicaciones.transparencia-documentacion-registro-publicaciones': ApiTransparenciaDocumentacionRegistroPublicacionesTransparenciaDocumentacionRegistroPublicaciones;
      'api::transparencia-esquema-publicacion.transparencia-esquema-publicacion': ApiTransparenciaEsquemaPublicacionTransparenciaEsquemaPublicacion;
      'api::transparencia-evaluacion-independiente.transparencia-evaluacion-independiente': ApiTransparenciaEvaluacionIndependienteTransparenciaEvaluacionIndependiente;
      'api::transparencia-formatos-contratos-pliegos-tipo.transparencia-formatos-contratos-pliegos-tipo': ApiTransparenciaFormatosContratosPliegosTipoTransparenciaFormatosContratosPliegosTipo;
      'api::transparencia-formatos-formularios.transparencia-formatos-formularios': ApiTransparenciaFormatosFormulariosTransparenciaFormatosFormularios;
      'api::transparencia-hojas-de-vida.transparencia-hojas-de-vida': ApiTransparenciaHojasDeVidaTransparenciaHojasDeVida;
      'api::transparencia-indice-informacion-clasificada.transparencia-indice-informacion-clasificada': ApiTransparenciaIndiceInformacionClasificadaTransparenciaIndiceInformacionClasificada;
      'api::transparencia-informacion-mujeres.transparencia-informacion-mujeres': ApiTransparenciaInformacionMujeresTransparenciaInformacionMujeres;
      'api::transparencia-informe.transparencia-informe': ApiTransparenciaInformeTransparenciaInforme;
      'api::transparencia-informes-empalme.transparencia-informes-empalme': ApiTransparenciaInformesEmpalmeTransparenciaInformesEmpalme;
      'api::transparencia-informes-legales.transparencia-informes-legales': ApiTransparenciaInformesLegalesTransparenciaInformesLegales;
      'api::transparencia-informes-organismos-ivc.transparencia-informes-organismos-ivc': ApiTransparenciaInformesOrganismosIvcTransparenciaInformesOrganismosIvc;
      'api::transparencia-informes-organismos.transparencia-informes-organismos': ApiTransparenciaInformesOrganismosTransparenciaInformesOrganismos;
      'api::transparencia-leyes.transparencia-leyes': ApiTransparenciaLeyesTransparenciaLeyes;
      'api::transparencia-normas-servicio.transparencia-normas-servicio': ApiTransparenciaNormasServicioTransparenciaNormasServicio;
      'api::transparencia-normatividad-especial.transparencia-normatividad-especial': ApiTransparenciaNormatividadEspecialTransparenciaNormatividadEspecial;
      'api::transparencia-otros-grupos.transparencia-otros-grupos': ApiTransparenciaOtrosGruposTransparenciaOtrosGrupos;
      'api::transparencia-planes-mejoramiento.transparencia-planes-mejoramiento': ApiTransparenciaPlanesMejoramientoTransparenciaPlanesMejoramiento;
      'api::transparencia-politicas-manuales.transparencia-politicas-manuales': ApiTransparenciaPoliticasManualesTransparenciaPoliticasManuales;
      'api::transparencia-procedimientos-decisiones.transparencia-procedimientos-decisiones': ApiTransparenciaProcedimientosDecisionesTransparenciaProcedimientosDecisiones;
      'api::transparencia-procedimientos.transparencia-procedimientos': ApiTransparenciaProcedimientosTransparenciaProcedimientos;
      'api::transparencia-programa-gestion-documental.transparencia-programa-gestion-documental': ApiTransparenciaProgramaGestionDocumentalTransparenciaProgramaGestionDocumental;
      'api::transparencia-protocolo-atencion.transparencia-protocolo-atencion': ApiTransparenciaProtocoloAtencionTransparenciaProtocoloAtencion;
      'api::transparencia-proyectos-inversion.transparencia-proyectos-inversion': ApiTransparenciaProyectosInversionTransparenciaProyectosInversion;
      'api::transparencia-proyectos-normas-comentarios.transparencia-proyectos-normas-comentarios': ApiTransparenciaProyectosNormasComentariosTransparenciaProyectosNormasComentarios;
      'api::transparencia-registro-activos.transparencia-registro-activos': ApiTransparenciaRegistroActivosTransparenciaRegistroActivos;
      'api::transparencia-relatoria.transparencia-relatoria': ApiTransparenciaRelatoriaTransparenciaRelatoria;
      'api::transparencia-rendicion-cuenta-contraloria.transparencia-rendicion-cuenta-contraloria': ApiTransparenciaRendicionCuentaContraloriaTransparenciaRendicionCuentaContraloria;
      'api::transparencia-reporte-austeridad-gasto.transparencia-reporte-austeridad-gasto': ApiTransparenciaReporteAusteridadGastoTransparenciaReporteAusteridadGasto;
      'api::transparencia-sede-horarios.transparencia-sede-horarios': ApiTransparenciaSedeHorariosTransparenciaSedeHorarios;
      'api::transparencia-supervision-vigilancia.transparencia-supervision-vigilancia': ApiTransparenciaSupervisionVigilanciaTransparenciaSupervisionVigilancia;
      'api::transparencia-tablas-retencion.transparencia-tablas-retencion': ApiTransparenciaTablasRetencionTransparenciaTablasRetencion;
      'api::transparencia-tramites.transparencia-tramites': ApiTransparenciaTramitesTransparenciaTramites;
      'api::transparencia.transparencia': ApiTransparenciaTransparencia;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
