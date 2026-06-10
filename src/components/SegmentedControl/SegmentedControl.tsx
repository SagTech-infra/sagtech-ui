'use client';

import { forwardRef, useCallback, useId, useRef } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

export type SegmentedSize = 'sm' | 'md' | 'lg';

export interface SegmentedOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (next: string) => void;
  size?: SegmentedSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

const sizeClasses: Record<SegmentedSize, string> = {
  sm: 'text-12 h-[28px] px-12px',
  md: 'text-14 h-[36px] px-16px',
  lg: 'text-16 h-[44px] px-20px',
};

const containerPadding: Record<SegmentedSize, string> = {
  sm: 'p-[2px]',
  md: 'p-[3px]',
  lg: 'p-[4px]',
};

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      options,
      value,
      onChange,
      size = 'md',
      fullWidth = false,
      disabled = false,
      className,
      'aria-label': ariaLabel,
    },
    ref,
  ) {
    const groupId = useId();
    const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

    const focusEnabledByOffset = useCallback(
      (fromIndex: number, direction: 1 | -1) => {
        const total = options.length;
        for (let step = 1; step <= total; step++) {
          const next = (fromIndex + direction * step + total) % total;
          if (!options[next]?.disabled) {
            buttonsRef.current[next]?.focus();
            onChange(options[next].value);
            return;
          }
        }
      },
      [onChange, options],
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const currentIndex = options.findIndex((o) => o.value === value);
      const target = currentIndex >= 0 ? currentIndex : 0;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        focusEnabledByOffset(target, 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        focusEnabledByOffset(target, -1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        const firstEnabled = options.findIndex((o) => !o.disabled);
        if (firstEnabled >= 0) {
          buttonsRef.current[firstEnabled]?.focus();
          onChange(options[firstEnabled].value);
        }
      } else if (event.key === 'End') {
        event.preventDefault();
        for (let i = options.length - 1; i >= 0; i--) {
          if (!options[i].disabled) {
            buttonsRef.current[i]?.focus();
            onChange(options[i].value);
            return;
          }
        }
      }
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        className={classNames(
          'inline-flex items-center rounded-circle bg-black_2 border border-black_3 font-manrope select-none',
          containerPadding[size],
          fullWidth && 'flex w-full',
          disabled && 'opacity-60 cursor-not-allowed',
          className,
        )}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isDisabled = disabled || option.disabled;
          return (
            <button
              key={option.value}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
              disabled={isDisabled}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !isDisabled && onChange(option.value)}
              className={classNames(
                'relative inline-flex items-center justify-center gap-6px rounded-circle transition-colors duration-150 cursor-pointer outline-none',
                'focus-visible:ring-2 focus-visible:ring-pr_purple',
                sizeClasses[size],
                fullWidth && 'flex-1',
                isDisabled && 'opacity-50 cursor-not-allowed',
                isSelected ? 'text-white' : 'text-fg-muted hover:text-fg-primary',
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId={`segmented-indicator-${groupId}`}
                  className="absolute inset-0 rounded-circle bg-pr_purple"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.32 }}
                  aria-hidden="true"
                />
              )}
              {option.icon && (
                <span className="relative z-10 flex items-center">{option.icon}</span>
              )}
              <span className="relative z-10 whitespace-nowrap">{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  },
);

export default SegmentedControl;
