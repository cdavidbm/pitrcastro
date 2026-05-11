import type { Schema, Struct } from '@strapi/strapi';

export interface AgenciaDireccionamientoEstrategicoMarconormativo extends Struct.ComponentSchema {
  collectionName: 'components_agencia_direccionamiento_estrategico_marconormativos';
  info: {
    displayName: 'Marconormativo';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    normas: Schema.Attribute.Component<'agencia-direccionamiento-estrategico.norma', true>;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaDireccionamientoEstrategicoNorma extends Struct.ComponentSchema {
  collectionName: 'components_agencia_direccionamiento_estrategico_normas';
  info: {
    displayName: 'Norma';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaDireccionamientoEstrategicoSection extends Struct.ComponentSchema {
  collectionName: 'components_agencia_direccionamiento_estrategico_sections';
  info: {
    displayName: 'Section';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    documentos: Schema.Attribute.Integer;
    icon: Schema.Attribute.String;
    idLogico: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaDireccionamientoInformesDocument extends Struct.ComponentSchema {
  collectionName: 'components_agencia_direccionamiento_informes_documents';
  info: {
    displayName: 'Document';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    category: Schema.Attribute.String;
    file: Schema.Attribute.Media<'files' | 'images'>;
    name: Schema.Attribute.String;
  };
}

export interface AgenciaDireccionamientoInformesSection extends Struct.ComponentSchema {
  collectionName: 'components_agencia_direccionamiento_informes_sections';
  info: {
    displayName: 'Section';
    icon: 'cube';
  };
  attributes: {
    displayMode: Schema.Attribute.String;
    documents: Schema.Attribute.Component<'agencia-direccionamiento-informes.document', true>;
    sectionTitle: Schema.Attribute.String;
  };
}

export interface AgenciaDireccionamientoPlanesDocument extends Struct.ComponentSchema {
  collectionName: 'components_agencia_direccionamiento_planes_documents';
  info: {
    displayName: 'Document';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    category: Schema.Attribute.String;
    file: Schema.Attribute.Media<'files' | 'images'>;
    name: Schema.Attribute.String;
  };
}

export interface AgenciaDireccionamientoPlanesSection extends Struct.ComponentSchema {
  collectionName: 'components_agencia_direccionamiento_planes_sections';
  info: {
    displayName: 'Section';
    icon: 'cube';
  };
  attributes: {
    displayMode: Schema.Attribute.String;
    documents: Schema.Attribute.Component<'agencia-direccionamiento-planes.document', true>;
    sectionTitle: Schema.Attribute.String;
  };
}

export interface AgenciaDireccionamientoPoliticasDocument extends Struct.ComponentSchema {
  collectionName: 'components_agencia_direccionamiento_politicas_documents';
  info: {
    displayName: 'Document';
    icon: 'cube';
  };
  attributes: {
    description: Schema.Attribute.String;
    file: Schema.Attribute.Media<'files' | 'images'>;
    name: Schema.Attribute.String;
  };
}

export interface AgenciaDireccionamientoPoliticasSection extends Struct.ComponentSchema {
  collectionName: 'components_agencia_direccionamiento_politicas_sections';
  info: {
    displayName: 'Section';
    icon: 'cube';
  };
  attributes: {
    displayMode: Schema.Attribute.String;
    documents: Schema.Attribute.Component<'agencia-direccionamiento-politicas.document', true>;
    sectionTitle: Schema.Attribute.String;
  };
}

export interface AgenciaDirectorioDirectorio extends Struct.ComponentSchema {
  collectionName: 'components_agencia_directorio_directorios';
  info: {
    displayName: 'Directorio';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    external: Schema.Attribute.Boolean;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaDirectorioEscalasalarial extends Struct.ComponentSchema {
  collectionName: 'components_agencia_directorio_escalasalarials';
  info: {
    displayName: 'Escalasalarial';
    icon: 'cube';
  };
  attributes: {
    subtitulo: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaDirectorioInfoadicional extends Struct.ComponentSchema {
  collectionName: 'components_agencia_directorio_infoadicionals';
  info: {
    displayName: 'Infoadicional';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    enlace: Schema.Attribute.String;
    externo: Schema.Attribute.Boolean;
    icon: Schema.Attribute.String;
    textoEnlace: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaEmpleoRrhhManualEspecificoFuncionesDocumento
  extends Struct.ComponentSchema {
  collectionName: 'components_agencia_empleo_rrhh_manual_especifico_funciones_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaEmpleoRrhhManualEspecificoFuncionesSeccion extends Struct.ComponentSchema {
  collectionName: 'components_agencia_empleo_rrhh_manual_especifico_funciones_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<
      'agencia-empleo-rrhh-manual-especifico-funciones.documento',
      true
    >;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaEmpleoRrhhManualIdentidadVisualInform extends Struct.ComponentSchema {
  collectionName: 'components_agencia_empleo_rrhh_manual_identidad_visual_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaEmpleoRrhhManualesInternosInform extends Struct.ComponentSchema {
  collectionName: 'components_agencia_empleo_rrhh_manuales_internos_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaEmpleoRrhhNombramientosDocumento extends Struct.ComponentSchema {
  collectionName: 'components_agencia_empleo_rrhh_nombramientos_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaEmpleoRrhhNombramientosVigencia extends Struct.ComponentSchema {
  collectionName: 'components_agencia_empleo_rrhh_nombramientos_vigencias';
  info: {
    displayName: 'Vigencia';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<'agencia-empleo-rrhh-nombramientos.documento', true>;
  };
}

export interface AgenciaEmpleoRrhhOfertasEmpleoCta extends Struct.ComponentSchema {
  collectionName: 'components_agencia_empleo_rrhh_ofertas_empleo_ctas';
  info: {
    displayName: 'Cta';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    external: Schema.Attribute.Boolean;
    icon: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaEquipoDirectivoDirectora extends Struct.ComponentSchema {
  collectionName: 'components_agencia_equipo_directivo_directoras';
  info: {
    displayName: 'Directora';
    icon: 'cube';
  };
  attributes: {
    bio: Schema.Attribute.JSON;
    cargo: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
  };
}

export interface AgenciaEquipoDirectivoSubdirector extends Struct.ComponentSchema {
  collectionName: 'components_agencia_equipo_directivo_subdirectors';
  info: {
    displayName: 'Subdirector';
    icon: 'cube';
  };
  attributes: {
    area: Schema.Attribute.String;
    bio: Schema.Attribute.JSON;
    cargo: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
  };
}

export interface AgenciaGestionMisionalCategoria extends Struct.ComponentSchema {
  collectionName: 'components_agencia_gestion_misional_categorias';
  info: {
    displayName: 'Categoria';
    icon: 'cube';
  };
  attributes: {
    documentos: Schema.Attribute.Component<'agencia-gestion-misional.documento', true>;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaGestionMisionalDocumento extends Struct.ComponentSchema {
  collectionName: 'components_agencia_gestion_misional_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    file: Schema.Attribute.Media<'files' | 'images'>;
    name: Schema.Attribute.String;
  };
}

export interface AgenciaGestionMisionalObservatorio extends Struct.ComponentSchema {
  collectionName: 'components_agencia_gestion_misional_observatorios';
  info: {
    displayName: 'Observatorio';
    icon: 'cube';
  };
  attributes: {
    label: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaGestionMisionalSubdireccion extends Struct.ComponentSchema {
  collectionName: 'components_agencia_gestion_misional_subdireccions';
  info: {
    displayName: 'Subdireccion';
    icon: 'cube';
  };
  attributes: {
    categorias: Schema.Attribute.Component<'agencia-gestion-misional.categoria', true>;
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    idLogico: Schema.Attribute.String;
    observatorio: Schema.Attribute.Component<'agencia-gestion-misional.observatorio', false>;
    sigla: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaInformacionFinancieraCtasection extends Struct.ComponentSchema {
  collectionName: 'components_agencia_informacion_financiera_ctasections';
  info: {
    displayName: 'Ctasection';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    linkText: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaInformacionFinancieraInfocard extends Struct.ComponentSchema {
  collectionName: 'components_agencia_informacion_financiera_infocards';
  info: {
    displayName: 'Infocard';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaInformacionFinancieraItem extends Struct.ComponentSchema {
  collectionName: 'components_agencia_informacion_financiera_items';
  info: {
    displayName: 'Item';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaInformacionFinancieraTab extends Struct.ComponentSchema {
  collectionName: 'components_agencia_informacion_financiera_tabs';
  info: {
    displayName: 'Tab';
    icon: 'cube';
  };
  attributes: {
    idLogico: Schema.Attribute.String;
    items: Schema.Attribute.Component<'agencia-informacion-financiera.item', true>;
    label: Schema.Attribute.String;
  };
}

export interface AgenciaLandingSeccion extends Struct.ComponentSchema {
  collectionName: 'components_agencia_landing_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaMisionVisionComolohacemo extends Struct.ComponentSchema {
  collectionName: 'components_agencia_mision_vision_comolohacemos';
  info: {
    displayName: 'Comolohacemo';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaMisionVisionEntidad extends Struct.ComponentSchema {
  collectionName: 'components_agencia_mision_vision_entidads';
  info: {
    displayName: 'Entidad';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
  };
}

export interface AgenciaMisionVisionFunciones extends Struct.ComponentSchema {
  collectionName: 'components_agencia_mision_vision_funcioneses';
  info: {
    displayName: 'Funciones';
    icon: 'cube';
  };
  attributes: {
    intro: Schema.Attribute.String;
    items: Schema.Attribute.Component<'agencia-mision-vision.item', true>;
    paragrafo: Schema.Attribute.Text;
  };
}

export interface AgenciaMisionVisionItem extends Struct.ComponentSchema {
  collectionName: 'components_agencia_mision_vision_items';
  info: {
    displayName: 'Item';
    icon: 'cube';
  };
  attributes: {
    content: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface AgenciaMisionVisionMapaestrategico extends Struct.ComponentSchema {
  collectionName: 'components_agencia_mision_vision_mapaestrategicos';
  info: {
    displayName: 'Mapaestrategico';
    icon: 'cube';
  };
  attributes: {
    imagen: Schema.Attribute.String;
    pdf: Schema.Attribute.Media<'files' | 'images'>;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaMisionVisionProposito extends Struct.ComponentSchema {
  collectionName: 'components_agencia_mision_vision_propositos';
  info: {
    displayName: 'Proposito';
    icon: 'cube';
  };
  attributes: {
    badge: Schema.Attribute.String;
    subtitulo: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaMisionVisionQuehacemos extends Struct.ComponentSchema {
  collectionName: 'components_agencia_mision_vision_quehacemoses';
  info: {
    displayName: 'Quehacemos';
    icon: 'cube';
  };
  attributes: {
    cierre: Schema.Attribute.Text;
    entidades: Schema.Attribute.Component<'agencia-mision-vision.entidad', true>;
    intro: Schema.Attribute.Text;
  };
}

export interface AgenciaMisionVisionQuienessomos extends Struct.ComponentSchema {
  collectionName: 'components_agencia_mision_vision_quienessomoses';
  info: {
    displayName: 'Quienessomos';
    icon: 'cube';
  };
  attributes: {
    capacidades: Schema.Attribute.JSON;
    intro: Schema.Attribute.JSON;
  };
}

export interface AgenciaMisionVisionValor extends Struct.ComponentSchema {
  collectionName: 'components_agencia_mision_vision_valors';
  info: {
    displayName: 'Valor';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
  };
}

export interface AgenciaOrganigramaCtadirectorio extends Struct.ComponentSchema {
  collectionName: 'components_agencia_organigrama_ctadirectorios';
  info: {
    displayName: 'Ctadirectorio';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaOrganigramaFuncionesporarea extends Struct.ComponentSchema {
  collectionName: 'components_agencia_organigrama_funcionesporareas';
  info: {
    displayName: 'Funcionesporarea';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    matrizUrl: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaOrganigramaOrganigrama extends Struct.ComponentSchema {
  collectionName: 'components_agencia_organigrama_organigramas';
  info: {
    displayName: 'Organigrama';
    icon: 'cube';
  };
  attributes: {
    alt: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    pdf: Schema.Attribute.Media<'files' | 'images'>;
  };
}

export interface AgenciaOrganigramaResolucion extends Struct.ComponentSchema {
  collectionName: 'components_agencia_organigrama_resolucions';
  info: {
    displayName: 'Resolucion';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.Text;
  };
}

export interface AgenciaOrganigramaResolucionesseccion extends Struct.ComponentSchema {
  collectionName: 'components_agencia_organigrama_resolucionesseccions';
  info: {
    displayName: 'Resolucionesseccion';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaPlanInstitucionalDeArchivosDocumento extends Struct.ComponentSchema {
  collectionName: 'components_agencia_plan_institucional_de_archivos_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AgenciaSistemaDeControlInternoContactointerno extends Struct.ComponentSchema {
  collectionName: 'components_agencia_sistema_de_control_interno_contactointernos';
  info: {
    displayName: 'Contactointerno';
    icon: 'cube';
  };
  attributes: {
    direccion: Schema.Attribute.String;
    email: Schema.Attribute.String;
    lineaNacional: Schema.Attribute.String;
    telefono: Schema.Attribute.String;
  };
}

export interface AgenciaSistemaDeControlInternoControlinterno extends Struct.ComponentSchema {
  collectionName: 'components_agencia_sistema_de_control_interno_controlinternos';
  info: {
    displayName: 'Controlinterno';
    icon: 'cube';
  };
  attributes: {
    control: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
  };
}

export interface AgenciaSistemaDeControlInternoControlpolitico extends Struct.ComponentSchema {
  collectionName: 'components_agencia_sistema_de_control_interno_controlpoliticos';
  info: {
    displayName: 'Controlpolitico';
    icon: 'cube';
  };
  attributes: {
    direccion: Schema.Attribute.String;
    email: Schema.Attribute.String;
    lineaNacional: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
    telefono: Schema.Attribute.String;
    web: Schema.Attribute.String;
  };
}

export interface AgenciaSistemaDeControlInternoDocumento extends Struct.ComponentSchema {
  collectionName: 'components_agencia_sistema_de_control_interno_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    file: Schema.Attribute.Media<'files' | 'images'>;
    name: Schema.Attribute.String;
  };
}

export interface AgenciaSistemaDeControlInternoEntidadesexterna extends Struct.ComponentSchema {
  collectionName: 'components_agencia_sistema_de_control_interno_entidadesexternas';
  info: {
    displayName: 'Entidadesexterna';
    icon: 'cube';
  };
  attributes: {
    control: Schema.Attribute.String;
    direccion: Schema.Attribute.String;
    email: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    lineaNacional: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
    telefono: Schema.Attribute.String;
    web: Schema.Attribute.String;
  };
}

export interface AgenciaSistemaDeControlInternoInformeslegal extends Struct.ComponentSchema {
  collectionName: 'components_agencia_sistema_de_control_interno_informeslegals';
  info: {
    displayName: 'Informeslegal';
    icon: 'cube';
  };
  attributes: {
    documentos: Schema.Attribute.Component<'agencia-sistema-de-control-interno.documento', true>;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaSistemaDeControlInternoPlanesmejoramiento extends Struct.ComponentSchema {
  collectionName: 'components_agencia_sistema_de_control_interno_planesmejoramientos';
  info: {
    displayName: 'Planesmejoramiento';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    linkText: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AgenciaSistemaIntegradoDeGestionDocument extends Struct.ComponentSchema {
  collectionName: 'components_agencia_sistema_integrado_de_gestion_documents';
  info: {
    displayName: 'Document';
    icon: 'cube';
  };
  attributes: {
    externo: Schema.Attribute.Boolean;
    file: Schema.Attribute.Media<'files' | 'images'>;
    name: Schema.Attribute.String;
  };
}

export interface AgenciaSistemaIntegradoDeGestionSection extends Struct.ComponentSchema {
  collectionName: 'components_agencia_sistema_integrado_de_gestion_sections';
  info: {
    displayName: 'Section';
    icon: 'cube';
  };
  attributes: {
    displayMode: Schema.Attribute.String;
    documents: Schema.Attribute.Component<'agencia-sistema-integrado-de-gestion.document', true>;
    sectionDescription: Schema.Attribute.Text;
    sectionIcon: Schema.Attribute.String;
    sectionTitle: Schema.Attribute.String;
  };
}

export interface AtencionCanalesDeAtencionCanal extends Struct.ComponentSchema {
  collectionName: 'components_atencion_canales_de_atencion_canals';
  info: {
    displayName: 'Canal';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    items: Schema.Attribute.Component<'atencion-canales-de-atencion.item', true>;
    nombre: Schema.Attribute.String;
  };
}

export interface AtencionCanalesDeAtencionItem extends Struct.ComponentSchema {
  collectionName: 'components_atencion_canales_de_atencion_items';
  info: {
    displayName: 'Item';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String;
    valor: Schema.Attribute.String;
  };
}

export interface AtencionCanalesDeAtencionPortafolio extends Struct.ComponentSchema {
  collectionName: 'components_atencion_canales_de_atencion_portafolios';
  info: {
    displayName: 'Portafolio';
    icon: 'cube';
  };
  attributes: {
    file: Schema.Attribute.Media<'files' | 'images'>;
    nombre: Schema.Attribute.String;
  };
}

export interface AtencionGlosarioTermino extends Struct.ComponentSchema {
  collectionName: 'components_atencion_glosario_terminos';
  info: {
    displayName: 'Termino';
    icon: 'cube';
  };
  attributes: {
    definicion: Schema.Attribute.Text;
    termino: Schema.Attribute.String;
  };
}

export interface AtencionLandingEnlacesexterno extends Struct.ComponentSchema {
  collectionName: 'components_atencion_landing_enlacesexternos';
  info: {
    displayName: 'Enlacesexterno';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AtencionLandingSeccion extends Struct.ComponentSchema {
  collectionName: 'components_atencion_landing_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AtencionPqrsServidoresInform extends Struct.ComponentSchema {
  collectionName: 'components_atencion_pqrs_servidores_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface AtencionPqrsDefinicion extends Struct.ComponentSchema {
  collectionName: 'components_atencion_pqrs_definicions';
  info: {
    displayName: 'Definicion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    letra: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface AtencionPqrsInform extends Struct.ComponentSchema {
  collectionName: 'components_atencion_pqrs_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    label: Schema.Attribute.String;
    reportes: Schema.Attribute.Component<'atencion-pqrs.report', true>;
  };
}

export interface AtencionPqrsReport extends Struct.ComponentSchema {
  collectionName: 'components_atencion_pqrs_reports';
  info: {
    displayName: 'Report';
    icon: 'cube';
  };
  attributes: {
    file: Schema.Attribute.Media<'files' | 'images'>;
    nombre: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
  };
}

export interface AtencionPreguntasFrecuentesFaq extends Struct.ComponentSchema {
  collectionName: 'components_atencion_preguntas_frecuentes_faqs';
  info: {
    displayName: 'Faq';
    icon: 'cube';
  };
  attributes: {
    pregunta: Schema.Attribute.String;
    respuesta: Schema.Attribute.Text;
  };
}

export interface AtencionVinculacionATercerosDocumento extends Struct.ComponentSchema {
  collectionName: 'components_atencion_vinculacion_a_terceros_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    fecha: Schema.Attribute.String;
    file: Schema.Attribute.Media<'files' | 'images'>;
    nombre: Schema.Attribute.String;
  };
}

export interface CiprepAgenda extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_agendas';
  info: {
    displayName: 'Agenda';
    icon: 'cube';
  };
  attributes: {
    dia1: Schema.Attribute.Component<'ciprep.dia1', false>;
    dia2: Schema.Attribute.Component<'ciprep.dia2', false>;
  };
}

export interface CiprepAliados extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_aliadoses';
  info: {
    displayName: 'Aliados';
    icon: 'cube';
  };
  attributes: {
    estrategico: Schema.Attribute.Component<'ciprep.estrategico', true>;
    integridad: Schema.Attribute.Component<'ciprep.integridad', true>;
  };
}

export interface CiprepCta extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_ctas';
  info: {
    displayName: 'Cta';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    enlaceAncla: Schema.Attribute.String;
    enlaceLabel: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface CiprepDia1 extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_dia1s';
  info: {
    displayName: 'Dia1';
    icon: 'cube';
  };
  attributes: {
    fecha: Schema.Attribute.String;
    fechaCorta: Schema.Attribute.String;
    items: Schema.Attribute.Component<'ciprep.item', true>;
  };
}

export interface CiprepDia2 extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_dia2s';
  info: {
    displayName: 'Dia2';
    icon: 'cube';
  };
  attributes: {
    fecha: Schema.Attribute.String;
    fechaCorta: Schema.Attribute.String;
    items: Schema.Attribute.Component<'ciprep.item', true>;
  };
}

export interface CiprepEstrategico extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_estrategicos';
  info: {
    displayName: 'Estrategico';
    icon: 'cube';
  };
  attributes: {
    logo: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
  };
}

export interface CiprepIntegridad extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_integridads';
  info: {
    displayName: 'Integridad';
    icon: 'cube';
  };
  attributes: {
    logo: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
  };
}

export interface CiprepItem extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_items';
  info: {
    displayName: 'Item';
    icon: 'cube';
  };
  attributes: {
    franja: Schema.Attribute.String;
    hora: Schema.Attribute.String;
    moderador: Schema.Attribute.String;
    ponentes: Schema.Attribute.JSON;
    titulo: Schema.Attribute.String;
  };
}

export interface CiprepMemorias extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_memoriases';
  info: {
    displayName: 'Memorias';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    recursos: Schema.Attribute.Component<'ciprep.recurso', true>;
    youtubeId: Schema.Attribute.String;
  };
}

export interface CiprepRecurso extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_recursos';
  info: {
    displayName: 'Recurso';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface CiprepSpeakersindex extends Struct.ComponentSchema {
  collectionName: 'components_ciprep_speakersindexs';
  info: {
    displayName: 'Speakersindex';
    icon: 'cube';
  };
  attributes: {
    name: Schema.Attribute.String;
    slug: Schema.Attribute.String;
  };
}

export interface GaleriaImagen extends Struct.ComponentSchema {
  collectionName: 'components_galeria_imagens';
  info: {
    displayName: 'Imagen';
    icon: 'cube';
  };
  attributes: {
    alt: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface GaleriaPortada extends Struct.ComponentSchema {
  collectionName: 'components_galeria_portadas';
  info: {
    displayName: 'Portada';
    icon: 'cube';
  };
  attributes: {
    alt: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface HomeColumnasservicio extends Struct.ComponentSchema {
  collectionName: 'components_home_columnasservicios';
  info: {
    displayName: 'Columnasservicio';
    icon: 'cube';
  };
  attributes: {
    items: Schema.Attribute.Component<'home.item', true>;
  };
}

export interface HomeEntidadesvigilada extends Struct.ComponentSchema {
  collectionName: 'components_home_entidadesvigiladas';
  info: {
    displayName: 'Entidadesvigilada';
    icon: 'cube';
  };
  attributes: {
    alt: Schema.Attribute.String;
    logo: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface HomeItem extends Struct.ComponentSchema {
  collectionName: 'components_home_items';
  info: {
    displayName: 'Item';
    icon: 'cube';
  };
  attributes: {
    texto: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface InstitucionalAudiosItrcAudio extends Struct.ComponentSchema {
  collectionName: 'components_institucional_audios_itrc_audios';
  info: {
    displayName: 'Audio';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface InstitucionalCalendarioEventosCta extends Struct.ComponentSchema {
  collectionName: 'components_institucional_calendario_eventos_ctas';
  info: {
    displayName: 'Cta';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    external: Schema.Attribute.Boolean;
    icon: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface InstitucionalDefensaJudicialInform extends Struct.ComponentSchema {
  collectionName: 'components_institucional_defensa_judicial_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface InstitucionalEstadosNotificacion extends Struct.ComponentSchema {
  collectionName: 'components_institucional_estados_notificacions';
  info: {
    displayName: 'Notificacion';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface InstitucionalEstudiosInvestigacionesInform extends Struct.ComponentSchema {
  collectionName: 'components_institucional_estudios_investigaciones_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface InstitucionalHistoricoInvestigacionesDisciplinariasInform
  extends Struct.ComponentSchema {
  collectionName: 'components_institucional_historico_investigaciones_disciplinarias_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface InstitucionalHistoricoSistemaControlInternoSeccion extends Struct.ComponentSchema {
  collectionName: 'components_institucional_historico_sistema_control_interno_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    documentos: Schema.Attribute.JSON;
    titulo: Schema.Attribute.String;
  };
}

export interface InstitucionalPublicacionDatosAbiertosCta extends Struct.ComponentSchema {
  collectionName: 'components_institucional_publicacion_datos_abiertos_ctas';
  info: {
    displayName: 'Cta';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    external: Schema.Attribute.Boolean;
    icon: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface MapaDelSitioExtras extends Struct.ComponentSchema {
  collectionName: 'components_mapa_del_sitio_extrases';
  info: {
    displayName: 'Extras';
    icon: 'cube';
  };
  attributes: {
    items: Schema.Attribute.Component<'mapa-del-sitio.item', true>;
    title: Schema.Attribute.String;
  };
}

export interface MapaDelSitioItem extends Struct.ComponentSchema {
  collectionName: 'components_mapa_del_sitio_items';
  info: {
    displayName: 'Item';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface NormativaDecretosDecreto extends Struct.ComponentSchema {
  collectionName: 'components_normativa_decretos_decretos';
  info: {
    displayName: 'Decreto';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.Text;
    fecha: Schema.Attribute.String;
    file: Schema.Attribute.Media<'files' | 'images'>;
    nombre: Schema.Attribute.String;
  };
}

export interface NormativaLandingSeccion extends Struct.ComponentSchema {
  collectionName: 'components_normativa_landing_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface NormativaMarcoLegalDocumento extends Struct.ComponentSchema {
  collectionName: 'components_normativa_marco_legal_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    file: Schema.Attribute.Media<'files' | 'images'>;
    nombre: Schema.Attribute.String;
  };
}

export interface NormativaMarcoLegalSeccion extends Struct.ComponentSchema {
  collectionName: 'components_normativa_marco_legal_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    documentos: Schema.Attribute.Component<'normativa-marco-legal.documento', true>;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface NormativaResolucionesActo extends Struct.ComponentSchema {
  collectionName: 'components_normativa_resoluciones_actos';
  info: {
    displayName: 'Acto';
    icon: 'cube';
  };
  attributes: {
    dependencia: Schema.Attribute.String;
    fecha: Schema.Attribute.String;
    interes: Schema.Attribute.String;
    motivacion: Schema.Attribute.Text;
    numero: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
    tipo: Schema.Attribute.String;
    vigencia: Schema.Attribute.Integer;
  };
}

export interface NormativaUnificacionSuinJuriscolNorma extends Struct.ComponentSchema {
  collectionName: 'components_normativa_unificacion_suin_juriscol_normas';
  info: {
    displayName: 'Norma';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.Integer;
    diarioOficial: Schema.Attribute.String;
    entidadEmisora: Schema.Attribute.String;
    epigrafe: Schema.Attribute.Text;
    estado: Schema.Attribute.String;
    numero: Schema.Attribute.String;
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
    suinUrl: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
  };
}

export interface NormativaVigenciasInform extends Struct.ComponentSchema {
  collectionName: 'components_normativa_vigencias_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface NormogramaNorma extends Struct.ComponentSchema {
  collectionName: 'components_normograma_normas';
  info: {
    displayName: 'Norma';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.Integer;
    descripcion: Schema.Attribute.Text;
    fichaUrl: Schema.Attribute.String;
    normaUrl: Schema.Attribute.Text;
    numero: Schema.Attribute.String;
    proceso: Schema.Attribute.Text;
    tipo: Schema.Attribute.String;
    vigencia: Schema.Attribute.String;
  };
}

export interface ObservatorioDelObservatorioTab extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_del_observatorio_tabs';
  info: {
    displayName: 'Tab';
    icon: 'cube';
  };
  attributes: {
    contenido: Schema.Attribute.Text;
    titulo: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionArticulosArticulo extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_articulos_articulos';
  info: {
    displayName: 'Articulo';
    icon: 'cube';
  };
  attributes: {
    autor: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionConociendoDocumento extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_conociendo_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.Text;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionGlosarioNinosTermino extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_glosario_ninos_terminos';
  info: {
    displayName: 'Termino';
    icon: 'cube';
  };
  attributes: {
    definicion: Schema.Attribute.Text;
    imagen: Schema.Attribute.String;
    termino: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionItrcParaNinosSeccion extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_itrc_para_ninos_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionJuegoDeRolesJuego extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_juego_de_roles_juegos';
  info: {
    displayName: 'Juego';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    duracion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionMemoriasInfoAnio extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_memorias_info_anios';
  info: {
    displayName: 'Anio';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    entradas: Schema.Attribute.Component<
      'observatorio-eje-de-educacion-memorias-info.entrada',
      true
    >;
  };
}

export interface ObservatorioEjeDeEducacionMemoriasInfoEntrada extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_memorias_info_entradas';
  info: {
    displayName: 'Entrada';
    icon: 'cube';
  };
  attributes: {
    fecha: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionMemoriasGaleria extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_memorias_galerias';
  info: {
    displayName: 'Galeria';
    icon: 'cube';
  };
  attributes: {
    alt: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionQuizPregunta extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_quiz_preguntas';
  info: {
    displayName: 'Pregunta';
    icon: 'cube';
  };
  attributes: {
    correcta: Schema.Attribute.Integer;
    explicacion: Schema.Attribute.String;
    opciones: Schema.Attribute.JSON;
    pregunta: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionRepositorioJuridicoNorma extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_repositorio_juridico_normas';
  info: {
    displayName: 'Norma';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    numero: Schema.Attribute.String;
    palabrasClave: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeEducacionSeccion extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_educacion_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeMedicionDashboard extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_medicion_dashboards';
  info: {
    displayName: 'Dashboard';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeParticipacionCartillasCartilla extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_participacion_cartillas_cartillas';
  info: {
    displayName: 'Cartilla';
    icon: 'cube';
  };
  attributes: {
    imagen: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeParticipacionEncuestaParticipar extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_participacion_encuesta_participars';
  info: {
    displayName: 'Participar';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeParticipacionEncuestaResultados extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_participacion_encuesta_resultadoses';
  info: {
    displayName: 'Resultados';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeParticipacionMemoriasInfoAnio extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_participacion_memorias_info_anios';
  info: {
    displayName: 'Anio';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    entradas: Schema.Attribute.Component<
      'observatorio-eje-de-participacion-memorias-info.entrada',
      true
    >;
  };
}

export interface ObservatorioEjeDeParticipacionMemoriasInfoEntrada extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_participacion_memorias_info_entradas';
  info: {
    displayName: 'Entrada';
    icon: 'cube';
  };
  attributes: {
    fecha: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeParticipacionMemoriasGaleria extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_participacion_memorias_galerias';
  info: {
    displayName: 'Galeria';
    icon: 'cube';
  };
  attributes: {
    alt: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeParticipacionNoticiasNoticia extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_participacion_noticias_noticias';
  info: {
    displayName: 'Noticia';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    fecha: Schema.Attribute.String;
    fechaIso: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    resumen: Schema.Attribute.String;
    slug: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeParticipacionVideosTutorialesVideo
  extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_participacion_videos_tutoriales_videos';
  info: {
    displayName: 'Video';
    icon: 'cube';
  };
  attributes: {
    poster: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioEjeDeParticipacionSeccion extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_eje_de_participacion_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ObservatorioObservatorioSeccion extends Struct.ComponentSchema {
  collectionName: 'components_observatorio_observatorio_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaAtencionInformeComiteConciliacionInform extends Struct.ComponentSchema {
  collectionName: 'components_participa_atencion_informe_comite_conciliacion_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaAtencionOtrosGruposInteresEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_participa_atencion_otros_grupos_interes_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaAtencionRespuestaAnonimosNotificacion extends Struct.ComponentSchema {
  collectionName: 'components_participa_atencion_respuesta_anonimos_notificacions';
  info: {
    displayName: 'Notificacion';
    icon: 'cube';
  };
  attributes: {
    fecha: Schema.Attribute.String;
    radicadoPqrs: Schema.Attribute.String;
    radicadoRespuesta: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaColaboracionIniciativa extends Struct.ComponentSchema {
  collectionName: 'components_participa_colaboracion_iniciativas';
  info: {
    displayName: 'Iniciativa';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    enlace: Schema.Attribute.String;
    imagen: Schema.Attribute.String;
    interno: Schema.Attribute.Boolean;
    textoEnlace: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface ParticipaConsultaCiudadanaContenido extends Struct.ComponentSchema {
  collectionName: 'components_participa_consulta_ciudadana_contenidos';
  info: {
    displayName: 'Contenido';
    icon: 'cube';
  };
  attributes: {
    subtitulo: Schema.Attribute.String;
    texto: Schema.Attribute.Text;
  };
}

export interface ParticipaConsultaCiudadanaEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_participa_consulta_ciudadana_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaControlSocialEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_participa_control_social_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaDiagnosticoCajaherramienta extends Struct.ComponentSchema {
  collectionName: 'components_participa_diagnostico_cajaherramientas';
  info: {
    displayName: 'Cajaherramienta';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaDiagnosticoEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_participa_diagnostico_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaPlaneacionEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_participa_planeacion_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaRendicionDeCuentasAnio extends Struct.ComponentSchema {
  collectionName: 'components_participa_rendicion_de_cuentas_anios';
  info: {
    displayName: 'Anio';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<'participa-rendicion-de-cuentas.documento', true>;
  };
}

export interface ParticipaRendicionDeCuentasDocumento extends Struct.ComponentSchema {
  collectionName: 'components_participa_rendicion_de_cuentas_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ParticipaSeccion extends Struct.ComponentSchema {
  collectionName: 'components_participa_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PrensaCapsulasCapsula extends Struct.ComponentSchema {
  collectionName: 'components_prensa_capsulas_capsulas';
  info: {
    displayName: 'Capsula';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    fecha: Schema.Attribute.String;
    posterImagen: Schema.Attribute.String;
    slug: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PrensaComunicadosInstitucionalesAnio extends Struct.ComponentSchema {
  collectionName: 'components_prensa_comunicados_institucionales_anios';
  info: {
    displayName: 'Anio';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    items: Schema.Attribute.Component<'prensa-comunicados-institucionales.item', true>;
  };
}

export interface PrensaComunicadosInstitucionalesItem extends Struct.ComponentSchema {
  collectionName: 'components_prensa_comunicados_institucionales_items';
  info: {
    displayName: 'Item';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PrensaGaleriaAlbum extends Struct.ComponentSchema {
  collectionName: 'components_prensa_galeria_albums';
  info: {
    displayName: 'Album';
    icon: 'cube';
  };
  attributes: {
    disabled: Schema.Attribute.Boolean;
    imagen: Schema.Attribute.String;
    nota: Schema.Attribute.String;
    slug: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface PrensaLandingSeccion extends Struct.ComponentSchema {
  collectionName: 'components_prensa_landing_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PrensaVideosEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_prensa_videos_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PrensaVideosVideo extends Struct.ComponentSchema {
  collectionName: 'components_prensa_videos_videos';
  info: {
    displayName: 'Video';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    destacado: Schema.Attribute.Boolean;
    fecha: Schema.Attribute.String;
    slug: Schema.Attribute.String;
    thumbnail: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    transcripcion: Schema.Attribute.String;
    url: Schema.Attribute.String;
    youtubeId: Schema.Attribute.String;
  };
}

export interface PrensaSection extends Struct.ComponentSchema {
  collectionName: 'components_prensa_sections';
  info: {
    displayName: 'Section';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    idLogico: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
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

export interface TransparenciaAccesibilidadDocumento extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_accesibilidad_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaComiteConciliacionAnio extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_comite_conciliacion_anios';
  info: {
    displayName: 'Anio';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    docs: Schema.Attribute.Component<'transparencia-comite-conciliacion.doc', true>;
  };
}

export interface TransparenciaComiteConciliacionDoc extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_comite_conciliacion_docs';
  info: {
    displayName: 'Doc';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaContratacionContratacionSuscritaContratacionsuscrita
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_contratacion_suscrita_contratacionsuscritas';
  info: {
    displayName: 'Contratacionsuscrita';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    contratos: Schema.Attribute.Component<
      'transparencia-contratacion-contratacion-suscrita.contrato',
      true
    >;
    titulo: Schema.Attribute.String;
  };
}

export interface TransparenciaContratacionContratacionSuscritaContrato
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_contratacion_suscrita_contratos';
  info: {
    displayName: 'Contrato';
    icon: 'cube';
  };
  attributes: {
    periodo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaContratacionContratacionSuscritaConvocatoria
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_contratacion_suscrita_convocatorias';
  info: {
    displayName: 'Convocatoria';
    icon: 'cube';
  };
  attributes: {
    categoria: Schema.Attribute.String;
    procesos: Schema.Attribute.Component<
      'transparencia-contratacion-contratacion-suscrita.proceso',
      true
    >;
  };
}

export interface TransparenciaContratacionContratacionSuscritaProceso
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_contratacion_suscrita_procesos';
  info: {
    displayName: 'Proceso';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    label: Schema.Attribute.String;
    otros: Schema.Attribute.JSON;
    pdfUrl: Schema.Attribute.Media<'files' | 'images'>;
    secopRef: Schema.Attribute.String;
  };
}

export interface TransparenciaContratacionEjecucionContratosDocumento
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_ejecucion_contratos_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    numero: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaContratacionEjecucionContratosEnlacesexterno
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_ejecucion_contratos_enlacesexternos';
  info: {
    displayName: 'Enlacesexterno';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.Text;
  };
}

export interface TransparenciaContratacionEjecucionContratosVigencia
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_ejecucion_contratos_vigencias';
  info: {
    displayName: 'Vigencia';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    documentos: Schema.Attribute.Component<
      'transparencia-contratacion-ejecucion-contratos.documento',
      true
    >;
  };
}

export interface TransparenciaContratacionFormatosFormato extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_formatos_formatos';
  info: {
    displayName: 'Formato';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaContratacionManualDocumento extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_manual_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaContratacionPlanAdquisicionesAnio extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_plan_adquisiciones_anios';
  info: {
    displayName: 'Anio';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    docs: Schema.Attribute.Component<'transparencia-contratacion-plan-adquisiciones.doc', true>;
  };
}

export interface TransparenciaContratacionPlanAdquisicionesDoc extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_plan_adquisiciones_docs';
  info: {
    displayName: 'Doc';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaContratacionProcedimientosAdquisicionDocumento
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_contratacion_procedimientos_adquisicion_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    tipo: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaDecretoUnicoDocumento extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_decreto_unico_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaDecretosEstructuraDecreto extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_decretos_estructura_decretos';
  info: {
    displayName: 'Decreto';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
    numero: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaDecretosEstructuraSeccion extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_decretos_estructura_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    decretos: Schema.Attribute.Component<'transparencia-decretos-estructura.decreto', true>;
    descripcion: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface TransparenciaDefensaPublicaEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_defensa_publica_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaDirectorioEntidadesEntidad extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_directorio_entidades_entidads';
  info: {
    displayName: 'Entidad';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaDirectorioEntidadesGrupo extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_directorio_entidades_grupos';
  info: {
    displayName: 'Grupo';
    icon: 'cube';
  };
  attributes: {
    entidades: Schema.Attribute.Component<'transparencia-directorio-entidades.entidad', true>;
    nombre: Schema.Attribute.String;
  };
}

export interface TransparenciaDocumentacionEsquemaPublicacionInform extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_documentacion_esquema_publicacion_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaDocumentacionFormatoGruposEtnicosInform
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_documentacion_formato_grupos_etnicos_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaDocumentacionProteccionDatosDocumento extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_documentacion_proteccion_datos_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    tipo: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaDocumentacionProteccionDatosEnlacesexterno
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_documentacion_proteccion_datos_enlacesexternos';
  info: {
    displayName: 'Enlacesexterno';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaDocumentacionRegistroPublicacionesInform
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_documentacion_registro_publicaciones_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaEvaluacionIndependienteDocumento extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_evaluacion_independiente_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaEvaluacionIndependienteEnlacerelacionado
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_evaluacion_independiente_enlacerelacionados';
  info: {
    displayName: 'Enlacerelacionado';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaFormatosContratosPliegosTipoInform extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_formatos_contratos_pliegos_tipo_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaFormatosFormulariosSeccion extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_formatos_formularios_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    color: Schema.Attribute.String;
    descripcion: Schema.Attribute.String;
    externo: Schema.Attribute.Boolean;
    icon: Schema.Attribute.String;
    textoEnlace: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaHojasDeVidaAspirant extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_hojas_de_vida_aspirants';
  info: {
    displayName: 'Aspirant';
    icon: 'cube';
  };
  attributes: {
    cargo: Schema.Attribute.String;
    fechaDesfijacion: Schema.Attribute.String;
    fechaFijacion: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
    pdf: Schema.Attribute.Media<'files' | 'images'>;
  };
}

export interface TransparenciaIndiceInformacionClasificadaInform extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_indice_informacion_clasificada_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaInformacionMujeresLink extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informacion_mujeres_links';
  info: {
    displayName: 'Link';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaInformacionMujeresSeccion extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informacion_mujeres_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    links: Schema.Attribute.Component<'transparencia-informacion-mujeres.link', true>;
    titulo: Schema.Attribute.String;
  };
}

export interface TransparenciaInformesEmpalmeDocumento extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informes_empalme_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaInformesLegalesDoc extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informes_legales_docs';
  info: {
    displayName: 'Doc';
    icon: 'cube';
  };
  attributes: {
    cat: Schema.Attribute.String;
    items: Schema.Attribute.Component<'transparencia-informes-legales.item', true>;
  };
}

export interface TransparenciaInformesLegalesItem extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informes_legales_items';
  info: {
    displayName: 'Item';
    icon: 'cube';
  };
  attributes: {
    n: Schema.Attribute.String;
    u: Schema.Attribute.String;
  };
}

export interface TransparenciaInformesLegalesSeccion extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informes_legales_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    docs: Schema.Attribute.Component<'transparencia-informes-legales.doc', true>;
    titulo: Schema.Attribute.String;
  };
}

export interface TransparenciaInformesOrganismosIvcEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informes_organismos_ivc_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaInformesOrganismosEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informes_organismos_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaInformesCategoria extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informes_categorias';
  info: {
    displayName: 'Categoria';
    icon: 'cube';
  };
  attributes: {
    destino: Schema.Attribute.Component<'transparencia-informes.destino', false>;
    numero: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
  };
}

export interface TransparenciaInformesDestino extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informes_destinos';
  info: {
    displayName: 'Destino';
    icon: 'cube';
  };
  attributes: {
    estado: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaInformesInform extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_informes_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaLeyesLey extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_leyes_leys';
  info: {
    displayName: 'Ley';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaNormasServicioNorma extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_normas_servicio_normas';
  info: {
    displayName: 'Norma';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaNormatividadEspecialSeccion extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_normatividad_especial_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaOtrosGruposEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_otros_grupos_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaPlanesMejoramientoSeccion extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_planes_mejoramiento_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    desc: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaPoliticasManualesDerechosautor extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_politicas_manuales_derechosautors';
  info: {
    displayName: 'Derechosautor';
    icon: 'cube';
  };
  attributes: {
    normas: Schema.Attribute.JSON;
    texto: Schema.Attribute.String;
  };
}

export interface TransparenciaPoliticasManualesEnlaz extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_politicas_manuales_enlaces';
  info: {
    displayName: 'Enlaz';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    interno: Schema.Attribute.Boolean;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaProcedimientosDecisionesInform extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_procedimientos_decisiones_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaProgramaGestionDocumentalInform extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_programa_gestion_documental_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaProyectosInversionDoc extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_proyectos_inversion_docs';
  info: {
    displayName: 'Doc';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaProyectosInversionEnlacesexterno extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_proyectos_inversion_enlacesexternos';
  info: {
    displayName: 'Enlacesexterno';
    icon: 'cube';
  };
  attributes: {
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaProyectosInversionFicha extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_proyectos_inversion_fichas';
  info: {
    displayName: 'Ficha';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaProyectosInversionFichasebi extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_proyectos_inversion_fichasebis';
  info: {
    displayName: 'Fichasebi';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    fichas: Schema.Attribute.Component<'transparencia-proyectos-inversion.ficha', true>;
  };
}

export interface TransparenciaProyectosInversionInform extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_proyectos_inversion_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    anio: Schema.Attribute.String;
    docs: Schema.Attribute.Component<'transparencia-proyectos-inversion.doc', true>;
  };
}

export interface TransparenciaProyectosInversionResumenejecutivo extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_proyectos_inversion_resumenejecutivos';
  info: {
    displayName: 'Resumenejecutivo';
    icon: 'cube';
  };
  attributes: {
    proyecto: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaProyectosInversionSeguimientosspi extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_proyectos_inversion_seguimientosspis';
  info: {
    displayName: 'Seguimientosspi';
    icon: 'cube';
  };
  attributes: {
    periodo: Schema.Attribute.String;
    proyecto: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaProyectosNormasComentariosEnlacesexterno
  extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_proyectos_normas_comentarios_enlacesexternos';
  info: {
    displayName: 'Enlacesexterno';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaRelatoriaFicha extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_relatoria_fichas';
  info: {
    displayName: 'Ficha';
    icon: 'cube';
  };
  attributes: {
    archivo: Schema.Attribute.Media<'files' | 'images'>;
    expediente: Schema.Attribute.String;
    filenameOrigen: Schema.Attribute.String;
    idLogico: Schema.Attribute.String;
    instancia: Schema.Attribute.String;
    jcatid: Schema.Attribute.String;
    jslug: Schema.Attribute.String;
    origenUrl: Schema.Attribute.String;
    slug: Schema.Attribute.String;
    tamano: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    year: Schema.Attribute.String;
    yearCategoria: Schema.Attribute.String;
  };
}

export interface TransparenciaRelatoriaResolucion extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_relatoria_resolucions';
  info: {
    displayName: 'Resolucion';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaRendicionCuentaContraloriaDocumento extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_rendicion_cuenta_contraloria_documentos';
  info: {
    displayName: 'Documento';
    icon: 'cube';
  };
  attributes: {
    nombre: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaReporteAusteridadGastoInform extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_reporte_austeridad_gasto_informs';
  info: {
    displayName: 'Inform';
    icon: 'cube';
  };
  attributes: {
    titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaSedeHorariosContacto extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_sede_horarios_contactos';
  info: {
    displayName: 'Contacto';
    icon: 'cube';
  };
  attributes: {
    email: Schema.Attribute.String;
    extension: Schema.Attribute.String;
    lineaGratuita: Schema.Attribute.String;
    telefono: Schema.Attribute.String;
  };
}

export interface TransparenciaSedeHorariosHorario extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_sede_horarios_horarios';
  info: {
    displayName: 'Horario';
    icon: 'cube';
  };
  attributes: {
    dias: Schema.Attribute.String;
    fin: Schema.Attribute.String;
    inicio: Schema.Attribute.String;
    nota: Schema.Attribute.String;
  };
}

export interface TransparenciaSedeHorariosMapa extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_sede_horarios_mapas';
  info: {
    displayName: 'Mapa';
    icon: 'cube';
  };
  attributes: {
    embedUrl: Schema.Attribute.Text;
    lat: Schema.Attribute.String;
    lng: Schema.Attribute.String;
  };
}

export interface TransparenciaSedeHorariosSede extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_sede_horarios_sedes';
  info: {
    displayName: 'Sede';
    icon: 'cube';
  };
  attributes: {
    ciudad: Schema.Attribute.String;
    codigoPostal: Schema.Attribute.String;
    direccion: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
    piso: Schema.Attribute.String;
  };
}

export interface TransparenciaSupervisionVigilanciaEntidad extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_supervision_vigilancia_entidads';
  info: {
    displayName: 'Entidad';
    icon: 'cube';
  };
  attributes: {
    control: Schema.Attribute.String;
    direccion: Schema.Attribute.String;
    email: Schema.Attribute.String;
    nombre: Schema.Attribute.String;
    telefono: Schema.Attribute.String;
    web: Schema.Attribute.String;
  };
}

export interface TransparenciaTablasRetencionDoc extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_tablas_retencion_docs';
  info: {
    displayName: 'Doc';
    icon: 'cube';
  };
  attributes: {
    n: Schema.Attribute.String;
    u: Schema.Attribute.String;
  };
}

export interface TransparenciaTablasRetencionVersion extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_tablas_retencion_versions';
  info: {
    displayName: 'Version';
    icon: 'cube';
  };
  attributes: {
    docs: Schema.Attribute.Component<'transparencia-tablas-retencion.doc', true>;
    titulo: Schema.Attribute.String;
  };
}

export interface TransparenciaChildren extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_childrens';
  info: {
    displayName: 'Children';
    icon: 'cube';
  };
  attributes: {
    num: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaItem extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_items';
  info: {
    displayName: 'Item';
    icon: 'cube';
  };
  attributes: {
    children: Schema.Attribute.Component<'transparencia.children', true>;
    num: Schema.Attribute.String;
    texto: Schema.Attribute.String;
    tipo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TransparenciaSeccion extends Struct.ComponentSchema {
  collectionName: 'components_transparencia_seccions';
  info: {
    displayName: 'Seccion';
    icon: 'cube';
  };
  attributes: {
    descripcion: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    items: Schema.Attribute.Component<'transparencia.item', true>;
    numero: Schema.Attribute.String;
    titulo: Schema.Attribute.String;
    tituloUrl: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'agencia-direccionamiento-estrategico.marconormativo': AgenciaDireccionamientoEstrategicoMarconormativo;
      'agencia-direccionamiento-estrategico.norma': AgenciaDireccionamientoEstrategicoNorma;
      'agencia-direccionamiento-estrategico.section': AgenciaDireccionamientoEstrategicoSection;
      'agencia-direccionamiento-informes.document': AgenciaDireccionamientoInformesDocument;
      'agencia-direccionamiento-informes.section': AgenciaDireccionamientoInformesSection;
      'agencia-direccionamiento-planes.document': AgenciaDireccionamientoPlanesDocument;
      'agencia-direccionamiento-planes.section': AgenciaDireccionamientoPlanesSection;
      'agencia-direccionamiento-politicas.document': AgenciaDireccionamientoPoliticasDocument;
      'agencia-direccionamiento-politicas.section': AgenciaDireccionamientoPoliticasSection;
      'agencia-directorio.directorio': AgenciaDirectorioDirectorio;
      'agencia-directorio.escalasalarial': AgenciaDirectorioEscalasalarial;
      'agencia-directorio.infoadicional': AgenciaDirectorioInfoadicional;
      'agencia-empleo-rrhh-manual-especifico-funciones.documento': AgenciaEmpleoRrhhManualEspecificoFuncionesDocumento;
      'agencia-empleo-rrhh-manual-especifico-funciones.seccion': AgenciaEmpleoRrhhManualEspecificoFuncionesSeccion;
      'agencia-empleo-rrhh-manual-identidad-visual.inform': AgenciaEmpleoRrhhManualIdentidadVisualInform;
      'agencia-empleo-rrhh-manuales-internos.inform': AgenciaEmpleoRrhhManualesInternosInform;
      'agencia-empleo-rrhh-nombramientos.documento': AgenciaEmpleoRrhhNombramientosDocumento;
      'agencia-empleo-rrhh-nombramientos.vigencia': AgenciaEmpleoRrhhNombramientosVigencia;
      'agencia-empleo-rrhh-ofertas-empleo.cta': AgenciaEmpleoRrhhOfertasEmpleoCta;
      'agencia-equipo-directivo.directora': AgenciaEquipoDirectivoDirectora;
      'agencia-equipo-directivo.subdirector': AgenciaEquipoDirectivoSubdirector;
      'agencia-gestion-misional.categoria': AgenciaGestionMisionalCategoria;
      'agencia-gestion-misional.documento': AgenciaGestionMisionalDocumento;
      'agencia-gestion-misional.observatorio': AgenciaGestionMisionalObservatorio;
      'agencia-gestion-misional.subdireccion': AgenciaGestionMisionalSubdireccion;
      'agencia-informacion-financiera.ctasection': AgenciaInformacionFinancieraCtasection;
      'agencia-informacion-financiera.infocard': AgenciaInformacionFinancieraInfocard;
      'agencia-informacion-financiera.item': AgenciaInformacionFinancieraItem;
      'agencia-informacion-financiera.tab': AgenciaInformacionFinancieraTab;
      'agencia-landing.seccion': AgenciaLandingSeccion;
      'agencia-mision-vision.comolohacemo': AgenciaMisionVisionComolohacemo;
      'agencia-mision-vision.entidad': AgenciaMisionVisionEntidad;
      'agencia-mision-vision.funciones': AgenciaMisionVisionFunciones;
      'agencia-mision-vision.item': AgenciaMisionVisionItem;
      'agencia-mision-vision.mapaestrategico': AgenciaMisionVisionMapaestrategico;
      'agencia-mision-vision.proposito': AgenciaMisionVisionProposito;
      'agencia-mision-vision.quehacemos': AgenciaMisionVisionQuehacemos;
      'agencia-mision-vision.quienessomos': AgenciaMisionVisionQuienessomos;
      'agencia-mision-vision.valor': AgenciaMisionVisionValor;
      'agencia-organigrama.ctadirectorio': AgenciaOrganigramaCtadirectorio;
      'agencia-organigrama.funcionesporarea': AgenciaOrganigramaFuncionesporarea;
      'agencia-organigrama.organigrama': AgenciaOrganigramaOrganigrama;
      'agencia-organigrama.resolucion': AgenciaOrganigramaResolucion;
      'agencia-organigrama.resolucionesseccion': AgenciaOrganigramaResolucionesseccion;
      'agencia-plan-institucional-de-archivos.documento': AgenciaPlanInstitucionalDeArchivosDocumento;
      'agencia-sistema-de-control-interno.contactointerno': AgenciaSistemaDeControlInternoContactointerno;
      'agencia-sistema-de-control-interno.controlinterno': AgenciaSistemaDeControlInternoControlinterno;
      'agencia-sistema-de-control-interno.controlpolitico': AgenciaSistemaDeControlInternoControlpolitico;
      'agencia-sistema-de-control-interno.documento': AgenciaSistemaDeControlInternoDocumento;
      'agencia-sistema-de-control-interno.entidadesexterna': AgenciaSistemaDeControlInternoEntidadesexterna;
      'agencia-sistema-de-control-interno.informeslegal': AgenciaSistemaDeControlInternoInformeslegal;
      'agencia-sistema-de-control-interno.planesmejoramiento': AgenciaSistemaDeControlInternoPlanesmejoramiento;
      'agencia-sistema-integrado-de-gestion.document': AgenciaSistemaIntegradoDeGestionDocument;
      'agencia-sistema-integrado-de-gestion.section': AgenciaSistemaIntegradoDeGestionSection;
      'atencion-canales-de-atencion.canal': AtencionCanalesDeAtencionCanal;
      'atencion-canales-de-atencion.item': AtencionCanalesDeAtencionItem;
      'atencion-canales-de-atencion.portafolio': AtencionCanalesDeAtencionPortafolio;
      'atencion-glosario.termino': AtencionGlosarioTermino;
      'atencion-landing.enlacesexterno': AtencionLandingEnlacesexterno;
      'atencion-landing.seccion': AtencionLandingSeccion;
      'atencion-pqrs-servidores.inform': AtencionPqrsServidoresInform;
      'atencion-pqrs.definicion': AtencionPqrsDefinicion;
      'atencion-pqrs.inform': AtencionPqrsInform;
      'atencion-pqrs.report': AtencionPqrsReport;
      'atencion-preguntas-frecuentes.faq': AtencionPreguntasFrecuentesFaq;
      'atencion-vinculacion-a-terceros.documento': AtencionVinculacionATercerosDocumento;
      'ciprep.agenda': CiprepAgenda;
      'ciprep.aliados': CiprepAliados;
      'ciprep.cta': CiprepCta;
      'ciprep.dia1': CiprepDia1;
      'ciprep.dia2': CiprepDia2;
      'ciprep.estrategico': CiprepEstrategico;
      'ciprep.integridad': CiprepIntegridad;
      'ciprep.item': CiprepItem;
      'ciprep.memorias': CiprepMemorias;
      'ciprep.recurso': CiprepRecurso;
      'ciprep.speakersindex': CiprepSpeakersindex;
      'galeria.imagen': GaleriaImagen;
      'galeria.portada': GaleriaPortada;
      'home.columnasservicio': HomeColumnasservicio;
      'home.entidadesvigilada': HomeEntidadesvigilada;
      'home.item': HomeItem;
      'institucional-audios-itrc.audio': InstitucionalAudiosItrcAudio;
      'institucional-calendario-eventos.cta': InstitucionalCalendarioEventosCta;
      'institucional-defensa-judicial.inform': InstitucionalDefensaJudicialInform;
      'institucional-estados.notificacion': InstitucionalEstadosNotificacion;
      'institucional-estudios-investigaciones.inform': InstitucionalEstudiosInvestigacionesInform;
      'institucional-historico-investigaciones-disciplinarias.inform': InstitucionalHistoricoInvestigacionesDisciplinariasInform;
      'institucional-historico-sistema-control-interno.seccion': InstitucionalHistoricoSistemaControlInternoSeccion;
      'institucional-publicacion-datos-abiertos.cta': InstitucionalPublicacionDatosAbiertosCta;
      'mapa-del-sitio.extras': MapaDelSitioExtras;
      'mapa-del-sitio.item': MapaDelSitioItem;
      'normativa-decretos.decreto': NormativaDecretosDecreto;
      'normativa-landing.seccion': NormativaLandingSeccion;
      'normativa-marco-legal.documento': NormativaMarcoLegalDocumento;
      'normativa-marco-legal.seccion': NormativaMarcoLegalSeccion;
      'normativa-resoluciones.acto': NormativaResolucionesActo;
      'normativa-unificacion-suin-juriscol.norma': NormativaUnificacionSuinJuriscolNorma;
      'normativa-vigencias.inform': NormativaVigenciasInform;
      'normograma.norma': NormogramaNorma;
      'observatorio-del-observatorio.tab': ObservatorioDelObservatorioTab;
      'observatorio-eje-de-educacion-articulos.articulo': ObservatorioEjeDeEducacionArticulosArticulo;
      'observatorio-eje-de-educacion-conociendo.documento': ObservatorioEjeDeEducacionConociendoDocumento;
      'observatorio-eje-de-educacion-glosario-ninos.termino': ObservatorioEjeDeEducacionGlosarioNinosTermino;
      'observatorio-eje-de-educacion-itrc-para-ninos.seccion': ObservatorioEjeDeEducacionItrcParaNinosSeccion;
      'observatorio-eje-de-educacion-juego-de-roles.juego': ObservatorioEjeDeEducacionJuegoDeRolesJuego;
      'observatorio-eje-de-educacion-memorias-info.anio': ObservatorioEjeDeEducacionMemoriasInfoAnio;
      'observatorio-eje-de-educacion-memorias-info.entrada': ObservatorioEjeDeEducacionMemoriasInfoEntrada;
      'observatorio-eje-de-educacion-memorias.galeria': ObservatorioEjeDeEducacionMemoriasGaleria;
      'observatorio-eje-de-educacion-quiz.pregunta': ObservatorioEjeDeEducacionQuizPregunta;
      'observatorio-eje-de-educacion-repositorio-juridico.norma': ObservatorioEjeDeEducacionRepositorioJuridicoNorma;
      'observatorio-eje-de-educacion.seccion': ObservatorioEjeDeEducacionSeccion;
      'observatorio-eje-de-medicion.dashboard': ObservatorioEjeDeMedicionDashboard;
      'observatorio-eje-de-participacion-cartillas.cartilla': ObservatorioEjeDeParticipacionCartillasCartilla;
      'observatorio-eje-de-participacion-encuesta.participar': ObservatorioEjeDeParticipacionEncuestaParticipar;
      'observatorio-eje-de-participacion-encuesta.resultados': ObservatorioEjeDeParticipacionEncuestaResultados;
      'observatorio-eje-de-participacion-memorias-info.anio': ObservatorioEjeDeParticipacionMemoriasInfoAnio;
      'observatorio-eje-de-participacion-memorias-info.entrada': ObservatorioEjeDeParticipacionMemoriasInfoEntrada;
      'observatorio-eje-de-participacion-memorias.galeria': ObservatorioEjeDeParticipacionMemoriasGaleria;
      'observatorio-eje-de-participacion-noticias.noticia': ObservatorioEjeDeParticipacionNoticiasNoticia;
      'observatorio-eje-de-participacion-videos-tutoriales.video': ObservatorioEjeDeParticipacionVideosTutorialesVideo;
      'observatorio-eje-de-participacion.seccion': ObservatorioEjeDeParticipacionSeccion;
      'observatorio-observatorio.seccion': ObservatorioObservatorioSeccion;
      'participa-atencion-informe-comite-conciliacion.inform': ParticipaAtencionInformeComiteConciliacionInform;
      'participa-atencion-otros-grupos-interes.enlaz': ParticipaAtencionOtrosGruposInteresEnlaz;
      'participa-atencion-respuesta-anonimos.notificacion': ParticipaAtencionRespuestaAnonimosNotificacion;
      'participa-colaboracion.iniciativa': ParticipaColaboracionIniciativa;
      'participa-consulta-ciudadana.contenido': ParticipaConsultaCiudadanaContenido;
      'participa-consulta-ciudadana.enlaz': ParticipaConsultaCiudadanaEnlaz;
      'participa-control-social.enlaz': ParticipaControlSocialEnlaz;
      'participa-diagnostico.cajaherramienta': ParticipaDiagnosticoCajaherramienta;
      'participa-diagnostico.enlaz': ParticipaDiagnosticoEnlaz;
      'participa-planeacion.enlaz': ParticipaPlaneacionEnlaz;
      'participa-rendicion-de-cuentas.anio': ParticipaRendicionDeCuentasAnio;
      'participa-rendicion-de-cuentas.documento': ParticipaRendicionDeCuentasDocumento;
      'participa.seccion': ParticipaSeccion;
      'prensa-capsulas.capsula': PrensaCapsulasCapsula;
      'prensa-comunicados-institucionales.anio': PrensaComunicadosInstitucionalesAnio;
      'prensa-comunicados-institucionales.item': PrensaComunicadosInstitucionalesItem;
      'prensa-galeria.album': PrensaGaleriaAlbum;
      'prensa-landing.seccion': PrensaLandingSeccion;
      'prensa-videos.enlaz': PrensaVideosEnlaz;
      'prensa-videos.video': PrensaVideosVideo;
      'prensa.section': PrensaSection;
      'shared.related-link': SharedRelatedLink;
      'transparencia-accesibilidad.documento': TransparenciaAccesibilidadDocumento;
      'transparencia-comite-conciliacion.anio': TransparenciaComiteConciliacionAnio;
      'transparencia-comite-conciliacion.doc': TransparenciaComiteConciliacionDoc;
      'transparencia-contratacion-contratacion-suscrita.contratacionsuscrita': TransparenciaContratacionContratacionSuscritaContratacionsuscrita;
      'transparencia-contratacion-contratacion-suscrita.contrato': TransparenciaContratacionContratacionSuscritaContrato;
      'transparencia-contratacion-contratacion-suscrita.convocatoria': TransparenciaContratacionContratacionSuscritaConvocatoria;
      'transparencia-contratacion-contratacion-suscrita.proceso': TransparenciaContratacionContratacionSuscritaProceso;
      'transparencia-contratacion-ejecucion-contratos.documento': TransparenciaContratacionEjecucionContratosDocumento;
      'transparencia-contratacion-ejecucion-contratos.enlacesexterno': TransparenciaContratacionEjecucionContratosEnlacesexterno;
      'transparencia-contratacion-ejecucion-contratos.vigencia': TransparenciaContratacionEjecucionContratosVigencia;
      'transparencia-contratacion-formatos.formato': TransparenciaContratacionFormatosFormato;
      'transparencia-contratacion-manual.documento': TransparenciaContratacionManualDocumento;
      'transparencia-contratacion-plan-adquisiciones.anio': TransparenciaContratacionPlanAdquisicionesAnio;
      'transparencia-contratacion-plan-adquisiciones.doc': TransparenciaContratacionPlanAdquisicionesDoc;
      'transparencia-contratacion-procedimientos-adquisicion.documento': TransparenciaContratacionProcedimientosAdquisicionDocumento;
      'transparencia-decreto-unico.documento': TransparenciaDecretoUnicoDocumento;
      'transparencia-decretos-estructura.decreto': TransparenciaDecretosEstructuraDecreto;
      'transparencia-decretos-estructura.seccion': TransparenciaDecretosEstructuraSeccion;
      'transparencia-defensa-publica.enlaz': TransparenciaDefensaPublicaEnlaz;
      'transparencia-directorio-entidades.entidad': TransparenciaDirectorioEntidadesEntidad;
      'transparencia-directorio-entidades.grupo': TransparenciaDirectorioEntidadesGrupo;
      'transparencia-documentacion-esquema-publicacion.inform': TransparenciaDocumentacionEsquemaPublicacionInform;
      'transparencia-documentacion-formato-grupos-etnicos.inform': TransparenciaDocumentacionFormatoGruposEtnicosInform;
      'transparencia-documentacion-proteccion-datos.documento': TransparenciaDocumentacionProteccionDatosDocumento;
      'transparencia-documentacion-proteccion-datos.enlacesexterno': TransparenciaDocumentacionProteccionDatosEnlacesexterno;
      'transparencia-documentacion-registro-publicaciones.inform': TransparenciaDocumentacionRegistroPublicacionesInform;
      'transparencia-evaluacion-independiente.documento': TransparenciaEvaluacionIndependienteDocumento;
      'transparencia-evaluacion-independiente.enlacerelacionado': TransparenciaEvaluacionIndependienteEnlacerelacionado;
      'transparencia-formatos-contratos-pliegos-tipo.inform': TransparenciaFormatosContratosPliegosTipoInform;
      'transparencia-formatos-formularios.seccion': TransparenciaFormatosFormulariosSeccion;
      'transparencia-hojas-de-vida.aspirant': TransparenciaHojasDeVidaAspirant;
      'transparencia-indice-informacion-clasificada.inform': TransparenciaIndiceInformacionClasificadaInform;
      'transparencia-informacion-mujeres.link': TransparenciaInformacionMujeresLink;
      'transparencia-informacion-mujeres.seccion': TransparenciaInformacionMujeresSeccion;
      'transparencia-informes-empalme.documento': TransparenciaInformesEmpalmeDocumento;
      'transparencia-informes-legales.doc': TransparenciaInformesLegalesDoc;
      'transparencia-informes-legales.item': TransparenciaInformesLegalesItem;
      'transparencia-informes-legales.seccion': TransparenciaInformesLegalesSeccion;
      'transparencia-informes-organismos-ivc.enlaz': TransparenciaInformesOrganismosIvcEnlaz;
      'transparencia-informes-organismos.enlaz': TransparenciaInformesOrganismosEnlaz;
      'transparencia-informes.categoria': TransparenciaInformesCategoria;
      'transparencia-informes.destino': TransparenciaInformesDestino;
      'transparencia-informes.inform': TransparenciaInformesInform;
      'transparencia-leyes.ley': TransparenciaLeyesLey;
      'transparencia-normas-servicio.norma': TransparenciaNormasServicioNorma;
      'transparencia-normatividad-especial.seccion': TransparenciaNormatividadEspecialSeccion;
      'transparencia-otros-grupos.enlaz': TransparenciaOtrosGruposEnlaz;
      'transparencia-planes-mejoramiento.seccion': TransparenciaPlanesMejoramientoSeccion;
      'transparencia-politicas-manuales.derechosautor': TransparenciaPoliticasManualesDerechosautor;
      'transparencia-politicas-manuales.enlaz': TransparenciaPoliticasManualesEnlaz;
      'transparencia-procedimientos-decisiones.inform': TransparenciaProcedimientosDecisionesInform;
      'transparencia-programa-gestion-documental.inform': TransparenciaProgramaGestionDocumentalInform;
      'transparencia-proyectos-inversion.doc': TransparenciaProyectosInversionDoc;
      'transparencia-proyectos-inversion.enlacesexterno': TransparenciaProyectosInversionEnlacesexterno;
      'transparencia-proyectos-inversion.ficha': TransparenciaProyectosInversionFicha;
      'transparencia-proyectos-inversion.fichasebi': TransparenciaProyectosInversionFichasebi;
      'transparencia-proyectos-inversion.inform': TransparenciaProyectosInversionInform;
      'transparencia-proyectos-inversion.resumenejecutivo': TransparenciaProyectosInversionResumenejecutivo;
      'transparencia-proyectos-inversion.seguimientosspi': TransparenciaProyectosInversionSeguimientosspi;
      'transparencia-proyectos-normas-comentarios.enlacesexterno': TransparenciaProyectosNormasComentariosEnlacesexterno;
      'transparencia-relatoria.ficha': TransparenciaRelatoriaFicha;
      'transparencia-relatoria.resolucion': TransparenciaRelatoriaResolucion;
      'transparencia-rendicion-cuenta-contraloria.documento': TransparenciaRendicionCuentaContraloriaDocumento;
      'transparencia-reporte-austeridad-gasto.inform': TransparenciaReporteAusteridadGastoInform;
      'transparencia-sede-horarios.contacto': TransparenciaSedeHorariosContacto;
      'transparencia-sede-horarios.horario': TransparenciaSedeHorariosHorario;
      'transparencia-sede-horarios.mapa': TransparenciaSedeHorariosMapa;
      'transparencia-sede-horarios.sede': TransparenciaSedeHorariosSede;
      'transparencia-supervision-vigilancia.entidad': TransparenciaSupervisionVigilanciaEntidad;
      'transparencia-tablas-retencion.doc': TransparenciaTablasRetencionDoc;
      'transparencia-tablas-retencion.version': TransparenciaTablasRetencionVersion;
      'transparencia.children': TransparenciaChildren;
      'transparencia.item': TransparenciaItem;
      'transparencia.seccion': TransparenciaSeccion;
    }
  }
}
