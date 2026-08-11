/**
 * Pagina de estados: filtros y despliegue del listado.
 *
 * Vive en public/js/ (y no como script dentro de la pagina) para cumplir la
 * politica de seguridad de contenido que el proveedor aplica en produccion,
 * la cual prohibe el codigo incrustado.
 */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('est-filter');
    const items = document.querySelectorAll('.est-item');
    const count = document.getElementById('est-count');
    const total = items.length;
    if (!input) return;
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      let visible = 0;
      items.forEach((it) => {
        const txt = it.getAttribute('data-search') || '';
        const show = !q || txt.includes(q);
        it.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      count.textContent = `${visible} de ${total} notificaciones`;
    });
  });
