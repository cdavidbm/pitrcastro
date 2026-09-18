<?php
// Prueba del escape SIN escribir en la base: solo SELECT del valor escapado.
require '/var/www/portal_principal/denuncias/Connections/mysql.php';
mysqli_report(MYSQLI_REPORT_OFF);
$fuente = file_get_contents($argv[1]);
preg_match('/function GetSQLValueString.*?\n\}\n/s', $fuente, $m);
eval(preg_replace('/^function GetSQLValueString/', 'function G', $m[0]));
$casos = ["O'Neill", "comillas 'simples' y \"dobles\"", "barra \\ invertida", "100% seguro",
          "línea 1\nlínea 2", "Ñandú — «prueba» áéíóú", "'); DROP TABLE DENUNCIA; --", "texto normal", ""];
$ok = 0;
foreach ($casos as $c) {
  $sql = sprintf("SELECT %s AS v", G($c, "text"));
  $r = mysqli_query($mysql, $sql);
  $v = $r ? mysqli_fetch_assoc($r)['v'] : '[ERROR SQL: ' . mysqli_error($mysql) . ']';
  $igual = ($c === '' ? $v === null : $v === $c);
  $ok += $igual;
  printf("%-40s → %s\n", json_encode($c, JSON_UNESCAPED_UNICODE), $igual ? 'llega intacto' : 'DISTINTO: ' . json_encode($v, JSON_UNESCAPED_UNICODE));
}
// El nombre del adjunto: escape + % protegido para sprintf
foreach (["document01/Denuncia_1_d'Agosto.pdf", "document01/Denuncia_1_100%.pdf"] as $t) {
  $a = str_replace('%', '%%', mysqli_real_escape_string($mysql, $t));
  $v = mysqli_fetch_assoc(mysqli_query($mysql, sprintf("SELECT '%s' AS x, '$a' AS v", 'a')))['v'];
  printf("%-40s → %s\n", "adjunto " . json_encode($t), $v === $t ? 'llega intacto' : 'DISTINTO: ' . $v);
  $ok += $v === $t;
}
echo "\n$ok de " . (count($casos) + 2) . " casos correctos\n";
