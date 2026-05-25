import { describe, expect, it } from 'vitest';
import {
  formatDisplayDate,
  formatMonthLabel,
  getWeekdayLabels,
} from '../calendar';

describe('getWeekdayLabels', () => {
  it('returns 7 labels for en-US', () => {
    expect(getWeekdayLabels('en-US')).toHaveLength(7);
  });

  it('en-US first label is the Monday short name', () => {
    const labels = getWeekdayLabels('en-US');
    // Monday short name in en-US is "Mon"; match case-insensitively on leading M
    expect(labels[0]).toMatch(/^M/i);
  });

  it('en-US labels are all non-empty strings', () => {
    for (const label of getWeekdayLabels('en-US')) {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it('de-DE returns 7 labels', () => {
    expect(getWeekdayLabels('de-DE')).toHaveLength(7);
  });

  it('de-DE first label is Monday-first (Mo in German)', () => {
    const labels = getWeekdayLabels('de-DE');
    // German Monday short is "Mo." or "Mo" — starts with M
    expect(labels[0]).toMatch(/^M/i);
  });

  it('de-DE differs from en-US array', () => {
    const en = getWeekdayLabels('en-US');
    const de = getWeekdayLabels('de-DE');
    // At least one label must differ (e.g. Sat/Sun abbreviations differ)
    const hasDiff = en.some((label, i) => label !== de[i]);
    expect(hasDiff).toBe(true);
  });

  it('no-arg call deep-equals explicit en-US call', () => {
    expect(getWeekdayLabels()).toEqual(getWeekdayLabels('en-US'));
  });

  it('same locale returns same array reference (memoization)', () => {
    const a = getWeekdayLabels('en-US');
    const b = getWeekdayLabels('en-US');
    expect(a).toBe(b);
  });
});

describe('formatMonthLabel', () => {
  it('en-US explicit: January 2026', () => {
    expect(formatMonthLabel(2026, 0, 'en-US')).toMatch(/January/);
    expect(formatMonthLabel(2026, 0, 'en-US')).toMatch(/2026/);
  });

  it('default arg matches explicit en-US', () => {
    expect(formatMonthLabel(2026, 0)).toBe(formatMonthLabel(2026, 0, 'en-US'));
  });

  it('December 2025 contains December and 2025', () => {
    expect(formatMonthLabel(2025, 11, 'en-US')).toMatch(/December/);
    expect(formatMonthLabel(2025, 11, 'en-US')).toMatch(/2025/);
  });
});

describe('formatDisplayDate', () => {
  it('en-US explicit: May 18, 2026', () => {
    const d = new Date(2026, 4, 18);
    expect(formatDisplayDate(d, 'en-US')).toMatch(/May/);
    expect(formatDisplayDate(d, 'en-US')).toMatch(/18/);
    expect(formatDisplayDate(d, 'en-US')).toMatch(/2026/);
  });

  it('default arg matches explicit en-US', () => {
    const d = new Date(2026, 4, 18);
    expect(formatDisplayDate(d)).toBe(formatDisplayDate(d, 'en-US'));
  });

  it('January 1, 2024', () => {
    const d = new Date(2024, 0, 1);
    expect(formatDisplayDate(d, 'en-US')).toMatch(/Jan/);
    expect(formatDisplayDate(d, 'en-US')).toMatch(/2024/);
  });
});
