/**
 * Galeria de un album: visor de imagenes a pantalla completa.
 *
 * Los datos llegan en un atributo del propio <script>, porque la politica de
 * seguridad de contenido que el proveedor aplica en produccion prohibe el
 * codigo incrustado (que es como se pasaban antes).
 */
var imagenes = JSON.parse(document.currentScript.dataset.imagenes || '[]');

const dialog = document.getElementById('albumLightbox');
    if (dialog) {
      const imgEl = dialog.querySelector('.lightbox__img');
      const capEl = dialog.querySelector('.lightbox__caption');
      let index = 0;

      const render = () => {
        const im = imagenes[index];
        if (!im) return;
        imgEl.src = im.url;
        imgEl.alt = im.alt || '';
        capEl.textContent = im.caption || im.alt || '';
      };

      const open = (i) => {
        index = i;
        render();
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      };

      const close = () => {
        if (typeof dialog.close === 'function') dialog.close();
        else dialog.removeAttribute('open');
      };

      const step = (delta) => {
        index = (index + delta + imagenes.length) % imagenes.length;
        render();
      };

      document.querySelectorAll('[data-lightbox-open]').forEach((btn) => {
        btn.addEventListener('click', () => open(Number(btn.dataset.lightboxOpen)));
      });
      dialog.querySelector('[data-lightbox-close]').addEventListener('click', close);
      dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => step(-1));
      dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => step(1));

      dialog.addEventListener('click', (e) => {
        // Cerrar al clickear backdrop (el dialog recibe el evento con target=dialog).
        if (e.target === dialog) close();
      });
      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
      });
    }
