#!/usr/bin/env node
// Varre assets-source/, rasteriza sprites SVG->PNG (sharp) e faz POST /assets
// no asset-service real (services/asset-service). Ver docs/ASSET-DEVELOPMENT-PLAN.md.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const ASSETS_SOURCE = join(ROOT, "assets-source");

const BASE_URL = process.env.ASSET_SERVICE_URL ?? "http://localhost:4100";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!ADMIN_API_KEY) {
  console.error("ADMIN_API_KEY nao definido no ambiente — obrigatorio para POST /assets.");
  process.exit(1);
}

function collectFiles(dir, extension) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(fullPath, extension);
    return entry.name.endsWith(extension) ? [fullPath] : [];
  });
}

function assetIdFromPath(path, extension) {
  const base = path.split("/").pop();
  return base.slice(0, -extension.length);
}

async function uploadAsset(id, category, mimeType, buffer) {
  const form = new FormData();
  form.append("id", id);
  form.append("category", category);
  form.append("file", new Blob([buffer], { type: mimeType }), `${id}.bin`);

  const response = await fetch(`${BASE_URL}/assets`, {
    method: "POST",
    headers: { "x-admin-api-key": ADMIN_API_KEY },
    body: form,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`POST /assets falhou para "${id}": ${response.status} ${body}`);
  }
  return response.json();
}

async function seedSprites() {
  const spriteDir = join(ASSETS_SOURCE, "sprite");
  const svgFiles = collectFiles(spriteDir, ".svg");
  let count = 0;
  for (const path of svgFiles) {
    const id = assetIdFromPath(path, ".svg");
    const svg = readFileSync(path);
    const png = await sharp(svg).png().toBuffer();
    await uploadAsset(id, "sprite", "image/png", png);
    count += 1;
  }
  return count;
}

async function seedAudio() {
  const audioDir = join(ASSETS_SOURCE, "audio");
  const wavFiles = collectFiles(audioDir, ".wav");
  let count = 0;
  for (const path of wavFiles) {
    const id = assetIdFromPath(path, ".wav");
    const wav = readFileSync(path);
    await uploadAsset(id, "audio", "audio/wav", wav);
    count += 1;
  }
  return count;
}

const spriteCount = await seedSprites();
const audioCount = await seedAudio();
console.log(`seed-asset-service: ${spriteCount} sprites + ${audioCount} audios registrados em ${BASE_URL}`);
