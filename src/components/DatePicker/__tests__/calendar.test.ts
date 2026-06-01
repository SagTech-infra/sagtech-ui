import { describe, expect, it } from 'vitest';
import {
  formatDisplayDate,
  formatMonthLabel,
  getWeekdayLabels,
  getFirstDayOfWeek,
  getCalendarDays,
} from '../calendar';

describe('getWeekdayLabels', () => {
  it('returns 7 labels for en-US', () => {
    expect(getWeekdayLabels('en-US')).toHaveLength(7);
  });

  it('en-US first label is locale-driven (Sunday-first → Sun)', () => {
    const labels = getWeekdayLabels('en-US');
    // en-US is Sunday-first; the first label should be the Sunday short name
    const sunLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
      new Date(Date.UTC(2024, 0, 7)), // 2024-01-07 is a Sunday
    );
    expect(labels[0]).toBe(sunLabel);
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

describe('getFirstDayOfWeek', () => {
  it('returns 1 (Monday) for de-DE', () => {
    // Germany is Monday-first
    const result = getFirstDayOfWeek('de-DE');
    expect(result).toBe(1);
  });

  it('returns 0 (Sunday) for en-US', () => {
    // US is Sunday-first
    const result = getFirstDayOfWeek('en-US');
    expect(result).toBe(0);
  });

  it('falls back to 1 (Monday) when weekInfo is unavailable', () => {
    // Simulate engine without Intl weekInfo
    const origIntlLocale = globalThis.Intl.Locale;
    // @ts-expect-error overriding for test
    globalThis.Intl.Locale = class {
      constructor() {}
      // no weekInfo property
    };
    try {
      expect(getFirstDayOfWeek('en-US')).toBe(1);
    } finally {
      globalThis.Intl.Locale = origIntlLocale;
    }
  });
});

describe('getWeekdayLabels with weekStartsOn', () => {
  it('weekStartsOn=0 puts Sunday first', () => {
    const labels = getWeekdayLabels('en-US', 0);
    const sunLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
      new Date(Date.UTC(2024, 0, 7)), // 2024-01-07 is a Sunday
    );
    expect(labels[0]).toBe(sunLabel);
  });

  it('weekStartsOn=1 puts Monday first', () => {
    const labels = getWeekdayLabels('en-US', 1);
    const monLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
      new Date(Date.UTC(2024, 0, 1)), // 2024-01-01 is a Monday
    );
    expect(labels[0]).toBe(monLabel);
  });

  it('cache key is locale|weekStartsOn — different weekStartsOn returns different array', () => {
    const mon = getWeekdayLabels('en-US', 1);
    const sun = getWeekdayLabels('en-US', 0);
    expect(mon[0]).not.toBe(sun[0]);
  });

  it('same locale+weekStartsOn returns same array reference (memoized)', () => {
    const a = getWeekdayLabels('en-US', 0);
    const b = getWeekdayLabels('en-US', 0);
    expect(a).toBe(b);
  });
});

describe('getCalendarDays with weekStartsOn', () => {
  // January 2026: starts on a Thursday (day=4)
  it('Monday-first (weekStartsOn=1): first cell is Mon 29 Dec 2025', () => {
    const days = getCalendarDays(2026, 0, undefined, undefined, 1);
    // firstDay offset = (4 - 1 + 7) % 7 = 3 → 3 leading days from prev month
    expect(days[0].date.getDate()).toBe(29);
    expect(days[0].date.getMonth()).toBe(11); // December
    expect(days[0].isCurrentMonth).toBe(false);
  });

  it('Sunday-first (weekStartsOn=0): first cell is Sun 28 Dec 2025', () => {
    const days = getCalendarDays(2026, 0, undefined, undefined, 0);
    // firstDay offset = (4 - 0 + 7) % 7 = 4 → 4 leading days
    expect(days[0].date.getDate()).toBe(28);
    expect(days[0].date.getMonth()).toBe(11); // December
    expect(days[0].isCurrentMonth).toBe(false);
  });

  it('no weekStartsOn arg preserves existing (backward-compat) behaviour', () => {
    // Old callers pass no 5th arg — should not throw and return 42 cells
    const days = getCalendarDays(2026, 0);
    expect(days).toHaveLength(42);
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
