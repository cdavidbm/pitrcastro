#!/usr/bin/env node
// Webhook handler invocado por Strapi al publicar/despublicar contenido.
// Hace: pnpm build → rsync dist → chown a www-data. Debounce automatico:
// si llega otro evento durante un build, queda uno solo pendiente al final.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { appendFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const PORT = parseInt(process.env.WEBHOOK_PORT || "9001", 10);
const HOST = process.env.WEBHOOK_HOST || "0.0.0.0";
const SECRET = process.env.WEBHOOK_SECRET || "";
const PROJECT = process.env.PROJECT_DIR || "/home/admweb/itrc-cms";
const TARGET = process.env.TARGET_DIR || "/var/www/portal_nuevo";
const LOG_DIR = process.env.LOG_DIR || "/var/log/strapi-deploy";
const LOG_FILE = `${LOG_DIR}/webhook.log`;

if (!SECRET) { console.error("WEBHOOK_SECRET requerido"); process.exit(1); }
if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(line);
  try { appendFileSync(LOG_FILE, line); } catch {}
};

const run = (cmd, args, opts = {}) => new Promise((resolve, reject) => {
  const p = spawn(cmd, args, { ...opts, stdio: "pipe" });
  p.stdout.on("data", (d) => log(`[${cmd}] ${d.toString().trim()}`));
  p.stderr.on("data", (d) => log(`[${cmd}:err] ${d.toString().trim()}`));
  p.on("close", (code) => code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`)));
});

// ---------------------------------------------------------------------------
// Comprobacion antes de publicar
//
// El rsync corre con --delete sobre el directorio en vivo: lo que salga de la
// compilacion reemplaza al sitio publicado. Una compilacion puede terminar
// bien y aun asi estar vacia — el lector del CMS devuelve nulo ante cualquier
// fallo en vez de detener el proceso — de modo que "exit 0" no basta como
// garantia.
//
// Se compara la compilacion nueva con lo que ya esta publicado. Si ha
// encogido de forma apreciable, se cancela y el sitio se queda como estaba.
// Es preferible no publicar a publicar en blanco.
//
// Para un recorte legitimo y grande, mandar {"force":true} en la peticion.
// Las publicaciones automaticas del CMS nunca lo mandan, que es lo correcto.
// ---------------------------------------------------------------------------

const MINIMO_PAGINAS = 100;      // por debajo de esto algo va mal, sin comparar
const MINIMO_PORCENTAJE = 0.80;  // no puede quedarse por debajo del 80% de lo vivo

const medir = (dir) => {
  let paginas = 0, bytes = 0;
  const recorrer = (d) => {
    let entradas;
    try { entradas = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entradas) {
      const p = join(d, e.name);
      if (e.isDirectory()) recorrer(p);
      else if (e.name.endsWith(".html")) {
        paginas++;
        try { bytes += statSync(p).size; } catch {}
      }
    }
  };
  recorrer(dir);
  return { paginas, bytes };
};

const revisarCompilacion = (forzado) => {
  const nuevo = medir(`${PROJECT}/dist`);
  const vivo = medir(TARGET);
  log(`Revision: compilacion ${nuevo.paginas} paginas / ${nuevo.bytes} bytes — publicado ${vivo.paginas} paginas / ${vivo.bytes} bytes`);

  const problemas = [];
  if (nuevo.paginas < MINIMO_PAGINAS) {
    problemas.push(`solo ${nuevo.paginas} paginas (minimo ${MINIMO_PAGINAS})`);
  }
  if (vivo.paginas > 0 && nuevo.paginas < vivo.paginas * MINIMO_PORCENTAJE) {
    problemas.push(`${nuevo.paginas} paginas frente a ${vivo.paginas} publicadas`);
  }
  if (vivo.bytes > 0 && nuevo.bytes < vivo.bytes * MINIMO_PORCENTAJE) {
    const pct = ((nuevo.bytes / vivo.bytes) * 100).toFixed(1);
    problemas.push(`el contenido pesa el ${pct}% de lo publicado`);
  }

  if (!problemas.length) return;

  const detalle = problemas.join("; ");
  if (forzado) {
    log(`AVISO: ${detalle}. Se publica igual porque la peticion trae force.`);
    return;
  }
  throw new Error(
    `compilacion rechazada — ${detalle}. NO se publico nada; el sitio sigue como estaba. ` +
    `Causa habitual: el CMS no respondio o esta sin contenido. ` +
    `Si el recorte es intencionado, repetir con {"force":true}.`
  );
};

let running = false, pending = false;
const deploy = async (forzado = false) => {
  if (running) { pending = true; log("Build ya en curso — un build pendiente queda en cola"); return; }
  running = true; pending = false;
  try {
    log("=== BUILD START ===");
    await run("pnpm", ["build"], { cwd: PROJECT, env: { ...process.env, SITE_URL: "https://www.itrc.gov.co", BASE_PATH: "/", STRAPI_URL: "http://localhost:1337" } });
    log("Build OK. Revisando antes de publicar...");
    revisarCompilacion(forzado);
    log("Revision OK. Iniciando rsync...");
    await run("rsync", ["-az", "--delete", "--exclude=/uploads/", `${PROJECT}/dist/`, `${TARGET}/`]);
    log("Rsync OK. chown a www-data...");
    await run("chown", ["-R", "www-data:www-data", TARGET]);
    await run("chown", ["-R", "1000:1000", `${TARGET}/uploads`]);
    log("=== DEPLOY DONE ===");
  } catch (e) {
    log(`ERROR: ${e.message}`);
  } finally {
    running = false;
    if (pending) { log("Disparando build encolado..."); setImmediate(deploy); }
  }
};

createServer((req, res) => {
  if (req.method !== "POST" || !req.url.startsWith("/publish")) {
    res.writeHead(404); res.end(); return;
  }
  const auth = req.headers["authorization"] || "";
  if (!auth || !auth.includes(SECRET)) {
    log(`UNAUTH from ${req.socket.remoteAddress} (auth=${auth.slice(0,12)}...)`);
    res.writeHead(401); res.end(); return;
  }
  let body = "";
  req.on("data", (d) => body += d.toString());
  req.on("end", () => {
    let evt = "unknown", model = "?", forzado = false;
    try {
      const data = JSON.parse(body);
      evt = data.event || "unknown";
      model = data.model || "?";
      forzado = data.force === true;
    } catch {}
    log(`Webhook event=${evt} model=${model}${forzado ? " force=true" : ""}`);
    res.writeHead(202); res.end("queued\n");
    deploy(forzado);
  });
}).listen(PORT, HOST, () => log(`Listening ${HOST}:${PORT}`));
