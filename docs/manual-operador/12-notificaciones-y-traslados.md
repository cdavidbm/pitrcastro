# Capítulo 12 — Notificaciones y traslados

Es la publicación más frecuente del portal. Llega por correo un PDF y una tabla,
y hay que trasladarlos al panel para que aparezcan en
`/notificaciones-y-traslados`.

## Los tres tipos

La página tiene tres pestañas y cada correo corresponde a una:

| Si el correo dice | Se publica como |
|---|---|
| **EDICTO 023** | Edicto |
| **ESTADO 068** | Estado |
| **Traslado 041-2026** | Traslado |

## Dónde se publican

En el panel, **Contenido del sitio** → sección **Atención y Servicios** →
**Notificaciones y traslados**, y luego **Create new entry**.

El listado sale ordenado con lo último cargado arriba, que es lo cómodo para
comprobar de un vistazo lo que se acaba de publicar.

## El formulario sigue el orden de la tabla

Los campos se llaman igual que las columnas del correo y están en el mismo
orden, para copiarlas de izquierda a derecha sin buscar:

```
Tipo de publicación          │  Vigencia (año)
Documento (PDF)
Número del expediente        │  Tipo de Auto
Tipo de notificación /       │  Dependencia que profiere el acto
Tipo de traslado
Fecha de expedición │ Desde  │  Hasta
```

Se empieza por arriba: primero se elige el tipo y se sube el PDF —lo que se
tiene delante al abrir el correo—, y después se copian las siete columnas.

**La tercera columna cambia de nombre según el correo.** En edictos y estados
se llama *Tipo de notificación*; en traslados, *Tipo de Traslado*. Es el mismo
campo, por eso lleva los dos nombres.

## Ejemplo: un traslado

Llega un correo con el asunto **Traslado 041-2026**, un PDF adjunto y esta
tabla:

| Número del expediente | Tipo de auto | Tipo de Traslado | Dependencia que profiere el acto | Fecha de expedición | Desde | Hasta |
|---|---|---|---|---|---|---|
| 1704-00-2021-249 | TRASLADO ALEGATOS DE CONCLUSION | ALEGATOS DE CONCLUSION | SUBDIRECCION DE ASUNTOS LEGALES | 02/06/2026 | 01/07/2026 | 15/07/2026 |

Se llena así:

| Campo | Valor |
|---|---|
| Tipo de publicación | `traslado` |
| Vigencia (año) | `2026` |
| Documento (PDF) | *(se arrastra el adjunto)* |
| Número del expediente | `1704-00-2021-249` |
| Tipo de Auto | `TRASLADO ALEGATOS DE CONCLUSION` |
| Tipo de notificación / Tipo de traslado | `ALEGATOS DE CONCLUSION` |
| Dependencia que profiere el acto | `SUBDIRECCION DE ASUNTOS LEGALES` |
| Fecha de expedición | `02/06/2026` |
| Desde | `01/07/2026` |
| Hasta | `15/07/2026` |

Y **Publish**.

## Ejemplo: un edicto

Mismo procedimiento. Con un correo **EDICTO 023**:

| Campo | Valor |
|---|---|
| Tipo de publicación | `edicto` |
| Vigencia (año) | `2026` |
| Número del expediente | `1704-00-2025-228` |
| Tipo de Auto | `AUTO APERTURA INVESTIGACION DISCIPLINARIA` |
| Tipo de notificación / Tipo de traslado | `EDICTO` |
| Dependencia que profiere el acto | `Subdirección de Instrucción Disciplinaria` |
| Fecha de expedición | `06/07/2026` |
| Desde | `15/07/2026` |
| Hasta | `17/07/2026` |

En edictos y estados la tercera columna repite la palabra (`EDICTO`, `ESTADO`).
No es un error del correo: se copia tal cual.

## Cuidados al copiar

**Las fechas van como en el correo**, en día/mes/año: `02/06/2026`. No se
cambia el formato ni se traduce a nombre de mes.

**La dependencia, siempre escrita igual.** Es texto libre, así que
*Subdirección de Instrucción Disciplinaria* y *SUBDIRECCION DE INSTRUCCION
DISCIPLINARIA* quedan como dos dependencias distintas en el listado. Conviene
copiar y pegar desde el correo anterior del mismo tipo, no escribirla a mano.

**El año de vigencia** agrupa el registro en el filtro por año de la página.
Normalmente es el año en que se publica.

## Si llegan varios en un mismo correo

Se crea una entrada por cada fila de la tabla. Comparten el PDF: se sube una vez
y en las siguientes entradas se elige desde la biblioteca en vez de volver a
cargarlo.

## Cuándo se ve publicado

Dos o tres minutos después de pulsar **Publish**. Aparece en su pestaña
—Edictos, Estados o Traslados—, arriba del todo por ser lo más reciente.

Para comprobarlo, abra `/notificaciones-y-traslados` y busque el número de
expediente en el buscador de la página.

## Corregir algo ya publicado

Se abre desde el listado, se corrige y se pulsa **Publish** otra vez.

Si hay que retirar una notificación del sitio, use **Unpublish**: sale del
portal y queda guardada. **Borrar** es permanente y estas publicaciones tienen
efectos jurídicos: consulte antes con el área que la envió.
