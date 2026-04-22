'use client';

import { useCallback, useMemo, useState, type Ref } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import useOutsideClick from '@/hooks/useOutsideClick';
import { mergeRefs } from '@/utils/mergeRefs';
import {
  WEEKDAYS,
  formatDisplayDate,
  formatMonthLabel,
  getCalendarDays,
  isBetween,
  isSameDay,
  isToday,
  stripTime,
  type CalendarDay,
} from './calendar';

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
  ref?: Ref<HTMLDivElement>;
}

const EMPTY_RANGE: DateRange = { from: null, to: null };

const dropdownVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -4 },
};

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
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
  placeholder = 'Select range',
  minDate,
  maxDate,
  disabled = false,
  error,
  label,
  className,
  ref,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() =>
    (value.from ?? new Date()).getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    (value.from ?? new Date()).getMonth(),
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const outsideRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const days = useMemo(
    () => getCalendarDays(viewYear, viewMonth, minDate, maxDate),
    [viewYear, viewMonth, minDate, maxDate],
  );

  const monthLabel = useMemo(
    () => formatMonthLabel(viewYear, viewMonth),
    [viewYear, viewMonth],
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
      return `${formatDisplayDate(value.from)} – ${formatDisplayDate(value.to)}`;
    }
    if (value.from) {
      return `${formatDisplayDate(value.from)} – …`;
    }
    return placeholder;
  }, [value, placeholder]);

  const effectiveTo = value.to ?? (value.from && hoverDate && hoverDate > value.from ? hoverDate : null);

  return (
    <div ref={mergeRefs(outsideRef, ref)} className={classNames('flex flex-col gap-6px relative', className)}>
      {label && <label className="text-12 font-bold leading-18 text-white_4">{label}</label>}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
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
        <span className={value.from ? 'text-grey_4' : 'text-grey_2'}>{triggerText}</span>
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
            className="absolute z-50 mt-4px top-full bg-black_2 border border-black_3 rounded-16px p-20px shadow-6xl min-w-[320px]"
            role="dialog"
            aria-label="Date range picker"
          >
            <div className="flex items-center justify-between mb-12px">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous month"
                className="w-[28px] h-[28px] flex items-center justify-center rounded-8px text-grey_4 hover:bg-black_3 transition-colors cursor-pointer"
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
                className="w-[28px] h-[28px] flex items-center justify-center rounded-8px text-grey_4 hover:bg-black_3 transition-colors cursor-pointer"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-[2px] mb-4px">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-10 text-grey_1 uppercase text-center font-manrope py-4px"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-[2px]">
              {days.map((day, index) => {
                const isFrom = value.from ? isSameDay(day.date, value.from) : false;
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
                      'w-[36px] h-[36px] rounded-8px text-14 font-manrope flex items-center justify-center mx-auto transition-colors duration-100',
                      {
                        'bg-pr_purple text-white': isEndpoint,
                        'bg-pr_purple/20 text-white_4': !isEndpoint && isInRange,
                        'text-pr_purple font-semibold':
                          todayFlag && !isEndpoint && !isInRange,
                        'text-grey_4 hover:bg-black_3 cursor-pointer':
                          day.isCurrentMonth && !isEndpoint && !isInRange && !day.isDisabled,
                        'text-grey_1': !day.isCurrentMonth && !isEndpoint && !isInRange,
                        'opacity-50 cursor-not-allowed': day.isDisabled,
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
      </AnimatePresence>

      {error && (
        <p className="px-24px pt-4px text-12 font-medium leading-16 text-error">{error}</p>
      )}
    </div>
  );
}
