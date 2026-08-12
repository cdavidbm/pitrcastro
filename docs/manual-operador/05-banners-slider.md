# Capítulo 5 — Banners del inicio

Los banners son las imágenes grandes que rotan en la parte superior de la
portada. Cada una es una imagen apaisada que lleva a una página del portal o de
otra entidad.

## Dónde están

En el panel, **Contenido del sitio** → sección **Inicio** → **Slider Principal**.

Se abre una sola pantalla con la lista de banners. Cada uno se despliega al
hacer clic sobre su nombre.

## Los campos de cada banner

| Campo | ¿Obligatorio? | Qué va ahí |
|---|---|---|
| **Imagen del banner** | Sí | La imagen apaisada. Idealmente 1900 × 600 píxeles |
| **Descripción de la imagen** | Sí | Qué se ve en la imagen, en pocas palabras |
| **A dónde lleva** | Sí | La dirección que se abre al hacer clic |
| **¿Se muestra?** | Sí | Interruptor para sacarlo de la portada sin borrarlo |
| **Imagen para celular** | No | Solo si la principal se ve mal en pantallas pequeñas |

### La descripción de la imagen

No es opcional aunque el sistema la deje pasar. La leen las personas que usan
lector de pantalla, y en un portal público es obligatoria por accesibilidad.

Descríbala como se la contaría a alguien por teléfono: *"II Congreso CIPREP
2026 — Agencia ITRC"*, no *"banner1"* ni *"imagen"*.

### A dónde lleva

Dos formas, según el destino:

- **Una página del portal**: se escribe empezando por barra, sin el dominio.
  `/ciprep2026`, `/tu-p-q-r-s-al-dia`, `/participa`
- **Otra entidad**: la dirección completa.
  `https://www.funcionpublica.gov.co/...`

El sitio reconoce solo cuál es cuál: las de otras entidades se abren en una
pestaña nueva, las del portal no.

### El interruptor

Un banner con **¿Se muestra?** en *No* desaparece de la portada pero sigue
guardado, con su imagen y su enlace. Sirve para banners de temporada: se apaga
cuando termina el evento y se vuelve a encender el año siguiente.

Es siempre preferible a borrarlo.

## Ejemplo completo

Llega la instrucción de poner un banner del congreso, con la pieza gráfica
adjunta:

1. En la lista de banners, pulse **Add an entry** al final.
2. Arrastre la imagen al recuadro **Imagen del banner**.
3. En **Descripción de la imagen**:
   ```
   II Congreso CIPREP 2026 — Agencia ITRC
   ```
4. En **A dónde lleva**:
   ```
   /ciprep2026
   ```
5. Deje **¿Se muestra?** en *Sí*.
6. **Imagen para celular**: vacío.
7. Arrastre el banner a la posición donde debe aparecer.
8. **Publish**.

En dos o tres minutos está en la portada.

## Cambiar el orden

El orden de la portada es el de esta lista. Cada banner tiene a la derecha un
asa (los seis puntos) para arrastrarlo arriba o abajo.

El primero de la lista es el que se ve al entrar al portal.

## Reemplazar la imagen de un banner

Despliegue el banner, pulse el lápiz sobre la imagen actual y elija la nueva.
Recuerde ajustar también la **descripción de la imagen**: si cambia la pieza y
no el texto, quien use lector de pantalla escuchará algo que ya no corresponde.

## Cuántos banners conviene tener

Entre cuatro y seis. Con más, los últimos casi nadie los ve: el visitante se va
de la portada antes de que el carrusel llegue a ellos.

Si hay que meter uno nuevo y ya hay seis, lo sano es apagar el menos vigente en
vez de acumular.

## Ritmo del carrusel

Arriba del todo, antes de la lista, hay dos ajustes que valen para todo el
carrusel:

- **Reproducción automática**: si las diapositivas cambian solas.
- **Intervalo**: cuánto dura cada una, en milisegundos. `6000` son seis
  segundos.

Rara vez hay que tocarlos.
