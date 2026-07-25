#!/usr/bin/env node
// Gera os sprites SVG da Fase 0+1 (docs/ASSET-DEVELOPMENT-PLAN.md) em
// assets-source/sprite/<tema>/<assetId>.svg. Puro Node — sem dependências.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(ROOT, "assets-source", "sprite");

const THEMES = ["classic", "modern_minimal", "cyber_neon"];

function svgDocument(width, height, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${defs ?? ""}${body}</svg>`;
}

function glowFilter(id, color, stdDeviation, region) {
  // feDropShadow tem suporte incompleto no librsvg (usado pelo sharp para
  // rasterizar) — elementos com esse filtro somem silenciosamente ao gerar
  // PNG. feGaussianBlur + feMerge é a técnica de glow classica, suportada.
  //
  // Region: por padrão usa objectBoundingBox (percentuais), mas isso quebra
  // para formas com uma dimensão de bbox igual a zero (ex.: uma <line>
  // perfeitamente vertical ou horizontal) — o filtro é descartado e o
  // elemento some. Nesses casos, passe `region` com coordenadas absolutas
  // (filterUnits="userSpaceOnUse").
  const regionAttrs = region
    ? `filterUnits="userSpaceOnUse" x="${region.x}" y="${region.y}" width="${region.width}" height="${region.height}"`
    : `x="-60%" y="-60%" width="220%" height="220%"`;
  return `<filter id="${id}" ${regionAttrs}><feFlood flood-color="${color}" flood-opacity="0.9" result="glowColor"/><feComposite in="glowColor" in2="SourceAlpha" operator="in" result="coloredAlpha"/><feGaussianBlur in="coloredAlpha" stdDeviation="${stdDeviation}" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}

function gridBoardMatrix(theme) {
  const size = 480;
  const third = size / 3;
  const line = (x1, y1, x2, y2, extra) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;

  if (theme === "classic") {
    const bg = `<rect width="${size}" height="${size}" fill="#c9a06a"/>` +
      Array.from({ length: 6 }, (_, i) => `<rect x="0" y="${i * (size / 6)}" width="${size}" height="2" fill="#b58a52" opacity="0.5"/>`).join("");
    const grid = [line(third, 20, third, size - 20, ""), line(2 * third, 20, 2 * third, size - 20, ""), line(20, third, size - 20, third, ""), line(20, 2 * third, size - 20, 2 * third, "")]
      .join("")
      .replace(/\/>/g, ' stroke="#5c3a21" stroke-width="10" stroke-linecap="round"/>');
    return svgDocument(size, size, "", bg + grid);
  }

  if (theme === "modern_minimal") {
    const bg = `<rect width="${size}" height="${size}" fill="#2b2f33"/>`;
    const grid = [line(third, 16, third, size - 16, ""), line(2 * third, 16, 2 * third, size - 16, ""), line(16, third, size - 16, third, ""), line(16, 2 * third, size - 16, 2 * third, "")]
      .join("")
      .replace(/\/>/g, ' stroke="#8fa1ad" stroke-width="4" stroke-linecap="butt"/>');
    return svgDocument(size, size, "", bg + grid);
  }

  const defs = glowFilter("gridGlow", "#00eaff", 6, { x: -20, y: -20, width: size + 40, height: size + 40 });
  const bg = `<rect width="${size}" height="${size}" fill="#05070d"/>`;
  const grid = [line(third, 12, third, size - 12, ""), line(2 * third, 12, 2 * third, size - 12, ""), line(12, third, size - 12, third, ""), line(12, 2 * third, size - 12, 2 * third, "")]
    .join("")
    .replace(/\/>/g, ' stroke="#00eaff" stroke-width="3" filter="url(#gridGlow)"/>');
  return svgDocument(size, size, defs, bg + grid);
}

function markerSymbolX(theme) {
  const size = 140;
  const pad = 28;
  if (theme === "classic") {
    const body = `<line x1="${pad}" y1="${pad}" x2="${size - pad}" y2="${size - pad}" stroke="#b3122b" stroke-width="22" stroke-linecap="round"/><line x1="${size - pad}" y1="${pad}" x2="${pad}" y2="${size - pad}" stroke="#b3122b" stroke-width="22" stroke-linecap="round"/>`;
    return svgDocument(size, size, "", body);
  }
  if (theme === "modern_minimal") {
    const body = `<line x1="${pad}" y1="${pad}" x2="${size - pad}" y2="${size - pad}" stroke="#33393f" stroke-width="14" stroke-linecap="butt"/><line x1="${size - pad}" y1="${pad}" x2="${pad}" y2="${size - pad}" stroke="#33393f" stroke-width="14" stroke-linecap="butt"/>`;
    return svgDocument(size, size, "", body);
  }
  const defs = glowFilter("xGlow", "#ff2bd6", 5);
  const body = `<line x1="${pad}" y1="${pad}" x2="${size - pad}" y2="${size - pad}" stroke="#ff2bd6" stroke-width="16" stroke-linecap="round" filter="url(#xGlow)"/><line x1="${size - pad}" y1="${pad}" x2="${pad}" y2="${size - pad}" stroke="#ff2bd6" stroke-width="16" stroke-linecap="round" filter="url(#xGlow)"/>`;
  return svgDocument(size, size, defs, body);
}

function markerSymbolO(theme) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;
  if (theme === "classic") {
    return svgDocument(size, size, "", `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1d4ed8" stroke-width="20"/>`);
  }
  if (theme === "modern_minimal") {
    return svgDocument(size, size, "", `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e8edf2" stroke-width="10"/>`);
  }
  const defs = glowFilter("oGlow", "#00eaff", 5);
  return svgDocument(size, size, defs, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#00eaff" stroke-width="14" filter="url(#oGlow)"/>`);
}

function uiHudFramePanel(theme) {
  const width = 640;
  const height = 160;
  if (theme === "classic") {
    const body = `<rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="16" fill="#f0e4c2" stroke="#6b4423" stroke-width="10"/>`;
    return svgDocument(width, height, "", body);
  }
  if (theme === "modern_minimal") {
    const body = `<rect x="4" y="4" width="${width - 8}" height="${height - 8}" rx="20" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>`;
    return svgDocument(width, height, "", body);
  }
  const defs = glowFilter("hudGlow", "#00eaff", 4);
  const body = `<rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="12" fill="#05070d" fill-opacity="0.85" stroke="#00eaff" stroke-width="3" filter="url(#hudGlow)"/>`;
  return svgDocument(width, height, defs, body);
}

const GENERATORS = {
  grid_board_matrix: gridBoardMatrix,
  marker_symbol_x: markerSymbolX,
  marker_symbol_o: markerSymbolO,
  ui_hud_frame_panel: uiHudFramePanel,
};

let count = 0;
for (const [assetName, generator] of Object.entries(GENERATORS)) {
  for (const theme of THEMES) {
    const dir = join(OUT_DIR, theme);
    mkdirSync(dir, { recursive: true });
    const assetId = `${assetName}_${theme}`;
    writeFileSync(join(dir, `${assetId}.svg`), generator(theme));
    count += 1;
  }
}

console.log(`generate-sprites: ${count} arquivos SVG escritos em ${OUT_DIR}`);
