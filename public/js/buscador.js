/**
 * Buscador del encabezado: sugerencias sobre el indice del sitio.
 *
 * Vive en public/js/ (y no como script dentro de la pagina) para cumplir la
 * politica de seguridad de contenido que el proveedor aplica en produccion,
 * la cual prohibe el codigo incrustado.
 */
(function() {
  const BASE = document.currentScript.getAttribute('data-base') || '/';
  let searchIndex = null;
  let activeIndex = -1;

  function normalize(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function resolveUrl(url) {
    if (!url || url.startsWith('http') || url.startsWith('//')) return url;
    if (url.startsWith('/')) return BASE + url.slice(1);
    return url;
  }

  function getIconClass(kind) {
    if (kind === 'p') return 'page';
    if (kind === 's') return 'section';
    return 'news';
  }

  function getIconFA(kind) {
    if (kind === 'p') return 'fa-file-lines';
    if (kind === 's') return 'fa-layer-group';
    return 'fa-newspaper';
  }

  function loadIndex(callback) {
    if (searchIndex) return callback(searchIndex);
    fetch(BASE + 'search-index.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        searchIndex = data;
        callback(data);
      })
      .catch(function() { callback([]); });
  }

  function renderResults(results) {
    const list = document.getElementById('search-results');
    const empty = document.getElementById('search-empty');
    const hint = document.getElementById('search-hint');
    const input = document.getElementById('search-input');
    const query = input ? input.value.trim() : '';

    if (!list || !empty || !hint) return;

    if (!query) {
      list.innerHTML = '';
      empty.hidden = true;
      hint.hidden = false;
      return;
    }

    hint.hidden = true;

    if (results.length === 0) {
      list.innerHTML = '';
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    activeIndex = -1;
    list.innerHTML = results.slice(0, 8).map(function(r, i) {
      const iconType = getIconClass(r.k);
      const iconFA = getIconFA(r.k);
      const url = resolveUrl(r.u);
      const external = url.startsWith('http');
      const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<li class="search-box__result" role="option">' +
        '<a href="' + url + '"' + target + ' data-idx="' + i + '">' +
          '<span class="search-box__result-icon search-box__result-icon--' + iconType + '">' +
            '<i class="fa-solid ' + iconFA + '"></i>' +
          '</span>' +
          '<span class="search-box__result-text">' +
            '<span class="search-box__result-title">' + escapeHtml(r.t) + '</span>' +
            (r.p ? '<span class="search-box__result-parent">' + escapeHtml(r.p) + '</span>' : '') +
          '</span>' +
        '</a>' +
      '</li>';
    }).join('');
  }

  function search(query) {
    if (!query) return renderResults([]);
    loadIndex(function(index) {
      const q = normalize(query);
      const scored = [];
      for (let i = 0; i < index.length; i++) {
        const entry = index[i];
        const title = normalize(entry.t);
        const parent = entry.p ? normalize(entry.p) : '';
        let score = 0;
        if (title === q) score = 100;
        else if (title.startsWith(q)) score = 80;
        else if (title.indexOf(q) !== -1) score = 60;
        else if (parent.indexOf(q) !== -1) score = 30;
        if (score > 0) scored.push({ entry: entry, score: score });
      }
      scored.sort(function(a, b) { return b.score - a.score; });
      renderResults(scored.map(function(s) { return s.entry; }));
    });
  }

  function openSearch() {
    const panel = document.getElementById('search-panel');
    const overlay = document.getElementById('search-overlay');
    const btn = document.getElementById('search-btn');
    const input = document.getElementById('search-input');
    if (!panel || panel.hidden === false) return;
    panel.hidden = false;
    if (overlay) overlay.hidden = false;
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (input) { input.value = ''; input.focus(); }
    renderResults([]);
  }

  function closeSearch() {
    const panel = document.getElementById('search-panel');
    const overlay = document.getElementById('search-overlay');
    const btn = document.getElementById('search-btn');
    if (panel) panel.hidden = true;
    if (overlay) overlay.hidden = true;
    if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
  }

  function navigateResults(direction) {
    const links = document.querySelectorAll('#search-results a');
    if (links.length === 0) return;
    links.forEach(function(l) { l.classList.remove('active'); });
    activeIndex += direction;
    if (activeIndex < 0) activeIndex = links.length - 1;
    if (activeIndex >= links.length) activeIndex = 0;
    links[activeIndex].classList.add('active');
    links[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function initSearch() {
    const btn = document.getElementById('search-btn');
    const input = document.getElementById('search-input');
    const overlay = document.getElementById('search-overlay');

    if (btn) btn.addEventListener('click', openSearch);
    if (overlay) overlay.addEventListener('click', closeSearch);

    if (input) {
      let timer;
      input.addEventListener('input', function() {
        clearTimeout(timer);
        const val = input.value.trim();
        timer = setTimeout(function() { search(val); }, 120);
      });

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { closeSearch(); e.preventDefault(); }
        if (e.key === 'ArrowDown') { navigateResults(1); e.preventDefault(); }
        if (e.key === 'ArrowUp') { navigateResults(-1); e.preventDefault(); }
        if (e.key === 'Enter') {
          const active = document.querySelector('#search-results a.active');
          if (active) { active.click(); closeSearch(); }
        }
      });
    }

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const panel = document.getElementById('search-panel');
        if (panel && panel.hidden) openSearch();
        else closeSearch();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
