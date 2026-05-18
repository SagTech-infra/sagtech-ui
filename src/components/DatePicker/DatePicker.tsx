"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import {
  WEEKDAYS,
  formatDisplayDate,
  formatMonthLabel,
  getCalendarDays,
  isSameDay,
  isToday,
  type CalendarDay,
} from "./calendar";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  showTime?: boolean;
  /** Granularity for the time picker. Defaults to 5. */
  timeStep?: number;
  ref?: Ref<HTMLDivElement>;
}

const dropdownVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -4 },
};

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M6.66667 1.66667V4.16667M13.3333 1.66667V4.16667M2.91667 7.575H17.0833M17.5 7.08333V14.1667C17.5 16.6667 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6667 2.5 14.1667V7.08333C2.5 4.58333 3.75 2.91667 6.66667 2.91667H13.3333C16.25 2.91667 17.5 4.58333 17.5 7.08333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0791 11.4167H13.0866M13.0791 13.9167H13.0866M9.99579 11.4167H10.0041M9.99579 13.9167H10.0041M6.91162 11.4167H6.91995M6.91162 13.9167H6.91995"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
  error,
  label,
  className,
  showTime = false,
  timeStep = 5,
  ref,
}: DatePickerProps) {
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);
  const [viewYear, setViewYear] = useState(() =>
    value ? value.getFullYear() : new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    value ? value.getMonth() : new Date().getMonth(),
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Custom outside-click: the popover lives in a Portal, so the standard
  // `contains()` check on the wrapping div would treat clicks inside the
  // calendar as "outside" and close it before the day handler fires. Allow
  // clicks inside either the trigger or the portalled popover.
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

  // Approx height of the calendar popover (header + grid + bottom padding).
  // Used as the initial guess; we re-measure once the popover renders.
  const ESTIMATED_POPOVER_HEIGHT = showTime ? 400 : 360;

  // Compute viewport-relative coordinates for the portalled popover so it
  // escapes any `overflow: hidden` ancestor (e.g. CardWrapper) yet still
  // anchors visually under (or above, on flip) the trigger button.
  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const popHeight =
      popoverRef.current?.offsetHeight ?? ESTIMATED_POPOVER_HEIGHT;
    const spaceBelow = window.innerHeight - rect.bottom;
    const flipUp = spaceBelow < popHeight + 12 && rect.top > spaceBelow;
    const top = flipUp ? rect.top - popHeight - 4 : rect.bottom + 4;
    setPopoverStyle({ top, left: rect.left, minWidth: rect.width });
  }, [ESTIMATED_POPOVER_HEIGHT]);

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

  const monthLabel = useMemo(
    () => formatMonthLabel(viewYear, viewMonth),
    [viewYear, viewMonth],
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
      const next = new Date(day.date);
      if (showTime && value) {
        next.setHours(value.getHours(), value.getMinutes(), 0, 0);
      }
      onChange?.(next);
      if (!showTime) setIsOpen(false);
    },
    [onChange, showTime, value],
  );

  const handleTimeChange = useCallback(
    (hours: number, minutes: number) => {
      if (!value) {
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        onChange?.(now);
        return;
      }
      const next = new Date(value);
      next.setHours(hours, minutes, 0, 0);
      onChange?.(next);
    },
    [onChange, value],
  );

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  return (
    <div className={classNames("flex flex-col gap-6px", className)} ref={ref}>
      {label && (
        <label className="text-12 font-bold leading-18 text-white_4">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={classNames(
            "bg-black_1 border border-solid rounded-16px h-[56px] px-24px font-manrope text-14 w-full text-left flex items-center justify-between transition-colors duration-200",
            {
              "border-pr_purple": !error,
              "border-error": error,
              "cursor-pointer": !disabled,
              "cursor-not-allowed opacity-50": disabled,
            },
          )}
        >
          <span className={value ? "text-grey_4" : "text-grey_2"}>
            {value
              ? showTime
                ? `${formatDisplayDate(value)} ${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
                : formatDisplayDate(value)
              : placeholder}
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
                    minWidth: Math.max(popoverStyle.minWidth, 320),
                  }}
                  className="z-50 bg-black_2 border border-black_3 rounded-16px p-20px shadow-6xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-12px">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-[28px] h-[28px] flex items-center justify-center rounded-8px text-grey_4 hover:bg-black_3 transition-colors cursor-pointer"
                    >
                      <ChevronLeft />
                    </button>
                    <span className="font-manrope text-14 font-semibold text-white_4">
                      {monthLabel}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-[28px] h-[28px] flex items-center justify-center rounded-8px text-grey_4 hover:bg-black_3 transition-colors cursor-pointer"
                    >
                      <ChevronRight />
                    </button>
                  </div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-[2px] mb-4px">
                    {WEEKDAYS.map((day) => (
                      <div
                        key={day}
                        className="text-10 text-grey_1 uppercase text-center font-manrope py-4px"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Day grid */}
                  <div className="grid grid-cols-7 gap-[2px]">
                    {days.map((day, index) => {
                      const isSelected = value
                        ? isSameDay(day.date, value)
                        : false;
                      const isTodayDay = isToday(day.date);

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDayClick(day)}
                          disabled={day.isDisabled}
                          className={classNames(
                            "w-[36px] h-[36px] rounded-8px text-14 font-manrope flex items-center justify-center mx-auto transition-colors duration-150",
                            {
                              "bg-pr_purple text-white": isSelected,
                              "text-pr_purple font-semibold":
                                isTodayDay && !isSelected,
                              "text-grey_4 hover:bg-black_3 cursor-pointer":
                                day.isCurrentMonth &&
                                !isSelected &&
                                !day.isDisabled,
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

                  {showTime && (
                    <div className="mt-12px pt-12px border-t border-solid border-black_3 flex items-center justify-between gap-12px">
                      <span className="font-manrope text-12 font-semibold text-grey_4">
                        Time
                      </span>
                      <div className="flex items-center gap-4px">
                        <select
                          aria-label="Hours"
                          className="bg-black_1 border border-solid border-black_3 rounded-8px text-white_4 text-14 font-manrope px-8px py-4px cursor-pointer"
                          value={value ? value.getHours() : 0}
                          onChange={(e) =>
                            handleTimeChange(
                              parseInt(e.target.value, 10),
                              value ? value.getMinutes() : 0,
                            )
                          }
                        >
                          {Array.from({ length: 24 }, (_, h) => (
                            <option key={h} value={h}>
                              {String(h).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span className="text-grey_4">:</span>
                        <select
                          aria-label="Minutes"
                          className="bg-black_1 border border-solid border-black_3 rounded-8px text-white_4 text-14 font-manrope px-8px py-4px cursor-pointer"
                          value={
                            value
                              ? value.getMinutes() -
                                (value.getMinutes() % timeStep)
                              : 0
                          }
                          onChange={(e) =>
                            handleTimeChange(
                              value ? value.getHours() : 0,
                              parseInt(e.target.value, 10),
                            )
                          }
                        >
                          {Array.from(
                            { length: Math.ceil(60 / timeStep) },
                            (_, i) => {
                              const m = i * timeStep;
                              return (
                                <option key={m} value={m}>
                                  {String(m).padStart(2, "0")}
                                </option>
                              );
                            },
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>,
            document.body,
          )}
      </div>
      {error && (
        <p className="px-24px pt-4px text-12 font-medium leading-16 text-error">
          {error}
        </p>
      )}
    </div>
  );
}
