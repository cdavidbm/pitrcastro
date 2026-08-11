/**
 * Buzon etico: descripcion de la conducta segun la opcion elegida.
 *
 * Los datos llegan en un atributo del propio <script>, porque la politica de
 * seguridad de contenido que el proveedor aplica en produccion prohibe el
 * codigo incrustado (que es como se pasaban antes).
 */
var CONDUCTAS = JSON.parse(document.currentScript.dataset.conductas || '{}');

(function () {
      var form = document.querySelector('[data-buzon-form]');
      if (!form) return;

      // Muestra/oculta cualquier bloque con data-cond según el valor activo.
      function toggleCond(key, on) {
        form.querySelectorAll('[data-cond="' + key + '"]').forEach(function (el) {
          el.hidden = !on;
        });
      }

      // 1. Tipo de reporte → muestra valor/conducta solo para "Código de Integridad"
      var tipo = form.querySelector('[data-tipo]');
      tipo && tipo.addEventListener('change', function () {
        toggleCond('codigo', tipo.value === 'codigo');
      });

      // 1.1 → 1.2 desplegable dependiente de conductas
      var valor = form.querySelector('[data-valor]');
      var conducta = form.querySelector('[data-conducta]');
      valor && valor.addEventListener('change', function () {
        var lista = CONDUCTAS[valor.value] || [];
        conducta.innerHTML = '<option value="" selected disabled>Selecciona la conducta…</option>';
        lista.forEach(function (c) {
          var o = document.createElement('option');
          o.textContent = c;
          conducta.appendChild(o);
        });
      });

      // 3. Modalidad anónima/identificada → muestra contacto + canal de respuesta
      function syncModalidad() {
        var sel = form.querySelector('[data-modalidad]:checked');
        var ident = sel && sel.value === 'identificada';
        toggleCond('identificada', ident);
        toggleCond('anonima', !ident);
      }
      form.querySelectorAll('[data-modalidad]').forEach(function (r) {
        r.addEventListener('change', syncModalidad);
      });

      // Estado inicial
      toggleCond('codigo', false);
      syncModalidad();
    })();
