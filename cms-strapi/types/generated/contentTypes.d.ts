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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Direccionamiento Estrat\u00E9gico. Publicada en: /agencia/direccionamiento-estrategico. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Direccionamiento Estrat\u00E9gico';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Direccionamiento Informes. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Direccionamiento Informes';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Direccionamiento Planes. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Direccionamiento Planes';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Direccionamiento Pol\u00EDticas. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Direccionamiento Pol\u00EDticas';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Directorio. Publicada en: /agencia/directorio. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Directorio';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Empleo RRHH Manual Espec\u00EDfico Funciones. Publicada en: /manual-especifico-de-funciones-y-de-competencias-laborales. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Empleo RRHH Manual Espec\u00EDfico Funciones';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Empleo RRHH Manual Identidad Visual. Publicada en: /manual-de-identidad-visual-itrc. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Empleo RRHH Manual Identidad Visual';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Empleo RRHH Manuales Internos. Publicada en: /manuales-internos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Empleo RRHH Manuales Internos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Empleo RRHH Nombramientos. Publicada en: /nombramientos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Empleo RRHH Nombramientos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Empleo RRHH Ofertas Empleo. Publicada en: /ofertas-de-empleo. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Empleo RRHH Ofertas Empleo';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Equipo Directivo. Publicada en: /agencia/equipo-directivo. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Equipo Directivo';
    mainField: 'title';
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

export interface ApiAgenciaEscalaSalarialAgenciaEscalaSalarial extends Struct.SingleTypeSchema {
  collectionName: 'agencia_escala_salarial';
  info: {
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Escala Salarial. Publicada en: /escala-salarial. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Escala Salarial';
    mainField: 'title';
    pluralName: 'agencia-escala-salarials';
    singularName: 'agencia-escala-salarial';
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
      'api::agencia-escala-salarial.agencia-escala-salarial'
    > &
      Schema.Attribute.Private;
    pdfNombre: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAgenciaGestionMisionalAgenciaGestionMisional extends Struct.SingleTypeSchema {
  collectionName: 'agencia_gestion_misional';
  info: {
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Gesti\u00F3n Misional. Publicada en: /agencia/gestion-misional. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Gesti\u00F3n Misional';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Informaci\u00F3n Financiera. Publicada en: /agencia/informacion-financiera. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Informaci\u00F3n Financiera';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Landing. Publicada en: /agencia. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Landing';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Mision Vision. Publicada en: /agencia/mision-vision. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Mision Vision';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Organigrama. Publicada en: /agencia/organigrama. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Organigrama';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Plan Institucional de Archivos. Publicada en: /agencia/plan-institucional-de-archivos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Plan Institucional de Archivos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Sistema de Control Interno. Publicada en: /agencia/control-interno. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Sistema de Control Interno';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Agencia": Sistema Integrado de Gesti\u00F3n. Publicada en: /agencia/sistema-integrado-de-gestion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '02. Agencia / Sistema Integrado de Gesti\u00F3n';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": Canales de Atenci\u00F3n. Publicada en: /canales-de-atencion-al-ciudadano. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / Canales de Atenci\u00F3n';
    mainField: 'title';
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

export interface ApiAtencionCartaTratoDignoAtencionCartaTratoDigno extends Struct.SingleTypeSchema {
  collectionName: 'atencion_carta_trato_digno';
  info: {
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": Carta Trato Digno. Publicada en: /carta-trato-digno. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / Carta Trato Digno';
    mainField: 'title';
    pluralName: 'atencion-carta-trato-dignos';
    singularName: 'atencion-carta-trato-digno';
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
      'api::atencion-carta-trato-digno.atencion-carta-trato-digno'
    > &
      Schema.Attribute.Private;
    pdfNombre: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionCartillaAlCiudadanoAtencionCartillaAlCiudadano
  extends Struct.SingleTypeSchema {
  collectionName: 'atencion_cartilla_al_ciudadano';
  info: {
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": Cartilla Al Ciudadano. Publicada en: /cartilla-al-ciudadano. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / Cartilla Al Ciudadano';
    mainField: 'title';
    pluralName: 'atencion-cartilla-al-ciudadanos';
    singularName: 'atencion-cartilla-al-ciudadano';
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
      'api::atencion-cartilla-al-ciudadano.atencion-cartilla-al-ciudadano'
    > &
      Schema.Attribute.Private;
    pdfNombre: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiAtencionCorreoNotificacionesJudicialesAtencionCorreoNotificacionesJudiciales
  extends Struct.SingleTypeSchema {
  collectionName: 'atencion_correo_notificaciones_judiciales';
  info: {
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": Correo Notificaciones Judiciales. Publicada en: /correo-electronico-para-notificaciones-judiciales. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / Correo Notificaciones Judiciales';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": Glosario. Publicada en: /glosario. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / Glosario';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": Landing. Publicada en: /atencion-y-servicios. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / Landing';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": Notificaciones Por Aviso. Publicada en: /notificaciones-por-aviso. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / Notificaciones Por Aviso';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": PQRS Servidores. Publicada en: /p-q-r-s-servidores-agencia-itrc. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / PQRS Servidores';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": PQRS. Publicada en: /tu-p-q-r-s-al-dia. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / PQRS';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": Preguntas Frecuentes. Publicada en: /preguntas-frecuentes. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / Preguntas Frecuentes';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Atenci\u00F3n y Servicios": Vinculaci\u00F3n a Terceros. Publicada en: /vinculacion-a-terceros-cancelacion-de-registro-publico. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '04. Atenci\u00F3n y Servicios / Vinculaci\u00F3n a Terceros';
    mainField: 'title';
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
    description: 'Colecci\u00F3n de entradas del dominio "Prensa": Congreso CIPREP / Speakers. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '08. Prensa / Congreso CIPREP / Speakers';
    mainField: 'name';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Prensa": Congreso CIPREP. Publicada en: /ciprep2025. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '08. Prensa / Congreso CIPREP';
    mainField: 'title';
    pluralName: 'cipreps';
    singularName: 'ciprep';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    agenda: Schema.Attribute.Component<'ciprep.agenda', false>;
    agendaLead: Schema.Attribute.Text;
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
    speakersLead: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    wazeUrl: Schema.Attribute.String;
    youtubeId: Schema.Attribute.String;
  };
}

export interface ApiEventoEvento extends Struct.CollectionTypeSchema {
  collectionName: 'eventos';
  info: {
    description: 'Calendario de eventos institucionales de la Agencia ITRC.';
    displayName: '08. Prensa / Eventos';
    mainField: 'title';
    pluralName: 'eventos';
    singularName: 'evento';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    archived: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    endDate: Schema.Attribute.DateTime;
    image: Schema.Attribute.String;
    inscriptionLink: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::evento.evento'> &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    published: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    publishedAt: Schema.Attribute.DateTime;
    startDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    virtualLink: Schema.Attribute.String;
  };
}

export interface ApiGaleriaGaleria extends Struct.CollectionTypeSchema {
  collectionName: 'galeria_items';
  info: {
    description: 'Colecci\u00F3n de entradas del dominio "Prensa": Galer\u00EDa. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '08. Prensa / Galer\u00EDa';
    mainField: 'titulo';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Inicio": Home. Publicada en: /. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '01. Inicio / Home';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Institucional": Audios ITRC. Publicada en: /audiositrc. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '09. Institucional / Audios ITRC';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Institucional": Calendario Eventos. Publicada en: /calendario-de-eventos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '09. Institucional / Calendario Eventos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Institucional": Defensa Judicial. Publicada en: /defensa-judicial. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '09. Institucional / Defensa Judicial';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Institucional": Estados. Publicada en: /estados. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '09. Institucional / Estados';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Institucional": Estudios Investigaciones. Publicada en: /estudios-investigaciones-y-otras-publicaciones. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '09. Institucional / Estudios Investigaciones';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Institucional": Hist\u00F3rico Investigaciones Disciplinarias. Publicada en: /historico-subdireccion-investigaciones-disciplinarias. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '09. Institucional / Hist\u00F3rico Investigaciones Disciplinarias';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Institucional": Hist\u00F3rico Sistema Control Interno. Publicada en: /historico-sistema-de-control-interno. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '09. Institucional / Hist\u00F3rico Sistema Control Interno';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Institucional": Publicaci\u00F3n Datos Abiertos. Publicada en: /publicacion-de-datos-abiertos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '09. Institucional / Publicaci\u00F3n Datos Abiertos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Sistema": Mapa del sitio. Publicada en: /mapa-del-sitio. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '99. Sistema / Mapa del sitio';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Normativa": Decretos. Publicada en: /decretos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '03. Normativa / Decretos';
    mainField: 'title';
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
    description: 'Colecci\u00F3n de entradas del dominio "Normativa": Delitos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '03. Normativa / Delitos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Normativa": Landing. Publicada en: /normativa. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '03. Normativa / Landing';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Normativa": Marco Legal. Publicada en: /marco-legal. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '03. Normativa / Marco Legal';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Normativa": Resoluciones. Publicada en: /documentos-de-interes/resoluciones-circulares-y-otros-actos-administrativos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '03. Normativa / Resoluciones';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Normativa": Unificaci\u00F3n SUIN Juriscol. Publicada en: /transparencia-y-acceso-a-la-informacion-publica/unificacion-normativa-suin-juriscol. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '03. Normativa / Unificaci\u00F3n SUIN Juriscol';
    mainField: 'title';
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
    description: 'Colecci\u00F3n de entradas del dominio "Normativa": Vigencias. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '03. Normativa / Vigencias';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Normativa": Normograma. Publicada en: /normativa-aplicada. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
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

export interface ApiNotificacionNotificacion extends Struct.CollectionTypeSchema {
  collectionName: 'notificaciones';
  info: {
    description: 'Notificaciones por edicto, estados y traslados publicados por la Agencia ITRC.';
    displayName: '04. Atenci\u00F3n y Servicios / Notificaciones y Traslados';
    pluralName: 'notificaciones';
    singularName: 'notificacion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    categoria: Schema.Attribute.Enumeration<['edicto', 'estado', 'traslado']> &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    dependencia: Schema.Attribute.String;
    desde: Schema.Attribute.String;
    expediente: Schema.Attribute.String & Schema.Attribute.Required;
    fechaAuto: Schema.Attribute.String;
    hasta: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::notificacion.notificacion'> &
      Schema.Attribute.Private;
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
    publishedAt: Schema.Attribute.DateTime;
    tipoAuto: Schema.Attribute.String;
    tipoNotificacion: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    vigencia: Schema.Attribute.Integer;
  };
}

export interface ApiObservatorioDelObservatorioObservatorioDelObservatorio
  extends Struct.SingleTypeSchema {
  collectionName: 'observatorio_del_observatorio';
  info: {
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Del Observatorio. Publicada en: /observatorio/del-observatorio. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Del Observatorio';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Art\u00EDculos. Publicada en: /observatorio/eje-de-educacion/articulos-y-publicaciones. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Art\u00EDculos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Cartilla Infantil. Publicada en: /observatorio/eje-de-educacion/itrc-para-ninos/cartilla-infantil. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Cartilla Infantil';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Conociendo. Publicada en: /observatorio/eje-de-educacion/conociendo-mas-del-itrc. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Conociendo';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Cuento. Publicada en: /observatorio/eje-de-educacion/itrc-para-ninos/cuento. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Cuento';
    mainField: 'title';
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
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Glosario Ni\u00F1os. Publicada en: /observatorio/eje-de-educacion/itrc-para-ninos/glosario-ninos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Glosario Ni\u00F1os';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n ITRC Para Ni\u00F1os. Publicada en: /observatorio/eje-de-educacion/itrc-para-ninos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n ITRC Para Ni\u00F1os';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Juego de Roles. Publicada en: /observatorio/eje-de-educacion/juego-de-roles. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Juego de Roles';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Libro Infantil. Publicada en: /observatorio/eje-de-educacion/itrc-para-ninos/libro-infantil. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Libro Infantil';
    mainField: 'title';
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
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
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
    description: 'Colecci\u00F3n de entradas del dominio "Observatorio ITRC": Eje de Educaci\u00F3n / Memorias. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n / Memorias';
    mainField: 'titulo';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Memorias Info. Publicada en: /observatorio/eje-de-educacion/memorias. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Memorias Info';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Quiz. Publicada en: /observatorio/eje-de-educacion/juego-de-roles/quiz. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Quiz';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Repositorio Jur\u00EDdico. Publicada en: /observatorio/eje-de-educacion/repositorio-juridico. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Repositorio Jur\u00EDdico';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Sopa de Letras. Publicada en: /observatorio/eje-de-educacion/juego-de-roles/sopa-de-letras. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Sopa de Letras';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n Video Ni\u00F1os. Publicada en: /observatorio/eje-de-educacion/itrc-para-ninos/video-ninos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n Video Ni\u00F1os';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Educaci\u00F3n. Publicada en: /observatorio/eje-de-educacion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Educaci\u00F3n';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Medici\u00F3n. Publicada en: /observatorio/eje-de-medicion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Medici\u00F3n';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Participaci\u00F3n Cartillas. Publicada en: /observatorio/eje-de-participacion/cartillas-divulgativas. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Participaci\u00F3n Cartillas';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Participaci\u00F3n Encuesta. Publicada en: /observatorio/eje-de-participacion/encuesta-ciudadana. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Participaci\u00F3n Encuesta';
    mainField: 'title';
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
    description: 'Colecci\u00F3n de entradas del dominio "Observatorio ITRC": Eje de Participaci\u00F3n / Memorias. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Participaci\u00F3n / Memorias';
    mainField: 'titulo';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Participaci\u00F3n Memorias Info. Publicada en: /observatorio/eje-de-participacion/memorias. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Participaci\u00F3n Memorias Info';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Participaci\u00F3n Noticias. Publicada en: /observatorio/eje-de-participacion/noticias. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Participaci\u00F3n Noticias';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Participaci\u00F3n Videos Tutoriales. Publicada en: /observatorio/eje-de-participacion/videos-tutoriales. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Participaci\u00F3n Videos Tutoriales';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Eje de Participaci\u00F3n. Publicada en: /observatorio/eje-de-participacion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Eje de Participaci\u00F3n';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Observatorio ITRC": Observatorio. Publicada en: /observatorio. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '07. Observatorio ITRC / Observatorio';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Atenci\u00F3n Informe Comit\u00E9 Conciliaci\u00F3n. Publicada en: /informe-de-gestion-del-comite-de-conciliacion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Atenci\u00F3n Informe Comit\u00E9 Conciliaci\u00F3n';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Atenci\u00F3n Otros Grupos Inter\u00E9s. Publicada en: /otros-de-grupos-de-interes. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Atenci\u00F3n Otros Grupos Inter\u00E9s';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Atenci\u00F3n Respuesta An\u00F3nimos. Publicada en: /respuesta-anonimos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Atenci\u00F3n Respuesta An\u00F3nimos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Colaboracion. Publicada en: /participa/colaboracion-e-innovacion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Colaboracion';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Consulta Ciudadana. Publicada en: /participa/consulta-ciudadana. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Consulta Ciudadana';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Control Social. Publicada en: /participa/control-social. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Control Social';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Diagnostico. Publicada en: /participa/diagnostico-e-identificacion-de-problemas. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Diagnostico';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Planeacion. Publicada en: /participa/planeacion-y-presupuesto-participativo. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Planeacion';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Rendici\u00F3n de Cuentas. Publicada en: /participa/rendicion-de-cuentas. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Rendici\u00F3n de Cuentas';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Participa": Inicio. Publicada en: /participa. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '05. Participa / Inicio';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Prensa": Capsulas. Publicada en: /capsulas-informativas. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '08. Prensa / Capsulas';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Prensa": Comunicados Institucionales. Publicada en: /prensa/noticias. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '08. Prensa / Comunicados Institucionales';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Prensa": Galer\u00EDa. Publicada en: /galeria. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '08. Prensa / Galer\u00EDa';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Prensa": Landing. Publicada en: /prensa. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '08. Prensa / Landing';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Prensa": Videos. Publicada en: /videos-itrc. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '08. Prensa / Videos';
    mainField: 'title';
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

export interface ApiSliderSlider extends Struct.SingleTypeSchema {
  collectionName: 'sliders';
  info: {
    description: 'Carrusel de banners de la p\u00E1gina de inicio. Migrado desde src/content/sliders/home.json.';
    displayName: '01. Inicio / Slider Principal';
    mainField: 'name';
    pluralName: 'sliders';
    singularName: 'slider';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    interval: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<6000>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::slider.slider'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Slider Principal'>;
    publishedAt: Schema.Attribute.DateTime;
    slides: Schema.Attribute.Component<'slider.slide', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> & Schema.Attribute.Private;
  };
}

export interface ApiTransparenciaAccesibilidadTransparenciaAccesibilidad
  extends Struct.SingleTypeSchema {
  collectionName: 'transparencia_accesibilidad';
  info: {
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Accesibilidad. Publicada en: /accesibilidad. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Accesibilidad';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Agremiaciones. Publicada en: /directorio-de-agremiaciones. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Agremiaciones';
    mainField: 'title';
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
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Comit\u00E9 Conciliaci\u00F3n. Publicada en: /informe-comite-conciliacion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Comit\u00E9 Conciliaci\u00F3n';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Contrataci\u00F3n Contrataci\u00F3n Suscrita. Publicada en: /contratacion-suscrita. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Contrataci\u00F3n Contrataci\u00F3n Suscrita';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Contrataci\u00F3n Ejecuci\u00F3n Contratos. Publicada en: /publicacion-de-la-ejecucion-de-contratos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Contrataci\u00F3n Ejecuci\u00F3n Contratos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Contrataci\u00F3n Ejecuci\u00F3n. Publicada en: /publicacion-ejecucion-contratos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Contrataci\u00F3n Ejecuci\u00F3n';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Contrataci\u00F3n Formatos. Publicada en: /formatos-contratos-pliego-tipo. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Contrataci\u00F3n Formatos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Contrataci\u00F3n Manual. Publicada en: /manual-contratacion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Contrataci\u00F3n Manual';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Contrataci\u00F3n Plan Adquisiciones. Publicada en: /plan-de-adquisiciones. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Contrataci\u00F3n Plan Adquisiciones';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Contrataci\u00F3n Procedimientos Adquisici\u00F3n. Publicada en: /publicacion-de-procedimientos-lineamientos-y-politicas-en-materia-de-adquisicion-y-compras. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Contrataci\u00F3n Procedimientos Adquisici\u00F3n';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Datos Abiertos. Publicada en: /publicacion-datos-abiertos. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Datos Abiertos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Decreto Unico. Publicada en: /decreto-unico-reglamentario. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Decreto Unico';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Decretos Estructura. Publicada en: /decretos-de-estructura-salarios-leyes-marco-y-otros. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Decretos Estructura';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Defensa P\u00FAblica. Publicada en: /informe-defensa-publica. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Defensa P\u00FAblica';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Directorio Entidades. Publicada en: /directorio-de-entidades. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Directorio Entidades';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Documentaci\u00F3n Esquema Publicaci\u00F3n. Publicada en: /esquema-de-publicacion-de-la-informacion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Documentaci\u00F3n Esquema Publicaci\u00F3n';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Documentaci\u00F3n Formato Grupos \u00C9tnicos. Publicada en: /formato-alternativo-para-grupos-etnicos-y-culturales. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Documentaci\u00F3n Formato Grupos \u00C9tnicos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Documentaci\u00F3n Protecci\u00F3n Datos. Publicada en: /proteccion-de-datos-personales. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Documentaci\u00F3n Protecci\u00F3n Datos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Documentaci\u00F3n Registro Publicaciones. Publicada en: /registro-de-publicaciones. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Documentaci\u00F3n Registro Publicaciones';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Esquema Publicaci\u00F3n. Publicada en: /esquema-publicacion-informacion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Esquema Publicaci\u00F3n';
    mainField: 'title';
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
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Evaluaci\u00F3n Independiente. Publicada en: /evaluacion-independiente-control-interno. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Evaluaci\u00F3n Independiente';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Formatos Contratos Pliegos Tipo. Publicada en: /formatos-o-modelos-de-contratos-o-pliego-tipo. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Formatos Contratos Pliegos Tipo';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Formatos Formularios. Publicada en: /formatos-y-formularios. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Formatos Formularios';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Hojas de Vida. Publicada en: /publicacion-hojas-de-vida. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Hojas de Vida';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": \u00CDndice Informaci\u00F3n Clasificada. Publicada en: /indice-de-informacion-clasificada-y-reservada. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / \u00CDndice Informaci\u00F3n Clasificada';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Informaci\u00F3n Mujeres. Publicada en: /informacion-para-mujeres. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Informaci\u00F3n Mujeres';
    mainField: 'title';
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
    description: 'Colecci\u00F3n de entradas del dominio "Transparencia": Informes. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Informes';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Informes Empalme. Publicada en: /informes-de-empalme. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Informes Empalme';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Informes Legales. Publicada en: /informes-legales. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Informes Legales';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Informes Organismos IVC. Publicada en: /informes-a-organismos-de-inspeccion-vigilancia-y-control. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Informes Organismos IVC';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Informes Organismos. Publicada en: /informes-organismos-inspeccion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Informes Organismos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Leyes. Publicada en: /leyes. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Leyes';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Normas Servicio. Publicada en: /normas-servicio-publico. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Normas Servicio';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Normatividad Especial. Publicada en: /normatividad-especial. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Normatividad Especial';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Otros Grupos. Publicada en: /otros-grupos-de-interes. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Otros Grupos';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Planes Mejoramiento. Publicada en: /planes-de-mejoramiento. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Planes Mejoramiento';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Pol\u00EDticas Manuales. Publicada en: /politicas-lineamientos-y-manuales. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Pol\u00EDticas Manuales';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Procedimientos Decisiones. Publicada en: /procedimientos-que-se-siguen-para-tomar-decisiones-en-las-diferentes-areas. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Procedimientos Decisiones';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Procedimientos. Publicada en: /procedimientos-decisiones. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Procedimientos';
    mainField: 'title';
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
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Programa Gesti\u00F3n Documental. Publicada en: /programa-gestion-documental. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Programa Gesti\u00F3n Documental';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Protocolo Atenci\u00F3n. Publicada en: /protocolo-de-atencion-al-ciudadano. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Protocolo Atenci\u00F3n';
    mainField: 'title';
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
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Proyectos Inversion. Publicada en: /programas-y-proyectos-en-ejecucion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Proyectos Inversion';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Proyectos Normas Comentarios. Publicada en: /proyectos-de-normas-para-comentarios. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Proyectos Normas Comentarios';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Registro Activos. Publicada en: /registro-activos-informacion. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Registro Activos';
    mainField: 'title';
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
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Relatoria. Publicada en: /relatoria. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Relatoria';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Rendici\u00F3n Cuenta Contralor\u00EDa. Publicada en: /informe-rendicion-cuenta-contraloria. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Rendici\u00F3n Cuenta Contralor\u00EDa';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Reporte Austeridad Gasto. Publicada en: /reporte-austeridad-en-el-gasto. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Reporte Austeridad Gasto';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Sede Horarios. Publicada en: /sede-y-horarios. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Sede Horarios';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Supervisi\u00F3n Vigilancia. Publicada en: /supervision-y-vigilancia. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Supervisi\u00F3n Vigilancia';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Tablas Retencion. Publicada en: /tablas-retencion-documental. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Tablas Retencion';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Tr\u00E1mites. Publicada en: /tramites. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Tr\u00E1mites';
    mainField: 'title';
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
    description: 'P\u00E1gina \u00FAnica del dominio "Transparencia": Inicio. Publicada en: /transparencia. Edite estos campos para actualizar el contenido que ven los visitantes del sitio.';
    displayName: '06. Transparencia / Inicio';
    mainField: 'title';
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
      'api::agencia-escala-salarial.agencia-escala-salarial': ApiAgenciaEscalaSalarialAgenciaEscalaSalarial;
      'api::agencia-gestion-misional.agencia-gestion-misional': ApiAgenciaGestionMisionalAgenciaGestionMisional;
      'api::agencia-informacion-financiera.agencia-informacion-financiera': ApiAgenciaInformacionFinancieraAgenciaInformacionFinanciera;
      'api::agencia-landing.agencia-landing': ApiAgenciaLandingAgenciaLanding;
      'api::agencia-mision-vision.agencia-mision-vision': ApiAgenciaMisionVisionAgenciaMisionVision;
      'api::agencia-organigrama.agencia-organigrama': ApiAgenciaOrganigramaAgenciaOrganigrama;
      'api::agencia-plan-institucional-de-archivos.agencia-plan-institucional-de-archivos': ApiAgenciaPlanInstitucionalDeArchivosAgenciaPlanInstitucionalDeArchivos;
      'api::agencia-sistema-de-control-interno.agencia-sistema-de-control-interno': ApiAgenciaSistemaDeControlInternoAgenciaSistemaDeControlInterno;
      'api::agencia-sistema-integrado-de-gestion.agencia-sistema-integrado-de-gestion': ApiAgenciaSistemaIntegradoDeGestionAgenciaSistemaIntegradoDeGestion;
      'api::atencion-canales-de-atencion.atencion-canales-de-atencion': ApiAtencionCanalesDeAtencionAtencionCanalesDeAtencion;
      'api::atencion-carta-trato-digno.atencion-carta-trato-digno': ApiAtencionCartaTratoDignoAtencionCartaTratoDigno;
      'api::atencion-cartilla-al-ciudadano.atencion-cartilla-al-ciudadano': ApiAtencionCartillaAlCiudadanoAtencionCartillaAlCiudadano;
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
      'api::evento.evento': ApiEventoEvento;
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
      'api::notificacion.notificacion': ApiNotificacionNotificacion;
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
      'api::slider.slider': ApiSliderSlider;
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
