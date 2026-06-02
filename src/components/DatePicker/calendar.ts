export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}

export const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

/**
 * Returns the locale's first day of week as 0=Sunday … 6=Saturday.
 * Uses Intl.Locale.weekInfo (Chrome 130+, FF 126+); falls back to 1 (Monday)
 * for engines that lack weekInfo (happy-dom, older Safari).
 *
 * Intl weekInfo.firstDay uses 1=Mon … 7=Sun, so 7 maps to 0 (Sunday).
 */
export function getFirstDayOfWeek(locale: string): number {
  try {
    const info = (new Intl.Locale(locale) as Intl.Locale & { weekInfo?: { firstDay: number } }).weekInfo;
    if (info?.firstDay !== undefined) {
      // Intl: 1=Mon, 2=Tue, … 7=Sun → convert to 0=Sun … 6=Sat
      return info.firstDay === 7 ? 0 : info.firstDay;
    }
  } catch {
    // invalid locale — fall through
  }
  return 1; // Monday fallback
}

// 2024-01-01 is a Monday; iterate Mon–Sun via UTC to avoid timezone drift.
const _weekdayCache = new Map<string, string[]>();

export function getWeekdayLabels(locale: string = 'en-US', weekStartsOn?: number): string[] {
  const effectiveStart = weekStartsOn ?? getFirstDayOfWeek(locale);
  const cacheKey = `${locale}|${effectiveStart}`;
  const cached = _weekdayCache.get(cacheKey);
  if (cached) return cached;
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // 2024-01-01 is a Monday (index 1 in 0=Sun base). Build the Mon-anchored base
  // array then rotate by effectiveStart.
  // Day offsets from Mon: 0=Mon,1=Tue,2=Wed,3=Thu,4=Fri,5=Sat,6=Sun
  // To start from effectiveStart (0=Sun..6=Sat), we need to shift the Mon-base array:
  // Sun is +6 from Mon in the Mon-anchored array.
  // rotation = effectiveStart === 0 ? 6 : effectiveStart - 1
  const rotation = effectiveStart === 0 ? 6 : effectiveStart - 1;
  const monBase = Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(Date.UTC(2024, 0, 1 + i))),
  );
  const labels = [...monBase.slice(rotation), ...monBase.slice(0, rotation)];
  _weekdayCache.set(cacheKey, labels);
  return labels;
}

export function formatDisplayDate(date: Date, locale: string = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number, weekStartsOn: number = 1): number {
  const day = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  return ((day - weekStartsOn) + 7) % 7;
}

export function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && date < stripTime(minDate)) return true;
  if (maxDate && date > stripTime(maxDate)) return true;
  return false;
}

export function isBetween(date: Date, from: Date, to: Date): boolean {
  const t = date.getTime();
  return t > from.getTime() && t < to.getTime();
}

export function formatMonthLabel(year: number, month: number, locale: string = 'en-US'): string {
  return new Date(year, month).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
}

export function getCalendarDays(
  year: number,
  month: number,
  minDate?: Date,
  maxDate?: Date,
  weekStartsOn?: number,
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month, weekStartsOn ?? 1);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    const date = new Date(prevYear, prevMonth, daysInPrevMonth - i);
    days.push({
      date,
      isCurrentMonth: false,
      isDisabled: isDateDisabled(date, minDate, maxDate),
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({
      date,
      isCurrentMonth: true,
      isDisabled: isDateDisabled(date, minDate, maxDate),
    });
  }

  const remaining = 42 - days.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let d = 1; d <= remaining; d++) {
    const date = new Date(nextYear, nextMonth, d);
    days.push({
      date,
      isCurrentMonth: false,
      isDisabled: isDateDisabled(date, minDate, maxDate),
    });
  }

  return days;
}
