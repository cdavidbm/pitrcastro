# Capítulo 3 — Publicar una noticia

Las noticias del portal se publican desde el panel. No hace falta tocar código
ni pedirle nada al equipo técnico.

## Dónde están

En el panel, entre a **Contenido del sitio** → sección **Prensa** → grupo
**Noticias**. Ahí aparece el listado completo, de la más reciente a la más
antigua.

Para crear una, pulse **Create new entry** arriba a la derecha.

## Los campos

| Campo | ¿Obligatorio? | Qué va ahí |
|---|---|---|
| **Título** | Sí | El titular completo, tal como debe leerse en el sitio |
| **Slug** | Sí | La dirección web. Se rellena solo a partir del título |
| **Fecha** | Sí | La fecha de la noticia, no la del día en que la carga |
| **Resumen** | No | Dos o tres líneas; es lo que se lee en la tarjeta del listado |
| **Imagen** | No | La foto de portada. Si la deja vacía se usa la imagen institucional |
| **Contenido** | Sí | El cuerpo de la noticia |
| **Categoría** | Sí | *Noticia* casi siempre. *Periódico* solo para las ediciones del periódico institucional |

### Sobre el slug

Es la parte final de la dirección: una noticia con slug
`sancion-exfuncionaria-dian` queda publicada en
`www.itrc.gov.co/prensa/noticias/sancion-exfuncionaria-dian`.

Strapi lo genera solo a partir del título. **Una vez publicada la noticia, no lo
cambie**: quien haya guardado o compartido el enlace anterior encontrará una
página inexistente.

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
necesario memorizar los símbolos.

Para insertar una imagen dentro del texto, use el botón de imagen de la barra.
El editor escribe solo la referencia:

```
![Funcionarios en reunión de trabajo](/uploads/nombre-del-archivo.jpg)
```

El texto entre corchetes describe la imagen para quien usa lector de pantalla.
Descríbala en pocas palabras; no lo deje vacío.

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
