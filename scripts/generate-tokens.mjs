#!/usr/bin/env node
// Parses src/tokens/theme.css and emits src/tokens/tokens.ts with typed constants
// for each @theme variable. Consumers get IDE autocomplete for colors/spacing/etc.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const themePath = resolve(__dirname, "../src/tokens/theme.css");
const outPath = resolve(__dirname, "../src/tokens/tokens.ts");

const css = readFileSync(themePath, "utf8");

// Extract content inside @theme { ... }
const themeMatch = css.match(/@theme\s*{([\s\S]*?)}\s*$/m);
if (!themeMatch) {
  console.error("Could not find @theme block in theme.css");
  process.exit(1);
}

const body = themeMatch[1];
const varRegex = /--([a-zA-Z0-9_-]+):\s*([^;]+);/g;

const groups = {
  colors: [],
  fonts: [],
  textSizes: [],
  leading: [],
  spacing: [],
  breakpoints: [],
  shadows: [],
  dropShadows: [],
  radius: [],
  borderWidths: [],
  z: [],
  inset: [],
  aspect: [],
  motionDuration: [],
  motionEase: [],
  other: [],
};

function classify(name) {
  if (name.startsWith("color-")) return "colors";
  if (name.startsWith("font-")) return "fonts";
  if (name.startsWith("text-")) return "textSizes";
  if (name.startsWith("leading-")) return "leading";
  if (name.startsWith("spacing-")) return "spacing";
  if (name.startsWith("breakpoint-")) return "breakpoints";
  if (name.startsWith("shadow-")) return "shadows";
  if (name.startsWith("drop-shadow-")) return "dropShadows";
  if (name.startsWith("radius-")) return "radius";
  if (name.startsWith("border-width-")) return "borderWidths";
  if (name.startsWith("z-")) return "z";
  if (name.startsWith("inset-")) return "inset";
  if (name.startsWith("aspect-")) return "aspect";
  if (name.startsWith("motion-duration-")) return "motionDuration";
  if (name.startsWith("motion-ease-")) return "motionEase";
  return "other";
}

function stripPrefix(name, prefix) {
  return name.startsWith(prefix) ? name.slice(prefix.length) : name;
}

let m;
while ((m = varRegex.exec(body)) !== null) {
  const name = m[1];
  const value = m[2].trim();
  groups[classify(name)].push({ name, value });
}

function toIdentifier(name) {
  // Keep valid JS identifiers; digits-first keys get a numeric-string key
  return /^[a-zA-Z_$][\w$]*$/.test(name) ? name : `'${name}'`;
}

function emitGroup(label, prefix, items) {
  if (items.length === 0) return "";
  const entries = items
    .map(({ name, value }) => {
      const key = stripPrefix(name, prefix);
      return `  ${toIdentifier(key)}: ${JSON.stringify(value)},`;
    })
    .join("\n");
  return `export const ${label} = {\n${entries}\n} as const;\n`;
}

const out = `// Generated from src/tokens/theme.css by scripts/generate-tokens.mjs.
// DO NOT EDIT MANUALLY. Re-run \`node scripts/generate-tokens.mjs\` after changing theme.css.

${emitGroup("colors", "color-", groups.colors)}
${emitGroup("fonts", "font-", groups.fonts)}
${emitGroup("textSizes", "text-", groups.textSizes)}
${emitGroup("leading", "leading-", groups.leading)}
${emitGroup("spacing", "spacing-", groups.spacing)}
${emitGroup("breakpoints", "breakpoint-", groups.breakpoints)}
${emitGroup("shadows", "shadow-", groups.shadows)}
${emitGroup("dropShadows", "drop-shadow-", groups.dropShadows)}
${emitGroup("radius", "radius-", groups.radius)}
${emitGroup("borderWidths", "border-width-", groups.borderWidths)}
${emitGroup("zIndex", "z-", groups.z)}
${emitGroup("inset", "inset-", groups.inset)}
${emitGroup("aspect", "aspect-", groups.aspect)}
${emitGroup("motionDuration", "motion-duration-", groups.motionDuration)}
${emitGroup("motionEase", "motion-ease-", groups.motionEase)}

export type ColorToken = keyof typeof colors;
export type FontToken = keyof typeof fonts;
export type TextSizeToken = keyof typeof textSizes;
export type SpacingToken = keyof typeof spacing;
export type BreakpointToken = keyof typeof breakpoints;
export type RadiusToken = keyof typeof radius;
export type ShadowToken = keyof typeof shadows;
export type ZIndexToken = keyof typeof zIndex;
export type MotionDurationToken = keyof typeof motionDuration;
export type MotionEaseToken = keyof typeof motionEase;
`;

writeFileSync(outPath, out, "utf8");
console.log(
  `Wrote ${outPath} (${Object.values(groups).reduce((n, g) => n + g.length, 0)} tokens)`,
);
