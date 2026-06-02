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

    // ⚠️ DEUDA TÉCNICA: el bloque de customización siguiente está
    // DESHABILITADO porque rompía la interactividad del admin de Strapi
    // v5 (botón "Create new entry" desaparecía, engranaje no respondía).
    //
    // Causa raíz: el MutationObserver sobre `document.body` con
    // `subtree: true` capturaba todas las mutaciones, y el callback
    // `apply()` modificaba el DOM, lo que disparaba nuevas mutaciones
    // que React también reconciliaba — loop infinito que bloqueaba el
    // event loop del browser. Además un selector CSS `:has()` global
    // sobre `nav` afectaba el header superior cortando el botón Create.
    //
    // Para retomar: ver
    // /home/chris/.claude/projects/-home-chris-proyectos-implementacionP/memory/
    // project_strapi_sidebar_custom_pendiente.md
    //
    // Camino recomendado: reescribir usando la API oficial de plugins
    // de Strapi v5 (app.injectContentManagerComponent, etc.) en vez de
    // manipular DOM con MutationObserver.
    return;

    const STORAGE_COLLAPSED = 'itrc-cm-collapsed';
    const STORAGE_FILTER = 'itrc-cm-filter';
    // Bump cuando cambie el modelo de inicialización (ej. al pasar de
    // "acordeones expandibles" a "dropdown navegador primario"). Garantiza
    // que el primer render aplique el nuevo default para los usuarios que
    // ya tenían estado guardado de versiones anteriores.
    const STORAGE_INITIALIZED = 'itrc-cm-initialized-v2';

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

    // Sentinel branch para items que no calzan en ninguno de los dominios
    // NN. Dominio (típicamente el item "User" del plugin users-permissions).
    // El valor "zz" garantiza que ordene al final alfabéticamente, después
    // de cualquier prefijo numérico real (01..99).
    const OTHER_BRANCH = 'zz. Otros';

    // Label legible del branch para mostrar en headers y dropdown.
    // El branch internamente conserva el "NN. " para mantener orden y
    // matching estable; solo el texto visible se limpia.
    const branchLabel = (branch: string): string => {
      if (branch === OTHER_BRANCH) return 'Otros';
      return branch.replace(/^\d{2}\.\s+/, '');
    };

    const injectStyles = () => {
      if (document.getElementById('itrc-cm-styles')) return;
      const s = document.createElement('style');
      s.id = 'itrc-cm-styles';
      s.textContent = `
        /* Sidebar más ancho. El width se aplica INLINE al navHost
           específico en apply() (no via CSS global) porque selectores
           como nav:has(a[href*="/content-manager/"]) matchean también el
           nav superior de Strapi y le cambiaban el ancho rompiendo el
           layout del header (escondía el botón "Create new entry"). */
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
        /* Esconder headers nativos "Collection Types" / "Single Types"
           (y sus variantes traducidas). Marcamos por dataset en apply(). */
        [data-itrc-hide="native-section-title"] {
          display: none !important;
        }
        /* Sección final para items sin prefijo NN. (ej. "User" del plugin
           users-permissions). Visualmente separada del resto. */
        [data-itrc-other-header] {
          margin-top: 14px !important;
          padding-top: 10px !important;
          border-top: 1px solid rgba(255,255,255,0.08) !important;
        }
      `;
      document.head.appendChild(s);
    };

    // Strapi v5 muestra dos títulos de sección en el sidebar del Content
    // Manager: "Collection Types" y "Single Types" (traducidos según locale).
    // Visualmente parten la lista en dos bloques que rompen el flujo del
    // menú ordenado por prefijo NN. — los ocultamos. Los items siguen
    // visibles, agrupados por nuestras branches.
    const NATIVE_SECTION_TITLES = new Set([
      // EN
      'collection types', 'single types',
      // ES
      'tipos de colección', 'tipos individuales', 'tipos de coleccion',
      // PT-BR
      'tipos de coleção', 'tipos únicos', 'tipos de colecao', 'tipos unicos',
      // FR (por si acaso)
      'types de collection', 'types unique',
    ]);

    const hideNativeSectionTitles = (navHost: HTMLElement) => {
      // Strapi marca los títulos como nodo de texto plano (span/h2/h3/div
      // sin hijos). Buscamos por textContent exacto contra el set de
      // títulos conocidos. Después subimos en el árbol con tope estricto
      // (MAX 3 niveles) para esconder el wrapper inmediato del título y
      // no algo mucho mayor que contiene también los items.
      const MAX_UP = 3;
      const candidates = navHost.querySelectorAll<HTMLElement>('span, h2, h3, div');
      for (const el of candidates) {
        if (el.children.length > 0) continue; // solo nodos con texto plano
        const txt = (el.textContent || '').trim().toLowerCase();
        if (!txt || txt.length > 40) continue;
        if (!NATIVE_SECTION_TITLES.has(txt)) continue;

        // Subir hasta encontrar un wrapper que NO contenga ningún link de
        // content-manager (significa que es solo el título, no la lista).
        // Si ya estamos en un elemento que NO tiene content link, se
        // marca directo. Tope estricto: 3 hops, jamás navHost.
        let target: HTMLElement = el;
        for (let hop = 0; hop < MAX_UP; hop++) {
          const parent = target.parentElement;
          if (!parent || parent === navHost) break;
          // Selector válido: dos clauses separadas por coma para single
          // o collection types (CSS no soporta regex en [attr*=...]).
          const hasContentLink = parent.querySelector(
            'a[href*="/content-manager/single-types/"], a[href*="/content-manager/collection-types/"]'
          );
          if (hasContentLink) break;
          target = parent;
        }
        if (target.dataset.itrcHide !== 'native-section-title') {
          target.dataset.itrcHide = 'native-section-title';
        }
      }
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

      // Esconder los títulos nativos "Collection Types" / "Single Types"
      // para que el menú fluya como una sola lista por dominios.
      if (navHost) hideNativeSectionTitles(navHost);

      const groups = new Map<string, HTMLElement[]>();
      for (const a of links) {
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
        // Si después de todo no detectamos branch, lo mandamos a la sección
        // "Otros" (ej. el item "User" del plugin users-permissions, que no
        // sigue el patrón NN. Dominio /). Así no se pierde y queda agrupado
        // visualmente al final del sidebar.
        if (!branch) branch = OTHER_BRANCH;
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

      // Primer render: pre-seleccionar la rama del item activo en el
      // dropdown. Si no hay activo, default a la primera rama numérica
      // (típicamente "01. Inicio"). Esto convierte al dropdown en el
      // navegador primario: el editor entra al panel y ve directamente
      // los items del dominio que está visitando.
      if (!isInitialized()) {
        const activeLink = document.querySelector<HTMLAnchorElement>(
          'a[href*="/content-manager/"][aria-current="page"]'
        );
        const activeBranch = activeLink ? branchPrefix(activeLink.textContent || '') : null;
        const sortedBranches = [...groups.keys()].sort();
        const defaultBranch =
          activeBranch && groups.has(activeBranch) ? activeBranch : sortedBranches[0];
        // Si veníamos del default "*" (Todas las ramas), forzar el cambio
        // al modo de una sola rama. Solo respetamos un filter explícito
        // distinto a "*" (que indica preferencia consciente del usuario).
        const current = localStorage.getItem(STORAGE_FILTER);
        if (defaultBranch && (!current || current === '*')) {
          setFilter(defaultBranch);
        }
        // No colapsamos nada: con el filter de rama única, la rama activa
        // está siempre visible y las otras escondidas por completo.
        setCollapsedSet(new Set());
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
          // Marca visual extra para la sección "Otros" (al final de la lista).
          if (branch === OTHER_BRANCH) {
            header.setAttribute('data-itrc-other-header', '1');
          }
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'itrc-branch-btn';
          btn.innerHTML =
            '<span class="itrc-arrow"></span><span class="itrc-label"></span><span class="itrc-count"></span>';
          btn.addEventListener('click', () => {
            const c = getCollapsed();
            const wasCollapsed = c.has(branch);
            if (wasCollapsed) c.delete(branch);
            else c.add(branch);
            setCollapsedSet(c);
            apply();
            // Al expandir un branch, scrollear el header al tope del
            // sidebar para que los items recién mostrados queden visibles
            // debajo de él (sin esto, en branches con muchos items como
            // Transparencia, el contenido se "abre en otra parte" del
            // scroll y el editor tiene que perseguirlo).
            if (wasCollapsed) {
              header!.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
          header.appendChild(btn);
          list.insertBefore(header, firstRow);
        }

        const isHiddenByFilter = filter !== '*' && filter !== branch;
        // En modo "una rama" (filter activo en este branch), el acordeón
        // es redundante: solo se muestra una rama. Forzamos expandido y
        // escondemos el header de acordeón (el editor sabe qué rama está
        // viendo por el dropdown).
        const singleBranchMode = filter !== '*' && filter === branch;
        const isCollapsed = singleBranchMode ? false : collapsed.has(branch);

        if (isHiddenByFilter || singleBranchMode) {
          header.style.display = 'none';
        } else {
          header.style.display = '';
        }
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
        // El dropdown es el navegador primario. La opción primera es una
        // rama concreta, no "todas". "Mostrar todo (avanzado)" queda como
        // último elemento para casos puntuales donde el editor quiere ver
        // el panorama completo.
        filterEl.innerHTML =
          '<label>Ir a la sección</label><select>' +
          branches
            .map(
              (b) =>
                `<option value="${b.replace(/"/g, '&quot;')}">${branchLabel(b)}</option>`
            )
            .join('') +
          '<option value="*">— Mostrar todo (avanzado) —</option></select>';
        const select = filterEl.querySelector('select') as HTMLSelectElement;
        select.value = filter;
        select.addEventListener('change', () => {
          setFilter(select.value);
          // Al elegir una rama específica, dejarla expandida (limpiamos el
          // estado de "colapsada" por si quedó de antes). En modo "Mostrar
          // todo" mantenemos el estado de colapsado del usuario.
          if (select.value !== '*') {
            const c = getCollapsed();
            c.delete(select.value);
            setCollapsedSet(c);
          }
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
