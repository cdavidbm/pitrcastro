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

### defensa-publica.json → enlace interno faltante (Lote M1)

**URL origen WP**: `https://www.itrc.gov.co/Itrc/informe-defensa-publica-y-prevencion-del-dano-antijuridico/`
**URL destino nuevo**: `/informe-defensa-publica` (página existe y renderiza)
**Estado**: `enlace-roto` (interno, destino inexistente en portal nuevo)
**Detectado**: 2026-04-15 (durante Lote M1 saneamiento CMS)

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
