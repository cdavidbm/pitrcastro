import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import yaml from "js-yaml";

// Asume que generate.js ya corrió (lo encadenamos desde package.json).
// Validaciones estructurales mínimas: que el YAML parsee y que las claves
// que Sveltia necesita para arrancar estén presentes.

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, "..", "public", "admin", "config.yml");

let raw;
try {
  raw = readFileSync(configPath, "utf-8");
} catch (err) {
  console.error(`validate: no se pudo leer ${configPath}: ${err.message}`);
  process.exit(1);
}

let parsed;
try {
  parsed = yaml.load(raw);
} catch (err) {
  console.error(`validate: YAML inválido en ${configPath}`);
  console.error(err.message);
  process.exit(1);
}

const problems = [];

if (!parsed || typeof parsed !== "object") {
  problems.push("el YAML no produce un objeto raíz");
}
if (!Array.isArray(parsed?.collections)) {
  problems.push("falta la clave `collections` o no es un array");
}
if (!parsed?.media_folder) {
  problems.push("falta la clave `media_folder`");
}

const names = new Set();
for (const col of parsed?.collections ?? []) {
  if (!col?.name) {
    problems.push("colección sin `name`");
    continue;
  }
  if (names.has(col.name)) {
    problems.push(`colección duplicada: ${col.name}`);
  }
  names.add(col.name);

  const hasFolder = typeof col.folder === "string";
  const hasFiles = Array.isArray(col.files);
  if (!hasFolder && !hasFiles) {
    problems.push(`colección "${col.name}" no declara ni \`folder\` ni \`files\``);
  }
  if (hasFiles) {
    for (const file of col.files) {
      if (!file?.name || !file?.file) {
        problems.push(`colección "${col.name}": entry sin \`name\` o \`file\``);
      }
    }
  }
}

if (problems.length > 0) {
  console.error("validate: config.yml tiene problemas estructurales:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`validate: config.yml OK — ${parsed.collections.length} colecciones, ${raw.split("\n").length} líneas.`);
