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

    // Extrae la rama del displayName: "02. Agencia / Mision Vision" → "02. Agencia"
    const branchPrefix = (text: string): string | null => {
      if (!text) return null;
      const t = text.trim();
      // Formato esperado: "NN. Branch / Subpath..." o "NN. Branch"
      const m = t.match(/^(\d{2}\.\s+[^\/]+?)\s*(?:\/.*)?$/);
      return m ? m[1].trim() : null;
    };

    const injectStyles = () => {
      if (document.getElementById('itrc-cm-styles')) return;
      const s = document.createElement('style');
      s.id = 'itrc-cm-styles';
      s.textContent = `
        .itrc-branch-filter {
          padding: 8px 12px;
          margin: 8px 12px;
          background: rgba(255,255,255,0.04);
          border-radius: 4px;
        }
        .itrc-branch-filter label {
          display: block;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 4px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .itrc-branch-filter select {
          width: 100%;
          padding: 5px 8px;
          background: rgba(0,0,0,0.25);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 4px;
          font-size: 0.85rem;
          font-family: inherit;
          cursor: pointer;
        }
        .itrc-branch-filter select:focus {
          outline: 2px solid #fbbf24;
          outline-offset: 1px;
        }
        li[data-itrc-header] {
          list-style: none;
          margin: 6px 0 2px;
        }
        .itrc-branch-btn {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 8px;
          padding: 4px 14px;
          background: transparent;
          border: none;
          color: #fbbf24;
          font-weight: 700;
          font-size: 0.74rem;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border-left: 3px solid transparent;
        }
        .itrc-branch-btn:hover {
          background: rgba(255,255,255,0.05);
          border-left-color: #fbbf24;
        }
        .itrc-arrow {
          font-size: 0.6rem;
          opacity: 0.7;
          width: 10px;
          text-align: center;
        }
        .itrc-count {
          opacity: 0.5;
          font-weight: 400;
          margin-left: auto;
          font-size: 0.7rem;
        }
        li[data-itrc-branch] {
          padding-left: 8px;
        }
      `;
      document.head.appendChild(s);
    };

    // Aplica una pasada de agrupación y visibilidad sobre el sidebar.
    // Llamado debouncedamente desde el MutationObserver.
    const apply = () => {
      const aside = document.querySelector('aside');
      if (!aside) return;

      const links = Array.from(
        aside.querySelectorAll<HTMLAnchorElement>('a[href*="/content-manager/"]')
      );
      if (links.length < 5) return;

      injectStyles();

      const groups = new Map<string, HTMLLIElement[]>();
      for (const a of links) {
        const text = a.textContent || '';
        const li = a.closest('li');
        if (!li) continue;
        const branch = branchPrefix(text);
        if (!branch) continue;
        if (li.dataset.itrcBranch !== branch) {
          li.dataset.itrcBranch = branch;
        }
        if (!groups.has(branch)) groups.set(branch, []);
        groups.get(branch)!.push(li as HTMLLIElement);
      }
      if (groups.size === 0) return;

      const collapsed = getCollapsed();
      const filter = getFilter();

      // Insertar/actualizar headers para cada rama.
      for (const [branch, lis] of groups) {
        const firstLi = lis[0];
        const ul = firstLi.parentElement;
        if (!ul) continue;
        let header = ul.querySelector<HTMLLIElement>(
          `li[data-itrc-header="${CSS.escape(branch)}"]`
        );
        if (!header) {
          header = document.createElement('li');
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
          ul.insertBefore(header, firstLi);
        }

        const isCollapsed = collapsed.has(branch);
        const isHiddenByFilter = filter !== '*' && filter !== branch;

        header.style.display = isHiddenByFilter ? 'none' : '';
        const arrow = header.querySelector('.itrc-arrow');
        const label = header.querySelector('.itrc-label');
        const count = header.querySelector('.itrc-count');
        if (arrow) arrow.textContent = isCollapsed ? '▶' : '▼';
        if (label) label.textContent = branch;
        if (count) count.textContent = `${lis.length}`;

        for (const li of lis) {
          (li as HTMLElement).style.display =
            isHiddenByFilter || isCollapsed ? 'none' : '';
        }
      }

      // Inyectar dropdown de filtro si no existe.
      let filterEl = aside.querySelector<HTMLElement>('.itrc-branch-filter');
      if (!filterEl) {
        const branches = [...groups.keys()].sort();
        filterEl = document.createElement('div');
        filterEl.className = 'itrc-branch-filter';
        filterEl.innerHTML =
          '<label>Filtrar por rama</label><select><option value="*">Todas las ramas</option>' +
          branches
            .map(
              (b) =>
                `<option value="${b.replace(/"/g, '&quot;')}">${b}</option>`
            )
            .join('') +
          '</select>';
        const select = filterEl.querySelector('select') as HTMLSelectElement;
        select.value = filter;
        select.addEventListener('change', () => {
          setFilter(select.value);
          apply();
        });
        // Insertar arriba del primer ul de content-manager.
        const firstUl = links[0].closest('ul');
        if (firstUl && firstUl.parentElement) {
          firstUl.parentElement.insertBefore(filterEl, firstUl);
        }
      } else {
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
