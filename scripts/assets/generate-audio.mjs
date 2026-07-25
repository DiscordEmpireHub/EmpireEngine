#!/usr/bin/env node
// Gera os SFX WAV da Fase 0+1 (docs/ASSET-DEVELOPMENT-PLAN.md) em
// assets-source/audio/<assetId>.wav. Síntese PCM pura — sem dependências.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(ROOT, "assets-source", "audio");
const SAMPLE_RATE = 44100;

function envelope(t, durationSec, attack = 0.01, release = 0.08) {
  if (t < attack) return t / attack;
  const remaining = durationSec - t;
  if (remaining < release) return Math.max(0, remaining / release);
  return 1;
}

function synthesize(durationSec, sampleFn) {
  const sampleCount = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Int16Array(sampleCount);
  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / SAMPLE_RATE;
    const amplitude = sampleFn(t) * envelope(t, durationSec);
    samples[i] = Math.max(-32767, Math.min(32767, Math.round(amplitude * 32767)));
  }
  return samples;
}

function sine(freq) {
  return (t) => Math.sin(2 * Math.PI * freq * t);
}

function square(freq) {
  return (t) => (Math.sin(2 * Math.PI * freq * t) >= 0 ? 1 : -1);
}

function chirp(freqFrom, freqTo, durationSec) {
  return (t) => {
    const freq = freqFrom + (freqTo - freqFrom) * (t / durationSec);
    return Math.sin(2 * Math.PI * freq * t);
  };
}

function mix(...fns) {
  return (t) => fns.reduce((sum, fn) => sum + fn(t), 0) / fns.length;
}

function writeWavFile(path, samples) {
  const blockAlign = 2; // 16-bit mono
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i += 1) {
    buffer.writeInt16LE(samples[i], 44 + i * 2);
  }

  writeFileSync(path, buffer);
}

const SFX = {
  sfx_piece_place_wood: () => synthesize(0.18, mix(sine(180), sine(90))),
  sfx_piece_place_metal: () => synthesize(0.15, mix(sine(720), sine(1440))),
  sfx_piece_place_neon: () => synthesize(0.12, square(880)),

  sfx_turn_pass_classic: () => synthesize(0.4, sine(660)),
  sfx_turn_pass_modern: () => synthesize(0.25, sine(1200)),
  sfx_turn_pass_cyber: () => synthesize(0.3, chirp(400, 1600, 0.3)),

  sfx_match_win_classic: () => synthesize(0.8, mix(sine(523), sine(659), sine(784))),
  sfx_match_win_modern: () => synthesize(0.6, mix(sine(660), sine(880))),
  sfx_match_win_cyber: () => synthesize(0.7, chirp(300, 1800, 0.7)),

  sfx_match_lose_classic: () => synthesize(0.7, mix(sine(220), sine(207))),
  sfx_match_lose_modern: () => synthesize(0.5, sine(160)),
  sfx_match_lose_cyber: () => synthesize(0.6, chirp(500, 100, 0.6)),

  sfx_match_draw_classic: () => synthesize(0.5, sine(392)),
  sfx_match_draw_modern: () => synthesize(0.4, sine(440)),
  sfx_match_draw_cyber: () => synthesize(0.45, mix(sine(440), sine(445))),

  sfx_ui_click_classic: () => synthesize(0.06, sine(500)),
  sfx_ui_click_modern: () => synthesize(0.05, sine(1000)),
  sfx_ui_click_cyber: () => synthesize(0.05, square(1600)),
};

mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const [assetId, generator] of Object.entries(SFX)) {
  writeWavFile(join(OUT_DIR, `${assetId}.wav`), generator());
  count += 1;
}

console.log(`generate-audio: ${count} arquivos WAV escritos em ${OUT_DIR}`);
