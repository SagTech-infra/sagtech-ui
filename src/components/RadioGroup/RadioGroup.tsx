'use client';

import { useId } from 'react';
import classNames from 'classnames';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md';
  error?: string;
  className?: string;
}

const circleSizeMap = {
  sm: 'w-[16px] h-[16px]',
  md: 'w-[20px] h-[20px]',
} as const;

const innerSizeMap = {
  sm: 'w-[6px] h-[6px]',
  md: 'w-[8px] h-[8px]',
} as const;

const labelSizeMap = {
  sm: 'text-12',
  md: 'text-14',
} as const;

export default function RadioGroup({
  options,
  value,
  onChange,
  name,
  orientation = 'vertical',
  size = 'md',
  error,
  className,
}: RadioGroupProps) {
  const groupId = useId();

  return (
    <div className={className}>
      <div
        role="radiogroup"
        className={classNames({
          'flex flex-col gap-12px': orientation === 'vertical',
          'flex flex-row gap-24px': orientation === 'horizontal',
        })}
      >
        {options.map((option) => {
          const inputId = `${groupId}-${option.value}`;
          const isSelected = value === option.value;
          const isDisabled = option.disabled ?? false;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={classNames('flex items-start gap-8px', {
                'cursor-pointer': !isDisabled,
                'opacity-50 cursor-not-allowed': isDisabled,
              })}
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => {
                  if (!isDisabled && onChange) {
                    onChange(option.value);
                  }
                }}
                className="hidden"
              />
              <div
                className={classNames(
                  'flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors duration-200 mt-[2px]',
                  circleSizeMap[size],
                  {
                    'border-pr_purple': isSelected,
                    'border-grey_2': !isSelected && !isDisabled,
                    'hover:border-white_4': !isSelected && !isDisabled,
                  },
                )}
              >
                <div
                  className={classNames(
                    'rounded-full bg-pr_purple transition-transform duration-200',
                    innerSizeMap[size],
                    {
                      'scale-100': isSelected,
                      'scale-0': !isSelected,
                    },
                  )}
                />
              </div>
              <div className="flex flex-col">
                <span className={classNames('font-manrope text-white_4', labelSizeMap[size])}>
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-12 text-grey_2 mt-2px">{option.description}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
      {error && <p className="text-error text-12 mt-8px">{error}</p>}
    </div>
  );
}
