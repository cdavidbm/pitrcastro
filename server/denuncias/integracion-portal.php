<?php
/**
 * integracion-portal.php — Envía a Forest (SIGI) una denuncia recién hecha con
 * el formulario del portal (/denuncias/).
 *
 * Es la versión que usa el formulario nuevo de `integracion.php`, que sigue
 * intacto para el formulario antiguo. Arma el mismo XML y lo manda al mismo
 * servicio de Forest. Cambia en cuatro cosas:
 *
 *  1. Encuentra al denunciante por su documento y la hora del envío.
 *     `integracion.php` usa la vista IT_IN_DATOS_VW, que empareja denuncia y
 *     persona por número interno (DENUNCIA.ID_DENUNCIA = DATOS_PERSONALES.ID_PERSONA).
 *     Esos dos contadores se desfasaron en 2021 y la vista casi nunca encuentra
 *     la denuncia: a Forest le llega vacía y no asigna radicado.
 *  2. No reenvía: si la denuncia ya tiene radicado, lo devuelve sin llamar a
 *     Forest. Un doble clic o un reintento no duplican nada.
 *  3. Solo acepta denuncias enviadas en los últimos minutos. No sirve para
 *     reenviar denuncias antiguas ni para recorrerlas por número.
 *  4. Responde solo el número de radicado, sin datos personales.
 *  5. Lee el radicado en los dos formatos en que Forest lo devuelve (ver
 *     radicadoDe). integracion.php solo conoce el de las anónimas, así que
 *     nunca registró ni mostró el radicado de una denuncia con datos
 *     personales, aunque Forest sí la radicaba.
 *
 * Petición:  POST ID_DENUNCIA, FORM_ID
 * Respuesta: JSON {"ok":true,"radicado":"1-2026-006925"} · {"ok":true,"radicado":null}
 *            · {"ok":false,"motivo":"..."}
 *
 * Simulación (solo en el servidor, línea de comandos): muestra el XML que se
 * enviaría, sin enviarlo ni guardar nada.
 *   sudo -u www-data php integracion-portal.php --simular <ID_DENUNCIA>
 */

require_once __DIR__ . '/Connections/mysql.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

const FOREST_URL = 'http://10.5.10.3/forestLauncher/launcher/WS_DOCUMENTOS_WEBFILE/WS_CARGUE_DOCUMENTOS';
const MINUTOS_VALIDEZ = 30;

// Mismos nombres de parámetro que integracion.php, en el mismo orden.
const NUMEROS = ['UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
  'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO',
  'DIECINUEVE', 'VEINTE', 'VEINTIUNO', 'VEINTIDOS', 'VEINTITRES', 'VEINTICUATRO', 'VEINTICINCO',
  'VEINTISEIS', 'VEINTISIETE'];

function responder(int $codigo, array $cuerpo): void {
  http_response_code($codigo);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE);
  exit;
}

function registrar(string $mensaje): void {
  error_log('[integracion-portal] ' . $mensaje);
}

/** Los datos de la denuncia tal como los arma la vista IT_IN_DATOS_VW, pero con el denunciante correcto. */
function leerDenuncia(mysqli $db, int $id, ?int $formId): ?array {
  $st = $db->prepare('SELECT ID_DENUNCIA, FORM_ID, TERCERO, TIP_DOC, MEDIO_RESPUESTA, CONTRASENIA, ASUNTO, Fecha
                      FROM DENUNCIA WHERE ID_DENUNCIA = ?');
  $st->bind_param('i', $id);
  $st->execute();
  $d = $st->get_result()->fetch_assoc();
  if (!$d) return null;
  if ($formId !== null && (int)$d['FORM_ID'] !== $formId) return null;

  // Las respuestas de la denuncia (la última, si hubo reenvíos del formulario).
  $st = $db->prepare('SELECT * FROM RESPUESTAS WHERE ID_DENUNCIA = ? AND FORM_ID = ? ORDER BY RESP_ID DESC LIMIT 1');
  $st->bind_param('ii', $id, $d['FORM_ID']);
  $st->execute();
  $c = $st->get_result()->fetch_assoc();
  if (!$c) return null;

  // El denunciante: la fila guardada en el mismo envío que la denuncia. El paso 1
  // inserta primero la persona y enseguida la denuncia, con el mismo documento.
  $st = $db->prepare('SELECT * FROM DATOS_PERSONALES
                      WHERE TERCERO = ? AND TIPO_DOCUMENTO = ?
                        AND Fecha BETWEEN ? - INTERVAL 30 SECOND AND ? + INTERVAL 5 SECOND
                      ORDER BY ABS(TIMESTAMPDIFF(SECOND, Fecha, ?)), ID_PERSONA DESC LIMIT 1');
  $tercero = (string)$d['TERCERO'];
  $st->bind_param('sssss', $tercero, $d['TIP_DOC'], $d['Fecha'], $d['Fecha'], $d['Fecha']);
  $st->execute();
  $b = $st->get_result()->fetch_assoc();
  if (!$b) {
    // Sin la fila del denunciante se envían igual los hechos: una denuncia sin
    // remitente es mejor que una que no llega.
    registrar("denuncia $id: no se encontró la fila del denunciante; se envía sin sus datos");
    $b = ['TERCERO' => $d['TERCERO'], 'TIPO_DOCUMENTO' => $d['TIP_DOC'], 'TIPO_PERSONA' => '',
          'NOMBRE' => '', 'PAIS' => '', 'DEPTID' => '', 'CITY' => '', 'DIRECCION' => '',
          'TELEFONO' => '', 'CORREO' => ''];
  }

  // Cada respuesta con su detalle escrito, igual que la vista:
  // CONCAT(IFNULL(RESPn,' '), '-', IFNULL(MAX(DESCR),' '))
  $st = $db->prepare('SELECT RESP_ID_VALUE, MAX(DESCR) AS DESCR FROM RESPUESTAS_VALUE
                      WHERE RESP_ID = ? AND FORM_ID = ? GROUP BY RESP_ID_VALUE');
  $st->bind_param('ii', $c['RESP_ID'], $c['FORM_ID']);
  $st->execute();
  $detalles = [];
  foreach ($st->get_result()->fetch_all(MYSQLI_ASSOC) as $fila) $detalles[$fila['RESP_ID_VALUE']] = $fila['DESCR'];

  $preguntas = [];
  for ($n = 1; $n <= 27; $n++) {
    $resp = $c["RESP{$n}_ID_VALUE"];
    $descr = $detalles["RESP{$n}_ID_VALUE"] ?? null;
    $preguntas[$n] = [
      'preg' => $c["PREG{$n}_ID_VALUE"],
      'resp' => ($resp ?? ' ') . '-' . ($descr ?? ' '),
    ];
  }

  return ['d' => $d, 'b' => $b, 'c' => $c, 'preguntas' => $preguntas];
}

/**
 * El radicado en la respuesta de Forest, o '' si no trae uno.
 *
 * Forest contesta distinto según el denunciante:
 *   anónima:        <salida>…<contenido><datos><mensaje>1-2026-006939</mensaje>…
 *   con remitente:  <salida><mensaje>OK</mensaje><contenido>1-2026-006938</contenido></salida>
 * Solo se acepta con forma de radicado, para no guardar un mensaje de error
 * como si fuera un número (los 396 radicados históricos tienen esta forma).
 */
function radicadoDe(string $respuesta): string {
  $xml = @simplexml_load_string($respuesta);
  if (!$xml) return '';
  $esRadicado = fn(string $v) => (bool)preg_match('/^\d+-\d{4}-\d+$/', $v);

  $anonima = trim((string)$xml->contenido->datos->mensaje);
  if ($esRadicado($anonima)) return $anonima;

  $conRemitente = trim((string)$xml->contenido);
  if (strcasecmp(trim((string)$xml->mensaje), 'OK') === 0 && $esRadicado($conRemitente)) return $conRemitente;

  return '';
}

/** El mismo XML que arma integracion.php, con los valores escapados. */
function armarXml(array $x): string {
  $e = fn($v) => htmlspecialchars((string)($v ?? ''), ENT_XML1 | ENT_QUOTES, 'UTF-8');
  $p = fn($nombre, $valor) => "<parametro nombre='$nombre' >" . $e($valor) . "</parametro>\n";
  $b = $x['b']; $d = $x['d']; $c = $x['c'];

  $xml = "<entrada>\n";
  $xml .= $p('TERCERO', $b['TERCERO']);
  $xml .= $p('TIPO_PERSONA', $b['TIPO_PERSONA']);
  $xml .= $p('TIPO_DOCUMENTO', $b['TIPO_DOCUMENTO']);
  $xml .= $p('NOMBRE', $b['NOMBRE']);
  $xml .= $p('PAIS', $b['PAIS']);
  $xml .= $p('DEPARTAMENTO', $b['DEPTID']);
  $xml .= $p('CIUDAD', $b['CITY']);
  $xml .= $p('DIRECCION', $b['DIRECCION']);
  $xml .= $p('TELEFONO', $b['TELEFONO']);
  $xml .= $p('CORREO', $b['CORREO']);
  $xml .= $p('MEDIO_RESPUESTA', $d['MEDIO_RESPUESTA']);
  $xml .= $p('CONTRASENIA', $d['CONTRASENIA']);
  $xml .= $p('ASUNTO', $d['ASUNTO']);
  $xml .= $p('FORM_ID', $c['FORM_ID']);
  foreach (NUMEROS as $i => $palabra) {
    $n = $i + 1;
    $xml .= $p("PREG{$palabra}_ID_VALUE", $x['preguntas'][$n]['preg']);
    $xml .= $p("RESP{$palabra}_ID_VALUE", $x['preguntas'][$n]['resp']);
  }
  $xml .= $p('RESPVEINTIOCHO', $c['ARCHIVO']);
  return $xml . "</entrada>";
}

// ---- Simulación desde la línea de comandos ----------------------------------
if (PHP_SAPI === 'cli') {
  // Prueba de la lectura de una respuesta de Forest, sin llamar a Forest.
  $j = array_search('--leer-respuesta', $argv, true);
  if ($j !== false && isset($argv[$j + 1])) {
    echo radicadoDe($argv[$j + 1]) ?: '(sin radicado)', "\n";
    exit(0);
  }
  $i = array_search('--simular', $argv, true);
  if ($i === false || !isset($argv[$i + 1])) {
    fwrite(STDERR, "Uso: php integracion-portal.php --simular <ID_DENUNCIA>\n");
    exit(1);
  }
  $datos = leerDenuncia($mysql, (int)$argv[$i + 1], null);
  if (!$datos) { fwrite(STDERR, "Denuncia sin respuestas guardadas\n"); exit(1); }
  echo armarXml($datos), "\n";
  exit(0);
}

// ---- Petición del formulario ------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') responder(405, ['ok' => false, 'motivo' => 'metodo']);

$id = filter_input(INPUT_POST, 'ID_DENUNCIA', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
$formId = filter_input(INPUT_POST, 'FORM_ID', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 12]]);
if (!$id || !$formId) responder(400, ['ok' => false, 'motivo' => 'datos']);

// Solo denuncias recién guardadas.
$st = $mysql->prepare('SELECT 1 FROM RESPUESTAS WHERE ID_DENUNCIA = ? AND FORM_ID = ?
                       AND FECHA >= NOW() - INTERVAL ' . MINUTOS_VALIDEZ . ' MINUTE LIMIT 1');
$st->bind_param('ii', $id, $formId);
$st->execute();
if (!$st->get_result()->fetch_row()) responder(404, ['ok' => false, 'motivo' => 'no-encontrada']);

// Una sola llamada a Forest a la vez por denuncia. El candado se libera solo
// al cerrarse la conexión con la base, cuando termina esta petición.
$candado = "itrc-integracion-portal-$id";
$st = $mysql->prepare('SELECT GET_LOCK(?, 0)');
$st->bind_param('s', $candado);
$st->execute();
if ((int)$st->get_result()->fetch_row()[0] !== 1) responder(409, ['ok' => false, 'motivo' => 'en-curso']);

// ¿Ya tiene radicado? Se devuelve sin volver a enviar.
$st = $mysql->prepare('SELECT RADICADO FROM RADICADOS WHERE ID_DENUNCIA = ? ORDER BY ID LIMIT 1');
$st->bind_param('i', $id);
$st->execute();
$previo = $st->get_result()->fetch_row();
if ($previo) responder(200, ['ok' => true, 'radicado' => $previo[0]]);

$datos = leerDenuncia($mysql, $id, $formId);
if (!$datos) responder(404, ['ok' => false, 'motivo' => 'no-encontrada']);

$xmlEnvio = armarXml($datos);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, FOREST_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 200);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlEnvio);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-type: application/xml', 'Content-length: ' . strlen($xmlEnvio), 'Connection: close']);
$respuesta = curl_exec($ch);
$errorRed = curl_errno($ch) ? curl_error($ch) : null;
curl_close($ch);

if ($errorRed !== null || $respuesta === false) {
  registrar("denuncia $id: Forest no respondió ($errorRed)");
  responder(502, ['ok' => false, 'motivo' => 'forest']);
}

$radicado = radicadoDe($respuesta);

if ($radicado === '') {
  // La respuesta completa (recortada), para poder preguntar el motivo a quien
  // administra Forest.
  $resumen = substr(preg_replace('/\s+/', ' ', (string)$respuesta), 0, 800);
  registrar("denuncia $id: Forest respondió sin radicado. Respuesta: $resumen");
  responder(200, ['ok' => true, 'radicado' => null]);
}

$st = $mysql->prepare('INSERT INTO RADICADOS (RADICADO, ID_DENUNCIA) VALUES (?, ?)');
$st->bind_param('si', $radicado, $id);
$st->execute();
registrar("denuncia $id: radicado $radicado");
responder(200, ['ok' => true, 'radicado' => $radicado]);
