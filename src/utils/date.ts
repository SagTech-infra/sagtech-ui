export const calculateQuarters = (dateString: string | number | Date) => {
  let inf;
  const date = new Date(dateString);
  const monthNumber = date.getMonth() + 1;
  const year = date.getFullYear();
  if (monthNumber >= 1 && monthNumber <= 3) {
    inf = "Q1";
  }
  if (monthNumber >= 4 && monthNumber <= 6) {
    inf = "Q2";
  }
  if (monthNumber >= 7 && monthNumber <= 9) {
    inf = "Q3";
  }
  if (monthNumber >= 10 && monthNumber <= 12) {
    inf = "Q4";
  }
  return `${inf} ${year}`;
};

export const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${month}, ${year}`;
};

export const getCompanyAge = (): number => {
  const foundingYear = 2022;
  const currentYear = new Date().getFullYear();
  return currentYear - foundingYear;
};

/**
 * Returns a relative-time string like "5 minutes ago" / "in 3 days".
 * Uses Intl.RelativeTimeFormat. No external dependencies.
 *
 * @param date      The date being described.
 * @param baseDate  Reference date (default: `new Date()`).
 * @param locale    BCP-47 locale (default: undefined → host locale).
 */
export function formatRelativeTime(
  date: Date | string,
  baseDate?: Date,
  locale?: string,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const base = baseDate ?? new Date();
  const diffMs = d.getTime() - base.getTime();
  const diffSec = diffMs / 1000;
  const absSec = Math.abs(diffSec);

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (absSec < 60) {
    value = Math.round(diffSec);
    unit = "second";
  } else if (absSec < 60 * 60) {
    value = Math.round(diffSec / 60);
    unit = "minute";
  } else if (absSec < 60 * 60 * 24) {
    value = Math.round(diffSec / (60 * 60));
    unit = "hour";
  } else if (absSec < 60 * 60 * 24 * 7) {
    value = Math.round(diffSec / (60 * 60 * 24));
    unit = "day";
  } else if (absSec < 60 * 60 * 24 * 30) {
    value = Math.round(diffSec / (60 * 60 * 24 * 7));
    unit = "week";
  } else if (absSec < 60 * 60 * 24 * 365) {
    value = Math.round(diffSec / (60 * 60 * 24 * 30));
    unit = "month";
  } else {
    value = Math.round(diffSec / (60 * 60 * 24 * 365));
    unit = "year";
  }

  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
    value,
    unit,
  );
}

/**
 * Returns an absolute timestamp like "May 18, 2026, 3:42 PM".
 * Uses Intl.DateTimeFormat.
 *
 * @param date    The date to format.
 * @param locale  BCP-47 locale (default: undefined → host locale).
 */
export function formatAbsoluteTime(
  date: Date | string,
  locale?: string,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
