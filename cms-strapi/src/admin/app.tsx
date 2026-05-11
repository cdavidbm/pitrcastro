import type { StrapiApp } from '@strapi/strapi/admin';

/**
 * Personalización del Content Manager: agrupa los content types por rama
 * del menú del sitio (la primera parte del displayName, ej. "02. Agencia
 * / Misión Visión") en secciones colapsables (accordion) y agrega un
 * dropdown para filtrar por rama.
 *
 * Hace falta porque el sidebar nativo de Strapi v5 muestra todos los
 * content types en una sola lista plana ordenada alfabéticamente, lo
 * que es ilegible cuando hay >100.
 *
 * Estado persistido por usuario en localStorage:
 *   itrc-cm-collapsed  → JSON array de ramas colapsadas
 *   itrc-cm-filter     → "*" (todas) o nombre de rama
 */
export default {
  config: {
    locales: [],
  },
  bootstrap(_app: StrapiApp) {
    if (typeof window === 'undefined') return;

    const STORAGE_COLLAPSED = 'itrc-cm-collapsed';
    const STORAGE_FILTER = 'itrc-cm-filter';
    const STORAGE_INITIALIZED = 'itrc-cm-initialized';

    const getCollapsed = (): Set<string> => {
      try {
        return new Set(JSON.parse(localStorage.getItem(STORAGE_COLLAPSED) || '[]'));
      } catch {
        return new Set();
      }
    };
    const setCollapsedSet = (s: Set<string>) =>
      localStorage.setItem(STORAGE_COLLAPSED, JSON.stringify([...s]));
    const getFilter = () => localStorage.getItem(STORAGE_FILTER) || '*';
    const setFilter = (v: string) => localStorage.setItem(STORAGE_FILTER, v);
    const isInitialized = () => localStorage.getItem(STORAGE_INITIALIZED) === '1';
    const markInitialized = () => localStorage.setItem(STORAGE_INITIALIZED, '1');

    // Extrae la rama del displayName: "02. Agencia / Mision Vision" → "02. Agencia"
    // El texto puede incluir basura al final (badges con número de docs,
    // etc.). Solo anclamos al inicio y cortamos en la primera "/".
    const branchPrefix = (text: string): string | null => {
      if (!text) return null;
      const t = text.trim();
      const m = t.match(/^(\d{2}\.\s+[^\/]+?)(?:\s*\/|\s{2,}|$)/);
      return m ? m[1].trim() : null;
    };

    // Label legible del branch para mostrar en headers y dropdown.
    // El branch internamente conserva el "NN. " para mantener orden y
    // matching estable; solo el texto visible se limpia.
    const branchLabel = (branch: string): string =>
      branch.replace(/^\d{2}\.\s+/, '');

    const injectStyles = () => {
      if (document.getElementById('itrc-cm-styles')) return;
      const s = document.createElement('style');
      s.id = 'itrc-cm-styles';
      s.textContent = `
        /* Sidebar más ancho. Targets el nav que contiene los enlaces del
           Content Manager, ya sea en aside o nav. !important para superar
           el width fijo que Strapi declara inline. */
        nav:has(a[href*="/content-manager/"]),
        aside:has(a[href*="/content-manager/"]) {
          min-width: 280px !important;
          width: 280px !important;
        }
        .itrc-branch-filter {
          padding: 10px 14px;
          margin: 10px 12px 14px;
          background: rgba(255,255,255,0.04);
          border-radius: 4px;
        }
        .itrc-branch-filter label {
          display: block;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 6px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .itrc-branch-filter select {
          width: 100%;
          padding: 6px 9px;
          background: rgba(0,0,0,0.25);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 4px;
          font-size: 0.9rem;
          font-family: inherit;
          cursor: pointer;
        }
        .itrc-branch-filter select:focus {
          outline: 2px solid #fbbf24;
          outline-offset: 1px;
        }
        li[data-itrc-header],
        div[data-itrc-header] {
          list-style: none;
          margin: 10px 0 4px;
        }
        .itrc-branch-btn {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 10px;
          padding: 6px 14px;
          background: transparent;
          border: none;
          color: #fbbf24;
          font-weight: 700;
          font-size: 0.92rem;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-left: 3px solid transparent;
        }
        .itrc-branch-btn:hover {
          background: rgba(255,255,255,0.05);
          border-left-color: #fbbf24;
        }
        .itrc-arrow {
          font-size: 0.7rem;
          opacity: 0.7;
          width: 12px;
          text-align: center;
        }
        .itrc-count {
          opacity: 0.55;
          font-weight: 500;
          margin-left: auto;
          font-size: 0.78rem;
        }
        li[data-itrc-branch],
        div[data-itrc-branch] {
          padding-left: 8px;
        }
      `;
      document.head.appendChild(s);
    };

    // Aplica una pasada de agrupación y visibilidad sobre el sidebar.
    // Llamado debouncedamente desde el MutationObserver.
    const apply = () => {
      // Strapi v5 usa <nav> (no <aside>). Buscamos por rol y por presencia
      // de muchos enlaces de content-manager para identificar la barra
      // lateral del Content Manager.
      const allLinks = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href*="/content-manager/"]')
      );
      // Filtra solo enlaces a single-types o collection-types (excluye
      // botones de navegación interna que también matchean).
      const links = allLinks.filter((a) =>
        /content-manager\/(single|collection)-types\//.test(a.href)
      );
      if (links.length < 5) return;

      // Diagnóstico: log la primera vez que encontramos enough links.
      if (!(window as any).__itrcCmDebugged) {
        (window as any).__itrcCmDebugged = true;
        console.info(
          '[itrc-cm] content-types detectados:',
          links.length,
          'ejemplo:',
          links.slice(0, 3).map((a) => a.textContent?.trim() || '')
        );
      }

      injectStyles();

      // Override inline-style width en el nav contenedor (CSS !important no
      // puede vencer style="width: ..." inline; lo seteamos por JS).
      const navHost = (links[0].closest('nav') || links[0].closest('aside')) as HTMLElement | null;
      if (navHost && navHost.style.minWidth !== '280px') {
        navHost.style.minWidth = '280px';
        navHost.style.width = '280px';
      }

      const groups = new Map<string, HTMLElement[]>();
      for (const a of links) {
        // Cada link puede estar en un <li>, en un <div> con role="listitem"
        // o sin contenedor; tomamos el inmediato padre como "fila".
        const row = (a.closest('li') ||
          a.closest('[role="listitem"]') ||
          a.parentElement) as HTMLElement | null;
        if (!row) continue;

        // Detección de la rama a partir del texto original. Si Strapi ya
        // re-renderizó el link y lo dejamos sin prefijo, el branch original
        // queda anclado en el dataset de la fila.
        const text = a.textContent || '';
        let branch = branchPrefix(text);
        if (!branch) branch = row.dataset.itrcBranch || null;
        if (!branch) continue;
        row.dataset.itrcBranch = branch;

        // Strip "NN. Branch / " (collection / single page) o "NN. " (page sola)
        // del texto visible, una vez que ya extrajimos el branch. Reaplicable:
        // si Strapi re-renderiza el link, el regex vuelve a matchear y se
        // re-strippa.
        if (/^\d{2}\.\s/.test(text)) {
          const stripped = text
            .replace(/^\d{2}\.\s+(?:[^\/]+\s*\/\s*)?/, '')
            .trim();
          if (stripped) a.textContent = stripped;
        }

        if (!groups.has(branch)) groups.set(branch, []);
        groups.get(branch)!.push(row);
      }
      if (groups.size === 0) return;

      // Primer render: colapsar todas las ramas salvo la activa, para que el
      // editor abra a un sidebar limpio en lugar de a una lista de 50+ items.
      // La detección del activo es best-effort; si falla, se queda todo
      // colapsado y el usuario expande lo que necesite.
      if (!isInitialized()) {
        const activeLink = document.querySelector<HTMLAnchorElement>(
          'a[href*="/content-manager/"][aria-current="page"]'
        );
        const activeBranch = activeLink ? branchPrefix(activeLink.textContent || '') : null;
        const initial = new Set<string>();
        for (const branch of groups.keys()) {
          if (branch !== activeBranch) initial.add(branch);
        }
        setCollapsedSet(initial);
        markInitialized();
      }

      const collapsed = getCollapsed();
      const filter = getFilter();

      // Insertar/actualizar headers para cada rama.
      for (const [branch, rows] of groups) {
        const firstRow = rows[0];
        const list = firstRow.parentElement;
        if (!list) continue;
        let header = list.querySelector<HTMLElement>(
          `[data-itrc-header="${CSS.escape(branch)}"]`
        );
        if (!header) {
          // Usa el mismo tagName que las filas para no romper layout
          // (algunos diseños esperan li dentro de ul; otros div dentro de div).
          header = document.createElement(firstRow.tagName.toLowerCase()) as HTMLElement;
          header.setAttribute('data-itrc-header', branch);
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'itrc-branch-btn';
          btn.innerHTML =
            '<span class="itrc-arrow"></span><span class="itrc-label"></span><span class="itrc-count"></span>';
          btn.addEventListener('click', () => {
            const c = getCollapsed();
            if (c.has(branch)) c.delete(branch);
            else c.add(branch);
            setCollapsedSet(c);
            apply();
          });
          header.appendChild(btn);
          list.insertBefore(header, firstRow);
        }

        const isCollapsed = collapsed.has(branch);
        const isHiddenByFilter = filter !== '*' && filter !== branch;

        header.style.display = isHiddenByFilter ? 'none' : '';
        const arrow = header.querySelector('.itrc-arrow');
        const label = header.querySelector('.itrc-label');
        const count = header.querySelector('.itrc-count');
        if (arrow) arrow.textContent = isCollapsed ? '▶' : '▼';
        if (label) label.textContent = branchLabel(branch);
        if (count) count.textContent = `${rows.length}`;

        for (const row of rows) {
          row.style.display = isHiddenByFilter || isCollapsed ? 'none' : '';
        }
      }

      // Inyectar dropdown de filtro si no existe. Lo ubicamos en el tope
      // del contenedor del sidebar, justo después del input de búsqueda.
      // Evitamos meterlo entre filas de un grupo (donde quedaba flotando
      // visualmente entre headers cuando los grupos arrancan colapsados).
      const navRoot = (() => {
        const link = links[0];
        let n: HTMLElement | null = link.parentElement;
        while (n) {
          if (
            n.querySelector(
              'input[type="search"], input[placeholder*="Search"], input[placeholder*="Buscar"]'
            )
          ) {
            return n;
          }
          n = n.parentElement;
        }
        return null;
      })();

      let filterEl = navRoot?.querySelector<HTMLElement>('.itrc-branch-filter') || null;
      if (!filterEl && navRoot) {
        const branches = [...groups.keys()].sort();
        filterEl = document.createElement('div');
        filterEl.className = 'itrc-branch-filter';
        filterEl.innerHTML =
          '<label>Filtrar por rama</label><select><option value="*">Todas las ramas</option>' +
          branches
            .map(
              (b) =>
                `<option value="${b.replace(/"/g, '&quot;')}">${branchLabel(b)}</option>`
            )
            .join('') +
          '</select>';
        const select = filterEl.querySelector('select') as HTMLSelectElement;
        select.value = filter;
        select.addEventListener('change', () => {
          setFilter(select.value);
          apply();
        });
        const searchInput = navRoot.querySelector<HTMLElement>(
          'input[type="search"], input[placeholder*="Search"], input[placeholder*="Buscar"]'
        );
        const searchContainer =
          (searchInput?.closest('form, [role="search"]') as HTMLElement | null) ||
          (searchInput?.parentElement as HTMLElement | null);
        if (
          searchContainer &&
          searchContainer.parentElement === navRoot &&
          searchContainer.nextSibling
        ) {
          navRoot.insertBefore(filterEl, searchContainer.nextSibling);
        } else if (searchContainer && searchContainer.parentElement) {
          searchContainer.parentElement.insertBefore(
            filterEl,
            searchContainer.nextSibling
          );
        } else {
          navRoot.insertBefore(filterEl, navRoot.firstChild);
        }
      } else if (filterEl) {
        const select = filterEl.querySelector<HTMLSelectElement>('select');
        if (select && select.value !== filter) select.value = filter;
      }
    };

    // Throttle: como el MutationObserver dispara seguido y nuestro apply
    // modifica el DOM, evitamos re-entrar.
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        try {
          apply();
        } catch (e) {
          console.warn('[itrc-cm-customizer]', e);
        }
      });
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(schedule, 500);
  },
};
