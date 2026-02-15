import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import yaml from "js-yaml";

import { base } from "./base.js";
import { agencia } from "./collections/agencia.js";
import { transparencia } from "./collections/transparencia.js";
import { normativa } from "./collections/normativa.js";
import { atencion } from "./collections/atencion.js";
import { participa } from "./collections/participa.js";
import { prensaCollections } from "./collections/prensa.js";
import { sliders } from "./collections/sliders.js";
import { settings } from "./collections/settings.js";

// ============================================================
// Config assembly
// ============================================================

const COLLECTION_GROUPS = [
  {
    header: "LA AGENCIA\n# Paginas institucionales de la Agencia ITRC",
    collections: [agencia],
  },
  {
    header: "TRANSPARENCIA\n# Indice de informacion clasificada y reservada",
    collections: [transparencia],
  },
  {
    header: "NORMATIVA\n# Marco legal y normativo de la entidad",
    collections: [normativa],
  },
  {
    header: "ATENCION Y SERVICIOS\n# Canales de atencion y servicios al ciudadano",
    collections: [atencion],
  },
  {
    header: "PARTICIPA\n# Mecanismos de participacion ciudadana",
    collections: [participa],
  },
  {
    header: "PRENSA\n# Noticias, eventos y comunicaciones",
    collections: prensaCollections,
  },
  {
    header: "SLIDERS / CARRUSELES",
    collections: [sliders],
  },
  {
    header: "CONFIGURACION GLOBAL",
    collections: [settings],
  },
];

const allCollections = COLLECTION_GROUPS.flatMap((g) => g.collections);

const config = {
  ...base,
  collections: allCollections,
};

// ============================================================
// YAML generation
// ============================================================

const HEADER = `# ============================================
# CONFIGURACION SVELTIA CMS - AGENCIA ITRC
# ============================================
# ARCHIVO GENERADO AUTOMATICAMENTE
# No editar directamente. Modificar los archivos en cms/
# y ejecutar: npm run cms:generate
# ============================================
#
# DESARROLLO LOCAL:
# Sveltia CMS usa la File System Access API del navegador.
# NO necesita servidor proxy. Solo funciona en Chrome o Edge.
#
# 1. Ejecuta: npm run dev
# 2. Abre http://localhost:4321/admin en Chrome o Edge
# 3. El navegador pedira permiso para acceder a la carpeta del proyecto
# 4. Los cambios se guardan directamente en los archivos locales
#
# PRODUCCION (con GitHub):
# Descomenta la seccion 'backend' de abajo y configura OAuth en GitHub
#
# ============================================

`;

/**
 * Renames auto-generated js-yaml anchors (&ref_0) to meaningful names.
 * Maps each anchor to a name based on the YAML content near its definition.
 */
function renameAnchors(yamlStr) {
  const anchorDefs = [...yamlStr.matchAll(/&(ref_\d+)/g)];
  if (anchorDefs.length === 0) return yamlStr;

  const anchorNames = new Map();
  let nameCounter = 0;

  for (const match of anchorDefs) {
    const refId = match[1];
    if (anchorNames.has(refId)) continue;

    // Look at surrounding YAML to determine a meaningful name
    const pos = match.index;
    const surroundingChunk = yamlStr.substring(pos, pos + 200);

    let name;
    if (surroundingChunk.includes("displayMode") || surroundingChunk.includes("Modo de visualizacion")) {
      name = "display_mode";
    } else {
      nameCounter++;
      name = `shared_${nameCounter}`;
    }

    anchorNames.set(refId, name);
  }

  let result = yamlStr;
  for (const [refId, name] of anchorNames) {
    result = result.replaceAll(`&${refId}`, `&${name}`);
    result = result.replaceAll(`*${refId}`, `*${name}`);
  }

  return result;
}

/**
 * Injects section comment headers before each collection group's
 * first collection in the YAML output.
 */
function injectSectionComments(yamlStr) {
  let result = yamlStr;

  for (const group of COLLECTION_GROUPS) {
    const firstCollection = group.collections[0];
    const collectionName = firstCollection.name;

    // Find the line `- name: "<collectionName>"` at the top level of collections
    const marker = `- name: ${collectionName}\n`;
    const markerQuoted = `- name: "${collectionName}"\n`;

    const targetMarker = result.includes(markerQuoted) ? markerQuoted : marker;
    const idx = result.indexOf(targetMarker);
    if (idx === -1) continue;

    const commentLines = group.header
      .split("\n")
      .map((line) => `  # ${line}`)
      .join("\n");

    const sectionComment = `\n  # ==========================================\n${commentLines}\n  # ==========================================\n  `;

    result = result.substring(0, idx) + sectionComment + result.substring(idx);
  }

  return result;
}

// ============================================================
// Generate and write
// ============================================================

const rawYaml = yaml.dump(config, {
  lineWidth: -1,
  noRefs: false,
  quotingType: '"',
  forceQuotes: false,
  flowLevel: -1,
  sortKeys: false,
});

let output = HEADER + renameAnchors(rawYaml);
output = injectSectionComments(output);

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, "..", "public", "admin", "config.yml");

writeFileSync(outputPath, output, "utf-8");

const collectionCount = allCollections.length;
const lineCount = output.split("\n").length;
console.log(`config.yml generado: ${collectionCount} colecciones, ${lineCount} lineas → ${outputPath}`);
