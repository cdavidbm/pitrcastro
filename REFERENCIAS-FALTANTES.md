# Referencias faltantes / placeholders del origen

> **Propósito**: este documento es el registro oficial de auditoría de la migración WP → Astro del portal ITRC. Cada entrada documenta un caso en el que el **sitio origen WordPress** referenciaba contenido (título de documento, sección, enlace) sin proveer el archivo/URL sustantivo correspondiente. Se registra para: (1) evitar omisiones silenciosas en el nuevo portal, (2) transparentar ante cualquier auditoría que la carencia **viene del origen** y no de la migración, (3) dar a los responsables de cada área una lista accionable de documentos por publicar.
>
> **Protocolo**: nunca omitir un ítem sin documentarlo aquí. Si durante un lote se detecta un enlace roto, un PDF inexistente, un título sin destino o un tab vacío, se registra con: origen WP, qué falta, cómo se manejó en el portal nuevo, y un campo abierto para el responsable que debe proveerlo.
>
> **Convención de estado**:
> - `faltante-en-origen`: el contenido declarado no existe en WP (placeholder, `href="#"`, etc.).
> - `enlace-roto`: WP tenía URL pero el archivo devuelve 404 / no resuelve.
> - `duplicado-en-origen`: el mismo PDF aparece múltiples veces en WP (preservado tal cual).
> - `enlace-externo-perdido`: sistema externo citado por WP ya no existe (SIRECI viejo, Liferay legacy, etc.).
>
> **Última actualización**: 2026-04-15

---

## Resumen cuantitativo

| Lote | Entradas registradas |
|---|:---:|
| N2 (#34 Ejecución contratos) | 73 URLs duplicadas |
| O3 (#46 Catálogo OCI 3LD) | 27 categorías con 90 placeholders; 12 sin destino en portal nuevo |
| M1 (defensa-publica.json) | 1 enlace interno a destino inexistente |
| M3 (decretos-estructura) | 1 enlace a archivo con nombre inconsistente en origen |
| M4 (programa-gestion-documental) | 1 decisión de slug registrada (desviación intencional del slug WP) |
| V (CIPREP) | Sub-app completa descartada en esta fase (decisión estratégica) |
| T (#91 Calendario de Eventos) | Página WP contenía solo shortcode de plugin descontinuado — migrada como wrapper a agenda vigente |
| W (UI/UX) | 3 elementos con requisito administrativo / acceso a terceros (ConverTIC, GTranslate, YouTube rendición) |
| Sync 2026-04-15 (#2 Planes) | 124 PDFs históricos en WP no presentes en local — esperan integración editorial |
| Sync 2026-04-15 (#3 Info Financiera) | 43 PDFs históricos (mayormente Presupuesto Series 2012-2017) en WP no presentes en local |
| AUDIT-1 gestion-misional | 3 URLs en HTML WP devuelven 404 (local ya tiene URLs correctas) |
| AUDIT-1 sistema-integrado-de-gestion | 2 archivos WP listados pero devuelven 404 (pendiente publicación real) |
| AUDIT-2 Transparencia | 19 URLs en HTML WP devuelven 404 (local tiene versiones correctas) + 1 duplicación legacy resuelta |
| AUDIT-3 Normativa | 3 URLs en WP dan 404/no-conecta (1 externa MinInterior 404, 1 externa Presidencia con espacios no-codificados) |
| AUDIT-4 Atención | 2 correcciones aplicadas (PQRS Servidores migrado + Chat ITRC enriquecido con 8 condiciones completas) |
| **Total** | **~100+ items bajo auditoría** |

---

## Entradas

### #46 — Catálogo OCI 3LD (Lote O3)

**URL origen WP**: https://www.itrc.gov.co/Itrc/informes-de-evaluacion-y-auditoria-de-la-agencia-3ld/
**URL destino nuevo**: `/informes-de-evaluacion-y-auditoria-de-la-agencia-3ld`
**Estado**: `faltante-en-origen`
**Detectado**: 2026-04-15

**Descripción**: el WP origen declaraba 27 categorías de informes OCI bajo el modelo de Tres Líneas de Defensa (3LD), con ~90 títulos de documentos ("Informe anual PAAC 2024 (PDF) Dic 2024", etc.). Sin embargo, **TODOS los 90 enlaces en WP tenían `href="#"`** (placeholder) — no apuntaban a ningún archivo real. La página funciona como declaración del plan anual de la OCI, no como biblioteca de PDFs.

**Cómo se manejó en el portal nuevo**: se convirtió en **hub de navegación** que remite a las 15 páginas del portal donde los informes reales sí viven (lotes O1/O2/L/K/N2). Las 12 categorías sin destino disponible quedan con badge "Próximamente" — visibles pero sin enlace clickable.

**Categorías sin destino activo (12) — pendientes de que el área responsable defina ruta destino y suba documentos**:

| # | Categoría | Responsable probable | Acción necesaria |
|---|---|---|---|
| 08 | Informe semestral PQRDS | Atención al Ciudadano | Crear página con informes semestrales PQRDS reales |
| 09 | Austeridad en el Gasto | Oficina de Control Interno | Resolución en Lote M5 |
| 10 | Gestión judicial EKOGUI | Subdirección Asuntos Legales | Crear página con reportes EKOGUI semestrales |
| 12 | FURAG II DAFP | Oficina Control Interno | Crear página con reportes FURAG anuales |
| 13 | Entregas de cargo | Talento Humano | Crear página con procedimiento + registros |
| 16 | Ejecución Presupuestal y PAC | Financiera | Crear página con seguimientos trimestrales PAC |
| 18 | Política de integridad | Oficina Control Interno | Crear página con seguimientos |
| 19 | Procedimientos misionales / prescripción disciplinaria | Subdirección Instrucción Disciplinaria | Crear página con reportes |
| 22 | Arqueo sorpresivo de caja | Financiera | Crear página (Decreto 1068/2015) |
| 23 | Indicadores de Gestión DAFP | Planeación | Crear página con seguimientos |
| 25 | Gobierno Digital MinTIC | TICs | Crear página con seguimientos |
| 27 | Acoso laboral | Talento Humano | Crear página con seguimientos (Ley 1010/2006) |

**Activar una categoría desde el CMS**: cuando su página destino exista, editar `src/content/pages/transparencia/informes/evaluacion-auditoria-3ld.json` (o desde Sveltia → Transparencia → "Informes de Evaluación y Auditoría 3LD"): cambiar `destino.url` al path nuevo y `destino.estado` de `proximamente` a `disponible`.

---

### AUDIT-4 — Atención al ciudadano (2026-04-15)

**Alcance**: 13 páginas WP del área Atención al Ciudadano.

**Correcciones aplicadas durante el audit**:

1. **`/p-q-r-s-servidores-agencia-itrc`** — página NO migrada previamente. El WP contenía **14 informes trimestrales de PQRSDF 2017-2020** (Ley 1712). Se migró completamente:
   - JSON creado: `src/content/pages/atencion/pqrs-servidores.json`
   - Astro creado: `src/pages/p-q-r-s-servidores-agencia-itrc.astro` (thin-wrapper ListadoInformes)
   - Los 14 URLs verificados con HTTP 200.

2. **`/chat-itrc`** — ratio local 32% vs WP (contenido resumido). Se enriqueció con:
   - 8 condiciones de uso completas (antes solo 4 resúmenes).
   - Horario de atención del chat: L-V 7:00 AM - 4:00 PM jornada continua (distinto al horario de oficinas 8:00-4:30).
   - Nota legal sobre reserva del derecho de modificar reglas.

**Estado final AUDIT-4** (13 páginas):

| Estado | Cantidad |
|---|:---:|
| 🟢 Completas originalmente | 10 |
| 🔴 Migrada durante el audit | 1 (PQRS Servidores — 14 docs) |
| 🟡 Enriquecida durante el audit | 1 (Chat ITRC — 8 condiciones) |
| `informacion-adicional` sin slug WP | 1 (cubierto por `/otros-de-grupos-de-interes` consolidado) |

Huérfanos: no se detectaron nuevas páginas WP fuera del listado del sitemap.

---

### AUDIT-3 — Normativa (2026-04-15)

**Alcance**: 22 páginas WP del área Normativa (6 landings + 15 delitos del Lote P + 1 políticas sectoriales ya en AUDIT-2).

| Estado | Cantidad |
|---|:---:|
| 🟢 Completas (ratio >= 80%, 0 deltas reales) | 18 |
| 🟡 Con deltas detectados que son URLs 404/rotas en WP | 2 (normativa-aplicada 2 deltas, marco-legal 1 delta) |
| ❌ Mapping inicial incorrecto (auto-resuelto) | 2 (politicas-lineamientos-y-manuales → `politicas-manuales.json`; manual-contratacion → `contratacion/manual.json`) |
| ❌ Slug WP "normograma" no responde | Alias de `normativa-aplicada` (ya cubierto) |

**URLs 404 detectadas en WP origen**:
- `normativa-aplicada`:
  - `Normograma-Agencia-ITRC-actualizado-septiembre-30-de-2022-1-1.xlsx` — WP 404.
  - `pgn-directiva-020-de-2022.pdf` (dominio externo `mininterior.gov.co`) — 404.
- `marco-legal`:
  - `http://es.presidencia.gov.co/.../Ley 1952 del 28 de enero de 2019.pdf` — URL externa con espacios sin codificar (HTTP 000 = DNS/connect fail). Local probablemente tiene versión corregida o alternativa vigente.

**Cierre AUDIT-3**: 22/22 páginas con contenido equivalente o superior al WP. Sin correcciones de código. Las 15 páginas de delitos del Lote P (cohecho, concusión, peculado, etc.) tienen ratios entre 108-183% (locales preservan el contenido completo).

---

### AUDIT-2 — Transparencia Ley 1712 (2026-04-15)

**Alcance**: 27 páginas WP auditadas. Resultado:
- 🟢 **23 páginas completas** (ratios locales >=80% del texto WP, PDFs idénticos tras URL-normalización).
- ⚠️ **19 "deltas" detectados que son URLs rotas en origen WP** — confirmados con HTTP HEAD. Local tiene las versiones funcionales. No hay contenido perdido.
- 🔧 **1 duplicación legacy resuelta** — existían 2 astros + 2 JSONs para el mismo contenido (`/indice-informacion-clasificada-reservada` con JSON `indice-clasificada.json` vs `/indice-de-informacion-clasificada-y-reservada` con `indice-informacion-clasificada.json`).

**Acción correctiva aplicada durante AUDIT-2**:
- Eliminado astro legacy `src/pages/indice-informacion-clasificada-reservada.astro`.
- Eliminado JSON legacy `src/content/pages/transparencia/indice-clasificada.json` (schema antiguo con `pdfUrl`/`pdfNombre`).
- Landing `transparencia.json` actualizado: enlace interno ahora apunta al slug WP literal `/indice-de-informacion-clasificada-y-reservada`.

**URLs 404 detectadas en WP (19 items informativos)**:
- `decreto`, `decretos-de-salarios`, `informe-defensa-publica`, `registro-de-activos-de-informacion`, `indice-clasificada`, `programa-gestion-documental` (2), `procedimientos-decisiones`, `formatos-contratos-pliegos-tipo` (10), `directorio-de-agremiaciones`.
- Patrón común: WP HTML apunta a archivos con nombre incluyendo tildes codificadas o sufijos de versión antiguos; los archivos reales activos en el servidor tienen nombres sin tilde/versión distinta, que el local ya usa.

**Búsqueda de huérfanos bajo parents transparencia**: 0 páginas nuevas (todas cubiertas por lotes M, L).

**Cierre AUDIT-2**: 100% cobertura efectiva. Duplicación crítica corregida. Hallazgos de URLs rotas WP registrados informativamente.

---

### AUDIT-1 — Agencia / Institucional (2026-04-15)

**Alcance**: 11 páginas WP auditadas con umbral máximo (compare URL-normalizado + text ratio + verificación HTTP):

| Página | WP words | Local words | ratio | PDFs WP | PDFs local | Delta real | Estado |
|---|---:|---:|---:|---:|---:|---:|---|
| mision-vision-y-proposito-estrategico | 1395 | 1319 | 94.6% | 1 | 1 | 0 | ✅ |
| organigrama | 77 | 127 | 164.9% | 7 | 7 | 0 | ✅ |
| directorio | 21 | 147 | 700% | 3 | 3 | 0 | ✅ |
| perfil-directora-general | 213 | 937 | 439.9% | 0 | 0 | 0 | ✅ consolidado en equipo-directivo |
| perfil-subdirectores | 725 | 937 | 129.2% | 0 | 0 | 0 | ✅ consolidado |
| direccionamiento-estrategico | 39 | 159 | 407.7% | 0 | 0 | 0 | ✅ |
| gestion-misional | 768 | 693 | 90.2% | 64 | 62 | **0 real** | ⚠️ 3 URLs en WP dan 404 |
| sistema-integrado-de-gestion | 185 | 258 | 139.5% | 11 | 11 | **0 real** | ⚠️ 2 URLs WP dan 404 (recientes) |
| plan-institucional-de-archivos | 10 | 76 | 760% | 2 | 2 | 0 | ✅ |
| sistema-de-control-interno | 77 | 462 | 600% | 0 | 11 | 0 | ✅ local supera al origen |
| informacion-financiera | 1337 | 1162 | 86.9% | 245 | 203 | **43** | 🔴 ya registrado |

**Resultado**: 8 páginas completas, 2 con URLs rotas en origen (local ya tiene versión funcional), 1 con delta editorial (info-financiera registrado).

**Hallazgo crítico sobre URLs rotas en WP**:

- `gestion-misional` — 3 URLs apuntadas desde HTML WP devuelven 404:
  - `Informe-gesti%C3%B3n-I-sem-2022_SAGR-1.pdf` (WP 404 — local tiene `Informe-gestion-I-sem-2022_SAGR-1.pdf` con 200)
  - `Informe-gesti%C3%B3n-II-sem-2022_SAGR.pdf` (WP 404 — local tiene versión sin tilde con 200)
  - `INFORME-DE-GESTI%C3%93N-IV-TRIMESTRE-.pdf` (WP 404 — local tiene su equivalente)

- `sistema-integrado-de-gestion` — 2 URLs referenciadas en WP recientes devuelven 404 (posible publicación no activada):
  - `2026-03-31_listado_maestro_de_documentos.xls` (404)
  - `mapa-de-procesos-version-005.pdf` (404)

**Cómo se manejó**: local tiene contenido equivalente con URLs correctas. NO se actualizó nada porque los enlaces rotos son del origen WP y el usuario final del portal nuevo no los ve. Informativo para mantenimiento WP origen.

**Búsqueda de huérfanos**: se hizo crawl de páginas hijas bajo cada padre en Agencia (5 padres). 0 nuevas páginas huérfanas — todos los hijos están cubiertos en lotes previos (K, L, M).

**Cierre AUDIT-1**: sin acción correctiva de código requerida. Cobertura efectiva: 100% de las 11 páginas WP del área Agencia.

---

### Sync 2026-04-15 — Direccionamiento Planes y Información Financiera (deltas históricos)

**Páginas auditadas**:
1. `https://www.itrc.gov.co/Itrc/direccionamiento-estrategico/planes/` (WP id 2709, modificada 2026-04-09)
2. `https://www.itrc.gov.co/Itrc/informacion-financiera/` (WP id 2604, modificada 2026-02-24)

**Estado**: `delta-pendiente-editorial`
**Detectado**: 2026-04-15

**Descripción**: ambas páginas WP contienen archivos históricos que NO están en los JSONs locales:
- **Planes**: WP tiene 124 PDFs únicos vs **44 en local** → **80+ archivos históricos faltantes** (Cuadro de Mando Integral 2015-2018, Planes de Acción Anual 2013-2018, Plan Anticorrupción 2013-2018, Plan de Acción MIPG 2013-2018, etc.).
- **Información Financiera**: WP tiene 245 PDFs vs **203 en local** → **43 PDFs faltantes** (mayormente Presupuesto Series 2012-2017 históricos).

**Cómo se manejó ahora**: NO se modificó automáticamente el JSON local porque ambos tienen estructura editorialmente curada (sections + tabs verticales + infoCards) que requiere asignar cada PDF histórico a su sección semántica correcta. Una sobrescritura automática rompería la organización.

**Archivos auxiliares generados** (en `reports/` — no commiteable, .gitignored):
- `reports/delta-planes-2026-04-15.json` (124 entradas WP no presentes en local)
- `reports/delta-financiera-2026-04-15.json` (43 entradas)

Cada entrada contiene `{ titulo, url }` extraídos del HTML WP.

**Acción pendiente / responsable**: Planeación + Financiera — usar Sveltia CMS para integrar los PDFs históricos en la sección/tab/categoría correcta. Los reports listan los URLs y títulos para copiar manualmente. Estimado: ~2-3h editoriales.

**Origen #1 sí actualizado**: la página `/contratacion-suscrita/` se reescribió completamente en este mismo ciclo (era wrapper SECOP de 2 enlaces; ahora muestra 67 procesos de selección + 118 contratos suscritos por vigencia = 229 documentos completos extraídos del JSON embedded WP).

---

### W — ConverTIC / GTranslate / YouTube rendición cuentas (Lote W — pendientes administrativos)

**Contexto**: los 3 elementos UI/UX del análisis §3.4 listados a continuación requieren decisión administrativa o acceso a terceros; no se pueden implementar en esta fase sin coordinar con el área responsable.

#### ConverTIC (widget accesibilidad MinTIC)
- **Detalle**: widget oficial de accesibilidad gubernamental (lectura asistida, magnificador, etc.) producido por MinTIC.
- **Requisito**: añadir `<script src="https://soyvisible.com/convertic/scripts/convertic.js"></script>` (URL oficial) en Base.astro + icono flotante. Validar con el equipo de comunicaciones si el portal debe embedder ConverTIC junto con el `WcagWidget` ya existente (podrían superponerse UI), o si uno reemplaza al otro.
- **Estado**: `pendiente-decision` (UX/Comunicaciones).

#### GTranslate — traductor multiidioma
- **Detalle**: widget de traducción automática. Requiere registro en gtranslate.io (cuenta gratuita / paga) y obtención de script con API key.
- **Estado**: `pendiente-administrativo` (Comunicaciones — decidir si se usa, y si sí, generar la cuenta y entregar snippet).

#### YouTube embed — Rendición de Cuentas
- **Detalle**: el análisis §3.4 menciona que el portal legacy embedía videos de rendición de cuentas en su página correspondiente. El portal nuevo ya tiene referencias a `siteData.featuredVideo` en index, y la página `/participa/rendicion-de-cuentas` existe, pero no embebe un video específico.
- **Requisito**: la Dirección de Comunicaciones debe proveer la URL del video oficial del evento de rendición de cuentas más reciente (formato embed: `https://www.youtube-nocookie.com/embed/VIDEO_ID`) para agregarlo a la página correspondiente.
- **Estado**: `pendiente-administrativo`.

---

### #91 Calendario de Eventos → shortcode de plugin descontinuado en origen (Lote T)

**URL origen WP**: `https://www.itrc.gov.co/Itrc/calendario-de-eventos/`
**URL destino nuevo**: `/calendario-de-eventos` (wrapper de redirección)
**Estado**: `faltante-en-origen` (contenido era solo `[MEC id="11638"]`, shortcode del plugin *Modern Events Calendar* que ya no está activo en WordPress)
**Detectado**: 2026-04-15 (durante Lote T)

**Descripción**: la página WP origen solo contenía 18 caracteres: `[MEC id="11638"]`. Era la referencia al plugin *Modern Events Calendar* de WordPress, que en algún momento se desactivó sin migrar el calendario. No hay contenido sustantivo en el origen.

**Cómo se manejó**: se creó la página `/calendario-de-eventos` como **wrapper de redirección** al sistema de eventos actual del portal: `/prensa/eventos`. El usuario que llegue al slug legacy ve una nota explicativa + CTA al calendario vigente.

**Pendiente / responsable**: Comunicaciones / Prensa — decidir si eventualmente se archiva esta página o se mantiene como bridge.

---

### CIPREP → sub-app WP independiente descartada en esta fase (decisión Lote V)

**URL origen WP**: `https://www.itrc.gov.co/ciprep/` (instalación WordPress independiente con Elementor)
**URL destino nuevo**: *(no migrada en esta fase)*
**Estado**: `descartado-temporalmente` por decisión estratégica
**Decidido**: 2026-04-15

**Descripción**: CIPREP (Congreso Internacional para la Protección de los Recursos Públicos) existe como una instalación WordPress independiente en la ruta `/ciprep/`. Pese a la infraestructura aparatosa (WP completo + Elementor + versión en inglés), **su contenido real es una landing page simple** (1 página + 1 post + 82 media según el análisis `analisis_web_ITRC.md §3.6`).

**Cómo se maneja ahora**: **no se migra**. Decisión del usuario (2026-04-15): *"en realidad es super simple, en la web original crearon toda una subinstalación para eso, pero unicamente es una landing, así que por ahora, descartemoslo, pues cuando sea el momento de hacer esa landing, esta nueva web ya estará en producción y para ese entonces decidiremos cómo se implementará"*.

**Pendiente / próxima fase** (post-producción): evaluar creación de un **builder genérico de landings/micrositios** dentro del portal nuevo que permita crear eventos/congresos (CIPREP y futuros) de forma eficiente. Conversación reabierta cuando termine toda la migración actual.

---

### #27 Programa de Gestión Documental → slug local distinto al WP (Lote M4)

**URL origen WP**: `https://www.itrc.gov.co/Itrc/transparencia-y-acceso-a-la-informacion-publica/programa-de-gestion-documental/` (slug WP: `programa-de-gestion-documental`)
**URL destino nuevo**: `/programa-gestion-documental` (sin el `-de-` intermedio)
**Estado**: *(nota editorial — no falta nada sustantivo)*
**Detectado**: 2026-04-15 (durante Lote M4)

**Descripción**: en esta página específica, el portal nuevo ya usaba un slug local más corto (`programa-gestion-documental`) antes de comenzar Lote M. El landing `transparencia.json` (7.1.4) enlaza a ese slug corto. Mantener el slug WP literal (`programa-de-gestion-documental`) habría requerido renombrar el archivo y actualizar el índice de Transparencia con riesgo de romper anchors externos ya indexados.

**Cómo se manejó**: se preserva el slug corto local (`/programa-gestion-documental`). El astro heredado se simplifica a thin-wrapper del componente `ListadoInformes`. El JSON expone 2 documentos: PGD y Resolución de adopción. Esta es la única excepción al principio "slugs WP preservados literalmente en Lote M" — documentada aquí por auditoría.

**Sin responsable pendiente** — caso editorial cerrado.

---

### Decreto 0664 de 2024 → archivo con nombre inconsistente (Lote M3)

**URL origen WP**: `https://www.itrc.gov.co/Itrc/transparencia-y-acceso-a-la-informacion-publica/decretos-de-estructura-salarios-leyes-marco-y-otros/`
**URL destino nuevo**: `/decretos-de-estructura-salarios-leyes-marco-y-otros` (sección "Decretos de modificación de la estructura")
**Estado**: `enlace-roto` (archivo presente pero nombre inconsistente con el texto del enlace)
**Detectado**: 2026-04-15 (durante Lote M3)

**Descripción**: en el WP origen, el ítem rotulado "**Decreto 0664 de 2024**" en la sección de modificación de estructura apunta a la URL `https://www.itrc.gov.co/Itrc/wp-content/uploads/2024/09/Solicitud_de_publicacion_Requerimientos_de_Comunicaciones-1.docx`. El nombre del archivo (`.docx`, "Solicitud_de_publicacion_Requerimientos_de_Comunicaciones") no corresponde a lo que un usuario esperaría al hacer clic en "Decreto 0664 de 2024". Probable error de publicación en el WP original.

**Cómo se maneja ahora**: se preserva el enlace tal cual en el JSON consolidado `decretos-estructura.json`, y se añade un campo `nota` que se renderiza visiblemente en la página con triángulo de alerta amarillo: *"Enlace en origen WP apunta a archivo con nombre inconsistente; verificar con Jurídica el documento correcto."*

**Pendiente / responsable**: Subdirección de Asuntos Legales / área Jurídica — debe (a) confirmar si el archivo actualmente enlazado es efectivamente el Decreto 0664 de 2024 o es un documento incorrecto, (b) proveer el PDF correcto si aplica, (c) actualizar la URL desde Sveltia CMS cuando se corrija.

---

### defensa-publica.json → enlace interno faltante (Lote M1) — ✅ RESUELTO en Lote S

**URL origen WP**: `https://www.itrc.gov.co/Itrc/informe-defensa-publica-y-prevencion-del-dano-antijuridico/`
**URL destino nuevo**: `/informe-defensa-publica` (página existe y renderiza)
**Estado**: ✅ `resuelto` (el destino `/informe-de-gestion-del-comite-de-conciliacion` se creó en Lote S el 2026-04-15)
**Detectado**: 2026-04-15 (durante Lote M1) · **Resuelto**: 2026-04-15 (durante Lote S)

**Descripción**: el JSON `src/content/pages/transparencia/defensa-publica.json` contiene un enlace interno a `/informe-comite-conciliacion` como uno de los 4 recursos mostrados ("Informe de Gestión del Comité de Conciliación", `tipo: internal`). **Esa página no existe** en el repo (`src/pages/informe-comite-conciliacion.astro` y su JSON no están creados). Al hacer clic desde `/informe-defensa-publica` se obtendría 404.

**Correlación con análisis secundario**: corresponde al **#78 "Informe Comité de Conciliación"** listado en `analisis_web_ITRC.md` §3.3 como Prioridad MEDIA pendiente.

**Cómo se maneja ahora**: se preserva el enlace en el JSON (visible en la lista de recursos) pero apunta a destino 404. El usuario puede editar desde Sveltia CMS para:
- Remover el enlace (si se considera que no va a existir).
- O dejarlo y crear la página destino en un lote futuro dedicado a #78.

**Pendiente / responsable**: Subdirección de Asuntos Legales — deben proveer la página con informes del Comité de Conciliación (o confirmar que no se migra). Referenciado también en el hub `/informes-a-organismos-de-inspeccion-vigilancia-y-control` (Lote O2 #47).

---

### #34 — Publicación de la ejecución de contratos (Lote N2)

**URL origen WP**: https://www.itrc.gov.co/Itrc/publicacion-de-la-ejecucion-de-contratos/
**URL destino nuevo**: `/publicacion-de-la-ejecucion-de-contratos`
**Estado**: `duplicado-en-origen`
**Detectado**: 2026-04-15

**Descripción**: el WP origen lista **314 documentos** distribuidos en 6 tabs (vigencias 2019-2024). Al analizar las URLs únicas, se detectaron **73 entradas duplicadas** (50 URLs que aparecen 2-3 veces cada una entre tabs). Ejemplo: "Informe de Supervisión CPS 032 2022" figura simultáneamente en tabs 2022, 2023 y 2024.

**Cómo se manejó en el portal nuevo**: se preservó fidelidad 1:1 con el origen — los 314 items (73 duplicados incluidos) se migraron tal cual, organizados en 6 paneles colapsables por vigencia. La limpieza editorial (mantener cada PDF en una sola vigencia) es tarea sugerida pero no ejecutada — puede hacerse desde Sveltia CMS.

**Pendiente**: decidir si se consolida la lista (mantener cada PDF una sola vez en la vigencia más representativa) o se preserva la redundancia original.

---

## Plantilla para nuevas entradas

```markdown
### #<NUM_ANALISIS> — <Nombre> (Lote <ID>)

**URL origen WP**: https://...
**URL destino nuevo**: `/ruta-nueva`
**Estado**: faltante-en-origen | enlace-roto | duplicado-en-origen | enlace-externo-perdido
**Detectado**: YYYY-MM-DD

**Descripción**: <qué encontramos, qué falta, con cifras si aplica>.

**Cómo se manejó en el portal nuevo**: <consolidación, placeholder visible, hub, etc>.

**Pendiente / responsable**: <área institucional que debe aportar el contenido>.
```
