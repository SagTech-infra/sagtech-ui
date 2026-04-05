'use client';

import { useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import useOutsideClick from '@/hooks/useOutsideClick';

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
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const dropdownVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -4 },
};

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // Convert Sunday=0 to Monday-based (0=Mon, 6=Sun)
  return day === 0 ? 6 : day - 1;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate) {
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    if (date < min) return true;
  }
  if (maxDate) {
    const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    if (date > max) return true;
  }
  return false;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}

function getCalendarDays(year: number, month: number, minDate?: Date, maxDate?: Date): CalendarDay[] {
  const days: CalendarDay[] = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Previous month days
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

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({
      date,
      isCurrentMonth: true,
      isDisabled: isDateDisabled(date, minDate, maxDate),
    });
  }

  // Next month days to fill grid
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  error,
  label,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => (value ? value.getFullYear() : new Date().getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (value ? value.getMonth() : new Date().getMonth()));

  const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const days = useMemo(
    () => getCalendarDays(viewYear, viewMonth, minDate, maxDate),
    [viewYear, viewMonth, minDate, maxDate],
  );

  const monthLabel = useMemo(() => {
    const d = new Date(viewYear, viewMonth);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [viewYear, viewMonth]);

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
      onChange?.(day.date);
      setIsOpen(false);
    },
    [onChange],
  );

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  return (
    <div className={classNames('flex flex-col gap-6px', className)} ref={ref}>
      {label && (
        <label className="text-12 font-bold leading-18 text-white_4">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={classNames(
            'bg-black_1 border border-solid rounded-16px h-[56px] px-24px font-manrope text-14 w-full text-left flex items-center justify-between transition-colors duration-200',
            {
              'border-pr_purple': !error,
              'border-error': error,
              'cursor-pointer': !disabled,
              'cursor-not-allowed opacity-50': disabled,
            },
          )}
        >
          <span className={value ? 'text-grey_4' : 'text-grey_2'}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <span className="text-grey_2">
            <CalendarIcon />
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={dropdownVariants}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-4px bg-black_2 border border-black_3 rounded-16px p-20px shadow-6xl min-w-[320px]"
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
                  const isSelected = value ? isSameDay(day.date, value) : false;
                  const isTodayDay = isToday(day.date);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDayClick(day)}
                      disabled={day.isDisabled}
                      className={classNames(
                        'w-[36px] h-[36px] rounded-8px text-14 font-manrope flex items-center justify-center mx-auto transition-colors duration-150',
                        {
                          'bg-pr_purple text-white': isSelected,
                          'text-pr_purple font-semibold': isTodayDay && !isSelected,
                          'text-grey_4 hover:bg-black_3 cursor-pointer':
                            day.isCurrentMonth && !isSelected && !day.isDisabled,
                          'text-grey_1': !day.isCurrentMonth && !isSelected,
                          'opacity-50 cursor-not-allowed': day.isDisabled,
                        },
                      )}
                    >
                      {day.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="px-24px pt-4px text-12 font-medium leading-16 text-error">{error}</p>
      )}
    </div>
  );
}
