/**
 * Preferencias de accesibilidad guardadas por la persona que visita el sitio.
 *
 * El tema institucional ya viene aplicado desde el servidor en la etiqueta <html>,
 * de modo que el sitio conserva su identidad aunque este archivo no llegue a
 * ejecutarse. Aqui solo se ajusta lo que la persona haya elegido en el widget
 * de accesibilidad: otro tema, tamaño de letra, contraste, escala de grises o
 * subrayado de enlaces.
 *
 * Vive en public/js/ (y no como script dentro de la pagina) para cumplir la
 * politica de seguridad de contenido que el proveedor aplica en produccion,
 * la cual prohibe el codigo incrustado.
 */
(function () {
  var raiz = document.documentElement;

  // Tema: el servidor ya puso 'theme-institucional'. Si la persona eligio otro,
  // se retira el de por defecto. Solo 'oscuro' tiene clase propia; el tema
  // 'claro' se obtiene con los valores base, sin ninguna clase.
  var tema = localStorage.getItem('itrc-theme') || 'institucional';
  if (tema !== 'institucional') {
    raiz.classList.remove('theme-institucional');
    if (tema === 'oscuro') raiz.classList.add('theme-oscuro');
  }

  var tamano = localStorage.getItem('itrc-font-size');
  if (tamano && tamano !== '100') raiz.style.fontSize = tamano + '%';

  if (localStorage.getItem('itrc-contrast') === 'true') raiz.classList.add('high-contrast');
  if (localStorage.getItem('itrc-grayscale') === 'true') raiz.classList.add('grayscale');
  if (localStorage.getItem('itrc-underline') === 'true') raiz.classList.add('underline-links');
})();
