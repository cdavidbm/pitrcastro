#!/usr/bin/env node
// Webhook handler invocado por Strapi al publicar/despublicar contenido.
// Hace: pnpm build → rsync dist → chown a www-data. Debounce automatico:
// si llega otro evento durante un build, queda uno solo pendiente al final.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { appendFileSync, mkdirSync, existsSync } from "node:fs";

const PORT = parseInt(process.env.WEBHOOK_PORT || "9001", 10);
const HOST = process.env.WEBHOOK_HOST || "0.0.0.0";
const SECRET = process.env.WEBHOOK_SECRET || "";
const PROJECT = process.env.PROJECT_DIR || "/home/admweb/itrc-cms";
const TARGET = process.env.TARGET_DIR || "/var/www/portal_nuevo";
const LOG_DIR = "/var/log/strapi-deploy";
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

let running = false, pending = false;
const deploy = async () => {
  if (running) { pending = true; log("Build ya en curso — un build pendiente queda en cola"); return; }
  running = true; pending = false;
  try {
    log("=== BUILD START ===");
    await run("pnpm", ["build"], { cwd: PROJECT, env: { ...process.env, SITE_URL: "https://www.itrc.gov.co", BASE_PATH: "/", STRAPI_URL: "http://localhost:1337" } });
    log("Build OK. Iniciando rsync...");
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
    let evt = "unknown", model = "?";
    try { const data = JSON.parse(body); evt = data.event || "unknown"; model = data.model || "?"; } catch {}
    log(`Webhook event=${evt} model=${model}`);
    res.writeHead(202); res.end("queued\n");
    deploy();
  });
}).listen(PORT, HOST, () => log(`Listening ${HOST}:${PORT}`));
