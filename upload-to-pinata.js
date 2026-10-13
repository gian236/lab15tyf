/**
 * upload-to-pinata.js
 * Lab 15 — IPFS + Pinata: CID + pin + resolve
 * Venture: PactTrail
 *
 * Sube venture-hello.json a IPFS a través de Pinata usando la API v3.
 * El JWT se lee únicamente desde la variable de entorno PINATA_JWT.
 * NUNCA se imprime el token. Si falta, el script termina con error claro.
 *
 * Uso:
 *   cp .env.example .env   # y rellena PINATA_JWT y PINATA_GATEWAY
 *   node upload-to-pinata.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";

// ── Carga .env manualmente (sin dependencia extra) ──────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadDotEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

loadDotEnv();

// ── Validar credenciales ────────────────────────────────────────────────────
const JWT = process.env.PINATA_JWT;
const GATEWAY = process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud";

if (!JWT || JWT.trim() === "") {
  console.error(
    "ERROR: PINATA_JWT no está configurado.\n" +
    "  1. Copia .env.example a .env\n" +
    "  2. Ingresa tu JWT de Pinata en PINATA_JWT\n" +
    "  3. Asegúrate de que .env esté en .gitignore y NUNCA lo commitees.\n" +
    "  Obtén tu JWT en: https://app.pinata.cloud/developers/api-keys"
  );
  process.exit(1);
}

// ── Archivo a subir ─────────────────────────────────────────────────────────
const FILE_PATH = path.join(__dirname, "venture-hello.json");

if (!existsSync(FILE_PATH)) {
  console.error("ERROR: No se encontró venture-hello.json en", __dirname);
  process.exit(1);
}

const fileStats = fs.statSync(FILE_PATH);
const fileName = "venture-hello.json";

console.log("──────────────────────────────────────────");
console.log(" PactTrail — Lab 15 IPFS Upload");
console.log("──────────────────────────────────────────");
console.log(`Archivo : ${fileName}`);
console.log(`Tamaño  : ${fileStats.size} bytes`);
console.log(`Gateway : ${GATEWAY}`);
console.log("Subiendo a Pinata...\n");

// ── Upload con Pinata API v3 ─────────────────────────────────────────────────
async function upload() {
  const formData = new FormData();

  const blob = new Blob([fs.readFileSync(FILE_PATH)], {
    type: "application/json",
  });
  formData.append("file", blob, fileName);
  formData.append(
    "pinataMetadata",
    JSON.stringify({ name: "pacttrail-lab15-venture-hello" })
  );
  formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    console.error(`ERROR HTTP ${response.status}: ${errBody}`);
    process.exit(1);
  }

  const data = await response.json();
  const cid = data.IpfsHash;
  const size = data.PinSize;
  const timestamp = data.Timestamp;

  console.log("✅ Upload exitoso");
  console.log(`──────────────────────────────────────────`);
  console.log(`Archivo    : ${fileName}`);
  console.log(`CID        : ${cid}`);
  console.log(`Tamaño pin : ${size} bytes`);
  console.log(`Timestamp  : ${timestamp}`);
  console.log(`Estado     : PINNED`);
  console.log(`──────────────────────────────────────────`);
  console.log(`\nResolve URL:`);
  console.log(`  ${GATEWAY}/ipfs/${cid}`);
  console.log(`  https://ipfs.io/ipfs/${cid}`);
  console.log(
    `\n⚠️  Guarda el CID para STORAGE.md y lab15-log.md. Nunca commitees .env.`
  );

  // Guardar CID en archivo temporal para el log
  fs.writeFileSync(
    path.join(__dirname, ".last-cid"),
    JSON.stringify({ cid, gateway: GATEWAY, timestamp, size }, null, 2)
  );
  console.log(`\nCID guardado en .last-cid (agrégate al .gitignore si quieres).`);
}

upload().catch((err) => {
  console.error("ERROR inesperado:", err.message);
  process.exit(1);
});
