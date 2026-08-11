/**
 * Memorias del Congreso: carga del reproductor al pulsar una grabacion.
 *
 * Vive en public/js/ (y no como script dentro de la pagina) para cumplir la
 * politica de seguridad de contenido que el proveedor aplica en produccion,
 * la cual prohibe el codigo incrustado.
 */
// Carga diferida del reproductor: el iframe de YouTube solo se inserta
    // cuando la persona pulsa play, no en cada visita a la página.
    (function () {
      document.querySelectorAll('.memoria-card__player').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-video');
          var frame = document.createElement('iframe');
          frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
          frame.title = btn.getAttribute('aria-label') || 'Grabación del Congreso';
          frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
          frame.setAttribute('allowfullscreen', '');
          frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          frame.className = 'memoria-card__iframe';
          btn.replaceWith(frame);
        });
      });
    })();
