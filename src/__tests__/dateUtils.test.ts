import { describe, expect, it } from "vitest";
import { formatRelativeTime, formatAbsoluteTime } from "../utils/date";

// All tests pass `locale: 'en-US'` explicitly for deterministic output
// regardless of the CI/host locale.

describe("formatRelativeTime", () => {
  const base = new Date("2026-05-18T12:00:00Z");

  it('returns "5 minutes ago" for a date 5 minutes in the past', () => {
    const past = new Date(base.getTime() - 5 * 60 * 1000);
    expect(formatRelativeTime(past, base, "en-US")).toBe("5 minutes ago");
  });

  it('returns "in 3 days" for a date 3 days in the future', () => {
    const future = new Date(base.getTime() + 3 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(future, base, "en-US")).toBe("in 3 days");
  });

  it('returns "yesterday" for exactly 1 day ago (numeric: auto)', () => {
    const yesterday = new Date(base.getTime() - 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(yesterday, base, "en-US")).toBe("yesterday");
  });

  it('returns "tomorrow" for exactly 1 day ahead (numeric: auto)', () => {
    const tomorrow = new Date(base.getTime() + 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(tomorrow, base, "en-US")).toBe("tomorrow");
  });

  it("uses seconds for sub-minute diffs", () => {
    const past = new Date(base.getTime() - 30 * 1000);
    expect(formatRelativeTime(past, base, "en-US")).toBe("30 seconds ago");
  });

  it("uses hours for same-day diffs over 60 minutes", () => {
    const past = new Date(base.getTime() - 3 * 60 * 60 * 1000);
    expect(formatRelativeTime(past, base, "en-US")).toBe("3 hours ago");
  });

  it("uses weeks for diffs between 7 and 30 days", () => {
    const past = new Date(base.getTime() - 14 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(past, base, "en-US")).toBe("2 weeks ago");
  });

  it("uses months for diffs between 30 days and 1 year", () => {
    const past = new Date(base.getTime() - 60 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(past, base, "en-US")).toBe("2 months ago");
  });

  it("uses years for diffs over 365 days", () => {
    const past = new Date(base.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(past, base, "en-US")).toBe("2 years ago");
  });

  it("accepts a string date input", () => {
    const past = new Date(base.getTime() - 5 * 60 * 1000);
    expect(formatRelativeTime(past.toISOString(), base, "en-US")).toBe(
      "5 minutes ago",
    );
  });

  it("defaults baseDate to now when omitted (smoke test)", () => {
    const result = formatRelativeTime(new Date(), undefined, "en-US");
    // "now" or "0 seconds ago" — just ensure it returns a non-empty string
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("formatAbsoluteTime", () => {
  it("returns a deterministic medium-date + short-time string in en-US", () => {
    // Use a fixed UTC timestamp; format in en-US
    const date = new Date("2026-05-18T15:42:00Z");
    const result = formatAbsoluteTime(date, "en-US");
    // The exact rendering depends on the runtime TZ; just verify it contains
    // the year and a colon (time separator) to avoid TZ flakiness.
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/:/);
  });

  it("accepts a string date input", () => {
    const result = formatAbsoluteTime("2026-05-18T15:42:00Z", "en-US");
    expect(result).toMatch(/2026/);
  });

  it("returns a non-empty string when locale is omitted", () => {
    const result = formatAbsoluteTime(new Date());
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
