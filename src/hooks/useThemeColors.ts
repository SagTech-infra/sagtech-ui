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

/**
 * Structural/semantic tokens the charts draw onto the canvas (grid lines, axis
 * labels, tooltip surfaces, the hole in hover dots). These are theme-aware in
 * `theme.css` (overridden under `[data-theme="light"]`), but canvas drawing
 * reads JS values — not CSS classes — so they must be resolved at runtime here.
 * Without this the grid/hover lines stayed `rgba(255,255,255,…)` (invisible on
 * the light surface) and tooltips kept a dark `black_2` background.
 */
const UI_TOKENS = [
  'bg-primary',
  'bg-secondary',
  'bg-tertiary',
  'fg-primary',
  'fg-secondary',
  'fg-muted',
  'border-default',
  'border-strong',
] as const;

const ALL_TOKENS = [...PALETTE_TOKENS, ...UI_TOKENS] as const;

type PaletteToken = (typeof PALETTE_TOKENS)[number];
type UiToken = (typeof UI_TOKENS)[number];
type AnyToken = (typeof ALL_TOKENS)[number];

export type ThemeColorRecord = Record<PaletteToken, string>;
export type ThemeUiRecord = Record<UiToken, string>;

export interface UseThemeColorsResult {
  /**
   * Default series palette in the canonical chart order
   * (pr_purple, sec_purple, success, warning, sec_blue). Charts that do not
   * accept an explicit color prop cycle through this list.
   */
  palette: string[];
  /** Every resolved palette token, keyed by token name. */
  colors: ThemeColorRecord;
  /**
   * Resolved structural colors (grid, axes, tooltip surface, dot holes) so
   * canvas drawing recolors with the active theme instead of staying dark-only.
   */
  ui: ThemeUiRecord;
}

/** Order most charts cycle through for multi-series colors. */
const SERIES_ORDER: PaletteToken[] = [
  'pr_purple',
  'sec_purple',
  'success',
  'warning',
  'sec_blue',
];

function fallback(name: AnyToken): string {
  return tokens.colors[name as keyof typeof tokens.colors] as string;
}

function readColors(): Record<AnyToken, string> {
  // SSR / no document — return the static token values verbatim.
  if (typeof document === 'undefined') {
    return ALL_TOKENS.reduce(
      (acc, name) => {
        acc[name] = fallback(name);
        return acc;
      },
      {} as Record<AnyToken, string>,
    );
  }

  const computed = getComputedStyle(document.documentElement);
  return ALL_TOKENS.reduce(
    (acc, name) => {
      const cssVar = computed.getPropertyValue(`--color-${name}`).trim();
      acc[name] = cssVar || fallback(name);
      return acc;
    },
    {} as Record<AnyToken, string>,
  );
}

function toResult(all: Record<AnyToken, string>): UseThemeColorsResult {
  const colors = {} as ThemeColorRecord;
  for (const name of PALETTE_TOKENS) colors[name] = all[name];

  const ui = {} as ThemeUiRecord;
  for (const name of UI_TOKENS) ui[name] = all[name];

  return {
    colors,
    ui,
    palette: SERIES_ORDER.map((name) => colors[name]),
  };
}

/**
 * Resolves the chart palette and structural colors from CSS custom properties
 * at runtime and re-resolves whenever the active theme changes (`data-theme` on
 * `<html>` is toggled by `ThemeProvider`). Falls back to the static design
 * tokens when a CSS variable is empty, so charts still render in tests/SSR.
 */
export function useThemeColors(): UseThemeColorsResult {
  const [colors, setColors] = useState<Record<AnyToken, string>>(readColors);

  const refresh = useCallback(() => {
    setColors((prev) => {
      const next = readColors();
      // Avoid a re-render (and chart repaint) when nothing actually changed.
      const changed = ALL_TOKENS.some((name) => prev[name] !== next[name]);
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
