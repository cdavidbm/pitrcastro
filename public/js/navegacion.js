/**
 * Menu de navegacion: apertura y cierre en pantallas pequenas.
 *
 * Vive en public/js/ (y no como script dentro de la pagina) para cumplir la
 * politica de seguridad de contenido que el proveedor aplica en produccion,
 * la cual prohibe el codigo incrustado.
 */
(function() {
  function closeMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');

    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (navList) navList.classList.remove('nav__list--mobile-open');
    if (overlay) overlay.classList.remove('nav__overlay--visible');
    document.body.classList.remove('menu-open');

    document.querySelectorAll('.nav__item--open').forEach(function(item) {
      item.classList.remove('nav__item--open');
      const link = item.querySelector('.nav__link');
      if (link) link.setAttribute('aria-expanded', 'false');
    });
  }

  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');

    if (!toggle || !navList) return;

    toggle.addEventListener('click', function() {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isOpen);

      if (isOpen) {
        closeMobileMenu();
      } else {
        navList.classList.add('nav__list--mobile-open');
        navList.scrollTop = 0;
        if (overlay) overlay.classList.add('nav__overlay--visible');
        document.body.classList.add('menu-open');
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMobileMenu);
    }

    const dropdownItems = document.querySelectorAll('.nav__item--has-dropdown');
    dropdownItems.forEach(function(item) {
      const link = item.querySelector('.nav__link');

      if (link) {
        link.addEventListener('click', function(e) {
          const headerMenuBtn = document.getElementById('header-menu-btn');
          const isHeaderMenuOpen = headerMenuBtn && headerMenuBtn.getAttribute('aria-expanded') === 'true';
          const isMobile = window.innerWidth <= 1024;

          if (isMobile || isHeaderMenuOpen) {
            e.preventDefault();
            const isOpen = item.classList.contains('nav__item--open');

            dropdownItems.forEach(function(otherItem) {
              if (otherItem !== item) {
                otherItem.classList.remove('nav__item--open');
                const otherLink = otherItem.querySelector('.nav__link');
                if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
              }
            });

            item.classList.toggle('nav__item--open', !isOpen);
            link.setAttribute('aria-expanded', (!isOpen).toString());
          }
        });
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 1024) {
        closeMobileMenu();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
