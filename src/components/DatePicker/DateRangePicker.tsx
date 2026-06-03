"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import { dropdownFadeSlideVariants as dropdownVariants } from "@/motion/overlayVariants";
import { useLocale } from "@/providers/LocaleContext";
import {
  getWeekdayLabels,
  formatDisplayDate,
  formatMonthLabel,
  getCalendarDays,
  isBetween,
  isSameDay,
  isToday,
  stripTime,
  type CalendarDay,
} from "./calendar";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  /** BCP-47 locale; falls back to LocaleProvider, then 'en-US'. */
  locale?: string;
  ref?: Ref<HTMLDivElement>;
}

const EMPTY_RANGE: DateRange = { from: null, to: null };

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M6.67 1.67V4.17M13.33 1.67V4.17M2.92 7.58H17.08M17.5 7.08V14.17C17.5 16.67 16.25 18.33 13.33 18.33H6.67C3.75 18.33 2.5 16.67 2.5 14.17V7.08C2.5 4.58 3.75 2.92 6.67 2.92H13.33C16.25 2.92 17.5 4.58 17.5 7.08Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

export default function DateRangePicker({
  value = EMPTY_RANGE,
  onChange,
  placeholder = "Select range",
  minDate,
  maxDate,
  disabled = false,
  error,
  label,
  className,
  locale: localeProp,
  ref,
}: DateRangePickerProps) {
  const { locale: ctxLocale, dir } = useLocale();
  const locale = localeProp ?? ctxLocale;
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() =>
    (value.from ?? new Date()).getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    (value.from ?? new Date()).getMonth(),
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<{
    top: number;
    left: number;
    minWidth: number;
    maxHeight: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  const ESTIMATED_POPOVER_HEIGHT = 360;

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const popHeight =
      popoverRef.current?.offsetHeight ?? ESTIMATED_POPOVER_HEIGHT;
    const margin = 8;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const flipUp = spaceBelow < popHeight + 12 && rect.top > spaceBelow;
    const maxHeight = Math.max(flipUp ? spaceAbove : spaceBelow, 200);
    const top = flipUp
      ? rect.top - Math.min(popHeight, spaceAbove) - 4
      : rect.bottom + 4;
    const availableWidth = window.innerWidth - 2 * margin;
    const popWidth = Math.min(
      Math.max(popoverRef.current?.offsetWidth ?? 0, Math.max(rect.width, 320)),
      availableWidth,
    );
    const left = Math.max(
      margin,
      Math.min(rect.left, window.innerWidth - popWidth - margin),
    );
    setPopoverStyle({ top, left, minWidth: popWidth, maxHeight });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [isOpen, updatePosition]);

  const days = useMemo(
    () => getCalendarDays(viewYear, viewMonth, minDate, maxDate),
    [viewYear, viewMonth, minDate, maxDate],
  );

  const weekdays = useMemo(() => getWeekdayLabels(locale), [locale]);

  const monthLabel = useMemo(
    () => formatMonthLabel(viewYear, viewMonth, locale),
    [viewYear, viewMonth, locale],
  );

  const handlePrev = useCallback(() => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const handleNext = useCallback(() => {
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
      const picked = stripTime(day.date);

      if (!value.from || (value.from && value.to)) {
        onChange?.({ from: picked, to: null });
        setHoverDate(null);
        return;
      }

      if (picked < value.from) {
        onChange?.({ from: picked, to: value.from });
      } else {
        onChange?.({ from: value.from, to: picked });
      }
      setHoverDate(null);
    },
    [value, onChange],
  );

  const handleToggle = useCallback(() => {
    if (!disabled) setIsOpen((prev) => !prev);
  }, [disabled]);

  const triggerText = useMemo(() => {
    if (value.from && value.to) {
      return `${formatDisplayDate(value.from, locale)} – ${formatDisplayDate(value.to, locale)}`;
    }
    if (value.from) {
      return `${formatDisplayDate(value.from, locale)} – …`;
    }
    return placeholder;
  }, [value, placeholder, locale]);

  const effectiveTo =
    value.to ??
    (value.from && hoverDate && hoverDate > value.from ? hoverDate : null);

  return (
    <div
      ref={ref}
      dir={dir}
      className={classNames("flex flex-col gap-6px", className)}
    >
      {label && (
        <label className="text-12 font-bold leading-18 text-white_4">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={classNames(
          "bg-black_1 border border-solid rounded-16px h-56px px-24px font-manrope text-14 w-full text-left flex items-center justify-between transition-colors duration-200",
          {
            "border-pr_purple": !error,
            "border-error": error,
            "cursor-pointer": !disabled,
            "cursor-not-allowed opacity-50": disabled,
          },
        )}
      >
        <span className={value.from ? "text-grey_4" : "text-grey_2"}>
          {triggerText}
        </span>
        <span className="text-grey_2">
          <CalendarIcon />
        </span>
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && popoverStyle && (
              <motion.div
                dir={dir}
                ref={popoverRef}
                initial="closed"
                animate="open"
                exit="closed"
                variants={dropdownVariants}
                transition={
                  reduceMotion ? { duration: 0 } : tokenTransition("fast")
                }
                style={{
                  position: "fixed",
                  top: popoverStyle.top,
                  left: popoverStyle.left,
                  minWidth: popoverStyle.minWidth,
                  maxHeight: popoverStyle.maxHeight,
                  overflowY: "auto",
                }}
                className="z-50 bg-black_2 border border-black_3 rounded-16px p-20px shadow-6xl"
                role="dialog"
                aria-label="Date range picker"
              >
            <div className="flex items-center justify-between mb-12px">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous month"
                className="w-7 h-7 flex items-center justify-center rounded-8px text-grey_4 hover:bg-black_3 transition-colors cursor-pointer"
              >
                <ChevronLeft />
              </button>
              <span className="font-manrope text-14 font-semibold text-white_4">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next month"
                className="w-7 h-7 flex items-center justify-center rounded-8px text-grey_4 hover:bg-black_3 transition-colors cursor-pointer"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-4px">
              {weekdays.map((d) => (
                <div
                  key={d}
                  className="text-10 text-grey_1 uppercase text-center font-manrope py-4px"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day, index) => {
                const isFrom = value.from
                  ? isSameDay(day.date, value.from)
                  : false;
                const isTo = value.to ? isSameDay(day.date, value.to) : false;
                const isEndpoint = isFrom || isTo;
                const isInRange =
                  value.from && effectiveTo
                    ? isBetween(day.date, value.from, effectiveTo)
                    : false;
                const todayFlag = isToday(day.date);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => {
                      if (value.from && !value.to) setHoverDate(day.date);
                    }}
                    disabled={day.isDisabled}
                    className={classNames(
                      "w-9 h-9 rounded-8px text-14 font-manrope flex items-center justify-center mx-auto transition-colors duration-100",
                      {
                        "bg-pr_purple text-white": isEndpoint,
                        "bg-pr_purple/20 text-white_4":
                          !isEndpoint && isInRange,
                        "text-pr_purple font-semibold":
                          todayFlag && !isEndpoint && !isInRange,
                        "text-grey_4 hover:bg-black_3 cursor-pointer":
                          day.isCurrentMonth &&
                          !isEndpoint &&
                          !isInRange &&
                          !day.isDisabled,
                        "text-grey_1":
                          !day.isCurrentMonth && !isEndpoint && !isInRange,
                        "opacity-50 cursor-not-allowed": day.isDisabled,
                      },
                    )}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>

            {value.from && (
              <div className="flex items-center justify-end gap-8px mt-12px pt-12px border-t border-black_3">
                <button
                  type="button"
                  onClick={() => {
                    onChange?.({ from: null, to: null });
                    setHoverDate(null);
                  }}
                  className="text-12 text-grey_4 hover:text-white_4 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {error && (
        <p className="px-24px pt-4px text-12 font-medium leading-16 text-error">
          {error}
        </p>
      )}
    </div>
  );
}
