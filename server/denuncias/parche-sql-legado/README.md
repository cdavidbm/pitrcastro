# Parche de inyección SQL en el sistema de denuncias original

Se aplicó en producción el 18 de septiembre de 2026 sobre 15 archivos de
`/var/www/portal_principal/denuncias/`: los tres del primer paso
(`denuNatural.php`, `denuJuridica.php`, `denuAnonimo.php`) y los doce formularios de
conducta. Son los únicos PHP del sistema que se ejecutan desde `/denuncias/`.

`parche.diff` tiene el cambio completo. En resumen:

1. **`GetSQLValueString()`** (los 15): la línea que escapaba los valores estaba
   comentada, así que todo el texto llegaba a la base sin escapar. Se agregan dos
   líneas que escapan con `mysqli_real_escape_string()` y la conexión ya abierta. La
   línea comentada original se conserva.
2. **Nombre del adjunto** (los 12 de conducta): iba dentro de la consulta sin escapar
   (`'$target_path'`). Ahora va `'$archivo_sql'`, escapado y con los `%` protegidos
   para `sprintf`.
3. **`FORM_ID`** (los 3 del primer paso): se fuerza a entero. nginx ya solo acepta
   1 a 12; esto es una segunda defensa.

Efecto: se cierra la inyección SQL y dejan de fallar las denuncias con apóstrofos o
barras invertidas en cualquier campo o en el nombre del adjunto. Para un texto
normal, lo guardado es idéntico.

## Comprobación

- `prueba-escape.php <archivo.php>`: extrae la función de un archivo y comprueba, con
  consultas `SELECT` que no escriben nada, que los valores difíciles llegan intactos.
  Con la función corregida, 11 de 11; con la original, los apóstrofos dan error de SQL
  y la barra invertida se pierde.
- Denuncia de prueba real 2703 (radicado 1-2026-006946), con apóstrofos, comillas y
  barra invertida en nombre, asunto, respuestas y adjunto: todo guardado intacto y
  el adjunto descargado por Forest.

## Volver atrás

Respaldo de los 15 archivos anteriores en el servidor; la ruta está en
`/root/backups/ultimo-respaldo-parche-sql`:

    D=$(sudo cat /root/backups/ultimo-respaldo-parche-sql)
    for f in $D/*.php; do sudo install -o root -g root -m 644 "$f" /var/www/portal_principal/denuncias/; done

El sistema original completo sigue preservado y sin cambios en
`/root/preservado/sistema-denuncias-original-2026-09-18/`.
