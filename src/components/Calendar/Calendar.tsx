"use client";

import { useCallback, useMemo, useState, type Ref } from "react";
import classNames from "classnames";
import { useLocale } from "@/providers/LocaleContext";
import {
  getCalendarDays,
  getWeekdayLabels,
  formatMonthLabel,
  isSameDay,
  isToday,
  type CalendarDay,
} from "../DatePicker/calendar";

export interface CalendarProps {
  /** The currently selected date. */
  value?: Date;
  /** Fired with the clicked day's Date when an enabled cell is pressed. */
  onChange?: (date: Date) => void;
  /** Earliest selectable date (inclusive); earlier days are disabled. */
  minDate?: Date;
  /** Latest selectable date (inclusive); later days are disabled. */
  maxDate?: Date;
  /** BCP-47 locale; falls back to LocaleProvider, then 'en-US'. */
  locale?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

function ChevronLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="rtl:rotate-180"
    >
      <path
        d="M10 12L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="rtl:rotate-180"
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  locale: localeProp,
  className,
  ref,
}: CalendarProps) {
  const { locale: ctxLocale, dir } = useLocale();
  const locale = localeProp ?? ctxLocale;

  const [viewYear, setViewYear] = useState(() =>
    value ? value.getFullYear() : new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    value ? value.getMonth() : new Date().getMonth(),
  );

  const days = useMemo(
    () => getCalendarDays(viewYear, viewMonth, minDate, maxDate),
    [viewYear, viewMonth, minDate, maxDate],
  );

  const weekdays = useMemo(() => getWeekdayLabels(locale), [locale]);

  const monthLabel = useMemo(
    () => formatMonthLabel(viewYear, viewMonth, locale),
    [viewYear, viewMonth, locale],
  );

  const handlePrevMonth = useCallback(() => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const handleDayClick = useCallback(
    (day: CalendarDay) => {
      if (day.isDisabled) return;
      onChange?.(new Date(day.date));
    },
    [onChange],
  );

  const dayLabelFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [locale],
  );

  return (
    <div ref={ref} dir={dir} className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-12px">
        <button
          type="button"
          onClick={handlePrevMonth}
          aria-label="Previous month"
          className="w-[28px] h-[28px] flex items-center justify-center rounded-8px text-grey_4 hover:bg-black_3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple"
        >
          <ChevronLeft />
        </button>
        <span
          aria-live="polite"
          className="font-manrope text-14 font-semibold text-white_4"
        >
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          aria-label="Next month"
          className="w-[28px] h-[28px] flex items-center justify-center rounded-8px text-grey_4 hover:bg-black_3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-[2px] mb-4px" role="row">
        {weekdays.map((day) => (
          <div
            key={day}
            role="columnheader"
            className="text-10 text-grey_1 uppercase text-center font-manrope py-4px"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-[2px]">
        {days.map((day, index) => {
          const isSelected = value ? isSameDay(day.date, value) : false;
          const isTodayDay = isToday(day.date);

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={day.isDisabled}
              aria-disabled={day.isDisabled || undefined}
              aria-pressed={isSelected}
              aria-current={isTodayDay ? "date" : undefined}
              aria-label={dayLabelFmt.format(day.date)}
              className={classNames(
                "w-[36px] h-[36px] rounded-8px text-14 font-manrope flex items-center justify-center mx-auto transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple",
                {
                  "bg-pr_purple text-white": isSelected,
                  "text-pr_purple font-semibold": isTodayDay && !isSelected,
                  "text-grey_4 hover:bg-black_3 cursor-pointer":
                    day.isCurrentMonth && !isSelected && !day.isDisabled,
                  "text-grey_1": !day.isCurrentMonth && !isSelected,
                  "opacity-50 cursor-not-allowed": day.isDisabled,
                },
              )}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
