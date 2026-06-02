#!/usr/bin/env node
// Parses src/tokens/theme.css and verifies WCAG contrast of key foreground/
// background pairs in BOTH dark (@theme) and light ([data-theme=light]) themes.
// Exits non-zero if any required pair is below threshold.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(__dirname, "../src/tokens/theme.css"), "utf8");

// --- token extraction -------------------------------------------------------
function parseBlock(source) {
  const map = {};
  const re = /--color-([a-zA-Z0-9_-]+):\s*([^;]+);/g;
  let m;
  while ((m = re.exec(source)) !== null) map[m[1]] = m[2].trim();
  return map;
}

const themeMatch = css.match(/@theme\s*{([\s\S]*?)}\s*$/m);
const lightMatch = css.match(/\[data-theme="light"\][^{]*{([\s\S]*?)}/);
if (!themeMatch || !lightMatch) {
  console.error("Could not find @theme and/or [data-theme=light] blocks");
  process.exit(1);
}
const darkVars = parseBlock(themeMatch[1]);
const lightVars = { ...darkVars, ...parseBlock(lightMatch[1]) }; // light overrides dark

// --- color math -------------------------------------------------------------
function toRgb(value) {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgba = value.match(/rgba?\(([^)]+)\)/);
  if (rgba) {
    const p = rgba[1].split(",").map((s) => parseFloat(s.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  }
  throw new Error(`Unsupported color: ${value}`);
}

function composite(fg, bg) {
  // alpha-composite fg over opaque bg
  const a = fg.a;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

function luminance({ r, g, b }) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(fgVal, bgVal) {
  const bg = toRgb(bgVal);
  let fg = toRgb(fgVal);
  if (fg.a < 1) fg = composite(fg, bg);
  const L1 = luminance(fg);
  const L2 = luminance(bg);
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

// --- required pairs ---------------------------------------------------------
// [foreground token, background token, minimum ratio]
const PAIRS = [
  ["fg-primary", "bg-primary", 4.5],
  ["fg-primary", "bg-secondary", 4.5],
  ["fg-secondary", "bg-primary", 4.5],
  ["fg-muted", "bg-primary", 4.5],
  ["fg-success", "bg-primary", 4.5],
  ["fg-warning", "bg-primary", 4.5],
  ["fg-error", "bg-primary", 4.5],
  ["fg-info", "bg-primary", 4.5],
  ["border-strong", "bg-primary", 3.0],
];

function check(label, vars) {
  let failed = 0;
  console.log(`\n[${label}]`);
  for (const [fg, bg, min] of PAIRS) {
    const r = ratio(vars[fg], vars[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      `  ${ok ? "PASS" : "FAIL"}  ${fg} on ${bg}: ${r.toFixed(2)}:1 (min ${min})`,
    );
  }
  return failed;
}

const failures = check("dark", darkVars) + check("light", lightVars);
if (failures > 0) {
  console.error(`\n${failures} contrast pair(s) below threshold.`);
  process.exit(1);
}
console.log("\nAll contrast pairs pass.");
