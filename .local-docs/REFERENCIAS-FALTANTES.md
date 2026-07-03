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
> **Última actualización**: 2026-05-08

---

## Resumen cuantitativo

| Lote | Entradas registradas |
|---|:---:|
| N2 (#34 Ejecución contratos) | 73 URLs duplicadas |
| O3 (#46 Catálogo OCI 3LD) | 27 categorías con 90 placeholders; 12 sin destino en portal nuevo |
| M1 (defensa-publica.json) | 1 enlace interno a destino inexistente |
| M3 (decretos-estructura) | 1 enlace a archivo con nombre inconsistente en origen |
| M4 (programa-gestion-documental) | 1 decisión de slug registrada (desviación intencional del slug WP) |
| V (CIPREP) | **Migrado 2026-05-03** → landing nativa `/ciprep` + 34 speakers en folder collection |
| T (#91 Calendario de Eventos) | Página WP contenía solo shortcode de plugin descontinuado — migrada como wrapper a agenda vigente |
| W (UI/UX) | 3 elementos con requisito administrativo / acceso a terceros (ConverTIC, GTranslate, YouTube rendición) |
| Sync 2026-04-15 (#2 Planes) | 124 PDFs históricos en WP no presentes en local — esperan integración editorial |
| Sync 2026-04-15 (#3 Info Financiera) | 43 PDFs históricos (mayormente Presupuesto Series 2012-2017) en WP no presentes en local |
| AUDIT-1 gestion-misional | 3 URLs en HTML WP devuelven 404 (local ya tiene URLs correctas) |
| AUDIT-1 sistema-integrado-de-gestion | 2 archivos WP listados pero devuelven 404 (pendiente publicación real) |
| AUDIT-2 Transparencia | 19 URLs en HTML WP devuelven 404 (local tiene versiones correctas) + 1 duplicación legacy resuelta |
| AUDIT-3 Normativa | 3 URLs en WP dan 404/no-conecta (1 externa MinInterior 404, 1 externa Presidencia con espacios no-codificados) |
| AUDIT-4 Atención | 2 correcciones aplicadas (PQRS Servidores migrado + Chat ITRC enriquecido con 8 condiciones completas) |
| AUDIT-5 Participa | Sin correcciones; falsos positivos por Unicode NFC/NFD + 1 URL 404 + 1 google-redirect |
| AUDIT-6 Prensa | Sin correcciones; 2 URLs 404 en WP (boletines legacy) |
| AUDIT-7 Observatorio | Sin correcciones; 3 páginas con texto descriptivo WP más largo (memorias, del-observatorio) pero 0 deltas de contenido/PDFs |
| AUDIT-8 Contratación/Informes/Vigencias | Sin correcciones; 55 URLs legacy `/pestana/documentos/` dan 404, 2 URLs a intranet privada dan 301 |
| **BIN-4 (2026-05-08)** | **273 binarios referenciados desde 37 JSONs no existen** en `public/documentos/`. Detectado al ejecutar `scripts/rewrite-urls.py`. Mayoría coincide con los 255 ya reportados como 404 en WP origen (`reports/binarios-404-wp.md`). Top: ejecucion-contratos.json (50), contratacion-suscrita.json (46), planes.json (44), informes.json (31), resoluciones.json (15). Listado detallado en `reports/bin4-missing-files.json` (gitignored). |
| **BIN-5 (2026-05-08, CERRADO)** | **Trayectoria**: 350 missing → **0 content-level gaps reales**. `scripts/audit-links.py` iterado 7 veces el mismo día con: (1) auto-layout via threshold 50%, (2) alias twitter↔x.com, (3) canonicalización http/https + www., (4) domain-match (URL del mismo host presente en local cuenta como cubierto), (5) config `intentionally_omitted` (addtoany, Flash, auth-temporal) + `redirect_map` (Ley 1952 PDF local), (6) parser regex en vez de `html.parser` (no rompe con markup legal `<Ver Notas de Vigencia>`), (7) strip de comentarios HTML antes de extraer (WP tenía anchors legacy comentados). **Acciones de contenido**: 5 entes externos añadidos a `historico-sistema-de-control-interno`; PGN-Directiva-020/2022 añadida a normograma como norma "Otra" (commit `c9e5590` y siguiente). **Único layout-gap remanente**: ConverTIC en 102 páginas WP — decisión arquitectural Lote W (reemplazado por WcagWidget local). Refactor vive solo local (scripts/ gitignored). |
| **Total** | **~720+ items bajo auditoría** (mayoría en categorías ya conocidas) |

---

## Entradas

### BIN-AUDIT-V2 — 111 binarios adicionales recuperados (2026-06-19, segundo pase)

**Origen**: nuevo audit completo sobre todas las referencias `/documentos/*.{pdf,xlsx,docx,...}` en `src/content/`. Detectó 272 paths faltantes (en parte solapados con BIN-4 del 2026-05-08, en parte nuevos por contenido agregado entre mayo y junio). Cross-reference vs `/var/www/portal_principal/Itrc/wp-content/uploads/` indexando los 23,669 archivos por basename con normalización NFC.

**Resultado**: 111 archivos encontrados (40% de los 272) y copiados a sus rutas locales. 161 confirmados 404 también en el WP origen (irrecuperables). Total: 56.4 MB en ~4 s vía `ssh+cat` con ControlMaster.

**Distribución de recuperados (top categorías)**: notificaciones (edictos, estados, traslados 2021-2023), agencia (informes CI trimestrales 2022-2024, gestión misional, atención al ciudadano PQRSDF), normativa.

**Ambigüedades**: 13 archivos tenían múltiples paths en uploads (mismo basename, distinta YYYY/MM). Se eligió el path con año más reciente.

**Estado de completitud post-recovery**: 4318/4479 referencias (96%) resuelven a archivo existente. Los 161 restantes son los irrecuperables.

**Trazabilidad**: `reports/bin-recovery-2026-06-19-v2.json` (gitignored).

---

### RELATORIAS-RECOVERY — 217 PDFs Joomla migrados (2026-06-19)

**Origen**: SSH a `root@10.5.10.6` /var/www/portal_principal/relatorias/jdownloads/ + DB Joomla `itrcgovc_relatoria.jau7z_jdownloads_files`.

**Resultado**: 218 PDFs copiados a `public/documentos/relatorias/<year>/`. JSON local `src/content/pages/transparencia/relatoria.json` actualizado: 152 de 152 fichas con `archivo` vacío ahora tienen su PDF resuelto. 65 fichas nuevas agregadas (archivos en el server que el JSON no listaba).

**Pendiente**: Resolución 234/2022 NO está en este Joomla (la auditoría previa la marcó como única excepción) — buscar aparte.

**Reporte detallado**: `info_bkp/03-relatorias-recovery-2026-06-19.md`.


### BIN-4-RECOVERY — 70 binarios recuperados desde el server productivo (2026-06-19)

**Origen**: SSH directo a `root@10.5.10.6` (server productivo HostDime que sirve `www.itrc.gov.co`). Acceso conseguido el 2026-06-19 con la VPN HostDime arriba.

**Resultado**: de los 273 binarios reportados como faltantes en BIN-4 (lote del 2026-05-08), 70 fueron localizados en `/var/www/portal_principal/Itrc/wp-content/uploads/...` y copiados a `public/documentos/` siguiendo el mapeo `new_url` del JSON original. Total recuperado: 102.09 MB.

**Distribución por extensión**: 68 PDF + 1 PPTX + 1 JPEG.

**Distribución por área**:

| área | archivos recuperados |
|---|---:|
| transparencia | 51 |
| normograma | 11 |
| agencia | 5 |
| media/prensa | 2 |
| atencion | 1 |

**Restantes**: 203 binarios siguen sin localizar. Coinciden mayoritariamente con los 255 confirmados como 404 en el WP origen (auditoría BIN-5 cerrada 2026-05-08). Probablemente fueron borrados del WP antes de los crawls — no son recuperables.

**Nota técnica**: el filesystem del server almacena nombres con tildes en forma Unicode NFD (decompuesta: `o`+combining-acute), mientras que el JSON local usa NFC. Hubo que normalizar a NFD para acceder a los archivos y se usó `ssh + cat` (no `scp`, que reportaba "No such file" por un bug de codificación de filenames en el cliente SFTP de OpenSSH frente a NFD).

**Trazabilidad**: lista completa en `reports/bin4-recovered-2026-06-19.json` (gitignored).

---

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

**Activar una categoría desde el CMS**: cuando su página destino exista, editar el content type correspondiente en Strapi (Content Manager → Transparencia → "Informes de Evaluación y Auditoría 3LD"): cambiar `destino.url` al path nuevo y `destino.estado` de `proximamente` a `disponible`.

---

### AUDIT-8 — Contratación + Informes + Vigencias (2026-04-15)

**Alcance**: 24 páginas (8 Contratación + 6 Informes + 10 Vigencias históricas).

**Resultado**: 17 🟢 + 5 🟡 + 2 🔴. Tras verificación HTTP HEAD: todos los "deltas" (55+ URLs) son legacy rotas:
- Paths `/pestana/documentos/` → 404 universalmente (directorio legacy pre-WordPress).
- Algunas URLs redirect (301) a `intranet.agenciaitrc.gov.co` (dominio privado no accesible públicamente).

**Sin correcciones de código**. Páginas locales tienen las URLs vigentes en `/wp-content/uploads/`. El portal nuevo no debe incluir las URLs legacy muertas.

---

### AUDIT-7 — Observatorio (2026-04-15)

**Alcance**: 20 páginas de `observatorio.itrc.gov.co` (crawl completo de WP REST).

**Resultado**: 16 🟢 + 3 🟡 (ratio texto <40% en memorias-eje-educacion, memorias-eje-participacion y del-observatorio — contenido descriptivo más resumido en local, 0 deltas de contenido/PDFs).

**Sin correcciones**. Los PDFs (carne editorial) están completos. Las diferencias son de longitud de texto narrativo descriptivo, decisión editorial legítima.

---

### AUDIT-6 — Prensa (2026-04-15)

**Alcance**: 8 páginas (comunicados, boletines, cápsulas, videos, galería).

**Resultado**: 3 🟢 + 2 🟡 (1 URL 404 cada uno en boletines y comunicados legacy) + 3 páginas WP sin slug directo (eventos, videos, aviso-de-convocatorias son custom post types o posts).

**Sin correcciones**.

---

### AUDIT-5 — Participa (2026-04-15)

**Alcance**: 9 páginas WP del área Participa (crawl automático de hijos de `participa` id 8297).

**Resultado** (9 páginas):

| Estado | Cantidad |
|---|:---:|
| 🟢 Completas | 7 (rendición cuentas, colaboración, planeación, diagnóstico, otros grupos, control social, consulta ciudadana, participa landing) |
| Falso positivo Unicode | 1 (informe-comite-conciliación — URLs WP usan descomposición NFD con combining acute, local NFC) |
| 🟡 Delta de 2 URLs (ambos falsos) | 1 (rendición-de-cuentas — 1 URL es google-redirect, 1 URL 404) |

**Aprendizaje nuevo (ampliado)**: la comparación de URLs con caracteres especiales requiere **Unicode NFC normalization** además de URL-decode + lowercase. Algunas URLs del WP se guardan con composición NFD (ej: `Gestio\u0301n` con combining acute) mientras otras con NFC (`Gestión`). Set difference sin normalizar da falsos positivos.

Cobertura efectiva: 100%. 0 correcciones de código requeridas.

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

**Acción pendiente / responsable**: Planeación + Financiera — usar el panel de Strapi para integrar los PDFs históricos en la sección/tab/categoría correcta. Los reports listan los URLs y títulos para copiar manualmente. Estimado: ~2-3h editoriales.

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

### CIPREP → migrado a /ciprep como landing nativa (2026-05-03)

**URL origen WP**: `https://www.itrc.gov.co/ciprep/` (instalación WordPress independiente con Elementor)
**URL destino nuevo**: `/ciprep`
**Estado**: `migrado` (la entrada quedó como histórico de auditoría)
**Reabierto**: 2026-05-03 — el usuario confirmó la 2ª edición 2026 y pidió migrar la landing al portal Astro.

**Descripción**: CIPREP (Primer Congreso Internacional para la Protección de los Recursos Públicos) se realizó el 20–21 de octubre de 2025 en la Cámara de Comercio de Bogotá – Sede Chapinero. La sub-app WP de Elementor que sirve la landing se reemplaza por la página nativa `/ciprep` con contenido editable desde Strapi y un content type de speakers preparado para la edición 2026.

**Cómo se manejó**:
- Página single-page con secciones ancladas (`#por-que`, `#agenda`, `#aliados`, `#speakers`, `#memorias`, `#info`).
- Folder collection `src/content/pages/ciprep/speakers/*.json` (34 archivos) — pavimenta el "builder de landings/micrositios" original.
- 54 binarios descargados a `public/images/ciprep/{speakers,aliados}/`.
- Versión en inglés del WP (`/ciprep/en/`) **no migrada** — decisión 2026-05-03: solo ES en esta fase.

**Pendientes conocidos**:
- Sección **Memorias**: en el WP origen los 4 botones aún tienen `href="#"`; los recursos (grabaciones, presentaciones, documentos oficiales, certificado) **no han sido publicados** por la Agencia. Los slots quedan en el JSON con `url: ""` y se renderizan como "Próximamente". Conectar cuando estén disponibles.
- Algunos cargos en items de agenda quedaron vacíos en origen (ej. ponentes "Por confirmar" del conversatorio Fraude día 1).

---

### Relatoría → migrado catálogo desde sub-portal Joomla roto (2026-05-03)

**URL origen**: `https://www.itrc.gov.co/relatorias/` (instalación Joomla! independiente con plugin `com_jdownloads`)
**URL destino nuevo**: `/relatoria` (existente, expandida)
**Estado**: `migrado catálogo · binarios pendientes`
**Decidido**: 2026-05-03 — usuario instruye unificar el contenido en la página existente, eliminando la sub-app Joomla.

**Descripción**: la "Relatoría" existía como un sub-portal Joomla aparte (paralelo al WP `/Itrc/` y al WP `/ciprep/`), usando el plugin com_jdownloads para gestionar 152 fichas PDF de decisiones administrativas/disciplinarias firmes (años 2012-2025, primera y segunda instancia). La sub-app expone categorías por año + buscador + páginas summary por ficha.

**Hallazgo crítico durante el crawl**:
- **Ningún PDF se puede descargar desde el origen**. Probados 8 IDs de 4 categorías distintas: todos retornan HTML "El archivo solicitado no ha sido encontrado. Por favor, informe al webmaster". La instalación Joomla tiene los registros del catálogo pero los binarios físicos no están en el servidor (probablemente nunca fueron subidos correctamente o se perdieron).
- Los visitantes de la página antigua reciben error en cualquier descarga.

**Cómo se manejó**:
- **Catálogo migrado** (152 fichas con título, expediente, año, instancia inferida, tamaño declarado, filename original, ID Joomla legacy y URL origen para auditoría) en `src/content/pages/transparencia/relatoria.json` campo `fichas[]`.
- **Página `/relatoria` reemplazada**: tabla con buscador (título/expediente/número), filtros por año e instancia, paginación cliente. Mismo molde que `/notificaciones-y-traslados`.
- **Slots de descarga** marcados con icono "pendiente" hasta que jurídica suba los PDFs originales desde el panel de Strapi. Cuando los provean, basta llenar el campo `archivo` por ficha en el CMS.
- **CTA externo eliminado** (apuntaba a `/Itrc/relatorias/` que devuelve 404 y al sub-portal Joomla roto).

**Pendientes conocidos**:
- 152 archivos PDF físicos a recuperar de la oficina de jurídica (NO están en el origen — falla del WP origen, no omisión de migración).
- 90 fichas (60%) tienen instancia "sin clasificar" porque el título origen no menciona explícitamente "primera/segunda instancia". Al subir el PDF, jurídica puede ajustar el campo `instancia` en el CMS.
- 1 ficha sin año detectable.

**Decisión arquitectónica del usuario** (2026-05-03): *"este subportal que estas explorando es una mala practica de alguien que tenia el anterior sitio roto en un monton de instalaciones diversas... tienes libertad para implementar todo el contenido, tan simple como cualquier otra pagina que conforma el proyecto actual"*. Esto cierra el patrón de migración: ninguna sub-app legacy permanece como dependencia del nuevo portal.

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

**Pendiente / responsable**: Subdirección de Asuntos Legales / área Jurídica — debe (a) confirmar si el archivo actualmente enlazado es efectivamente el Decreto 0664 de 2024 o es un documento incorrecto, (b) proveer el PDF correcto si aplica, (c) actualizar la URL desde Strapi cuando se corrija.

---

### defensa-publica.json → enlace interno faltante (Lote M1) — ✅ RESUELTO en Lote S

**URL origen WP**: `https://www.itrc.gov.co/Itrc/informe-defensa-publica-y-prevencion-del-dano-antijuridico/`
**URL destino nuevo**: `/informe-defensa-publica` (página existe y renderiza)
**Estado**: ✅ `resuelto` (el destino `/informe-de-gestion-del-comite-de-conciliacion` se creó en Lote S el 2026-04-15)
**Detectado**: 2026-04-15 (durante Lote M1) · **Resuelto**: 2026-04-15 (durante Lote S)

**Descripción**: el JSON `src/content/pages/transparencia/defensa-publica.json` contiene un enlace interno a `/informe-comite-conciliacion` como uno de los 4 recursos mostrados ("Informe de Gestión del Comité de Conciliación", `tipo: internal`). **Esa página no existe** en el repo (`src/pages/informe-comite-conciliacion.astro` y su JSON no están creados). Al hacer clic desde `/informe-defensa-publica` se obtendría 404.

**Correlación con análisis secundario**: corresponde al **#78 "Informe Comité de Conciliación"** listado en `analisis_web_ITRC.md` §3.3 como Prioridad MEDIA pendiente.

**Cómo se maneja ahora**: se preserva el enlace (visible en la lista de recursos) pero apunta a destino 404. El usuario puede editar desde Strapi para:
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

**Cómo se manejó en el portal nuevo**: se preservó fidelidad 1:1 con el origen — los 314 items (73 duplicados incluidos) se migraron tal cual, organizados en 6 paneles colapsables por vigencia. La limpieza editorial (mantener cada PDF en una sola vigencia) es tarea sugerida pero no ejecutada — puede hacerse desde Strapi.

**Pendiente**: decidir si se consolida la lista (mantener cada PDF una sola vez en la vigencia más representativa) o se preserva la redundancia original.

---

### BIN-4 — 273 binarios referenciados que no existen (consolidado)

**Detectado**: 2026-05-08, al ejecutar `scripts/rewrite-urls.py --docs-base /documentos` (BIN-4: reescritura de URLs WP origen → paths locales).

**Estado**: `enlace-roto` (273 archivos)

**Descripción**: 273 de las 4452 URLs reescritas apuntan a archivos que no existen en `public/documentos/` ni en el filesystem del servidor. La mayoría (~92%) coincide con los 255 archivos ya reportados como 404 en el WP origen durante BIN-3a (`reports/binarios-404-wp.md`). Es decir: WP referencia archivos que él mismo no sirve; ya estaban rotos antes de migrar.

**Distribución por JSON afectado** (top 10):

| Archivo JSON | Refs rotas |
|---|---:|
| `pages/transparencia/contratacion/ejecucion-contratos.json` | 50 |
| `pages/transparencia/contratacion/contratacion-suscrita.json` | 46 |
| `pages/agencia/direccionamiento/planes.json` | 44 |
| `pages/agencia/direccionamiento/informes.json` | 31 |
| `pages/normativa/resoluciones.json` | 15 |
| ... (32 más con 1-12 refs cada uno) | ~87 |

**Cómo se maneja ahora**:
- Las URLs en los JSONs **se reescribieron de WP a `/documentos/<area>/<archivo>`** igual que las que sí existen. Cuando un visitante haga click en una de estas URLs rotas, recibirá 404 desde nginx (mismo comportamiento que tenía WP origen).
- El listado completo URL-por-URL queda en `reports/bin4-missing-files.json` (gitignored, generado por script auxiliar a partir de `bin4-rewrite-map.json`).
- No se eliminaron las referencias del HTML/JSON: preservar fidelidad con el origen, dejar que cada área provea los faltantes desde Strapi.

**Pendiente / responsable**: las áreas afectadas (contratación, planeación, normativa) deben proveer los archivos faltantes o eliminar las referencias muertas. El panel de Strapi (que ya soporta upload nativo a `public/uploads/`) facilita la gestión. El operador puede:
- Editar el JSON correspondiente en `src/content/pages/...` y eliminar la línea
- O esperar a tener los PDFs y hacer `npm run deploy:binarios` con ellos en `public/documentos/<area>/`

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

---

## Lote 2026-06-17 — Actualización editorial vigencia 2026

### #92 — `/Itrc/contratacion-suscrita/` vacía en WP

**URL origen WP**: https://www.itrc.gov.co/Itrc/contratacion-suscrita/
**URL destino nuevo**: `/contratacion-suscrita`
**Estado**: faltante-en-origen
**Detectado**: 2026-06-17

**Descripción**: la página WP "Contratación Suscrita" actúa solo como portal: anuncia dos secciones — "Convocatoria a Procesos Públicos de Selección" y "Contratación Suscrita" — sin listar contratos ni adjuntar documentos. El cuerpo es texto introductorio + enlaces de navegación al menú de transparencia. Los contratos suscritos reales viven en otra parte (SECOP II / subpágina específica que el portal WP no resuelve directamente).

**Cómo se manejó en el portal nuevo**: el single-type `transparencia-contratacion-contratacion-suscrita` ya existe con sus repeatables `convocatorias` y `contratacionSuscrita`. Esta sincronización editorial 2026-06-17 NO modifica el single porque WP no aporta items concretos. Queda como estaba (presumiblemente sembrado en la migración inicial o vacío).

**Pendiente / responsable**: Subdirección de Asuntos Legales / Contratación — confirmar si los contratos suscritos deben listarse acá o si la página debe redireccionar a SECOP II. Si lo primero, alimentar el repeatable `contratacionSuscrita` en el panel.

---

### #93 — 3 PDFs 404 al sincronizar estados-2026 desde WP

**URL origen WP**: https://www.itrc.gov.co/Itrc/notificaciones-y-traslados/notificaciones-supletorias/estados-2026/
**URL destino nuevo**: `/notificaciones-y-traslados` (tab Estados)
**Estado**: enlace-roto
**Detectado**: 2026-06-17

**Descripción**: durante `update-notif-delta.mjs` (sync 2026-06-17) tres URLs de PDFs estaban referenciadas en la tabla WP pero devolvían 404 al descargarse:
- `ESTADO-048-2026_protected.pdf` (exp 1704-00-2022-128, 20/04/2026)
- `ESTADO-047-2026_protected.pdf` (exp 1704-00-2022-098, 20/04/2026)
- `ESTADO-046-2026_protected.pdf` (exp 1704-00-2025-039, 17/02/2026)

Las 3 URLs apuntan al subdirectorio `wp-content/uploads/2026/06/` cuando los autos son de abril/febrero — probable que el WP los haya movido a otro mes pero olvidó actualizar el enlace de la tabla.

**Cómo se manejó en el portal nuevo**: las 3 entradas se crearon en Strapi con todos los metadatos (expediente, fecha, tipo, dependencia, vigencia) PERO sin PDF asociado (`pdfUrl: null`). El listado del tab "Estados" las mostrará como filas sin enlace al archivo. Si el archivo aparece en WP, se puede correr el script de delta de nuevo o cargar manualmente al Media Library desde el panel.

**Pendiente / responsable**: Subdirección de Instrucción Disciplinaria — proveer los 3 PDFs, o quien administra `itrc.gov.co/Itrc/wp-content/uploads/` aclarar la ruta correcta.


---

## Lote 2026-06-25 — Planes Direccionamiento Estratégico (5 huérfanos de 2023)

**Origen**: detectado durante la publicación de Planes 2026 (Bienestar + Capacitación). Strapi tiene 110 entradas en `agencia-direccionamiento-planes` pero **5 documentos están registrados sin archivo asociado** (`file: null`). En el frontend aparecen en la lista pero al hacer click no descargan nada.

**Característica común**: los 5 son del año **2023**, mismo patrón (nombre + categoría correctos, falta el binario).

**Documentos sin archivo**:

| Documento | Categoría | Año |
|---|---|---|
| Plan Anual de Adquisiciones 2023 | PAA - Plan Anual de Adquisiciones | 2023 |
| Plan de Acción Institucional 2023 | PAI - Plan de Acción Institucional | 2023 |
| Plan Institucional de Capacitación 2023 | PIC - Plan Institucional de Capacitación | 2023 |
| Mapa de Riesgos de Corrupción 2023 | Mapa de Riesgos de Corrupción | 2023 |
| Plan de Participación Ciudadana 2023 | Plan de Participación Ciudadana | 2023 |

**Estado**: `enlace-roto` — entrada existe en CMS pero sin binario.

**Hipótesis del origen**: probablemente migración WP → Strapi importó los metadatos pero no encontró/descargó el PDF correspondiente. Verificar en backup de WP `itrc.gov.co/Itrc/wp-content/uploads/2023/` o pedirle al área SAGR/Direccionamiento los PDFs originales.

**Cómo se manejó en el portal nuevo**: se dejaron en Strapi tal cual (con `file: null`). En el frontend los acordeones los muestran como texto sin enlace activo.

**Pendiente / responsable**: Subdirección de Planeación (o quien tenga los PDFs originales de 2023) — proveer los 5 archivos para subir vía Media Library de Strapi y linkear a las entradas existentes (sin crear duplicados).

---

## Lote 2026-07-01 — Informes + Políticas de Direccionamiento Estratégico

**Origen**: auditoría de estado de la página `/agencia/direccionamiento-estrategico/informes` y `/politicas`. En Strapi hay 33 informes + 11 políticas registrados, pero la mayoría son huérfanos (aparecen listados pero no descargan nada).

**Estado tras la Fase B (2026-07-01)**: se restauraron 9 documentos con archivos encontrados en el WordPress legacy (`/var/www/portal_principal/Itrc/wp-content/uploads/`). Quedan 30 documentos huérfanos que NO están en WP legacy — deben proveerse por el área correspondiente.

### Informes restaurados desde WP legacy (2026-07-01)

Ya funcionan en producción con enlace real al PDF:

| # | Documento | Origen recuperado |
|---|---|---|
| 1 | Informe de Gestión 2025 | `2026/01/Informe-de-Gestion-Agencia-ITRC-2025-.pdf` |
| 2 | Informe de Gestión 2024 | `2025/01/Informe-de-Gestion-Agencia-ITRC-Vigencia-2024.pdf` |
| 3 | Informe de Gestión 2023 | `2024/01/Informe-de-Gestion-Agencia-ITRC-Vigencia-2023.pdf` |
| 4 | Informe de Gestión 2022 | `2023/01/INFORME-DE-GESTION-AGENCIA-ITRC-VIGENCIA-2022.pdf` |
| 5 | Informe de Gestión 2021 | `2022/02/INFORME-DE-GESTION-2021-AGENCIA-ITRC.pdf` |
| 6 | Informe de Gestión 2020 | `2021/01/Informe-de-Gestion-Agencia-ITRC-Vigencia-2020.pdf` |
| 7 | Informe de Rendición de Cuentas 2023 | `2023/11/INFORME-RENDICION-DE-CUENTAS-2023_AGENCIA-ITRC.pdf` |
| 8 | Informe de Rendición de Cuentas 2022 | `2023/01/INFORME-EJERCICIO-RENDICION-DE-CUENTAS-2022_vf.pdf` |
| 9 | Informe de Rendición de Cuentas 2021 | `2021/12/INFORME-EJERCICIO-RENDICION-DE-CUENTAS-2021-FINAL.pdf` |

### Faltantes reales (30) — pedir a las áreas

**No están en WP legacy Itrc**. Es probable que nunca se hayan publicado o vivan en archivos internos del área.

#### Control Interno — 11 documentos
- Informe FURAG 2020, 2021, 2022, 2023, 2024 (5 documentos)
- Informe Pormenorizado de Control Interno Marzo 2024
- Informe Pormenorizado de Control Interno Julio 2024
- Informe Pormenorizado de Control Interno Diciembre 2024
- Informe Pormenorizado de Control Interno Marzo 2025
- Informe Pormenorizado de Control Interno Julio 2025
- Informe Pormenorizado de Control Interno Diciembre 2025

**Responsable**: Oficina de Control Interno — pedir los PDFs originales de FURAG anuales y los tres reportes cuatrimestrales pormenorizados de 2024 y 2025.

#### Planeación — 8 documentos
- Informe de Seguimiento PAI Primer Trimestre 2024
- Informe de Seguimiento PAI Segundo Trimestre 2024
- Informe de Seguimiento PAI Tercer Trimestre 2024
- Informe de Seguimiento PAI Cuarto Trimestre 2024
- Informe de Seguimiento PAI Primer Trimestre 2025
- Informe de Seguimiento PAI Segundo Trimestre 2025
- Informe de Seguimiento PAI Tercer Trimestre 2025
- Informe de Seguimiento PAI Cuarto Trimestre 2025

**Responsable**: Subdirección Administrativa y Financiera / Planeación — pedir los 8 PDFs trimestrales del seguimiento al Plan de Acción Institucional.

#### Informes dudosos (2) — verificar con área
- Informe de Gestión 2019 (WP legacy tiene solo un consolidado del primer trimestre 2019, no un informe anual)
- Informe de Rendición de Cuentas 2020 (WP legacy tiene solo XLSX del ejercicio CGR, no un PDF del ejercicio institucional)
- Informe de Rendición de Cuentas 2024 (hay 5 candidatos, ninguno claramente "el oficial 2024")

**Responsable**: Direccionamiento Estratégico — confirmar cuál es la versión oficial de cada uno o si no existe.

#### Políticas — 11 documentos (todas)
- Política de Administración de Riesgos
- Política de Comunicaciones
- Política de Gestión del Conocimiento e Innovación
- Política de Seguridad Digital
- Política de Seguridad y Salud en el Trabajo
- Política de Tratamiento de Datos Personales
- Política Institucional de Gestión Ambiental
- Política de Gobierno Digital
- Política de Prevención del Daño Antijurídico
- Política de Racionalización de Trámites
- Política del Sistema Integrado de Gestión

**Responsable**: Direccionamiento Estratégico + áreas de origen de cada política. Ninguna política tiene PDF en WP legacy. Es probable que se hayan aprobado como resoluciones sueltas y nunca se consolidaron como documento de política.

---

## Actualización 2026-07-01 tarde — Fase B2 informes (8 Seguimiento PAI restaurados)

**Contexto**: Ampliación del rastreo del WP legacy tras solicitud de estados financieros. En la búsqueda amplia se descubrió que los 8 informes de "Seguimiento PAI" trimestrales existían en el WP legacy con el nombre "Informe Avance Plan de Acción" (equivalente semántico, distinto nombre).

**Restaurados (8)**:

| Documento Strapi | Origen recuperado |
|---|---|
| Seguimiento PAI Primer Trimestre 2024 | `2024/05/Informe-Avance-Plan-de-Accion-2024-TRIMESTRE-I.pdf` |
| Seguimiento PAI Segundo Trimestre 2024 | `2024/08/Informe-Avance-Plan-de-Accion-2024-Trimestre-II.pdf` |
| Seguimiento PAI Tercer Trimestre 2024 | `2024/11/INFORME-AVANCE-PLAN-DE-ACCION-2024-TRIMESTRE-III.pdf` |
| Seguimiento PAI Cuarto Trimestre 2024 | `2025/01/Informe-Avance-Plan-de-Accion-2024-Trimestre-IV.pdf` |
| Seguimiento PAI Primer Trimestre 2025 | `2025/06/Informe-Avance-Plan-de-Accion-2025-Trimestre-I.pdf` |
| Seguimiento PAI Segundo Trimestre 2025 | `2025/08/Informe-Avance-Plan-de-Accion-2025-Trimestre-II.pdf` |
| Seguimiento PAI Tercer Trimestre 2025 | `2026/01/Informe-Avance-Plan-de-Accion-2025-Trimestre-III.pdf` |
| Seguimiento PAI Cuarto Trimestre 2025 | `2026/01/Informe-Avance-Plan-de-Accion-2025-Trimestre-IV.pdf` |

**También** publicado: Estados Financieros a Marzo 2026 en `/agencia/informacion-financiera` (nuevo tab EF 2026), origen: `2026/06/Estados-Financieros-marzo-2026.pdf`.

**Estado actualizado de la página `/informes`**: 18 documentos con archivo, 14 huérfanos restantes.

### Faltantes ratificados tras búsqueda exhaustiva (14)

**Búsqueda cubrió**: 6041 PDFs distribuidos en Itrc (5452), observatorio (257), relatorias Joomla (217), denuncias (111), ciprep (4); tarballs de backup 2025-12-22 (2.6 GB combinados); `/root/backups/`; `portal_nuevo/documentos/institucional/`. Filtros aplicados: nombre exacto, variantes, sinónimos, MIPG, distintos formatos.

**No existen en ningún directorio del server**:

- **Informes FURAG 2020-2024** (5). El FURAG es reportado por el área de Control Interno al DAFP en la plataforma Función Pública. Los PDFs de resultado se descargan desde ahí — no se publicaban en el WP.
- **Pormenorizado Control Interno 2024-2025** (6): Marzo/Julio/Diciembre. En el WP solo hay hasta noviembre 2019.
- **Rendición de Cuentas 2020, 2024** (2). Solo hay banners e imágenes, no informes PDF.
- **Informe de Gestión 2019 anual** (1). No aparece en el WP.

**Áreas responsables para solicitar**:
- Control Interno: 11 documentos (5 FURAG + 6 Pormenorizado)
- Direccionamiento Estratégico: 3 documentos (Rendición 2020, Rendición 2024, Gestión 2019)

Las 11 Políticas siguen sin verificar en detalle — pendiente búsqueda dedicada.
