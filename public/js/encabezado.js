/**
 * Encabezado: efecto al desplazar la pagina y cierre del menu superior.
 *
 * Vive en public/js/ (y no como script dentro de la pagina) para cumplir la
 * politica de seguridad de contenido que el proveedor aplica en produccion,
 * la cual prohibe el codigo incrustado.
 */
(function() {
      const scrollThreshold = 100;
      let isScrolled = false;

      function handleScroll() {
        const shouldBeScrolled = window.scrollY > scrollThreshold;
        if (shouldBeScrolled !== isScrolled) {
          isScrolled = shouldBeScrolled;
          document.body.classList.toggle('scrolled', isScrolled);
          if (!isScrolled) closeHeaderMenu();
        }
      }

      function closeHeaderMenu() {
        const headerBtn = document.getElementById('header-menu-btn');
        const navList = document.getElementById('main-nav');
        const navElement = document.querySelector('.nav');
        const overlay = document.getElementById('nav-overlay');

        if (headerBtn) headerBtn.setAttribute('aria-expanded', 'false');
        if (navElement) navElement.classList.remove('nav--header-menu-visible');
        if (navList) {
          navList.classList.remove('nav__list--header-menu-open');
          navList.querySelectorAll('.nav__item--open').forEach(function(item) {
            item.classList.remove('nav__item--open');
          });
          navList.querySelectorAll('.nav__item--has-dropdown .nav__link').forEach(function(link) {
            link.setAttribute('aria-expanded', 'false');
          });
        }
        if (overlay) overlay.classList.remove('nav__overlay--header-visible');
        document.body.classList.remove('menu-open');
      }

      function initHeaderMenu() {
        const headerBtn = document.getElementById('header-menu-btn');
        const navList = document.getElementById('main-nav');
        const navElement = document.querySelector('.nav');
        const overlay = document.getElementById('nav-overlay');
        const header = document.getElementById('main-header');

        if (!headerBtn || !navList) return;

        headerBtn.addEventListener('click', function() {
          const isOpen = headerBtn.getAttribute('aria-expanded') === 'true';

          if (isOpen) {
            closeHeaderMenu();
          } else {
            headerBtn.setAttribute('aria-expanded', 'true');
            if (navElement) navElement.classList.add('nav--header-menu-visible');

            const headerRect = header.getBoundingClientRect();
            navList.style.setProperty('--header-menu-top', headerRect.bottom + 'px');
            navList.style.setProperty('--header-menu-max-height', 'calc(100vh - ' + (headerRect.bottom + 24) + 'px)');

            navList.classList.add('nav__list--header-menu-open');
            if (overlay) overlay.classList.add('nav__overlay--header-visible');
          }
        });

        if (overlay) {
          overlay.addEventListener('click', function() {
            if (window.innerWidth > 1024) closeHeaderMenu();
          });
        }

        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && headerBtn.getAttribute('aria-expanded') === 'true') {
            closeHeaderMenu();
            headerBtn.focus();
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          handleScroll();
          initHeaderMenu();
        });
      } else {
        handleScroll();
        initHeaderMenu();
      }

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', function() {
        const mobileToggle = document.getElementById('nav-toggle');
        if (window.innerWidth > 1024 && mobileToggle) {
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
        closeHeaderMenu();
      });
    })();
