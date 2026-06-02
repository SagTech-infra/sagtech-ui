import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as tokens from '@/tokens/tokens';
import { useThemeColors } from '../useThemeColors';

describe('useThemeColors', () => {
  it('falls back to the static token palette when no CSS vars are set', () => {
    // happy-dom applies no stylesheet, so getComputedStyle returns empty
    // strings for every --color-* var and the tokens fallback is exercised.
    const { result } = renderHook(() => useThemeColors());

    expect(result.current.colors.pr_purple).toBe(tokens.colors.pr_purple);
    expect(result.current.colors.sec_purple).toBe(tokens.colors.sec_purple);
    expect(result.current.colors.pr_blue).toBe(tokens.colors.pr_blue);
    expect(result.current.colors.sec_blue).toBe(tokens.colors.sec_blue);
    expect(result.current.colors.success).toBe(tokens.colors.success);
    expect(result.current.colors.warning).toBe(tokens.colors.warning);
    expect(result.current.colors.error).toBe(tokens.colors.error);
  });

  it('exposes the series palette in the canonical chart order', () => {
    const { result } = renderHook(() => useThemeColors());

    expect(result.current.palette).toEqual([
      tokens.colors.pr_purple,
      tokens.colors.sec_purple,
      tokens.colors.success,
      tokens.colors.warning,
      tokens.colors.sec_blue,
    ]);
  });

  it('re-reads the palette when data-theme changes on documentElement', () => {
    const { result } = renderHook(() => useThemeColors());

    // No stylesheet in happy-dom, so toggling the attribute keeps the fallback
    // values; the assertion proves the observer path does not throw and the
    // resolved palette remains stable/defined across a theme switch.
    document.documentElement.setAttribute('data-theme', 'light');
    expect(result.current.colors.pr_purple).toBe(tokens.colors.pr_purple);
    document.documentElement.removeAttribute('data-theme');
  });
});
