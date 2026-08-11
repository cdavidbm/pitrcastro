/**
 * Barra de administracion: enlace directo al editor de contenido, visible solo
 * para quien tenga sesion abierta en el gestor.
 *
 * Vive en public/js/ (y no como script dentro de la pagina) para cumplir la
 * politica de seguridad de contenido que el proveedor aplica en produccion,
 * la cual prohibe el codigo incrustado.
 */
(function () {
    const cur = document.currentScript;
    const slug = cur.dataset.strapiSlug || '';
    const kind = cur.dataset.strapiKind || 'singleType';

    async function check() {
      try {
        const res = await fetch(`/admin/users/me`, {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
      } catch {
        return null;
      }
    }

    function show(user) {
      const bar = document.getElementById('itrc-admin-bar');
      if (!bar) return;
      bar.hidden = false;
      document.body.classList.add('has-admin-bar');

      const userEl = document.getElementById('itrc-admin-bar-user');
      if (userEl) {
        userEl.textContent = user.email || user.username || 'Editor';
      }

      const editBtn = document.getElementById('itrc-admin-bar-edit');
      if (editBtn && slug) {
        const uid = `api::${slug}.${slug}`;
        editBtn.href =
          kind === 'collectionType'
            ? `/admin/content-manager/collection-types/${uid}`
            : `/admin/content-manager/single-types/${uid}`;
      }

      const logoutBtn = document.getElementById('itrc-admin-bar-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;';
          try {
            localStorage.removeItem('jwtToken');
            sessionStorage.removeItem('jwtToken');
          } catch {}
          window.location.reload();
        });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () =>
        check().then((u) => u && show(u))
      );
    } else {
      check().then((u) => u && show(u));
    }
  })();
