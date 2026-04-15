# PROMPTS-MIGRACION.md

> **Playbook operativo de prompts para la migración ITRC**.
> Este archivo es tu guía de trabajo. Copia los prompts desde aquí a Claude Code para ejecutar cada tarea con contexto completo.
>
> **Cómo usar este archivo**:
> 1. Abre este archivo en VS Code al inicio de cada sesión.
> 2. Sigue el **RITUAL DE INICIO** (sección 2) siempre, sin excepción.
> 3. Elige el lote de trabajo que vas a abordar desde el **PROGRESS TRACKER** (sección 3).
> 4. Copia el prompt correspondiente a esa tarea y pégalo en Claude Code.
> 5. Al terminar la sesión, ejecuta el **RITUAL DE CIERRE** (sección 8).
> 6. Marca los checkboxes ✅ del tracker conforme avanzas. Guarda el archivo (Ctrl+S).
>
> **Notación de checkboxes**:
> - `[ ]` = pendiente
> - `[~]` = en progreso
> - `[x]` = completado
> - `[!]` = bloqueado (añadir nota al lado)
>
> **Última actualización**: 2026-04-14

---

## TABLA DE CONTENIDOS

1. [Introducción y uso](#1-introducción-y-uso)
2. [Ritual de inicio de sesión](#2-ritual-de-inicio-de-sesión-siempre)
3. [Progress tracker](#3-progress-tracker-marcar-aquí)
4. [Lotes de trabajo](#4-lotes-de-trabajo)
    - [Lote A — Galería fotográfica (25 álbumes)](#lote-a--galería-fotográfica)
    - [Lote B — Memorias Eje Educación (55 posts)](#lote-b--memorias-eje-educación)
    - [Lote C — Memorias Eje Participación (39 posts)](#lote-c--memorias-eje-participación)
    - [Lote D — Noticias Observatorio (14 posts)](#lote-d--noticias-observatorio)
    - [Lote E — Repositorio Jurídico (85 posts)](#lote-e--repositorio-jurídico)
    - [Lote F — Cápsulas Informativas](#lote-f--cápsulas-informativas)
    - [Lote G — Videos ITRC individuales](#lote-g--videos-itrc)
    - [Lote H — Página `/agencia/directorio`](#lote-h--directorio-personas)
    - [Lote I — Evaluar `/denuncias/`](#lote-i--denuncias)
5. [Rituales periódicos](#5-rituales-periódicos)
6. [Prompts reusables por situación](#6-prompts-reusables-por-situación)
7. [Troubleshooting](#7-troubleshooting)
8. [Ritual de cierre de sesión](#8-ritual-de-cierre-de-sesión-siempre)

---

## 1. INTRODUCCIÓN Y USO

### ¿Qué es este documento?
Manual operacional de la migración. **Prompts copy-paste** con contexto completo para cada tarea. Asumen que el agente empieza sin memoria (es lo normal).

### Reglas de oro
1. Siempre **RITUAL DE INICIO** (§2) antes de tocar nada.
2. **Un lote por sesión**. Mezclar lotes multiplica conflictos.
3. `npm run build` obligatorio post-lote. Sin excepciones.
4. **Revisa `git diff`** antes de autorizar commit.
5. **Marca checkboxes** al terminar cada lote (Ctrl+S).

### Archivos del proyecto
- `MIGRACION-ITRC.md` — memoria maestra y matriz de trazabilidad
- `PROMPTS-MIGRACION.md` — este archivo
- `CLAUDE.md` — reglas para agentes IA
- `PAGINAS-PENDIENTES-TRANSPARENCIA.txt` — checklist histórico (31/31 ✅)
- `scripts/check-itrc-changes.py` — detector de cambios WP
- `reports/inventory-*.json` — snapshots del origen
- `reports/changes-*.md` — diffs detectados

---

## 1.5 DECISIONES ARQUITECTÓNICAS DELIBERADAS

> Esta sección es **normativa**. Cualquier prompt que contradiga estas reglas está mal.

### D1 — File collection vs Folder collection (CMS)

| Volumen | Decisión | Justificación |
|---------|----------|---------------|
| ≤ 20 items estáticos | **File collection** (un JSON con array interno) | Un solo archivo reduce PRs, más simple de administrar |
| > 20 items o crecimiento esperado | **Folder collection** (un JSON por item) | Git-blame útil, merges paralelos sin conflicto |
| Contenido temporal/archivo histórico | Folder collection con `slug: "{{year}}-{{month}}-{{day}}-{{slug}}"` | Ordenamiento natural por fecha |

### D2 — Ruta estática vs ruta dinámica `[slug].astro`

| Criterio | Elección |
|---|---|
| 1-5 páginas fijas, contenido estable | Archivos `.astro` individuales |
| 6+ páginas con mismo layout | Ruta dinámica `[slug].astro` + folder collection |
| Hijo de estructura jerárquica (ej. `/participa/rendicion/`) | Archivo individual |

### D3 — Schemas JSON — tipos de contenido del dominio ITRC

**Todos los JSON llevan estos campos raíz:**
```jsonc
{
  "title": "string (obligatorio)",
  "description": "string — meta description (obligatorio si es página pública)",
  "icon": "string — clase Font Awesome v6 (opcional)",
  "published": "boolean (default true)"
}
```

**Schema `Post` (memorias, noticias, eventos):**
```jsonc
{
  "title": "...",
  "fecha": "YYYY-MM-DD",                     // ISO, no locale
  "fechaPublicacion": "YYYY-MM-DDTHH:mm:ssZ",
  "resumen": "string — 1-2 frases",
  "contenido": "string — markdown (no HTML)",
  "imagenDestacada": "string — URL absoluta",
  "galeria": [{ "url": "...", "alt": "..." }],
  "fuenteOriginal": "string — URL WP original (trazabilidad)",
  "slug": "string — kebab-case sin tildes"
}
```

**Schema `Norma` (repositorio jurídico):**
```jsonc
{
  "tipo": "Ley|Decreto|Resolución|Sentencia|Acto Legislativo|Circular|Concepto|Convención|Tratado",
  "numero": "string",
  "anio": 2024,
  "nombre": "string — nombre oficial completo",
  "epigrafe": "string — sumilla legal",
  "palabrasClave": ["array", "de", "strings"],
  "urlPdf": "string",
  "urlSuin": "string — opcional",
  "vigencia": "VIGENTE|DERROGADA|VIGENTE-PARCIAL",
  "fuenteOriginal": "string — URL WP"
}
```

**Schema `Album` (galería):**
```jsonc
{
  "title": "...",
  "fecha": "YYYY-MM-DD",
  "evento": "string — nombre del evento",
  "lugar": "string — ciudad",
  "descripcion": "string — markdown corto",
  "portada": "string — URL",
  "imagenes": [{ "url": "...", "alt": "descripción accesible real, no el filename" }],
  "fuenteOriginal": "string — URL WP"
}
```

### D4 — Convenciones de nombres (dominio ITRC)

- **Slug**: kebab-case, ASCII puro (sin tildes ni ñ). Usa `slugify` con `lower=true, strip=true, replacement="-"`.
- **Variables**: español cuando representan entidad del dominio (`norma`, `memoria`, `entidad`, `traslado`). Inglés solo para términos técnicos (`url`, `href`, `slug`, `id`).
- **Archivos `.astro`**: mismo slug que el JSON. No usar sufijos `-page`, `-component`.
- **Prohibido**: `data`, `item`, `result`, `handle*` genéricos. Usa el nombre del dominio (`norma`, `memoriaEducacion`, `documentoContractual`).

### D5 — Manejo de errores obligatorio

Para cada lote:
- **Slugs duplicados entre `/Itrc/` y `/observatorio/`**: prefijar con `itrc-` u `obs-` si colisionan.
- **Caracteres especiales en slugs WP**: normalizar a ASCII antes de crear archivos (el FS de Windows/WSL falla con `ñ`, `á` en algunos contextos).
- **URLs con `//` doble**: colapsar a `/` — es artefacto del CMS WordPress, no rutas reales.
- **Shortcodes Elementor no convertidos** (`[et_pb_*]`, `[pb_row]`, etc.): eliminar con regex, no renderizarlos.
- **Imágenes 404 en origen**: registrar en `reports/broken-assets-<fecha>.md`. No bloquear el lote por eso.
- **Posts sin featured_media**: usar placeholder institucional — `/images/placeholder-itrc.png`. No dejar `null`.
- **Contenido vacío (`content.rendered === ""`)**: omitir el post. Registrar en reporte.

### D6 — Qué va en JSON vs en .astro

- **En JSON**: todo contenido editable por humanos no-técnicos (textos, URLs, arrays, booleanos de feature flags).
- **En .astro**: presentación, lógica de renderizado, interactividad, imports. Nunca datos.
- **Regla inviolable**: si un editor necesita cambiarlo desde Sveltia CMS, va en JSON. Sin excepciones.

### D7 — Verificación post-lote (checklist automatizable)

Después de cada lote, obligatorio en orden:
1. `npm run build` → 0 errores, 0 warnings nuevos
2. Audit de enlaces internos (Python script ad-hoc) → 0 rotos
3. Validación JSON: cada JSON debe tener `title`, `description`, estructura del schema declarado
4. `git diff --stat` → coincide con lo que el prompt prometió crear/modificar
5. `node cms/generate.js` → `public/admin/config.yml` regenerado sin errores

---

## 2. RITUAL DE INICIO DE SESIÓN (SIEMPRE)

**Copia este prompt al INICIO de cada sesión en Claude Code:**

```
Ritual de inicio — migración ITRC. En paralelo:

1. Lee PROMPTS-MIGRACION.md secciones 1.5 (decisiones D1-D7) y 3 (progress tracker).
2. `git log --oneline -5` y `ls reports/changes-*.md 2>/dev/null | tail -3`.
3. Reporte de 5 líneas: [último commit], [último lote completado], [reports/changes pendientes: sí/no], [lote sugerido hoy + razón], [cualquier bloqueo].

NO cambios, NO build hasta que yo autorice un lote. Si detectas un reporte de cambios sin procesar, priorízalo sobre los lotes.

Contexto pesado (MIGRACION-ITRC.md, CLAUDE.md) sólo si te pido uno concreto — no los leas por defecto.
```

---

## 3. PROGRESS TRACKER (MARCAR AQUÍ)

> **Marca los checkboxes conforme avanzas.** `[ ]` pendiente · `[~]` en progreso · `[x]` completado · `[!]` bloqueado · `[skip]` descartado con justificación.

### 🎯 Arranque en frío (recuperación de contexto)

**Si pierdes contexto, lee esto primero** y podrás retomar sin preguntas:

1. **Proyecto**: Migración WP → Astro + Sveltia CMS del portal ITRC (`cdavidbm.github.io/pitrcastro`). Origen: `itrc.gov.co/Itrc/`.
2. **Dos análisis autoritativos**:
   - `MIGRACION-ITRC.md` (2026-04-14): contexto arquitectónico, gap analysis v1 (10 lotes A-J).
   - `analisis_web_ITRC.md` (2026-04-14): análisis más exhaustivo con 125+ items faltantes. Generó los sub-lotes K-O (y M1-M5).
3. **Reglas permanentes (ver `MEMORY.md`)**:
   - NUNCA commit/push sin confirmación explícita.
   - Todo contenido va en JSON editable desde Sveltia CMS.
   - No clonar slugs/categorías WP — priorizar completitud + mejor organización.
   - **Reportar mapeo URL remota ↔ dev ↔ prod ↔ archivo astro/JSON en cada respuesta y reporte.**
   - **No omitir contenido silenciosamente** — placeholders, enlaces rotos, duplicados y ausencias del origen se registran en `REFERENCIAS-FALTANTES.md` (tracked). Preguntar al usuario ante duda sobre cómo manejar.
   - PDFs/binarios siguen hospedados en `itrc.gov.co/Itrc/wp-content/uploads/`. Decisión global: migrar binarios al final de todo el proceso.
4. **Estado al 2026-04-15**: lotes A-L y K cerrados (ver tabla abajo). En curso: O, N, M1-M5.
5. **Flujo de trabajo**: por cada lote, (1) pre-flight verificando repo + REST WP, (2) reporte con mapeo URL, (3) ejecutar solo con autorización explícita, (4) build + test, (5) reporte final con mapeo URL, (6) commit + push tras segunda autorización.
6. **Comandos clave**:
   - `curl -ks "https://www.itrc.gov.co/Itrc/wp-json/wp/v2/pages?slug=<slug>&_fields=id,slug,title,content.rendered,modified,parent"` — REST API WP
   - `npm run cms:validate && npm run build` — D7 check
   - `node scripts/check-itrc-changes.py` — diff WP vs snapshot base

### Base del proyecto (completado en sesiones anteriores)

- [x] Arquitectura Astro + Sveltia CMS
- [x] 9 colecciones CMS configuradas
- [x] Navegación principal (menú completo)
- [x] Landing pages (Agencia, Normativa, Atención, Participa, Prensa)
- [x] 74 noticias migradas (`src/content/news/*.md`)
- [x] Transparencia — 31/31 páginas pendientes completadas
- [x] Observatorio — Fases 1-5 completadas (20 páginas, 22 entries CMS)
- [x] Script de monitoreo `check-itrc-changes.py`
- [x] Primer snapshot base `inventory-2026-04-14.json`

### Lotes pendientes de migración

| ID | Lote | Volumen | Prioridad | Estado |
|----|------|---------|-----------|--------|
| A | Galería fotográfica (25 álbumes) | 25 páginas | 🔴 Alta | [x] |
| B | Memorias Eje Educación | 55 posts | 🟡 Media | [x] |
| C | Memorias Eje Participación | 39 posts | 🟡 Media | [x] |
| D | Noticias Observatorio | 14 posts | 🟡 Media | [x] |
| E | Repositorio Jurídico (detalle) | 85 posts | 🟢 Baja | [skip] |
| F | Cápsulas Informativas | ~10-15 | 🔴 Alta | [x] |
| G | Videos ITRC individuales | ~10-15 | 🟡 Media | [x] |
| H | `/agencia/directorio` (personas) | 1 página | 🟡 Media | [x] |
| I | Evaluar `/denuncias/` (WP aparte) | ? | 🟢 Baja | [skip] |
| J | Migrar `index.astro` a `home.json` (hardcoded → CMS) | 1 página | 🟡 Media | [x] |

### Lotes derivados del análisis secundario (`analisis_web_ITRC.md`)

> Iniciados 2026-04-15 tras evaluar el análisis exhaustivo del 2026-04-14. Abordan gaps ALTA priority no cubiertos en A-J: compliance Ley 1712 + sub-páginas de Control Interno, Contratación y Control e Informes.
>
> Principio vigente: **no clonar slugs/categorías WP, solo completitud + mejor organización**.
> Regla operativa: **cada respuesta y cada reporte de lote debe incluir mapeo URL remota ↔ URL local (dev + prod) ↔ archivo .astro ↔ archivo .json**.

**Orden de ejecución actual (2026-04-15):** K ✅ → L ✅ → **O → N → M1 → M2 → M3 → M4 → M5**.
Razón del reordenamiento: M (Transparencia, Ley 1712) es el lote más grande y crítico; se subdividió en 5 sub-lotes tras crawl profundo. Se aborda al final para llegar con patrón + CMS ya validados por O y N.

| ID | Lote | Items FALTA | CMS huérfanos | Orden ejecución | Estado |
|----|------|:-----------:|:-------------:|:---------------:|--------|
| K | Institucional (perfiles + PINAR) | 1 PINAR + 1 dato (Herbert) | 0 | 1º | [x] |
| L | Control Interno sub-páginas | 0 reales (todo consolidado) | 3 | 2º | [x] |
| **O1** | **Informes periódicos (homogéneos)** | 4 (#41, #42, #43, #45) | 0 | **3º** | [x] |
| O2 | Páginas especiales / wrappers | 3 (#40, #44, #47) | 0 | 6º | [x] |
| O3 | Informes 3LD (catálogo OCI como hub) | 1 (#46, 27 categorías) | 0 | 7º | [x] |
| **N1** | **Contratación — parte chica + huérfanos + consolidación** | 4 (#35, #37, #38, #39 consolidados) | 2 (plan-adquisiciones, proyectos-inversion) | **4º** | [x] |
| N2 | Publicación ejecución contratos | 1 (#34, 314 PDFs en 6 vigencias) | 0 | 5º | [x] |
| M1 | Transparencia — Saneamiento CMS (barrido) | 0 | 6 efectivos (unificacion-suin ya tenía entry en normativa.js) | 5º | [x] |
| M2 | Transparencia — Sede + Proyectos Normas | 2 (#15, #23) | 0 | 6º | [x] |
| M3 | Transparencia — Decretos | 2 (#18, #19) consolidados en 1 JSON + 1 enlace roto registrado | 0 | 7º | [x] |
| M4 | Transparencia — Gestión Documental | 4 (#26, #27, #28, #30) | 0 | 8º | [x] |
| M5 | Transparencia — Reporte Austeridad | 1 (#21) + update normatividad-especial con enlaces internos | 0 | 9º | [x] |

**Total trabajo restante (post K + L):** 22 FALTA puras + 9 CMS huérfanos = **31 items**.

### Segunda ola (MEDIA + BAJA) — derivada de §3.3 re-análisis (2026-04-15)

> Tras cerrar los 12 sub-lotes ALTA (K, L, M1-M5, N1-N2, O1-O3) del análisis secundario, un re-cross-check reveló 45 items FALTA adicionales en niveles MEDIA/BAJA. Se agrupan en 6 lotes temáticos (P-U) + 2 decisiones estratégicas (V, W).

**Orden de ejecución:** P → Q → R → S → T → U → W. V (CIPREP) queda descartado en esta fase.

| ID | Lote | Items FALTA | Prioridad | Estado |
|----|------|:-----------:|-----------|--------|
| P | Normativa Temática (delitos: cohecho, peculado, prevaricato, concusión, etc.) | 15 | 🟡 MEDIA | [x] |
| Q | Empleo y RRHH (incluye 310 nombramientos + 97 fichas cargo) | 5 | 🟡 MEDIA | [x] |
| R | Documentación y Archivos | 5 (1 CMS huérfano + 4 nuevos) | 🟡 MEDIA | [x] |
| S | Participación + Atención pendientes (incluye resolución enlace roto M1) | 4 | 🟡 MEDIA | [x] |
| T | Otros institucionales (incluye #91 Calendario con shortcode muerto → wrapper) | 6 | 🟢 BAJA-MEDIA | [x] |
| U | Vigencias históricas 2012-2021 (178 actos administrativos) | 10 | 🟢 BAJA | [x] |
| V | CIPREP (sub-app independiente) | ~1 landing | 🟢 BAJA | [skip] (decisión estratégica, retomar post-producción con builder genérico) |
| W | UI/UX compliance gov.co + SEO (Instagram, Colombia.co, RSS, Maps, Schema.org, Línea 018000) + 3 pendientes admin (ConverTIC, GTranslate, YT rendición) | 8 elementos | 🟡 MEDIA | [x] (parcial — 3 pendientes admin en REFERENCIAS) |

Total segunda ola: 45 FALTA + 8 UI/UX = **53 items** en 7 lotes ejecutables.

### Tercera ola — Audit integral (2026-04-15, ✅ CERRADA)

> Verificación profunda página-por-página del portal nuevo vs WP origen. 8 audits ejecutados, 134 páginas auditadas, 3 correcciones reales aplicadas + ~100 URLs rotas en WP documentadas.

| Audit | Área | Páginas | Correcciones |
|---|---|:---:|---|
| AUDIT-1 | Agencia / Institucional | 11 | 0 |
| AUDIT-2 | Transparencia | 27 | 1 duplicación eliminada |
| AUDIT-3 | Normativa | 22 | 0 |
| AUDIT-4 | Atención al Ciudadano | 13 | 2 (PQRS Servidores + Chat ITRC) |
| AUDIT-5 | Participa | 9 | 0 |
| AUDIT-6 | Prensa | 8 | 0 |
| AUDIT-7 | Observatorio | 20 | 0 |
| AUDIT-8 | Contratación/Informes/Vigencias | 24 | 0 |

### Cuarta ola — Migración de binarios (fase BIN, 🔜 PENDIENTE)

> Descargar los ~1100+ archivos referenciados en JSONs desde `itrc.gov.co/Itrc/wp-content/uploads/` al repo local (`public/documentos/`) y actualizar las URLs para desacoplar el portal del WP legacy.

Plan detallado en memoria Claude: `project_migracion_binarios.md`.

| Sub-lote | Propósito | Estado |
|---|---|---|
| BIN-1 | Inventario + análisis de URLs (sin descarga) | [ ] |
| BIN-2 | Estructura `public/documentos/` + script de descarga con dry-run | [ ] |
| BIN-3 | Descarga por tipo (a: PDFs, b: XLSX, c: imágenes, d: MP4, e: MP3) | [ ] |
| BIN-4 | Actualizar URLs en JSONs (replace WP → local) | [ ] |
| BIN-5 | Verificación + audit final (grep URLs WP + link-check) | [ ] |
| BIN-6 | Optimización opcional (WebP, compresión, Git LFS si aplica) | [ ] |

**Preocupaciones**:
- Límite GitHub: 100 MB por archivo, repo ideal <1 GB, GitHub Pages ~1 GB soft.
- URLs con tildes NFC/NFD y codificaciones distintas — normalizar.
- No tocar enlaces externos (SUIN-Juriscol, Contraloría, SECOP, etc.).
- Commit por sub-lote con historial limpio + rollback plan.

### Mantenimiento

- [ ] Snapshot semanal de WordPress ejecutado esta semana
- [ ] Último diff revisado: _(escribir fecha)_
- [ ] Build limpio en última verificación: _(escribir fecha)_

### Notas libres

**2026-04-15 — Lote K cerrado (Institucional)**
- #2 Perfil Directora General y #3 Perfil Subdirectores resueltos por **consolidación en `equipo-directivo.json`** (Opción A). No se crean páginas dedicadas `/perfil-*`.
- Dato corregido: Subdirección de Instrucción Disciplinaria pasa de "Diana Marcela Montenegro Villanueva" a "Herbert Harbey Romero Ríos" según confirmación del usuario; WP perfil-subdirectores era autoritativo.
- #7 Plan Institucional de Archivos (PINAR): página nueva `/agencia/plan-institucional-de-archivos` con los 2 PDFs oficiales (2022 + 2017) hospedados en WP.
- Los PDFs siguen apuntando a `itrc.gov.co/Itrc/wp-content/uploads/...`. Decisión global: migrar binarios al repo al final del proceso completo (riesgo si apagan WP pero ganamos simplicidad ahora).

**2026-04-15 — Lote I cerrado como [skip]**
Decisión: no migrar `/denuncias/`. No hay acceso wp-admin a esa instalación WordPress independiente, por lo que no se puede inventariar ni exportar contenido de forma fiable. Mantener el enlace externo actual como referencia. Reabrir si el equipo obtiene credenciales o decide rediseñar el flujo de denuncias dentro del portal nuevo.

**2026-04-15 — Lote E cerrado como [skip]**
Decisión: no migrar las 33 normas WP faltantes (52 actuales vs 85 en WP categoría `repositorio-juridico` id=15).
Motivación: (1) el gap analysis original §5 ya clasificó E como 🟢 Baja porque la tabla filtrable existente cubre la navegación básica; (2) traer sólo la lista sin páginas de detalle daría poco valor adicional y el contenido sustantivo (sentencias, decretos) vive también en SUIN-Juriscol; (3) el principio "traer contenido + organizar mejor, no clonar categorías WP" se considera cumplido con el listado filtrable ya desplegado.
Si en el futuro se requieren las normas faltantes, el camino es E-listado (enriquecer `repositorio-juridico.json` con REST API del observatorio) antes de considerar E-detalle.

---

---

## 4. LOTES DE TRABAJO

> Cada lote tiene **un solo prompt autocontenido**. Copia el prompt completo en Claude Code cuando decidas abordar ese lote.

---

### LOTE A — Galería fotográfica

**Volumen**: 25 álbumes fotográficos individuales.
**Origen WP**: `https://www.itrc.gov.co/Itrc/galeria/` y sub-URLs.
**Destino Astro**: `/galeria` (ya existe) + páginas individuales por álbum.

**Pre-requisitos**: Ritual de inicio ejecutado.

**PROMPT:**

````
Voy a abordar el LOTE A: Galería fotográfica (25 álbumes individuales).

Estructura WP: `/galeria` es página padre; cada álbum es hija. No es categoría de posts.

Decisiones arquitectónicas aplicables (sección 1.5):
- D1: folder collection `galeria-albumes` (volumen >20)
- D2: ruta dinámica `src/pages/galeria/[slug].astro`
- D3: schema Album — { titulo, slug, fecha (YYYY-MM-DD), descripcion, portada {url, alt}, imagenes: [{url, alt, caption?}] }
- D5: edge cases obligatorios — en especial #5 (imágenes 404 → `reports/broken-assets-<fecha>.md`) y #7 (álbum sin imágenes extraíbles → skip + reporta)

Flujo:

1. Resolver ID de la página padre `galeria`:
   curl -ks "https://www.itrc.gov.co/Itrc/wp-json/wp/v2/pages?slug=galeria&_fields=id"

2. Listar álbumes hijos (paginar si >100):
   curl -ks "https://www.itrc.gov.co/Itrc/wp-json/wp/v2/pages?parent=<ID>&per_page=100&_fields=id,slug,title,date,content,featured_media,link"

3. Por álbum, extraer imágenes del `content.rendered`:
   - Regex `<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>` sobre el HTML limpio
   - Strip shortcodes Elementor (D5 #4)
   - Deduplica URLs idénticas
   - Valida existencia con HEAD: `curl -ksI "<url>" | head -1`. Si 404 → registra en `reports/broken-assets-<fecha>.md` y excluye del JSON

4. Escribir `src/content/pages/galeria/<slug>.json` con schema Album. Si `imagenes.length === 0` tras la limpieza → skip, registra en `reports/empty-albums-<fecha>.md`.

5. Crear `src/pages/galeria/[slug].astro` con:
   - `getStaticPaths` via `import.meta.glob('../../content/pages/galeria/*.json', { eager: true })`
   - Grid CSS (no framework), `loading="lazy"` y `aspect-ratio: 4/3` obligatorio
   - Lightbox mínimo: usa `<dialog>` nativo HTML5, sin librerías externas
   - `HeroPage`, `Breadcrumb`, back-link a `/prensa/galeria`

6. Actualizar `src/content/pages/prensa/galeria.json`: cada thumbnail `.url` → `/galeria/<slug>` (interno). NO dejes links a `itrc.gov.co/Itrc/galeria/`.

7. Añadir folder collection en `cms/collections/prensa.js` usando `albumFields` (si no existe en `cms/templates/fields.js`, créalo ahí — NO inline).

8. Verificación D7 completa (cms:generate, build, grep de enlaces externos residuales).

Reporte final:
- Álbumes migrados: N (esperado 25)
- Álbumes saltados por vacío: N
- Imágenes totales: N
- Imágenes con 404 excluidas: N

Duplicados conocidos (como `galeria-2`): detente y pregúntame antes de crear el JSON — en WP esas páginas suelen ser borradores olvidados.

NO commit/push. Muestra diff resumido y reporte, espera confirmación.
````

---

### LOTES B/C/D — Archivo histórico por categoría WordPress (patrón parametrizado)

**Patrón compartido**: los tres lotes migran posts individuales de una categoría WP del Observatorio a páginas internas bajo una ruta dinámica `[slug].astro`. Sólo cambian cuatro parámetros.

**Tabla de parámetros:**

| Lote | `$CATEGORIA_SLUG` | `$DESTINO_JSON_DIR` | `$RUTA_ASTRO` | `$LISTADO_JSON` | `$VOL` |
|------|-------------------|---------------------|---------------|-----------------|--------|
| B | `memorias-eje-educacion` | `src/content/pages/observatorio/eje-de-educacion/memorias/` | `src/pages/observatorio/eje-de-educacion/memorias/[slug].astro` | `src/content/pages/observatorio/eje-de-educacion/memorias.json` | ~55 |
| C | `memorias-eje-participacion` | `src/content/pages/observatorio/eje-de-participacion/memorias/` | `src/pages/observatorio/eje-de-participacion/memorias/[slug].astro` | `src/content/pages/observatorio/eje-de-participacion/memorias.json` | ~39 |
| D | `noticias-observatorio` | `src/content/pages/observatorio/eje-de-participacion/noticias/` | `src/pages/observatorio/eje-de-participacion/noticias/[slug].astro` | `src/content/pages/observatorio/eje-de-participacion/noticias.json` | ~14 |

**PROMPT (sustituye los 4 parámetros antes de pegar):**

````
Voy a abordar el LOTE <B|C|D>: migración de archivo histórico por categoría WP.

Parámetros de este lote:
- $CATEGORIA_SLUG = <slug>
- $DESTINO_JSON_DIR = <ruta>
- $RUTA_ASTRO = <ruta>
- $LISTADO_JSON = <ruta>
- $VOL_ESPERADO = <n posts>

Decisiones arquitectónicas aplicables (ver sección 1.5 de este archivo):
- D1: folder collection (>20 items) o file collection (≤20 items) según $VOL_ESPERADO
- D2: ruta dinámica `[slug].astro` — obligatoria (patrón >5 páginas homogéneas)
- D3: schema Post del dominio ITRC (titulo, fecha YYYY-MM-DD, slug kebab-case ASCII, resumen, contenido markdown, imagenDestacada, galeria[], originalUrl)
- D4: slug sin tildes/ñ; si colisiona con otro lote, prefijar `obs-<slug>`
- D5: todos los 7 edge cases son obligatorios (ver D5)

Flujo:

1. Resolver categoría:
   curl -ks "https://www.itrc.gov.co/observatorio/wp-json/wp/v2/categories?slug=$CATEGORIA_SLUG&_fields=id,slug,count"
   Valida que `count` ≈ $VOL_ESPERADO (±5 acepto; si difiere más, detente y reporta — algo cambió en WP).

2. Descargar posts (paginar si count > 100):
   curl -ks "https://www.itrc.gov.co/observatorio/wp-json/wp/v2/posts?categories=<id>&per_page=100&page=1&_fields=id,slug,title,date,modified,content,excerpt,featured_media,link" > /tmp/lote-posts.json

3. Resolver imágenes destacadas en bloque (una sola llamada por lote, no una por post):
   Colecta todos los `featured_media` ≠ 0 y llama:
   curl -ks "https://www.itrc.gov.co/observatorio/wp-json/wp/v2/media?include=<id1>,<id2>,...&per_page=100&_fields=id,source_url,alt_text"
   Si algún featured_media resuelve 404 o devuelve vacío → aplica D5 (placeholder + registro en `reports/broken-assets-<fecha>.md`).

4. Por cada post, extraer y limpiar (aplicar D5 completo):
   - Strip shortcodes Elementor: regex `/\[\/?et_pb_[^\]]*\]/g` y `/\[\/?vc_[^\]]*\]/g`
   - Normaliza slug a ASCII kebab-case
   - Colapsa `//` → `/` en URLs relativas
   - Si `content.rendered` queda vacío tras limpiar → skip + reporta en `reports/empty-posts-<fecha>.md`; NO crees JSON vacío
   - Convierte HTML → markdown preservando `<strong> <em> <a> <img>`; descarta `style=`, `class=` innecesarios

5. Escribir JSONs en $DESTINO_JSON_DIR con schema Post (D3). Nombre del archivo = slug normalizado.

6. Crear $RUTA_ASTRO con:
   - `getStaticPaths` via `import.meta.glob('../../../../content/pages/<ruta>/*.json', { eager: true })`
   - Uso de `HeroPage`, `Breadcrumb` (variante light), `SectionTitle`, `RelatedLinks`
   - Back-link: "← Volver a <listado>" usando `resolveUrl()`
   - Render de galería sólo si `galeria.length > 0`
   - `<Fragment set:html={contenidoHtml} />` sólo si el JSON ya trae HTML seguro (markdown → HTML en build-time con remark en script de import, NO en el .astro)

7. Actualizar $LISTADO_JSON: cada tarjeta `.url` debe apuntar a `/observatorio/.../<slug>` interno, NO al `link` externo de WP.

8. Añadir colección en `cms/collections/observatorio.js`:
   ```js
   { name: '<nombre-colección>', label: '<etiqueta>', folder: '<$DESTINO_JSON_DIR sin src/>',
     create: true, slug: '{{slug}}', fields: postFields }
   ```
   Reutiliza `postFields` de `cms/templates/fields.js` (no redefinir ad-hoc).

9. Verificación post-lote (D7 completo):
   - `node cms/generate.js` → sin errores
   - `npm run build` → 0 warnings, recuento de páginas generadas = $VOL_ESPERADO ± skips reportados
   - Grep por `itrc.gov.co/observatorio/` en el $LISTADO_JSON para confirmar que no quedan enlaces externos donde deberían ser internos
   - Marca el lote como [x] en el PROGRESS TRACKER

Reporte final (formato exacto):
- Posts procesados: N (esperado $VOL_ESPERADO)
- Posts saltados por contenido vacío: N (ver reports/empty-posts-<fecha>.md)
- Posts con imagen placeholder: N (ver reports/broken-assets-<fecha>.md)
- Colisiones de slug resueltas con prefijo `obs-`: N
- Build status: OK / FAIL

NO hagas commit/push. Muéstrame el reporte y espera confirmación explícita.
````

**Nota sobre solapamiento B↔C**: si el mismo post aparece en ambas categorías (pasa con eventos transversales del observatorio), la WP REST API lo devolverá por separado en cada `categories=<id>`. Crea el JSON en ambas rutas con slug prefijado `educ-` o `part-` si hay colisión — NO cross-linkees, cada eje tiene su propio canon editorial.

---

### LOTE E — Repositorio Jurídico

**Volumen**: 85 posts (cada norma con ficha detallada).
**Origen WP**: posts en categoría `repositorio-juridico`.
**Destino Astro**: `/observatorio/eje-de-educacion/repositorio-juridico/<slug>`.

**PROMPT:**

````
Voy a abordar el LOTE E: Repositorio Jurídico del Observatorio (85 normas individuales con ficha detallada).

Contexto: En `src/content/pages/observatorio/eje-de-educacion/repositorio-juridico.json` ya hay una tabla filtrable con 51 normas en formato resumen (tipo, número, nombre, palabras clave). Ahora hay que agregar páginas individuales con la ficha completa de cada norma (texto íntegro, sentencia, descripción, vínculo al PDF).

Tareas:

1. Obtén las 85 normas desde WP REST API:
   curl -ks "https://www.itrc.gov.co/observatorio/wp-json/wp/v2/posts?categories_slugs=repositorio-juridico&per_page=100&_fields=id,slug,title,content,link,date,modified"

2. Por cada norma:
   - Extrae del content.rendered los campos: tipo de documento, número, año, observación/epígrafe, URL del PDF original, palabras clave, descripción detallada.
   - Crea `src/content/pages/observatorio/eje-de-educacion/repositorio-juridico/<slug>.json`

3. Crea ruta dinámica `src/pages/observatorio/eje-de-educacion/repositorio-juridico/[slug].astro` con ficha bien formateada (título grande, metadatos en sidebar, descripción, link al PDF).

4. Actualiza el JSON del listado principal (`repositorio-juridico.json`) para:
   - Reemplazar los 51 items hardcoded con los 85 reales
   - Cada fila de la tabla ahora debe enlazar a la ficha interna

5. Agrega folder collection en `cms/collections/observatorio.js`.

6. Regenera config, build, audita enlaces.

Decisión de diseño: Como son 85 entradas, la tabla filtrable del listado se mantiene pero ahora cada fila es clickeable hacia la ficha de detalle.

Al terminar, marca el Lote E como [x]. Reporta cuántas normas migraste y si alguna tuvo problemas de parseo del HTML original.
````

---

### LOTE F — Cápsulas Informativas

**Volumen**: ~10-15 cápsulas de video.
**Origen WP**: `https://www.itrc.gov.co/Itrc/capsulas-informativas/` y posiblemente videos individuales.
**Destino Astro**: `/capsulas-informativas` (ya existe listado vacío).

**PROMPT:**

````
Voy a abordar el LOTE F: Cápsulas Informativas.

Contexto: `/capsulas-informativas` ya tiene página pero sin contenido individual. Necesito identificar el origen de estos videos:
- Listado WP: curl -ks "https://www.itrc.gov.co/Itrc/capsulas-informativas/" | grep -iE "video|mp4|youtube"
- Si son YouTube: extrae IDs y embeds
- Si son MP4 hosteados: URLs del /wp-content/uploads/

Tareas:

1. Haz el crawling de la página `/Itrc/capsulas-informativas/` en WordPress y lista todas las cápsulas encontradas con sus URLs de video y metadatos.

2. Para cada cápsula crea:
   - `src/content/pages/prensa/capsulas/<slug>.json` con: { titulo, fecha, descripcion, videoUrl (o videoEmbedId si es YouTube), imagen }

3. Actualiza `src/content/pages/prensa/capsulas.json` (listado) para mostrar las cápsulas reales.

4. Si hace falta, crea ruta dinámica `src/pages/capsulas-informativas/[slug].astro` para páginas de detalle.

5. Agrega folder collection en `cms/collections/prensa.js`.

6. Regenera config, build, audita.

Restricción importante: TODO contenido en JSON. Si un video está en YouTube, guarda el ID del video (no el embed HTML completo) — el .astro construye el embed.

Al terminar, marca el Lote F como [x].
````

---

### LOTE G — Videos ITRC

**Volumen**: ~10-15 videos individuales.
**Origen WP**: `https://www.itrc.gov.co/Itrc/videos-itrc/`.
**Destino Astro**: `/videos-itrc` (ya existe con estructura pero contenido parcial).

**PROMPT:**

````
Voy a abordar el LOTE G: Videos ITRC individuales.

Contexto: `/videos-itrc` ya tiene una página con algunos videos listados pero faltan páginas individuales de detalle.

Tareas:

1. Crawlea `/Itrc/videos-itrc/` y extrae la lista de videos con: título, fecha, descripción, URL del video (MP4 hosted o YouTube).

2. Para cada video crea:
   - `src/content/pages/prensa/videos/<slug>.json`
   - Si hay muchos (>10), crea ruta dinámica `src/pages/videos-itrc/[slug].astro` + folder collection.
   - Si son pocos, integra todos en el JSON del listado (`src/content/pages/prensa/videos.json`).

3. Agrega/actualiza CMS en `cms/collections/prensa.js`.

4. Build + audit.

Al terminar, marca el Lote G como [x].
````

---

### LOTE H — Directorio Personas

**Volumen**: 1 página principal (posiblemente con cards o tabla).
**Origen WP**: `https://www.itrc.gov.co/Itrc/directorio/` (servidores públicos).
**Destino Astro**: `/agencia/directorio` (existe pero puede estar vacía).

**PROMPT:**

````
Voy a abordar el LOTE H: Página de directorio de servidores públicos.

Contexto: `/agencia/directorio` existe pero quiero verificar si tiene el listado completo del SIGEP o solo un enlace externo.

Tareas:

1. Revisa el estado actual del archivo `src/content/pages/agencia/directorio.json` si existe (y su .astro).

2. Crawlea `https://www.itrc.gov.co/Itrc/directorio/` en WordPress para ver qué contenido tiene.

3. Si WP tiene un listado de funcionarios con foto/nombre/cargo/extensión:
   - Extrae el listado
   - Crea JSON estructurado con { nombre, cargo, dependencia, email, telefono, extension, foto }
   - Si son >20 personas, considera folder collection con páginas individuales

4. Si WP solo tiene un enlace a SIGEP:
   - Mantén la página con botón CTA al SIGEP + texto explicativo

5. Actualiza/crea CMS entry en `cms/collections/agencia.js`.

6. Build + audit.

Al terminar, marca el Lote H como [x] y reporta qué enfoque elegiste.
````

---

### LOTE I — Denuncias

**Volumen**: Desconocido (otra instalación WP en `/denuncias/`).
**Origen WP**: `https://www.itrc.gov.co/denuncias/` (separada de /Itrc/).
**Destino**: A decidir.

**PROMPT:**

````
Voy a abordar el LOTE I: Evaluación de `/denuncias/`.

Este lote es de EVALUACIÓN primero, implementación después. Quiero decidir si migrar o dejar como enlace externo.

Tareas:

1. Verifica si `/denuncias/` tiene su propia WP REST API:
   curl -ks "https://www.itrc.gov.co/denuncias/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,title,link"
   curl -ks "https://www.itrc.gov.co/denuncias/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,title"

2. Si tiene contenido estático (páginas informativas sobre cómo denunciar, tipos de faltas, etc.), considera migrar.

3. Si es solo la interfaz del sistema de denuncias (formulario transaccional tipo webfile), déjalo como enlace externo y documenta la decisión en MIGRACION-ITRC.md sección 4.3.

4. Reporta tu análisis con:
   - Número de páginas encontradas
   - Tipo de contenido (estático vs transaccional)
   - Recomendación: [ ] Migrar | [ ] Dejar externo | [ ] Migración parcial (qué sí, qué no)

NO tomes decisión sin mi input. Solo reporta y espera mi instrucción.

Al terminar la evaluación (sin migrar todavía), marca el Lote I como [~] (en progreso, evaluación hecha) y espera mi decisión para continuar.
````

---

### LOTE J — Migrar `index.astro` a `home.json` (eliminar contenido hardcoded)

**Volumen**: 1 página (la landing), ~80 líneas de contenido actualmente en `.astro` que deben vivir en JSON.
**Motivo**: `src/pages/index.astro` viola la regla de CLAUDE.md "TODO contenido de página debe estar en JSON administrable por Sveltia CMS". Hoy tiene hardcoded: 3 entidades vigiladas (DIAN, Coljuegos, UGPP), 3 columnas de enlaces de "Servicios a la Ciudadanía" con 18 enlaces mezclando internos/externos, y el bloque de contacto. Esto además aparece en la auditoría vibe-coding como "strings mágicos": URLs externas como `https://www.datos.gov.co/browse?q=itrc`, `https://www.cnsc.gov.co/`, `https://www.colombiacompra.gov.co/` repetidas sin fuente única.

**Riesgo**: Medio — es la página de inicio; un error visual afecta la primera impresión del sitio.

**Pre-requisitos**: Commit limpio (sin otros cambios en curso). Ritual de inicio ejecutado.

**Decisiones arquitectónicas aplicables (sección 1.5):**
- D1: file collection (1 sola página → 1 archivo JSON)
- D3: schema Home — tres arrays tipados (ver abajo)
- D4: campos en español (`entidadesVigiladas`, `columnasServicios`), `icon` permanece así por consistencia con el resto del proyecto
- D6: `home.json` para contenido editable; `index.astro` sólo presentación

**Schema del JSON (D3):**

```jsonc
{
  "entidadesVigiladas": [
    { "nombre": "DIAN", "url": "https://www.dian.gov.co/", "logo": "dian.png", "alt": "DIAN - Dirección de Impuestos y Aduanas Nacionales" }
  ],
  "columnasServicios": [
    {
      "items": [
        { "texto": "Glosario", "url": "/glosario", "tipo": "internal" },
        { "texto": "Datos abiertos", "url": "https://www.datos.gov.co/browse?q=itrc", "tipo": "external" }
      ]
    }
  ]
}
```

`tipo` es `"internal"` o `"external"` — determina si usar `resolveUrl()` o `target="_blank" rel="noopener noreferrer"`. `logo` es el filename dentro de `/public/images/entidades/`, no URL completa.

**PROMPT:**

````
Voy a abordar el LOTE J: mover contenido hardcoded de index.astro a home.json.

Contexto: index.astro tiene ~80 líneas de contenido (entidades vigiladas, 3 columnas de servicios, URLs mezcladas internas/externas) que deben vivir en JSON editable por el CMS. Ver sección del lote en PROMPTS-MIGRACION.md para el schema.

Pre-verificación (detente si alguna falla):
- `git status` debe estar limpio
- `npm run build` baseline → 175 páginas, capturo timestamp para comparar
- Captura screenshot o descripción textual de la página actual (la home renderizada) — será la referencia visual

Flujo:

1. Crear `src/content/pages/home.json` con las 3 estructuras: `entidadesVigiladas`, `columnasServicios` (array de 3 objetos, cada uno con `items[]`), y cualquier otro dato hardcoded relevante que encuentres en index.astro. Cada item de columna con `{ texto, url, tipo: "internal" | "external" }`.

2. Refactorizar `src/pages/index.astro`:
   - `import homeData from '../content/pages/home.json'`
   - Mantén el orden visual exacto
   - Para `tipo === "internal"`: usar `resolveUrl()` + sin `target="_blank"`
   - Para `tipo === "external"`: URL literal + `target="_blank" rel="noopener noreferrer"` + icono FA `fa-arrow-up-right-from-square`
   - Preservar la clase `entidad`, `servicios-lista`, etc. — sólo datos al JSON, no CSS
   - NO cambiar markup de secciones que NO son parte del refactor (video, contacto, hero, news)

3. Añadir file collection `home` en `cms/collections/settings.js` (o crear nueva `home.js` si crece):
   - Schema matching el JSON con labels en español
   - `columnasServicios` como list of object of list (anidado) — verifica que Sveltia lo renderiza bien

4. `node cms/generate.js` — verificar que genera sin errores y que el nuevo entry aparece en config.yml

5. `npm run build` — DEBE seguir generando 175 páginas. Si el conteo cambia, algo se rompió.

6. `npm run dev` → abrir http://localhost:4321 y VERIFICAR visualmente:
   - Las 3 entidades vigiladas aparecen en el mismo orden (DIAN, Coljuegos, UGPP)
   - Las 3 columnas de servicios mantienen su distribución
   - Todos los enlaces externos abren en nueva pestaña y llevan el icono
   - Los enlaces internos usan la ruta con base path correcta
   - La página se ve idéntica a la de antes

7. Actualizar memoria en .claude/memory: pointer a que index.astro ahora consume home.json.

Restricciones:
- NO tocar otras secciones de index.astro fuera del scope (hero, video embed, news section, contact)
- NO cambiar clases CSS ni markup HTML — sólo extraer datos
- Si encuentras URLs que parecen obsoletas (p.ej. el PDF "Portafolio de servicios" de 2022), NO las cambies; sólo márcalas en el reporte final
- NO commit hasta que yo vea el diff y la captura visual

Reporte final:
- Items extraídos: N entidades + N enlaces en N columnas
- Build status: OK (175 páginas) / FAIL
- Conteo de URLs externas centralizadas: N
- Observaciones visuales tras npm run dev: [texto]
- URLs sospechosas/obsoletas detectadas: [lista o "ninguna"]
````

---

### LOTE K — Institucional (perfiles + PINAR) — ✅ CERRADO 2026-04-15

**Volumen resuelto**: 3 items del análisis secundario (#2 Perfil Directora, #3 Perfil Subdirectores, #7 Plan Institucional de Archivos).

**Decisiones tomadas:**
- Opción A de consolidación: #2 y #3 **NO tienen páginas dedicadas**. Su información vive en `/agencia/equipo-directivo` (JSON único con directora + subdirectores).
- Subdirección de Instrucción Disciplinaria: "Herbert Harbey Romero Ríos" (confirmado por el usuario, WP era autoritativo). Bio + foto traídas de WP perfil-subdirectores.
- #7 PINAR: página nueva `/agencia/plan-institucional-de-archivos` con 2 PDFs institucionales (2022 + 2017). Ruta plana bajo `agencia/` con breadcrumb que referencia SIG.

**Commit:** (pendiente al momento de escribir este prompt)

---

### LOTE L — Control Interno sub-páginas

**Volumen**: 5 páginas FALTA + 1 entry CMS para JSON huérfano.

**Items FALTA (crear desde cero):**
| # | WP slug | Destino propuesto |
|---|---------|-------------------|
| 9 | `informes-de-evaluacion-control-interno-contable` | `/agencia/sistema-de-control-interno/informes-contables` |
| 11 | `planes-de-mejoramiento-2` | `/agencia/sistema-de-control-interno/planes-de-mejoramiento` |
| 12 | `planes-de-mejoramiento-interno` | `/agencia/sistema-de-control-interno/planes-de-mejoramiento-interno` |
| 13 | `planes-de-mejoramiento-externo` | `/agencia/sistema-de-control-interno/planes-de-mejoramiento-externo` |
| 14 | `auditorias-por-parte-de-la-contraloria` | `/agencia/sistema-de-control-interno/auditorias-contraloria` |

**JSON huérfano (solo falta CMS entry):**
- #10 `src/content/pages/transparencia/supervision-vigilancia.json` → añadir entry en `cms/collections/transparencia.js` (u otro archivo relevante según dónde viva la colección actual).

**PROMPT:**

````
Voy a abordar el LOTE L: Control Interno sub-páginas.

Pre-flight obligatorio antes de tocar código:
1. Verifica estado actual en repo para los 5 slugs WP listados. Alguno puede estar parcialmente cubierto con nombre de archivo distinto (como vimos con el Lote K/auditoría). Usa `find src/content/pages -iname "*plan-mejoramiento*"` y `find src/pages -iname "*auditoria*"` para descartar falsos positivos.
2. Query WP REST para cada slug: `curl -ks "https://www.itrc.gov.co/Itrc/wp-json/wp/v2/pages?slug=<slug>&_fields=id,slug,title,content,modified,featured_media,parent"`. Registra content_len y featured_media.
3. Si algún slug devuelve `[]`, reporta y detente — algo cambió en WP vs el análisis (fechado 2026-04-14).
4. Respeta principio "no clonar slugs/categorías": si el slug WP es verboso (`planes-de-mejoramiento-2` con el `-2`), usa un slug más limpio en el destino.

Ejecución por item (loop):
A. Decide schema según tipo de contenido:
   - Si es lista de documentos/PDFs → schema `documentos[]` con { titulo, anio, url, tipo? }.
   - Si es texto explicativo + documentos → añade campo `intro` (markdown).
   - Si es tabla periódica (por año/trimestre) → `periodos[{ anio, entradas[] }]`.
B. Crea JSON en `src/content/pages/agencia/sistema-de-control-interno/<slug-local>.json` o archivo único con secciones si son múltiples que se ven juntos.
C. Crea astro en `src/pages/agencia/sistema-de-control-interno/<slug-local>.astro`. Reutiliza HeroPage, breadcrumb con "Sistema de Control Interno", `Accordion variant="document"` si son listados de PDFs.
D. Registra en `cms/collections/agencia.js` con función dedicada (patrón de `directorio()` / `planInstitucionalArchivos()` ya existentes).

JSON huérfano #10:
- Ya existe `src/content/pages/transparencia/supervision-vigilancia.json` con contenido y `src/pages/supervision-y-vigilancia.astro` renderizando. Solo falta **añadir entry CMS** en `cms/collections/transparencia.js` exponiendo todos los campos del JSON. Auditar schema del JSON antes de escribir los fields.

PDFs: todos los enlaces apuntan a `itrc.gov.co/Itrc/wp-content/uploads/...`. Mantener tal cual (migración de binarios al final del proceso completo).

D7 check:
- `npm run cms:validate` → OK
- `npm run build` → 0 errores, total de páginas debe incrementar en N (5 si creaste 5 rutas nuevas)
- Grep en HTML generado para confirmar que los PDFs aparecen linkeados

Reporte final:
- Items FALTA cerrados: X/5
- Entry CMS huérfano agregado: sí/no
- Páginas generadas adicionales: N
- Build status: OK / FAIL
- URLs listas para revisión manual (una línea por ítem)

**Requisito de reporte (regla permanente desde 2026-04-15):** al final, incluye una **tabla de mapeo de URLs** con columnas: Origen WP · URL dev (`http://localhost:4321/...`) · URL prod (`https://cdavidbm.github.io/pitrcastro/...`) · Archivo .astro · Archivo .json. Una fila por item procesado. Si un item se cubre por consolidación (varias URLs WP → 1 destino), hacerlo explícito.

NO hagas commit/push. Muéstrame el reporte y espera confirmación.
````

---

### LOTE M — Transparencia sub-páginas (Ley 1712 de 2014) — **PRIORIDAD MÁXIMA**

**Contexto (post crawl profundo 2026-04-15):** tras mapear `/Itrc/transparencia-y-acceso-a-la-informacion-publica/` (root id 3862) en 3 niveles, se detectaron **18 páginas WP**. Estado real vs análisis original:

| Categoría | Cantidad |
|---|:---:|
| ✅ Cubiertos + CMS | 1 (publicacion-hojas-de-vida) |
| ⚠️ CMS huérfano | **7** (decreto-unico, informacion-mujeres, defensa-publica, normatividad-especial, tramites, unificacion-suin, registro-activos) |
| ❌ FALTA pura | **9** (#15, #18, #19, #21, #23, #26, #27, #28, #30) |

**Total trabajo M = 16 items** → divididos en 5 sub-lotes (M1–M5) para controlar volumen y riesgo.

---

#### LOTE M1 — Saneamiento CMS de Transparencia (barrido)

**Alcance**: 7 entries CMS para JSONs huérfanos. Sin crawl. Sin cambios en render. Solo editabilidad Sveltia.

| JSON huérfano | astro renderizador | Cubre item análisis |
|---|---|---|
| `src/content/pages/transparencia/decreto-unico.json` | `src/pages/decreto-unico-reglamentario.astro` | #16 + N2 `decreto` consolidado |
| `src/content/pages/transparencia/informacion-mujeres.json` | `src/pages/informacion-para-mujeres.astro` | #22 |
| `src/content/pages/transparencia/defensa-publica.json` | `src/pages/informe-defensa-publica.astro` | #31 |
| `src/content/pages/transparencia/normatividad-especial.json` | `src/pages/normatividad-especial.astro` | (huérfano no listado, hallazgo) |
| `src/content/pages/transparencia/tramites.json` | `src/pages/tramites.astro` | #29 (huérfano) |
| `src/content/pages/transparencia/registro-activos.json` | `src/pages/registro-activos-informacion.astro` | #25 cubierto por consolidación |
| `src/content/pages/normativa/unificacion-suin-juriscol.json` | `src/pages/transparencia-y-acceso-a-la-informacion-publica/unificacion-normativa-suin-juriscol.astro` | (huérfano no listado, hallazgo) |

**PROMPT M1:**

````
Voy a abordar el LOTE M1: Saneamiento CMS de Transparencia (barrido).

Pre-flight:
1. Confirma que los 7 JSONs listados existen y ninguno tiene ya entry CMS:
   grep -n "<nombre-slug>" cms/collections/*.js
2. Audita schema REAL de cada JSON (no asumir):
   cat <ruta-json> | python3 -m json.tool
3. Registra campos raíz + arrays anidados + objetos. El CMS debe exponerlos todos.

Ejecución:
A. Añade 7 entries al final de `cms/collections/transparencia.js` (6 de ellos) y considera dónde va `unificacion-suin-juriscol` (vive en /normativa/ pero renderiza bajo /transparencia-.../) — puede ir en `transparencia.js` por semántica o en `normativa.js` por ubicación física. Decide y reporta.
B. Cada entry reutiliza patrón de Lote L (ver supervision-vigilancia, planes-mejoramiento, informes-legales).
C. NO modificar JSONs ni astro. Solo CMS.

D7:
- npm run cms:validate → OK
- npm run build → mismo número de páginas (no se crean rutas nuevas)

**Requisito de reporte**: tabla con columnas — "JSON · astro · URL dev · URL prod · Entry CMS nuevo (nombre) · Grupo CMS". No hay URLs WP porque no se crea contenido nuevo. Reporta cambio en líneas config.yml.

NO commit/push.
````

---

#### LOTE M2 — Sede y Horarios + Proyectos de Normas

**Alcance**: 2 FALTA.
| # | WP origen | Destino propuesto |
|---|---|---|
| #15 | `itrc.gov.co/Itrc/transparencia-y-acceso-a-la-informacion-publica/sede-y-horarios/` | `/transparencia-y-acceso-a-la-informacion-publica/sede-y-horarios` |
| #23 | `.../proyectos-de-normas-para-comentarios/` | `.../proyectos-normas-comentarios` |

**PROMPT M2:**

````
Voy a abordar el LOTE M2: Sede y Horarios + Proyectos de Normas.

Pre-flight:
1. curl REST: `curl -ks "https://www.itrc.gov.co/Itrc/wp-json/wp/v2/pages?slug=<slug>&_fields=id,slug,title,content.rendered,modified"` para los 2 slugs.
2. Reporta content_len, si tiene Elementor o HTML limpio.
3. Verifica que no existen en repo.

Schemas propuestos:
- sede-y-horarios: { intro, sede{ direccion, ciudad, codigoPostal? }, horario{ dias, horas }, contacto{ telefono, email, lineaGratuita? }, mapa?{ embedUrl | lat, lng } }
- proyectos-normas-comentarios: { intro, ciclo?, proyectos[{ titulo, tipo, fechaApertura, fechaCierre, estado: 'abierto'|'cerrado', urlProyecto, urlFormularioComentarios, resultado? }] }

Ejecución: 2 JSONs + 2 astros + 2 CMS entries. Usar breadcrumb "Inicio > Transparencia > <Item>".
Considerar actualizar `src/content/pages/transparencia.json` (landing) para enlazar a las nuevas páginas.

**Requisito de reporte**: tabla URL completa (WP · dev · prod · astro · json) + si se actualizó landing.

NO commit/push.
````

---

#### LOTE M3 — Decretos (Estructura + Salarios)

**Alcance**: 2 FALTA con relación padre-hijo en WP.
| # | WP | Destino propuesto |
|---|---|---|
| #18 | `.../decretos-de-estructura-salarios-leyes-marco-y-otros/` | `.../decretos-estructura` |
| #19 | `.../decretos-de-estructura-.../decretos-de-salarios/` | sub-sección dentro del JSON de #18 (consolidar) |

**PROMPT M3:**

````
Voy a abordar el LOTE M3: Decretos (Estructura + Salarios + Leyes Marco).

Pre-flight:
1. curl REST para ids 6357 (padre) y 6360 (hijo).
2. Inspecciona contenido — probablemente listas de PDFs.

Decisión arquitectónica: consolidar padre + hijo en UN JSON con secciones (estructura, salarios, leyes marco, otros). Aplica principio "organizar mejor" del proyecto.

Schema:
{
  intro,
  secciones: [
    { titulo: "Decretos de estructura", decretos: [{ numero, nombre, anio, url }] },
    { titulo: "Decretos de salarios", decretos: [...] },
    { titulo: "Leyes marco", decretos: [...] },
    { titulo: "Otros decretos", decretos: [...] }
  ]
}

Ejecución: 1 JSON consolidado + 1 astro + 1 CMS entry.

**Requisito de reporte**: tabla URL + nota explícita de consolidación (qué 2 URLs WP → 1 destino).

NO commit/push.
````

---

#### LOTE M4 — Gestión Documental

**Alcance**: 4 FALTA, bloque cohesivo sobre gestión de información institucional.

| # | WP | Destino |
|---|---|---|
| #26 | `.../indice-de-informacion-clasificada-y-reservada/` | `.../indice-informacion-clasificada` |
| #27 | `.../programa-de-gestion-documental/` | `.../programa-gestion-documental` |
| #28 | `.../procedimientos-que-se-siguen-para-tomar-decisiones-en-las-diferentes-areas/` | `.../procedimientos-decisiones` |
| #30 | `.../formatos-o-modelos-de-contratos-o-pliego-tipo/` | `.../formatos-contratos-pliegos-tipo` |

**PROMPT M4:**

````
Voy a abordar el LOTE M4: Gestión Documental (4 páginas Ley 1712).

Pre-flight:
1. curl REST para los 4 slugs. Anota content_len + estructura.
2. #26 y #28 suelen ser tablas estructuradas. #27 y #30 suelen ser listas de documentos.

Schemas (diferenciados por ítem):
- indice-informacion-clasificada: { intro, registros[{ nombre, nivelClasificacion: 'clasificada'|'reservada', fundamento, plazoReserva, fechaCalificacion }] }
- programa-gestion-documental: { intro, version?, documentos[{ titulo, url, anio, version? }] }
- procedimientos-decisiones: { intro, secciones[{ titulo, contenido (markdown) }] }
- formatos-contratos-pliegos-tipo: { intro, categorias[{ nombre, formatos[{ titulo, url, descripcion? }] }] }

Ejecución: 4 JSONs + 4 astros + 4 CMS entries. Actualizar landing transparencia si aplica.

**Requisito de reporte**: tabla URL completa para los 4 items.

NO commit/push.
````

---

#### LOTE M5 — Reporte Austeridad en el Gasto

**Alcance**: 1 FALTA (nivel 2 bajo `normatividad-especial`).
| # | WP | Destino |
|---|---|---|
| #21 | `.../normatividad-especial/reporte-austeridad-en-el-gasto/` | `.../normatividad-especial/reporte-austeridad` |

**PROMPT M5:**

````
Voy a abordar el LOTE M5: Reporte Austeridad — último sub-lote de M.

Pre-flight:
1. curl REST id 9845.
2. Contenido esperado: lista de reportes periódicos con PDF.

Schema:
{ intro, reportes[{ anio, periodo: 'I trimestre'|'II trimestre'|'III trimestre'|'IV trimestre'|'Anual', url, fechaPublicacion? }] }

Ejecución: 1 JSON + 1 astro + 1 CMS entry. Breadcrumb: "Inicio > Transparencia > Normatividad Especial > Reporte de Austeridad".

**Al cerrar M5, marcar M completo en tracker §3.**

**Requisito de reporte**: tabla URL.

NO commit/push.
````

---

### LOTE M (prompt legacy consolidado, solo referencia — ver M1-M5 arriba)

<!-- Este prompt agregado queda como referencia histórica. Usa los sub-lotes M1-M5. -->

````
Voy a abordar el LOTE M legacy: Transparencia sub-páginas (Ley 1712 compliance).

Pre-flight:
1. Para cada uno de los 10 slugs WP, verifica en repo:
   find src/content/pages/transparencia -iname "*<keyword>*"
   find src/pages -iname "*<keyword>*"
   Importante: `registro-de-activos-de-informacion` (#25) puede ya estar cubierto por `/registro-activos-informacion` — si el JSON tiene contenido completo solo falta consolidar/redirigir mentalmente y marcar cubierto.
2. Query WP REST por slug individualmente (algunos pueden ser Elementor pages — content.rendered puede traer mucho HTML con estilos, hay que limpiar).
3. Reportar matriz antes de crear archivos.

Ejecución por item FALTA:
A. Schema tipo por dominio:
   - `sede-y-horarios` → { direccion, ciudad, horario{ dias, horas }, coordenadas, telefono, email, mapa? }
   - `decretos-*` → { intro, decretos[{ numero, nombre, anio, url }] }
   - `reporte-austeridad-*` → { intro, reportes[{ anio, periodo, url }] }
   - `proyectos-normas-comentarios` → { intro, proyectos[{ titulo, tipo, fechaPublicacion, fechaCierre, urlProyecto, urlFormularioComentarios }] }
   - `indice-informacion-clasificada` / `programa-gestion-documental` → { intro, documentos[{ titulo, url, anio? }] }
   - `procedimientos-decisiones` → { intro, secciones[{ titulo, contenido markdown }] }
   - `formatos-contratos-pliegos-tipo` → { intro, formatos[{ nombre, categoria, url }] }
B. Crea JSON + astro + CMS entry por cada ítem. Para astro, preferir breadcrumb:
   Inicio > Transparencia > <Item>
C. Los 3 JSONs huérfanos (#16, #22, #31) solo requieren CMS entry — auditar el JSON antes para exponer todos los campos reales.

Verificación Ley 1712:
- Confirma que después del lote, el menú "Transparencia" / página `transparencia.astro` linkea a estas nuevas rutas. Si no, actualiza `src/content/pages/transparencia.json` (landing) con los enlaces nuevos.

D7 check:
- npm run cms:validate → OK
- npm run build → +N páginas
- Grep "sede-y-horarios", "programa-gestion-documental", etc en dist/ para confirmar SSR

Reporte final:
- Páginas creadas: X/10
- CMS entries añadidos (huérfanos): 3/3
- Landing transparencia.json actualizado con enlaces: sí/no
- Compliance Ley 1712 checklist: [lista de items cubiertos]
- Build status: OK/FAIL

NO commit/push. Reporta y espera.
````

---

### LOTE N — Contratación y Gestión

**Volumen**: 5 páginas FALTA + 2 entries CMS para JSONs huérfanos.

**Items FALTA:**
| # | WP slug | Destino sugerido |
|---|---------|------------------|
| 34 | `publicacion-de-la-ejecucion-de-contratos` | `/contratacion/ejecucion-contratos` |
| 35 | `publicacion-de-procedimientos-lineamientos-politicas-en-materia-de-adquisicion-y-compras` | `/contratacion/procedimientos-adquisiciones` |
| 37 | `ficha-ebi-proyecto-de-inversion` | `/proyectos-inversion/ficha-ebi` |
| 38 | `consulta-proyecto-de-inversion-por-sector-y-entidad` | `/proyectos-inversion/consulta` |
| 39 | `resumen-ejecutivo-proyecto-de-inversion` | `/proyectos-inversion/resumen-ejecutivo` |

**JSONs huérfanos:**
- #32 `transparencia/contratacion/plan-adquisiciones.json` → CMS entry
- #36 `transparencia/proyectos-inversion.json` → CMS entry

**PROMPT:**

````
Voy a abordar el LOTE N: Contratación y Gestión.

Pre-flight: mismo patrón que L/M. Verifica repo + REST WP por slug.

Observación: los 3 items de "proyectos de inversión" (#37, #38, #39) son páginas con tabla/ficha del BPIN (Banco Nacional de Programas y Proyectos de Inversión). Puede ser que el contenido WP sea realmente un enlace externo a dnp.gov.co o suifp.dnp.gov.co. Verifica: si solo enlaza hacia SUIFP o SIIF, el contenido en el nuevo portal puede ser un wrapper con CTA externo + descripción. No replicar estructura WP innecesariamente.

Schema:
- `ejecucion-contratos`: probablemente lista de enlaces a SECOP II por año → { intro, enlacesSecop[{ anio, urlSecop, descripcion? }] }
- `procedimientos-adquisiciones`: documentos PDF con procedimientos → { intro, documentos[] }
- `ficha-ebi`, `consulta-inversion`, `resumen-ejecutivo`: evaluar si consolidar en UNA página `/agencia/proyectos-inversion` con secciones, o mantener 3. Mi recomendación: consolidar si el contenido es chico en cada uno (aplica principio de "organizar mejor").

JSONs huérfanos:
- #32 plan-adquisiciones — ya tiene 4.5 KB, expone fields completos en CMS
- #36 proyectos-inversion — 2.1 KB, idem

D7 + reporte: mismo formato que M.

NO commit/push. Reporta y espera.
````

---

### LOTE O — Control e Informes

**Volumen**: 8 páginas FALTA. Sin CMS huérfanos. Es el último sub-lote del análisis secundario.

**Items FALTA:**
| # | WP slug | Destino sugerido |
|---|---------|------------------|
| 40 | `relatoria` | `/agencia/relatoria` o `/transparencia/relatoria` |
| 41 | `informe-pormenorizado` | `/agencia/sistema-de-control-interno/informe-pormenorizado` |
| 42 | `evaluacion-independiente-sistema-de-control-interno` | `/agencia/sistema-de-control-interno/evaluacion-independiente` |
| 43 | `seguimiento-al-plan-anticorrupcion-y-de-atencion-al-ciudadano` | `/transparencia/seguimiento-plan-anticorrupcion` |
| 44 | `informe-de-rendicion-de-la-cuenta-fiscal-e-informe-de-gestion-a-la-cgr` | `/transparencia/informe-cuenta-fiscal-cgr` |
| 45 | `informes-software-legal` | `/transparencia/informes-software-legal` |
| 46 | `informes-de-evaluacion-y-auditoria-de-la-agencia-3ld` | `/agencia/sistema-de-control-interno/informes-evaluacion-auditoria` |
| 47 | `informes-a-organismos-de-control-externo-entre-otros-informes-especiales` | `/transparencia/informes-organismos-control` |

**PROMPT:**

````
Voy a abordar el LOTE O: Control e Informes — último sub-lote del análisis secundario.

Pre-flight + REST WP igual que L/M/N.

Decisiones de agrupamiento:
- #41, #42, #46 son sub-rutas naturales de `/agencia/sistema-de-control-interno/`. Reutiliza el patrón de Lote L.
- #40 Relatoría puede ser página top-level pequeña (suele ser un buscador de actos administrativos o enlace a sistema externo).
- #43, #44, #45, #47 son informes periódicos bajo Transparencia.

Schema tipo (informes periódicos):
{ intro, periodos[{ anio, informes[{ periodo: "Q1|Q2|...|Anual", url, fecha }] }] }

Al terminar este lote:
- Actualiza `PROMPTS-MIGRACION.md` §3 tracker: marcar L, M, N, O como [x].
- Añadir nota en "Notas libres" con el estado final post-análisis-secundario.

D7 + reporte estándar.

NO commit/push. Reporta y espera.
````

---

---

## 5. RITUALES PERIÓDICOS

### 5.1. Verificación semanal (lunes por la mañana)

**PROMPT:**

```
Ritual semanal: verificar cambios en WordPress origen.

1. Ejecuta: python3 scripts/check-itrc-changes.py
2. Si detecta cambios (exit code 1):
   - Lee el reporte en reports/changes-YYYY-MM-DD.md
   - Clasifícamelos en:
     * Urgentes (noticias nuevas, cambios en Transparencia por obligación legal)
     * Normales (memorias, publicaciones regulares)
     * Estéticos (cambios de título menores sin contenido sustantivo)
   - Dame un plan de sincronización priorizado.
3. Si NO detecta cambios (exit code 0):
   - Confirma: "Sin cambios. El proyecto está sincronizado con www.itrc.gov.co hasta la fecha <date>."

Actualiza el PROGRESS TRACKER sección "Mantenimiento":
- [x] Snapshot semanal de WordPress ejecutado esta semana
- Último diff revisado: <fecha>
```

### 5.2. Antes de cada deploy a producción

**PROMPT:**

```
Ritual pre-deploy:

1. Ejecuta `npm run build` y reporta resultado.
2. Corre auditoría de enlaces internos. Reporta cualquier enlace roto.
3. Verifica con `git status` que no hay archivos sin commitear.
4. Muéstrame `git log --oneline origin/main..HEAD` (commits locales no pusheados).
5. Dame un go/no-go para hacer push a main.

NO hagas push. Solo diagnóstico.
```

### 5.3. Después de cada lote completado

**PROMPT:**

```
Ritual post-lote:

1. Ejecuta `npm run build` y verifica 0 errores.
2. Corre auditoría de enlaces internos.
3. Ejecuta `git status` y `git diff --stat` para ver cuántos archivos se modificaron.
4. Revisa el diff de PROMPTS-MIGRACION.md (que actualicé manualmente el checkbox del lote).
5. Prepárame un mensaje de commit descriptivo en español siguiendo la convención del proyecto (feat:/fix:/docs:/chore:).
6. Muéstrame el resumen pero NO hagas commit ni push.
```

---

## 6. PROMPTS REUSABLES POR SITUACIÓN

### 6.1. "Quiero migrar una página individual que no está en ningún lote"

```
Quiero migrar esta página específica de WordPress al proyecto Astro:

URL origen: <pegar URL aquí>

Sigue el flujo 6.2 de MIGRACION-ITRC.md:
1. Extrae contenido con curl y la WP REST API.
2. Estructura como JSON en la carpeta apropiada de src/content/pages/.
3. Crea el .astro que lo renderiza (sin hardcodear nada).
4. Agrega entry en la colección CMS correspondiente.
5. Regenera config y corre el build.
6. Audita enlaces.

Si no está claro dónde encaja arquitectónicamente, pregúntame antes de crear archivos. NO commits sin mi aprobación.
```

### 6.2. "WordPress cambió y tengo que actualizar una página"

```
Una página del proyecto Astro quedó desactualizada respecto a WordPress.

Página Astro: <ruta interna>
URL WordPress: <URL origen>

Tareas:
1. Compara el contenido actual del JSON con el HTML de WordPress.
2. Identifica qué cambió (texto, enlaces nuevos, documentos añadidos, etc.).
3. Actualiza el JSON correspondiente.
4. Build + audit.
5. Prepara mensaje de commit tipo "sync: <descripción corta>" pero NO commits.
```

### 6.3. "Quiero añadir una nueva página que no existe en WordPress"

```
Quiero añadir una página nueva al proyecto Astro. Esto es contenido NUEVO, no migración.

Título: <título>
Sección: <agencia/normativa/atencion/etc>
Propósito: <descripción>

Sigue las reglas del proyecto:
1. Crea `src/content/pages/<seccion>/<slug>.json` con estructura coherente con páginas vecinas.
2. Crea `src/pages/<ruta>/<slug>.astro` siguiendo el patrón de páginas similares.
3. Agrega entry en la colección CMS.
4. Si es relevante, añade el enlace al menú (`src/content/settings/navigation.json`) o a una landing page existente.
5. Build + audit.
```

### 6.4. "Tengo un enlace roto que hay que corregir"

```
Hay un enlace roto en el proyecto.

Ubicación: <archivo y línea si lo conoces, o la ruta donde lo vi>
URL rota: <URL>

Tareas:
1. Localiza todas las referencias al enlace roto en el proyecto (grep recursivo).
2. Propón la URL correcta (si la conoces o si puedes deducirla del mapa de trazabilidad en MIGRACION-ITRC.md).
3. Corrige todas las ocurrencias.
4. Build + audit.
```

### 6.5. "Quiero hacer commit y push" (tú lo autorizas explícitamente)

```
Autorizo commit y push. Por favor:

1. `git status` para ver archivos modificados.
2. Prepara mensaje de commit en español usando convenciones (feat:/fix:/sync:/docs:/chore:/refactor:).
3. Ejecuta:
   git add <archivos específicos, no use -A sin justificación>
   git commit -m "<mensaje>"
   git push
4. Verifica con `git status` que quedó limpio.
```

### 6.6. "Quiero un diagnóstico rápido del proyecto ahora mismo"

```
Diagnóstico rápido:

1. Totales actuales:
   - Cuenta archivos .astro en src/pages/ (excluye dinámicas)
   - Cuenta JSONs en src/content/pages/
   - Cuenta noticias .md
   - Cuenta colecciones CMS
2. Estado del build: ejecuta `npm run build` y reporta resultado.
3. Estado git: `git status` y últimos 3 commits.
4. Comparación con el sitio WP origen (último snapshot en reports/inventory-*.json):
   - Cobertura Itrc: X/338 páginas (%)
   - Cobertura Observatorio: X/231 páginas (%)
5. Recomendación: ¿Qué lote deberíamos atacar según el tracker?
```

---

## 7. TROUBLESHOOTING

> Cada entrada es un **árbol de decisión**, no un "pégame el error". Identifica la hipótesis, pruébala con un comando concreto, y sólo si ninguna cuadra, recopila evidencia adicional.

### 🔥 El build falla después de añadir páginas

```
`npm run build` falla. Clasifica el error según la primera línea del stack trace:

Hipótesis 1 — Cannot find module 'X.json' o ENOENT:
  → El import apunta a un JSON que no existe, o el path es relativo incorrecto.
  → Verifica: `ls <path absoluto del import>` y compara con la profundidad de `../` en el .astro.
  → Causa común: la ruta dinámica está N niveles más adentro que el JSON, y los `../` no se ajustaron.

Hipótesis 2 — "Property 'X' does not exist on type":
  → El .astro accede a un campo que no existe en el JSON (o cambió nombre).
  → Verifica el JSON con `cat` y compara claves con las usadas en el .astro.
  → Fix: ajusta el .astro (no el JSON, los JSONs son la fuente canónica editable).

Hipótesis 3 — "getStaticPaths ... duplicate slug":
  → Dos JSONs generaron el mismo slug tras normalización. Aplica D5 edge case #1: prefija con `itrc-`/`obs-`/`educ-`/`part-` según contexto.

Hipótesis 4 — "Invalid URL" en resolveUrl():
  → Una URL en un JSON tiene `//` duplicadas o empieza sin `/`. Aplica D5 edge case #3: colapsa `//` → `/`.

Hipótesis 5 — warning "X is defined but never used":
  → Ignorable en build (no rompe), pero límpialo si está en .astro que estás tocando.

Si ninguna cuadra: ejecuta `npm run build 2>&1 | tail -40` y pégame esas líneas.
NO hagas cambios masivos — arregla el error específico y re-ejecuta el build.
```

### 🔥 Agregué un JSON pero no sale en Sveltia CMS

```
JSON invisible en el CMS. Diagnóstico por capas (detente en la primera que falle):

Capa 1 — Archivo físico:
  `test -f <path/al/json> && echo OK`

Capa 2 — Declaración en cms/collections/<seccion>.js:
  `grep -n "<nombre-base-del-json>" cms/collections/*.js`
  Si no aparece → no está declarado. Añádelo como file collection (file collection para JSON único, folder para carpeta).

Capa 3 — config.yml regenerado:
  `grep -n "<nombre>" public/admin/config.yml`
  Si no aparece → falta `node cms/generate.js`.

Capa 4 — Schema de campos correcto:
  El JSON físico debe tener las mismas claves que `fields` declara. Si el JSON trae un campo no declarado, Sveltia lo oculta al editar.

Capa 5 — Cache del navegador:
  Última instancia. Recarga con Ctrl+Shift+R en /admin.
```

### 🔥 El script check-itrc-changes.py falla

```
Diagnóstico por tipo de error:

Tipo A — "curl: command not found":
  → `which curl`. En WSL debería existir. Si no: `sudo apt install curl`.

Tipo B — Código de salida 60 / SSL cert:
  → ESPERADO. El script ya usa --insecure (cadena SSL incompleta en itrc.gov.co).
  → Si aún falla: verifica que la flag esté en `curl_args` en el script.

Tipo C — JSONDecodeError:
  → WP devolvió HTML en vez de JSON (probable mantenimiento o error 5xx).
  → Reproduce manual: `curl -ks "<url exacta del log>" | head -5`
  → Si devuelve `<html>`: espera 10 min y reintenta. Si persiste, WP está caído.

Tipo D — HTTPError 404 en un endpoint:
  → Ese content type ya no existe en WP (fue eliminado o movido).
  → Actualiza `CONTENT_TYPES` en el script. NO lo dejes registrado como "cambio"; es un cambio de esquema del origen.

Tipo E — Exit 1 (cambios detectados, no un error):
  → Esperado. Abre `reports/changes-<fecha>.md` y trabaja las diferencias.
```

### 🔥 Perdí el contexto, estoy confundido

```
Necesito recuperar contexto.

1. Lee MIGRACION-ITRC.md secciones 1-5 completas.
2. Lee PROMPTS-MIGRACION.md sección 3 (Progress tracker).
3. Lee los últimos 10 commits: `git log --oneline -10`.
4. Dame un resumen en 10 líneas de: qué es este proyecto, qué está hecho, qué falta, qué era lo último que trabajamos (intenta deducir del último commit).
5. Sugiéreme un siguiente paso concreto.
```

### 🔥 Quiero deshacer algo

```
Quiero deshacer cambios recientes.

Alcance: <describe qué quieres deshacer>

Opciones a considerar:
- git restore <archivos> (si no hay commit todavía)
- git revert <hash> (si ya hay commit y está pusheado)
- git reset --soft HEAD~1 (si el commit es local y quiero mantener los cambios)

NO tomes acción destructiva sin mi confirmación explícita. Solo recomiéndame la más segura.
```

---

## 8. RITUAL DE CIERRE DE SESIÓN (SIEMPRE)

**Copia este prompt al FINAL de cada sesión antes de cerrar Claude Code:**

```
Ritual de cierre de sesión.

1. `git status` — ¿Hay cambios sin guardar?
2. Si hay cambios sin committear:
   - Resúmeme qué hay sin commitear.
   - Recomienda si conviene hacer un WIP commit o dejarlo pendiente.
3. `npm run build` — ¿Build limpio?
4. Resúmeme qué se hizo esta sesión en 5 bullets.
5. Verifica que actualicé el PROGRESS TRACKER en PROMPTS-MIGRACION.md (si no lo hice, recuérdame marcarlo).
6. Sugiere el siguiente paso para la próxima sesión (qué lote abordar, qué revisar).
7. Si el día es lunes, recuérdame ejecutar el ritual semanal (sección 5.1).

NO hagas commits/push sin mi autorización explícita. Solo diagnóstico.
```

---

## APÉNDICE A — CONVENCIONES DE COMMIT

Prefijos estandarizados del proyecto:

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad (nueva página, nueva sección) |
| `fix:` | Bug, enlace roto, error de contenido |
| `sync:` | Sincronización con cambios detectados en WordPress |
| `docs:` | Cambios en MIGRACION-ITRC.md, PROMPTS-MIGRACION.md, CLAUDE.md |
| `chore:` | Limpieza, refactors técnicos sin impacto visible |
| `refactor:` | Reestructuración de código sin cambio de comportamiento |
| `wip:` | Trabajo en progreso (usar con cuidado) |

Ejemplos:
- `feat: galería de Rendición de Cuentas 2019 con 42 imágenes`
- `sync: 3 noticias nuevas del Observatorio (abril 2026)`
- `fix: enlace roto en /participa/rendicion-de-cuentas`
- `docs: actualizar progress tracker del lote B`

---

## APÉNDICE B — GLOSARIO DE RUTAS

### Sitio origen (WordPress)
- Portal principal: `https://www.itrc.gov.co/Itrc/`
- Observatorio: `https://www.itrc.gov.co/observatorio/`
- Denuncias: `https://www.itrc.gov.co/denuncias/`
- API Itrc: `https://www.itrc.gov.co/Itrc/wp-json/wp/v2/`
- API Observatorio: `https://www.itrc.gov.co/observatorio/wp-json/wp/v2/`
- Sitemap Itrc: `https://www.itrc.gov.co/Itrc/wp-sitemap.xml`
- Sitemap Observatorio: `https://www.itrc.gov.co/observatorio/wp-sitemap.xml`

### Proyecto destino (este repo)
- Raíz: este directorio
- Páginas: `src/pages/`
- Contenido: `src/content/pages/`, `src/content/news/`, `src/content/settings/`
- CMS config: `cms/collections/*.js` → genera `public/admin/config.yml`
- Documentación operativa: `MIGRACION-ITRC.md`, `PROMPTS-MIGRACION.md`, `CLAUDE.md`
- Reportes: `reports/inventory-*.json`, `reports/changes-*.md`

---

## APÉNDICE C — FAQ

**P: ¿Puedo trabajar dos lotes en una misma sesión?**
R: No se recomienda. Cada lote puede tocar 30-100 archivos y aumenta el riesgo de conflictos. Haz commit al terminar cada lote, luego arranca el siguiente.

**P: ¿Qué hago si Claude Code pierde memoria a media sesión?**
R: Usa el prompt de la sección 7 "Perdí el contexto". Siempre podrás recuperar contexto leyendo MIGRACION-ITRC.md + este archivo + git log.

**P: ¿Debo borrar el sitio WordPress cuando termine la migración?**
R: No se decide aquí. Es una decisión editorial/de gobernanza. Mientras siga activo, los archivos media (PDFs, imágenes) pueden servirse desde el CDN de WordPress. Considera migrar los media a un CDN propio antes de apagar WP.

**P: ¿Cómo sé si el CMS Sveltia está funcionando correctamente?**
R: En desarrollo local: `npm run dev` y abre `http://localhost:4321/admin` en Chrome o Edge. Si ves el sidebar con todas las colecciones (18 grupos), funciona.

**P: ¿Qué hago si un post de WordPress tiene HTML de Elementor muy complejo?**
R: Prioriza el texto y las imágenes principales. Descarta animaciones, widgets interactivos, y formatos propietarios. Convierte a markdown limpio. Si pierdes algo de riqueza visual, está bien — el sitio Astro es más ligero por diseño.

---

**Fin del documento PROMPTS-MIGRACION.md**
