/**
 * Pure color math for ColorPicker. No side effects, no React.
 * All hex strings are uppercase and prefixed with "#".
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

const HEX_6 = /^#?([0-9a-fA-F]{6})$/;
const HEX_8 = /^#?([0-9a-fA-F]{8})$/;
const HEX_3 = /^#?([0-9a-fA-F]{3})$/;
const HEX_4 = /^#?([0-9a-fA-F]{4})$/;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toHexByte(value: number): string {
  return clamp(Math.round(value), 0, 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
}

/**
 * Normalize an arbitrary user string into a canonical hex color.
 * Accepts: #RGB, #RGBA, #RRGGBB, #RRGGBBAA (with or without leading "#").
 * Returns null for anything that is not a valid hex color.
 *
 * When `allowAlpha` is false, an alpha component is stripped (#RRGGBBAA -> #RRGGBB).
 */
export function normalizeHex(
  input: string,
  allowAlpha = false,
): string | null {
  if (typeof input !== "string") return null;
  const raw = input.trim();
  if (raw === "") return null;

  // Expand shorthand #abc / #abcd to full form.
  const short3 = raw.match(HEX_3);
  if (short3) {
    const [r, g, b] = short3[1].split("");
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  const short4 = raw.match(HEX_4);
  if (short4) {
    const [r, g, b, a] = short4[1].split("");
    const expanded = `#${r}${r}${g}${g}${b}${b}${a}${a}`.toUpperCase();
    return allowAlpha ? expanded : `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  const eight = raw.match(HEX_8);
  if (eight) {
    const value = `#${eight[1]}`.toUpperCase();
    return allowAlpha ? value : `#${eight[1].slice(0, 6)}`.toUpperCase();
  }

  const six = raw.match(HEX_6);
  if (six) {
    return `#${six[1]}`.toUpperCase();
  }

  return null;
}

/**
 * Parse the alpha channel (0-100) out of an #RRGGBBAA string.
 * Colors without an alpha component return 100 (fully opaque).
 */
export function hexAlpha(hex: string): number {
  const normalized = normalizeHex(hex, true);
  if (!normalized || normalized.length !== 9) return 100;
  const alphaByte = parseInt(normalized.slice(7, 9), 16);
  return Math.round((alphaByte / 255) * 100);
}

/**
 * Append/replace the alpha channel on a hex color.
 * `alpha` is a percentage 0-100. The base color is normalized first.
 */
export function withAlpha(hex: string, alpha: number): string {
  const base = normalizeHex(hex, false) ?? "#000000";
  const clamped = clamp(alpha, 0, 100);
  if (clamped >= 100) return base;
  const alphaByte = toHexByte((clamped / 100) * 255);
  return `${base}${alphaByte}`;
}

export function hexToRgb(hex: string): Rgb | null {
  const normalized = normalizeHex(hex, false);
  if (!normalized) return null;
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = clamp(r, 0, 255) / 255;
  const gn = clamp(g, 0, 255) / 255;
  const bn = clamp(b, 0, 255) / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hn = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hn < 60) {
    r = c;
    g = x;
  } else if (hn < 120) {
    r = x;
    g = c;
  } else if (hn < 180) {
    g = c;
    b = x;
  } else if (hn < 240) {
    g = x;
    b = c;
  } else if (hn < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function hexToHsl(hex: string): Hsl | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb);
}

export function hslToHex(hsl: Hsl): string {
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Build a CSS-renderable color string. When the hex carries an alpha
 * component the raw 8-digit hex is already valid CSS, so return as-is.
 */
export function toCssColor(hex: string, alpha?: boolean): string {
  const normalized = normalizeHex(hex, alpha ?? true);
  return normalized ?? "#000000";
}
