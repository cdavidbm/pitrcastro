# Capítulo 3 — Publicar una noticia

Las noticias del portal se publican desde el panel. No hace falta tocar código
ni pedirle nada al equipo técnico.

## Dónde están

En el panel, entre a **Contenido del sitio** → sección **Prensa** → grupo
**Noticias**. Ahí aparece el listado completo, de la más reciente a la más
antigua.

Para crear una, pulse **Crear nueva entrada** arriba a la derecha.

La oficina de prensa tiene su propia cuenta, que solo ve las noticias y el
slider de la portada ([capítulo 10](10-autenticacion-strapi.md#b-roles-disponibles)).
Su guía rápida, con capturas en el celular, se entrega aparte.

## Los campos

| Campo | ¿Obligatorio? | Qué va ahí |
|---|---|---|
| **Título** | Sí | El titular completo, tal como debe leerse en el sitio |
| **Fecha de publicación** | Sí | La fecha de la noticia, no la del día en que la carga |
| **Categoría** | Sí | *Noticia* casi siempre. *Periódico* solo para las ediciones del periódico institucional |
| **Resumen** | No | Dos o tres líneas; es lo que se lee en la tarjeta del listado |
| **Imagen principal** | No | La foto de portada. Si la deja vacía se usa la imagen institucional |
| **Contenido** | Sí | El cuerpo de la noticia. Se puede pegar desde Word |
| **Dirección (slug)** | — | La dirección web. Se genera sola al guardar; no se escribe |

### Sobre el slug

Es la parte final de la dirección: una noticia con slug
`sancion-exfuncionaria-dian` queda publicada en
`www.itrc.gov.co/prensa/noticias/sancion-exfuncionaria-dian`.

Se genera solo a partir del título la primera vez que se guarda la noticia, y
después no cambia aunque se corrija el título: quien haya guardado o compartido
el enlace lo sigue encontrando. Por eso el campo es de solo lectura.

### Sobre la imagen

Formato JPG o WebP, de al menos 800 píxeles de ancho, y por debajo de 500 KB
para que la página cargue rápido.

Si la noticia no tiene foto propia, **deje el campo vacío**. El sitio pone
automáticamente la imagen institucional. No hace falta buscar una imagen de
relleno.

## Ejemplo completo

Supongamos que llega este comunicado para publicar:

> La Agencia ITRC sancionó disciplinariamente a una exfuncionaria de la DIAN
> por hechos relacionados con un presunto fraude en falsos remates. Se adjunta
> una fotografía del edificio de la Agencia.

Así se llena el formulario:

**Título**
```
Agencia ITRC sanciona disciplinariamente a exfuncionaria de la DIAN por hechos
relacionados con un presunto fraude en falsos remates
```

**Slug** — se rellena solo:
```
agencia-itrc-sanciona-disciplinariamente-a-exfuncionaria-de-la-dian
```

**Fecha**: `04/07/2026` — la del comunicado.

**Resumen**
```
La Agencia ITRC profirió dos fallos sancionatorios contra una exservidora
pública de la DIAN: destitución e inhabilidad general por diez años.
```

**Imagen**: se arrastra la fotografía al recuadro.

**Contenido** — el cuerpo, con la ciudad y fecha en negrita al inicio:
```
**Bogotá D.C., julio de 2026**

La Agencia del Inspector General de Tributos, Rentas y Contribuciones
Parafiscales —ITRC, en ejercicio de su función disciplinaria, profirió dos
fallos sancionatorios contra una exservidora pública de la DIAN.

## Las sanciones

En el primer proceso se impuso destitución e inhabilidad general para ejercer
cargos públicos por diez (10) años.

## Qué sigue

Los fallos quedan en firme una vez agotados los recursos de ley.
```

**Categoría**: `noticia`.

Después, **Publish**.

## Cómo se escribe el contenido

El cuerpo admite formato sencillo:

| Para conseguir | Se escribe |
|---|---|
| **negrita** | `**texto**` |
| *cursiva* | `*texto*` |
| Un subtítulo | `## Subtítulo` |
| Una lista | Una línea por punto, empezando con `- ` |
| Un enlace | `[texto visible](/direccion)` |

La barra de herramientas del editor tiene botones para todo esto; no es
necesario memorizar los símbolos. En el celular, los de formato están en el
menú **«…»** de la barra.

### Pegar desde Word

Lo habitual es pegar el texto ya redactado en Word (o en Outlook, Google Docs o
una página web). Al pegar en **Contenido**, el panel convierte el formato a estos
símbolos: se conservan los **párrafos**, las **negritas**, las *cursivas*, los
**enlaces**, las **listas** y los **subtítulos**. No se pegan fotos ni tablas.

Sin esta conversión, el editor recibiría solo el texto plano y los párrafos
quedarían fundidos en uno. La hace `cms-strapi/src/admin/pegar-desde-word.ts`.

Para comprobar el resultado antes de publicar, pulse **Modo de vista previa**.

Para insertar una imagen dentro del texto, use el botón de imagen de la barra.
El editor escribe solo la referencia:

```
![Funcionarios en reunión de trabajo](/uploads/nombre-del-archivo.jpg)
```

El texto entre corchetes describe la imagen para quien usa lector de pantalla.
Descríbala en pocas palabras; no lo deje vacío.

## El botón «Descargar PDF»

Al final de cada noticia aparece un botón **Descargar PDF**. Funciona solo, de
una de dos maneras:

- **Si el texto enlaza el comunicado en PDF**, el botón descarga ese archivo.
- **Si no**, el botón abre la ventana del navegador para guardar la noticia como
  PDF, con el logo de la Agencia, el título, la fecha, la imagen y el texto.

Para que descargue el comunicado original:

1. En el panel, abra **Media Library** y suba el PDF del comunicado.
2. Abra el archivo subido y copie su dirección (*Copy link*). Empieza por
   `/uploads/`.
3. En el contenido de la noticia, escriba un enlace con esa dirección:

```
[Descargar el comunicado](/uploads/nombre-del-archivo.pdf)
```

El botón usa el **primer** PDF enlazado en el texto. Si la noticia enlaza varios
documentos, ponga primero el del comunicado.

## Cómo se encuentran las noticias

El listado de `/prensa/noticias` se filtra por **categoría** (Noticias o
Periódico), por **año** y con el buscador por título. Los años del selector
salen solos de las fechas de las noticias publicadas: no hay que configurarlos.
Por eso es importante que la **Fecha** sea la del comunicado.

## Qué pasa al publicar

Al pulsar **Publish**, el sitio se reconstruye solo. La noticia aparece
publicada en **dos o tres minutos**, en tres lugares a la vez:

- El listado de `/prensa/noticias`
- Su propia página, en `/prensa/noticias/<slug>`
- Las "Últimas noticias" de la portada, si es de las tres más recientes

No hay que avisarle a nadie ni ejecutar ningún otro paso.

## Guardar sin publicar

**Save** guarda el trabajo sin que salga al sitio. Sirve para dejar una noticia
a medias y retomarla después. Mientras esté solo guardada, la entrada aparece
marcada como borrador en el listado.

Cuando esté lista, se abre y se pulsa **Publish**.

## Corregir una noticia publicada

Ábrala desde el listado, corrija y pulse **Publish** otra vez. El sitio se
actualiza en los mismos dos o tres minutos.

## Retirar una noticia del sitio

Para que deje de verse sin perderla, use **Unpublish** en el menú de la entrada.
La noticia sale del portal y queda guardada en el panel; se puede volver a
publicar cuando se quiera.

**Borrar** (*Delete*) es distinto: elimina la entrada de forma permanente.
Consulte antes con el equipo técnico: una noticia publicada puede estar
enlazada desde otros sitios.

## El periódico institucional

Las ediciones del Periódico ITRC se publican igual, con dos diferencias:

- La **categoría** es `periodico`, para que aparezcan bajo su propio filtro.
- El **contenido** incluye los botones de descarga y el visor del PDF, que el
  equipo técnico deja preparados en la edición anterior. Lo práctico es abrir
  la edición previa, copiar ese bloque y cambiar el número y el enlace.
