'use client';

import { useId } from 'react';
import classNames from 'classnames';

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: string;
}

const trackSizeMap = {
  sm: 'w-[36px] h-[20px]',
  md: 'w-[44px] h-[24px]',
} as const;

const thumbSizeMap = {
  sm: 'w-[16px] h-[16px]',
  md: 'w-[20px] h-[20px]',
} as const;

const thumbTranslateMap = {
  sm: 'translate-x-[18px]',
  md: 'translate-x-[22px]',
} as const;

export default function Toggle({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
}: ToggleProps) {
  const id = useId();

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <label
      htmlFor={id}
      className={classNames('inline-flex items-center gap-8px', {
        'cursor-pointer': !disabled,
        'cursor-not-allowed opacity-50': disabled,
      })}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={classNames(
          'relative rounded-circle transition-colors duration-200 flex-shrink-0',
          trackSizeMap[size],
          {
            'bg-pr_purple': checked,
            'bg-grey_2': !checked,
          },
        )}
      >
        <span
          className={classNames(
            'absolute top-[2px] left-[2px] bg-white rounded-[50%] transition-transform duration-200',
            thumbSizeMap[size],
            {
              [thumbTranslateMap[size]]: checked,
              'translate-x-0': !checked,
            },
          )}
        />
      </button>
      {label && <span className="font-manrope text-14 text-grey_4">{label}</span>}
    </label>
  );
}
