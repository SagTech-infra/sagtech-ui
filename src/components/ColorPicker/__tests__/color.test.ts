import { describe, expect, it } from "vitest";
import {
  hexAlpha,
  hexToHsl,
  hexToRgb,
  hslToHex,
  normalizeHex,
  rgbToHex,
  rgbToHsl,
  withAlpha,
} from "../color";

describe("normalizeHex", () => {
  it("normalizes a 6-digit hex to uppercase with leading #", () => {
    expect(normalizeHex("#3b82f6")).toBe("#3B82F6");
    expect(normalizeHex("3b82f6")).toBe("#3B82F6");
  });

  it("expands #abc shorthand to full 6-digit form", () => {
    expect(normalizeHex("#abc")).toBe("#AABBCC");
    expect(normalizeHex("f00")).toBe("#FF0000");
  });

  it("rejects invalid strings", () => {
    expect(normalizeHex("nope")).toBeNull();
    expect(normalizeHex("#12")).toBeNull();
    expect(normalizeHex("#1234567")).toBeNull();
    expect(normalizeHex("")).toBeNull();
    expect(normalizeHex("#GGGGGG")).toBeNull();
  });

  it("strips alpha when allowAlpha is false but keeps it when true", () => {
    expect(normalizeHex("#11223344", false)).toBe("#112233");
    expect(normalizeHex("#11223344", true)).toBe("#11223344");
    expect(normalizeHex("#abcd", true)).toBe("#AABBCCDD");
  });
});

describe("rgb <-> hex round-trips", () => {
  it("converts hex to rgb and back", () => {
    const rgb = hexToRgb("#3B82F6");
    expect(rgb).toEqual({ r: 59, g: 130, b: 246 });
    expect(rgbToHex(rgb!)).toBe("#3B82F6");
  });

  it("returns null for invalid hex", () => {
    expect(hexToRgb("garbage")).toBeNull();
  });
});

describe("hsl <-> hex round-trips", () => {
  it("round-trips primary colors through hsl", () => {
    for (const hex of ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF", "#000000"]) {
      const hsl = hexToHsl(hex)!;
      expect(hslToHex(hsl)).toBe(hex);
    }
  });

  it("produces correct hue for red", () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
  });
});

describe("alpha handling", () => {
  it("reports 100 for colors without an alpha component", () => {
    expect(hexAlpha("#3B82F6")).toBe(100);
  });

  it("parses alpha from #RRGGBBAA", () => {
    expect(hexAlpha("#00000000")).toBe(0);
    expect(hexAlpha("#000000FF")).toBe(100);
  });

  it("always emits an 8-digit hex (FF at full opacity)", () => {
    expect(withAlpha("#3B82F6", 100)).toBe("#3B82F6FF");
    expect(withAlpha("#3B82F6", 0)).toBe("#3B82F600");
    expect(hexAlpha(withAlpha("#3B82F6", 50))).toBe(50);
  });
});
