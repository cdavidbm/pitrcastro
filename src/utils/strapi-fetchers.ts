/**
 * Auto-generado por cms-strapi/scripts/gen-strapi-fetchers.mjs
 * NO EDITAR A MANO. Cambios en schemas → regenerar:
 *   node cms-strapi/scripts/gen-strapi-fetchers.mjs
 */
import { strapiGet } from './strapi';

export const getCiprep = () => strapiGet<any>("/api/ciprep?populate[agenda][populate][dia1][populate][items]=true&populate[agenda][populate][dia2][populate][items]=true&populate[aliados][populate][estrategico]=true&populate[aliados][populate][integridad]=true&populate[memorias][populate][recursos]=true&populate[cta]=true&populate[speakersIndex]=true");
export const getHome = () => strapiGet<any>("/api/home?populate[entidadesVigiladas]=true&populate[columnasServicios][populate][items]=true");
export const getMapaDelSitio = () => strapiGet<any>("/api/mapa-del-sitio?populate[extras][populate][items]=true");
export const getNormograma = () => strapiGet<any>("/api/normograma?populate[normas]=true&populate[enlacesRelacionados]=true");
export const getParticipa = () => strapiGet<any>("/api/participa?populate[secciones]=true");
export const getPrensa = () => strapiGet<any>("/api/prensa?populate[sections]=true");
export const getTransparencia = () => strapiGet<any>("/api/transparencia?populate[secciones][populate][items][populate][children]=true");
export const getAgenciaDireccionamientoEstrategico = () => strapiGet<any>("/api/agencia-direccionamiento-estrategico?populate[sections]=true&populate[marcoNormativo][populate][normas]=true&populate[enlacesRelacionados]=true");
export const getAgenciaDirectorio = () => strapiGet<any>("/api/agencia-directorio?populate[directorios]=true&populate[escalaSalarial]=true&populate[infoAdicional]=true");
export const getAgenciaEquipoDirectivo = () => strapiGet<any>("/api/agencia-equipo-directivo?populate[directora]=true&populate[subdirectores]=true");
export const getAgenciaGestionMisional = () => strapiGet<any>("/api/agencia-gestion-misional?populate[subdirecciones][populate][observatorio]=true&populate[subdirecciones][populate][categorias][populate][documentos][populate][file]=true&populate[enlacesRelacionados]=true");
export const getAgenciaInformacionFinanciera = () => strapiGet<any>("/api/agencia-informacion-financiera?populate[tabs][populate][items]=true&populate[infoCards]=true&populate[ctaSection]=true");
export const getAgenciaLanding = () => strapiGet<any>("/api/agencia-landing?populate[secciones]=true");
export const getAgenciaMisionVision = () => strapiGet<any>("/api/agencia-mision-vision?populate[proposito]=true&populate[quienesSomos]=true&populate[queHacemos][populate][entidades]=true&populate[comoLoHacemos]=true&populate[funciones][populate][items]=true&populate[valores]=true&populate[mapaEstrategico]=true");
export const getAgenciaOrganigrama = () => strapiGet<any>("/api/agencia-organigrama?populate[organigrama]=true&populate[funcionesPorArea]=true&populate[resolucionesSeccion]=true&populate[resoluciones]=true&populate[ctaDirectorio]=true");
export const getAgenciaPlanInstitucionalDeArchivos = () => strapiGet<any>("/api/agencia-plan-institucional-de-archivos?populate[documentos]=true");
export const getAgenciaSistemaDeControlInterno = () => strapiGet<any>("/api/agencia-sistema-de-control-interno?populate[entidadesExternas]=true&populate[controlPolitico]=true&populate[controlInterno]=true&populate[contactoInterno]=true&populate[informesLegales][populate][documentos][populate][file]=true&populate[planesMejoramiento]=true&populate[enlacesRelacionados]=true");
export const getAgenciaSistemaIntegradoDeGestion = () => strapiGet<any>("/api/agencia-sistema-integrado-de-gestion?populate[sections][populate][documents][populate][file]=true&populate[enlacesRelacionados]=true");
export const getAgenciaDireccionamientoInformes = () => strapiGet<any>("/api/agencia-direccionamiento-informes?populate[sections][populate][documents][populate][file]=true");
export const getAgenciaDireccionamientoPlanes = () => strapiGet<any>("/api/agencia-direccionamiento-planes?populate[sections][populate][documents][populate][file]=true");
export const getAgenciaDireccionamientoPoliticas = () => strapiGet<any>("/api/agencia-direccionamiento-politicas?populate[sections][populate][documents][populate][file]=true");
export const getAgenciaEmpleoRrhhManualEspecificoFunciones = () => strapiGet<any>("/api/agencia-empleo-rrhh-manual-especifico-funciones?populate[secciones][populate][documentos]=true");
export const getAgenciaEmpleoRrhhManualIdentidadVisual = () => strapiGet<any>("/api/agencia-empleo-rrhh-manual-identidad-visual?populate[informes]=true");
export const getAgenciaEmpleoRrhhManualesInternos = () => strapiGet<any>("/api/agencia-empleo-rrhh-manuales-internos?populate[informes]=true");
export const getAgenciaEmpleoRrhhNombramientos = () => strapiGet<any>("/api/agencia-empleo-rrhh-nombramientos?populate[vigencias][populate][documentos]=true");
export const getAgenciaEmpleoRrhhOfertasEmpleo = () => strapiGet<any>("/api/agencia-empleo-rrhh-ofertas-empleo?populate[cta]=true");
export const getAtencionCanalesDeAtencion = () => strapiGet<any>("/api/atencion-canales-de-atencion?populate[canales][populate][items]=true&populate[portafolio][populate][file]=true&populate[enlacesRelacionados]=true");
export const getAtencionCorreoNotificacionesJudiciales = () => strapiGet<any>("/api/atencion-correo-notificaciones-judiciales?populate[enlacesRelacionados]=true");
export const getAtencionGlosario = () => strapiGet<any>("/api/atencion-glosario?populate[terminos]=true&populate[enlacesRelacionados]=true");
export const getAtencionLanding = () => strapiGet<any>("/api/atencion-landing?populate[secciones]=true&populate[enlacesExternos]=true");
export const getAtencionNotificacionesPorAviso = () => strapiGet<any>("/api/atencion-notificaciones-por-aviso?populate[enlacesRelacionados]=true");
export const getAtencionPqrsServidores = () => strapiGet<any>("/api/atencion-pqrs-servidores?populate[informes]=true");
export const getAtencionPqrs = () => strapiGet<any>("/api/atencion-pqrs?populate[definiciones]=true&populate[informes][populate][reportes][populate][file]=true&populate[enlacesRelacionados]=true");
export const getAtencionPreguntasFrecuentes = () => strapiGet<any>("/api/atencion-preguntas-frecuentes?populate[faqs]=true&populate[enlacesRelacionados]=true");
export const getAtencionVinculacionATerceros = () => strapiGet<any>("/api/atencion-vinculacion-a-terceros?populate[documentos][populate][file]=true&populate[enlacesRelacionados]=true");
export const getInstitucionalAudiosItrc = () => strapiGet<any>("/api/institucional-audios-itrc?populate[audios]=true");
export const getInstitucionalCalendarioEventos = () => strapiGet<any>("/api/institucional-calendario-eventos?populate[cta]=true");
export const getInstitucionalDefensaJudicial = () => strapiGet<any>("/api/institucional-defensa-judicial?populate[informes]=true");
export const getInstitucionalEstados = () => strapiGet<any>("/api/institucional-estados?populate[notificaciones]=true");
export const getInstitucionalEstudiosInvestigaciones = () => strapiGet<any>("/api/institucional-estudios-investigaciones?populate[informes]=true");
export const getInstitucionalHistoricoInvestigacionesDisciplinarias = () => strapiGet<any>("/api/institucional-historico-investigaciones-disciplinarias?populate[informes]=true");
export const getInstitucionalHistoricoSistemaControlInterno = () => strapiGet<any>("/api/institucional-historico-sistema-control-interno?populate[secciones]=true&populate[enlacesRelacionados]=true");
export const getInstitucionalPublicacionDatosAbiertos = () => strapiGet<any>("/api/institucional-publicacion-datos-abiertos?populate[cta]=true");
export const getNormativaDecretos = () => strapiGet<any>("/api/normativa-decretos?populate[decretos][populate][file]=true&populate[enlacesRelacionados]=true");
export const getNormativaLanding = () => strapiGet<any>("/api/normativa-landing?populate[secciones]=true");
export const getNormativaMarcoLegal = () => strapiGet<any>("/api/normativa-marco-legal?populate[secciones][populate][documentos][populate][file]=true&populate[enlacesRelacionados]=true");
export const getNormativaResoluciones = () => strapiGet<any>("/api/normativa-resoluciones?populate[actos][populate][pdfUrl]=true&populate[enlacesRelacionados]=true");
export const getNormativaUnificacionSuinJuriscol = () => strapiGet<any>("/api/normativa-unificacion-suin-juriscol?populate[normas][populate][pdfUrl]=true&populate[enlacesRelacionados]=true");
export const getObservatorioDelObservatorio = () => strapiGet<any>("/api/observatorio-del-observatorio?populate[tabs]=true&populate[enlacesRelacionados]=true");
export const getObservatorioEjeDeEducacion = () => strapiGet<any>("/api/observatorio-eje-de-educacion?populate[secciones]=true");
export const getObservatorioEjeDeMedicion = () => strapiGet<any>("/api/observatorio-eje-de-medicion?populate[dashboards]=true&populate[enlacesRelacionados]=true");
export const getObservatorioEjeDeParticipacion = () => strapiGet<any>("/api/observatorio-eje-de-participacion?populate[secciones]=true");
export const getObservatorioObservatorio = () => strapiGet<any>("/api/observatorio-observatorio?populate[secciones]=true");
export const getObservatorioEjeDeEducacionArticulos = () => strapiGet<any>("/api/observatorio-eje-de-educacion-articulos?populate[articulos]=true");
export const getObservatorioEjeDeEducacionCartillaInfantil = () => strapiGet<any>("/api/observatorio-eje-de-educacion-cartilla-infantil");
export const getObservatorioEjeDeEducacionConociendo = () => strapiGet<any>("/api/observatorio-eje-de-educacion-conociendo?populate[documentos]=true");
export const getObservatorioEjeDeEducacionCuento = () => strapiGet<any>("/api/observatorio-eje-de-educacion-cuento?populate[pdfUrl]=true");
export const getObservatorioEjeDeEducacionGlosarioNinos = () => strapiGet<any>("/api/observatorio-eje-de-educacion-glosario-ninos?populate[terminos]=true");
export const getObservatorioEjeDeEducacionItrcParaNinos = () => strapiGet<any>("/api/observatorio-eje-de-educacion-itrc-para-ninos?populate[secciones]=true");
export const getObservatorioEjeDeEducacionJuegoDeRoles = () => strapiGet<any>("/api/observatorio-eje-de-educacion-juego-de-roles?populate[juegos]=true");
export const getObservatorioEjeDeEducacionLibroInfantil = () => strapiGet<any>("/api/observatorio-eje-de-educacion-libro-infantil?populate[pdfUrl]=true");
export const getObservatorioEjeDeEducacionMemoriasInfo = () => strapiGet<any>("/api/observatorio-eje-de-educacion-memorias-info?populate[anios][populate][entradas]=true");
export const getObservatorioEjeDeEducacionQuiz = () => strapiGet<any>("/api/observatorio-eje-de-educacion-quiz?populate[preguntas]=true");
export const getObservatorioEjeDeEducacionRepositorioJuridico = () => strapiGet<any>("/api/observatorio-eje-de-educacion-repositorio-juridico?populate[normas]=true");
export const getObservatorioEjeDeEducacionSopaDeLetras = () => strapiGet<any>("/api/observatorio-eje-de-educacion-sopa-de-letras");
export const getObservatorioEjeDeEducacionVideoNinos = () => strapiGet<any>("/api/observatorio-eje-de-educacion-video-ninos");
export const getObservatorioEjeDeParticipacionCartillas = () => strapiGet<any>("/api/observatorio-eje-de-participacion-cartillas?populate[cartillas]=true");
export const getObservatorioEjeDeParticipacionEncuesta = () => strapiGet<any>("/api/observatorio-eje-de-participacion-encuesta?populate[participar]=true&populate[resultados]=true");
export const getObservatorioEjeDeParticipacionMemoriasInfo = () => strapiGet<any>("/api/observatorio-eje-de-participacion-memorias-info?populate[anios][populate][entradas]=true");
export const getObservatorioEjeDeParticipacionNoticias = () => strapiGet<any>("/api/observatorio-eje-de-participacion-noticias?populate[noticias]=true");
export const getObservatorioEjeDeParticipacionVideosTutoriales = () => strapiGet<any>("/api/observatorio-eje-de-participacion-videos-tutoriales?populate[videos]=true");
export const getParticipaColaboracion = () => strapiGet<any>("/api/participa-colaboracion?populate[iniciativas]=true&populate[enlacesRelacionados]=true");
export const getParticipaConsultaCiudadana = () => strapiGet<any>("/api/participa-consulta-ciudadana?populate[contenido]=true&populate[enlaces]=true&populate[enlacesRelacionados]=true");
export const getParticipaControlSocial = () => strapiGet<any>("/api/participa-control-social?populate[enlaces]=true&populate[enlacesRelacionados]=true");
export const getParticipaDiagnostico = () => strapiGet<any>("/api/participa-diagnostico?populate[enlaces]=true&populate[cajaHerramientas]=true&populate[enlacesRelacionados]=true");
export const getParticipaPlaneacion = () => strapiGet<any>("/api/participa-planeacion?populate[enlaces]=true&populate[enlacesRelacionados]=true");
export const getParticipaRendicionDeCuentas = () => strapiGet<any>("/api/participa-rendicion-de-cuentas?populate[anios][populate][documentos]=true&populate[enlacesRelacionados]=true");
export const getParticipaAtencionInformeComiteConciliacion = () => strapiGet<any>("/api/participa-atencion-informe-comite-conciliacion?populate[informes]=true");
export const getParticipaAtencionOtrosGruposInteres = () => strapiGet<any>("/api/participa-atencion-otros-grupos-interes?populate[enlaces]=true");
export const getParticipaAtencionRespuestaAnonimos = () => strapiGet<any>("/api/participa-atencion-respuesta-anonimos?populate[notificaciones]=true");
export const getPrensaCapsulas = () => strapiGet<any>("/api/prensa-capsulas?populate[capsulas]=true&populate[enlacesRelacionados]=true");
export const getPrensaComunicadosInstitucionales = () => strapiGet<any>("/api/prensa-comunicados-institucionales?populate[anios][populate][items]=true");
export const getPrensaGaleria = () => strapiGet<any>("/api/prensa-galeria?populate[albums]=true&populate[enlacesRelacionados]=true");
export const getPrensaLanding = () => strapiGet<any>("/api/prensa-landing?populate[secciones]=true");
export const getPrensaVideos = () => strapiGet<any>("/api/prensa-videos?populate[videos]=true&populate[enlaces]=true&populate[enlacesRelacionados]=true");
export const getTransparenciaAccesibilidad = () => strapiGet<any>("/api/transparencia-accesibilidad?populate[documentos]=true");
export const getTransparenciaAgremiaciones = () => strapiGet<any>("/api/transparencia-agremiaciones?populate[pdfUrl]=true");
export const getTransparenciaComiteConciliacion = () => strapiGet<any>("/api/transparencia-comite-conciliacion?populate[anios][populate][docs]=true");
export const getTransparenciaDatosAbiertos = () => strapiGet<any>("/api/transparencia-datos-abiertos");
export const getTransparenciaDecretoUnico = () => strapiGet<any>("/api/transparencia-decreto-unico?populate[documentos]=true");
export const getTransparenciaDecretosEstructura = () => strapiGet<any>("/api/transparencia-decretos-estructura?populate[secciones][populate][decretos]=true");
export const getTransparenciaDefensaPublica = () => strapiGet<any>("/api/transparencia-defensa-publica?populate[enlaces]=true");
export const getTransparenciaDirectorioEntidades = () => strapiGet<any>("/api/transparencia-directorio-entidades?populate[grupos][populate][entidades]=true");
export const getTransparenciaEsquemaPublicacion = () => strapiGet<any>("/api/transparencia-esquema-publicacion?populate[pdfUrl]=true");
export const getTransparenciaEvaluacionIndependiente = () => strapiGet<any>("/api/transparencia-evaluacion-independiente?populate[documentos]=true&populate[enlaceRelacionado]=true");
export const getTransparenciaFormatosContratosPliegosTipo = () => strapiGet<any>("/api/transparencia-formatos-contratos-pliegos-tipo?populate[informes]=true");
export const getTransparenciaFormatosFormularios = () => strapiGet<any>("/api/transparencia-formatos-formularios?populate[secciones]=true");
export const getTransparenciaHojasDeVida = () => strapiGet<any>("/api/transparencia-hojas-de-vida?populate[aspirantes]=true");
export const getTransparenciaIndiceInformacionClasificada = () => strapiGet<any>("/api/transparencia-indice-informacion-clasificada?populate[informes]=true");
export const getTransparenciaInformacionMujeres = () => strapiGet<any>("/api/transparencia-informacion-mujeres?populate[secciones][populate][links]=true");
export const getTransparenciaInformesEmpalme = () => strapiGet<any>("/api/transparencia-informes-empalme?populate[documentos]=true");
export const getTransparenciaInformesLegales = () => strapiGet<any>("/api/transparencia-informes-legales?populate[secciones][populate][docs][populate][items]=true");
export const getTransparenciaInformesOrganismosIvc = () => strapiGet<any>("/api/transparencia-informes-organismos-ivc?populate[enlaces]=true");
export const getTransparenciaInformesOrganismos = () => strapiGet<any>("/api/transparencia-informes-organismos?populate[enlaces]=true");
export const getTransparenciaLeyes = () => strapiGet<any>("/api/transparencia-leyes?populate[leyes]=true");
export const getTransparenciaNormasServicio = () => strapiGet<any>("/api/transparencia-normas-servicio?populate[normas]=true");
export const getTransparenciaNormatividadEspecial = () => strapiGet<any>("/api/transparencia-normatividad-especial?populate[secciones]=true");
export const getTransparenciaOtrosGrupos = () => strapiGet<any>("/api/transparencia-otros-grupos?populate[enlaces]=true");
export const getTransparenciaPlanesMejoramiento = () => strapiGet<any>("/api/transparencia-planes-mejoramiento?populate[secciones]=true");
export const getTransparenciaPoliticasManuales = () => strapiGet<any>("/api/transparencia-politicas-manuales?populate[enlaces]=true&populate[derechosAutor]=true");
export const getTransparenciaProcedimientosDecisiones = () => strapiGet<any>("/api/transparencia-procedimientos-decisiones?populate[informes]=true");
export const getTransparenciaProcedimientos = () => strapiGet<any>("/api/transparencia-procedimientos?populate[pdfUrl]=true");
export const getTransparenciaProgramaGestionDocumental = () => strapiGet<any>("/api/transparencia-programa-gestion-documental?populate[informes]=true");
export const getTransparenciaProtocoloAtencion = () => strapiGet<any>("/api/transparencia-protocolo-atencion?populate[pdfUrl]=true");
export const getTransparenciaProyectosInversion = () => strapiGet<any>("/api/transparencia-proyectos-inversion?populate[enlacesExternos]=true&populate[informes][populate][docs]=true&populate[fichasEbi][populate][fichas]=true&populate[resumenEjecutivo]=true&populate[seguimientosSPI]=true");
export const getTransparenciaProyectosNormasComentarios = () => strapiGet<any>("/api/transparencia-proyectos-normas-comentarios?populate[enlacesExternos]=true");
export const getTransparenciaRegistroActivos = () => strapiGet<any>("/api/transparencia-registro-activos?populate[pdfUrl]=true");
export const getTransparenciaRelatoria = () => strapiGet<any>("/api/transparencia-relatoria?populate[resolucion]=true&populate[fichas][populate][archivo]=true");
export const getTransparenciaRendicionCuentaContraloria = () => strapiGet<any>("/api/transparencia-rendicion-cuenta-contraloria?populate[documentos]=true");
export const getTransparenciaReporteAusteridadGasto = () => strapiGet<any>("/api/transparencia-reporte-austeridad-gasto?populate[informes]=true");
export const getTransparenciaSedeHorarios = () => strapiGet<any>("/api/transparencia-sede-horarios?populate[sede]=true&populate[horario]=true&populate[contacto]=true&populate[mapa]=true");
export const getTransparenciaSupervisionVigilancia = () => strapiGet<any>("/api/transparencia-supervision-vigilancia?populate[entidades]=true");
export const getTransparenciaTablasRetencion = () => strapiGet<any>("/api/transparencia-tablas-retencion?populate[versiones][populate][docs]=true");
export const getTransparenciaTramites = () => strapiGet<any>("/api/transparencia-tramites");
export const getTransparenciaContratacionContratacionSuscrita = () => strapiGet<any>("/api/transparencia-contratacion-contratacion-suscrita?populate[convocatorias][populate][procesos][populate][pdfUrl]=true&populate[contratacionSuscrita][populate][contratos]=true");
export const getTransparenciaContratacionEjecucionContratos = () => strapiGet<any>("/api/transparencia-contratacion-ejecucion-contratos?populate[vigencias][populate][documentos]=true&populate[enlacesExternos]=true");
export const getTransparenciaContratacionEjecucion = () => strapiGet<any>("/api/transparencia-contratacion-ejecucion");
export const getTransparenciaContratacionFormatos = () => strapiGet<any>("/api/transparencia-contratacion-formatos?populate[formatos]=true");
export const getTransparenciaContratacionManual = () => strapiGet<any>("/api/transparencia-contratacion-manual?populate[documentos]=true");
export const getTransparenciaContratacionPlanAdquisiciones = () => strapiGet<any>("/api/transparencia-contratacion-plan-adquisiciones?populate[anios][populate][docs]=true");
export const getTransparenciaContratacionProcedimientosAdquisicion = () => strapiGet<any>("/api/transparencia-contratacion-procedimientos-adquisicion?populate[documentos]=true");
export const getTransparenciaDocumentacionEsquemaPublicacion = () => strapiGet<any>("/api/transparencia-documentacion-esquema-publicacion?populate[informes]=true");
export const getTransparenciaDocumentacionFormatoGruposEtnicos = () => strapiGet<any>("/api/transparencia-documentacion-formato-grupos-etnicos?populate[informes]=true");
export const getTransparenciaDocumentacionProteccionDatos = () => strapiGet<any>("/api/transparencia-documentacion-proteccion-datos?populate[documentos]=true&populate[enlacesExternos]=true");
export const getTransparenciaDocumentacionRegistroPublicaciones = () => strapiGet<any>("/api/transparencia-documentacion-registro-publicaciones?populate[informes]=true");

export const getCiprepSpeakerList = () => strapiGet<any[]>("/api/ciprep-speakers?pagination[pageSize]=2000");
export const getGaleriaList = () => strapiGet<any[]>("/api/galerias?pagination[pageSize]=2000&populate[portada]=true&populate[imagenes]=true");
export const getNormativaDelitoList = () => strapiGet<any[]>("/api/normativa-delitos?pagination[pageSize]=2000");
export const getNormativaVigenciaList = () => strapiGet<any[]>("/api/normativa-vigencias?pagination[pageSize]=2000&populate[informes]=true");
export const getObservatorioEjeDeEducacionMemoriaList = () => strapiGet<any[]>("/api/observatorio-eje-de-educacion-memorias?pagination[pageSize]=2000&populate[galeria]=true");
export const getObservatorioEjeDeParticipacionMemoriaList = () => strapiGet<any[]>("/api/observatorio-eje-de-participacion-memorias?pagination[pageSize]=2000&populate[galeria]=true");
export const getTransparenciaInformeList = () => strapiGet<any[]>("/api/transparencia-informes?pagination[pageSize]=2000&populate[categorias][populate][destino]=true&populate[informes]=true");
export const getNotificacionList = () => strapiGet<any[]>("/api/notificaciones?pagination[pageSize]=2000&populate[pdfUrl]=true");
export const getEventoList = () => strapiGet<any[]>("/api/eventos?pagination[pageSize]=2000");

export const fetchers = {
  "ciprep": getCiprep,
  "home": getHome,
  "mapa-del-sitio": getMapaDelSitio,
  "normograma": getNormograma,
  "participa": getParticipa,
  "prensa": getPrensa,
  "transparencia": getTransparencia,
  "agencia-direccionamiento-estrategico": getAgenciaDireccionamientoEstrategico,
  "agencia-directorio": getAgenciaDirectorio,
  "agencia-equipo-directivo": getAgenciaEquipoDirectivo,
  "agencia-gestion-misional": getAgenciaGestionMisional,
  "agencia-informacion-financiera": getAgenciaInformacionFinanciera,
  "agencia-landing": getAgenciaLanding,
  "agencia-mision-vision": getAgenciaMisionVision,
  "agencia-organigrama": getAgenciaOrganigrama,
  "agencia-plan-institucional-de-archivos": getAgenciaPlanInstitucionalDeArchivos,
  "agencia-sistema-de-control-interno": getAgenciaSistemaDeControlInterno,
  "agencia-sistema-integrado-de-gestion": getAgenciaSistemaIntegradoDeGestion,
  "agencia-direccionamiento-informes": getAgenciaDireccionamientoInformes,
  "agencia-direccionamiento-planes": getAgenciaDireccionamientoPlanes,
  "agencia-direccionamiento-politicas": getAgenciaDireccionamientoPoliticas,
  "agencia-empleo-rrhh-manual-especifico-funciones": getAgenciaEmpleoRrhhManualEspecificoFunciones,
  "agencia-empleo-rrhh-manual-identidad-visual": getAgenciaEmpleoRrhhManualIdentidadVisual,
  "agencia-empleo-rrhh-manuales-internos": getAgenciaEmpleoRrhhManualesInternos,
  "agencia-empleo-rrhh-nombramientos": getAgenciaEmpleoRrhhNombramientos,
  "agencia-empleo-rrhh-ofertas-empleo": getAgenciaEmpleoRrhhOfertasEmpleo,
  "atencion-canales-de-atencion": getAtencionCanalesDeAtencion,
  "atencion-correo-notificaciones-judiciales": getAtencionCorreoNotificacionesJudiciales,
  "atencion-glosario": getAtencionGlosario,
  "atencion-landing": getAtencionLanding,
  "atencion-notificaciones-por-aviso": getAtencionNotificacionesPorAviso,
  "atencion-pqrs-servidores": getAtencionPqrsServidores,
  "atencion-pqrs": getAtencionPqrs,
  "atencion-preguntas-frecuentes": getAtencionPreguntasFrecuentes,
  "atencion-vinculacion-a-terceros": getAtencionVinculacionATerceros,
  "institucional-audios-itrc": getInstitucionalAudiosItrc,
  "institucional-calendario-eventos": getInstitucionalCalendarioEventos,
  "institucional-defensa-judicial": getInstitucionalDefensaJudicial,
  "institucional-estados": getInstitucionalEstados,
  "institucional-estudios-investigaciones": getInstitucionalEstudiosInvestigaciones,
  "institucional-historico-investigaciones-disciplinarias": getInstitucionalHistoricoInvestigacionesDisciplinarias,
  "institucional-historico-sistema-control-interno": getInstitucionalHistoricoSistemaControlInterno,
  "institucional-publicacion-datos-abiertos": getInstitucionalPublicacionDatosAbiertos,
  "normativa-decretos": getNormativaDecretos,
  "normativa-landing": getNormativaLanding,
  "normativa-marco-legal": getNormativaMarcoLegal,
  "normativa-resoluciones": getNormativaResoluciones,
  "normativa-unificacion-suin-juriscol": getNormativaUnificacionSuinJuriscol,
  "observatorio-del-observatorio": getObservatorioDelObservatorio,
  "observatorio-eje-de-educacion": getObservatorioEjeDeEducacion,
  "observatorio-eje-de-medicion": getObservatorioEjeDeMedicion,
  "observatorio-eje-de-participacion": getObservatorioEjeDeParticipacion,
  "observatorio-observatorio": getObservatorioObservatorio,
  "observatorio-eje-de-educacion-articulos": getObservatorioEjeDeEducacionArticulos,
  "observatorio-eje-de-educacion-cartilla-infantil": getObservatorioEjeDeEducacionCartillaInfantil,
  "observatorio-eje-de-educacion-conociendo": getObservatorioEjeDeEducacionConociendo,
  "observatorio-eje-de-educacion-cuento": getObservatorioEjeDeEducacionCuento,
  "observatorio-eje-de-educacion-glosario-ninos": getObservatorioEjeDeEducacionGlosarioNinos,
  "observatorio-eje-de-educacion-itrc-para-ninos": getObservatorioEjeDeEducacionItrcParaNinos,
  "observatorio-eje-de-educacion-juego-de-roles": getObservatorioEjeDeEducacionJuegoDeRoles,
  "observatorio-eje-de-educacion-libro-infantil": getObservatorioEjeDeEducacionLibroInfantil,
  "observatorio-eje-de-educacion-memorias-info": getObservatorioEjeDeEducacionMemoriasInfo,
  "observatorio-eje-de-educacion-quiz": getObservatorioEjeDeEducacionQuiz,
  "observatorio-eje-de-educacion-repositorio-juridico": getObservatorioEjeDeEducacionRepositorioJuridico,
  "observatorio-eje-de-educacion-sopa-de-letras": getObservatorioEjeDeEducacionSopaDeLetras,
  "observatorio-eje-de-educacion-video-ninos": getObservatorioEjeDeEducacionVideoNinos,
  "observatorio-eje-de-participacion-cartillas": getObservatorioEjeDeParticipacionCartillas,
  "observatorio-eje-de-participacion-encuesta": getObservatorioEjeDeParticipacionEncuesta,
  "observatorio-eje-de-participacion-memorias-info": getObservatorioEjeDeParticipacionMemoriasInfo,
  "observatorio-eje-de-participacion-noticias": getObservatorioEjeDeParticipacionNoticias,
  "observatorio-eje-de-participacion-videos-tutoriales": getObservatorioEjeDeParticipacionVideosTutoriales,
  "participa-colaboracion": getParticipaColaboracion,
  "participa-consulta-ciudadana": getParticipaConsultaCiudadana,
  "participa-control-social": getParticipaControlSocial,
  "participa-diagnostico": getParticipaDiagnostico,
  "participa-planeacion": getParticipaPlaneacion,
  "participa-rendicion-de-cuentas": getParticipaRendicionDeCuentas,
  "participa-atencion-informe-comite-conciliacion": getParticipaAtencionInformeComiteConciliacion,
  "participa-atencion-otros-grupos-interes": getParticipaAtencionOtrosGruposInteres,
  "participa-atencion-respuesta-anonimos": getParticipaAtencionRespuestaAnonimos,
  "prensa-capsulas": getPrensaCapsulas,
  "prensa-comunicados-institucionales": getPrensaComunicadosInstitucionales,
  "prensa-galeria": getPrensaGaleria,
  "prensa-landing": getPrensaLanding,
  "prensa-videos": getPrensaVideos,
  "transparencia-accesibilidad": getTransparenciaAccesibilidad,
  "transparencia-agremiaciones": getTransparenciaAgremiaciones,
  "transparencia-comite-conciliacion": getTransparenciaComiteConciliacion,
  "transparencia-datos-abiertos": getTransparenciaDatosAbiertos,
  "transparencia-decreto-unico": getTransparenciaDecretoUnico,
  "transparencia-decretos-estructura": getTransparenciaDecretosEstructura,
  "transparencia-defensa-publica": getTransparenciaDefensaPublica,
  "transparencia-directorio-entidades": getTransparenciaDirectorioEntidades,
  "transparencia-esquema-publicacion": getTransparenciaEsquemaPublicacion,
  "transparencia-evaluacion-independiente": getTransparenciaEvaluacionIndependiente,
  "transparencia-formatos-contratos-pliegos-tipo": getTransparenciaFormatosContratosPliegosTipo,
  "transparencia-formatos-formularios": getTransparenciaFormatosFormularios,
  "transparencia-hojas-de-vida": getTransparenciaHojasDeVida,
  "transparencia-indice-informacion-clasificada": getTransparenciaIndiceInformacionClasificada,
  "transparencia-informacion-mujeres": getTransparenciaInformacionMujeres,
  "transparencia-informes-empalme": getTransparenciaInformesEmpalme,
  "transparencia-informes-legales": getTransparenciaInformesLegales,
  "transparencia-informes-organismos-ivc": getTransparenciaInformesOrganismosIvc,
  "transparencia-informes-organismos": getTransparenciaInformesOrganismos,
  "transparencia-leyes": getTransparenciaLeyes,
  "transparencia-normas-servicio": getTransparenciaNormasServicio,
  "transparencia-normatividad-especial": getTransparenciaNormatividadEspecial,
  "transparencia-otros-grupos": getTransparenciaOtrosGrupos,
  "transparencia-planes-mejoramiento": getTransparenciaPlanesMejoramiento,
  "transparencia-politicas-manuales": getTransparenciaPoliticasManuales,
  "transparencia-procedimientos-decisiones": getTransparenciaProcedimientosDecisiones,
  "transparencia-procedimientos": getTransparenciaProcedimientos,
  "transparencia-programa-gestion-documental": getTransparenciaProgramaGestionDocumental,
  "transparencia-protocolo-atencion": getTransparenciaProtocoloAtencion,
  "transparencia-proyectos-inversion": getTransparenciaProyectosInversion,
  "transparencia-proyectos-normas-comentarios": getTransparenciaProyectosNormasComentarios,
  "transparencia-registro-activos": getTransparenciaRegistroActivos,
  "transparencia-relatoria": getTransparenciaRelatoria,
  "transparencia-rendicion-cuenta-contraloria": getTransparenciaRendicionCuentaContraloria,
  "transparencia-reporte-austeridad-gasto": getTransparenciaReporteAusteridadGasto,
  "transparencia-sede-horarios": getTransparenciaSedeHorarios,
  "transparencia-supervision-vigilancia": getTransparenciaSupervisionVigilancia,
  "transparencia-tablas-retencion": getTransparenciaTablasRetencion,
  "transparencia-tramites": getTransparenciaTramites,
  "transparencia-contratacion-contratacion-suscrita": getTransparenciaContratacionContratacionSuscrita,
  "transparencia-contratacion-ejecucion-contratos": getTransparenciaContratacionEjecucionContratos,
  "transparencia-contratacion-ejecucion": getTransparenciaContratacionEjecucion,
  "transparencia-contratacion-formatos": getTransparenciaContratacionFormatos,
  "transparencia-contratacion-manual": getTransparenciaContratacionManual,
  "transparencia-contratacion-plan-adquisiciones": getTransparenciaContratacionPlanAdquisiciones,
  "transparencia-contratacion-procedimientos-adquisicion": getTransparenciaContratacionProcedimientosAdquisicion,
  "transparencia-documentacion-esquema-publicacion": getTransparenciaDocumentacionEsquemaPublicacion,
  "transparencia-documentacion-formato-grupos-etnicos": getTransparenciaDocumentacionFormatoGruposEtnicos,
  "transparencia-documentacion-proteccion-datos": getTransparenciaDocumentacionProteccionDatos,
  "transparencia-documentacion-registro-publicaciones": getTransparenciaDocumentacionRegistroPublicaciones,
  "ciprep-speaker__list": getCiprepSpeakerList,
  "galeria__list": getGaleriaList,
  "normativa-delito__list": getNormativaDelitoList,
  "normativa-vigencia__list": getNormativaVigenciaList,
  "observatorio-eje-de-educacion-memoria__list": getObservatorioEjeDeEducacionMemoriaList,
  "observatorio-eje-de-participacion-memoria__list": getObservatorioEjeDeParticipacionMemoriaList,
  "transparencia-informe__list": getTransparenciaInformeList,
  "notificacion__list": getNotificacionList,
  "evento__list": getEventoList,
};
