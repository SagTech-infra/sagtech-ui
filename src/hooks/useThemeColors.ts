'use client';

import { useCallback, useEffect, useState } from 'react';
import * as tokens from '@/tokens/tokens';

/**
 * Palette tokens the canvas charts read at runtime. Kept in one place so the
 * hook resolves exactly the CSS custom properties (`--color-<name>`) that the
 * charts consume, and falls back to the static `tokens.colors.*` values when a
 * stylesheet has not been applied (SSR / tests).
 */
const PALETTE_TOKENS = [
  'pr_purple',
  'sec_purple',
  'pr_blue',
  'sec_blue',
  'success',
  'warning',
  'error',
] as const;

type PaletteToken = (typeof PALETTE_TOKENS)[number];

export type ThemeColorRecord = Record<PaletteToken, string>;

export interface UseThemeColorsResult {
  /**
   * Default series palette in the canonical chart order
   * (pr_purple, sec_purple, success, warning, sec_blue). Charts that do not
   * accept an explicit color prop cycle through this list.
   */
  palette: string[];
  /** Every resolved palette token, keyed by token name. */
  colors: ThemeColorRecord;
}

/** Order most charts cycle through for multi-series colors. */
const SERIES_ORDER: PaletteToken[] = [
  'pr_purple',
  'sec_purple',
  'success',
  'warning',
  'sec_blue',
];

function readColors(): ThemeColorRecord {
  // SSR / no document — return the static token values verbatim.
  if (typeof document === 'undefined') {
    return PALETTE_TOKENS.reduce((acc, name) => {
      acc[name] = tokens.colors[name];
      return acc;
    }, {} as ThemeColorRecord);
  }

  const computed = getComputedStyle(document.documentElement);
  return PALETTE_TOKENS.reduce((acc, name) => {
    const cssVar = computed.getPropertyValue(`--color-${name}`).trim();
    acc[name] = cssVar || tokens.colors[name];
    return acc;
  }, {} as ThemeColorRecord);
}

function toResult(colors: ThemeColorRecord): UseThemeColorsResult {
  return {
    colors,
    palette: SERIES_ORDER.map((name) => colors[name]),
  };
}

/**
 * Resolves the chart palette from CSS custom properties at runtime and
 * re-resolves whenever the active theme changes (`data-theme` on
 * `<html>` is toggled by `ThemeProvider`). Falls back to the static design
 * tokens when a CSS variable is empty, so charts still render in tests/SSR.
 */
export function useThemeColors(): UseThemeColorsResult {
  const [colors, setColors] = useState<ThemeColorRecord>(readColors);

  const refresh = useCallback(() => {
    setColors((prev) => {
      const next = readColors();
      // Avoid a re-render (and chart repaint) when nothing actually changed.
      const changed = PALETTE_TOKENS.some((name) => prev[name] !== next[name]);
      return changed ? next : prev;
    });
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Re-read once on mount: the first paint runs before the stylesheet may be
    // applied, and the initial state was seeded synchronously.
    refresh();

    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [refresh]);

  return toResult(colors);
}

export default useThemeColors;
