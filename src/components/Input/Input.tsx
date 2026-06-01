'use client';

import React, { type InputHTMLAttributes, type DetailedHTMLProps, useId, useMemo } from 'react';
import classNames from 'classnames';
import inputConsts from './input.const';

interface InputTypes
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  state?: 'default' | 'active';
  disabled?: boolean;
  isError?: boolean;
  errorMessage?: string;
  /** Floating label shown inside the field when state === 'active'. */
  floatingLabel?: string;
  classes?: string;
  inputClasses?: string;
  /** Static label rendered above the field, associated via htmlFor. */
  label?: string;
}

export default function Input({
  state = 'default',
  value,
  floatingLabel,
  errorMessage,
  classes,
  disabled,
  isError,
  inputClasses,
  label,
  id,
  ...rest
}: InputTypes) {
  const reactId = useId();
  const inputId = id ?? rest.name ?? reactId;
  const errorId = `${inputId}-error`;

  const inputStyles = useMemo(
    () =>
      classNames({
        [inputConsts.basicStyles]: true,
        [inputConsts.disabledInput]: true,
        [inputConsts.defaultBorder]: state === 'default' && !isError,
        [inputConsts.defaultStyles]: state === 'default' && !isError,
        [inputConsts.activeInput]: state === 'active' && !isError,
        [inputConsts.errorInput]: isError,
      }),
    [isError, state],
  );

  const spanDefault = 'relative flex flex-col';
  return (
    <div className="flex flex-col gap-6px">
      {label && (
        <label htmlFor={inputId} className="text-12 font-bold leading-18 text-fg-secondary">
          {label}
        </label>
      )}
      <div className={`${spanDefault} ${classes}`}>
        {state === 'active' && !isError && (
          <span className="absolute start-24px top-8px text-10 font-medium leading-16 text-fg-muted ">
            {floatingLabel}
          </span>
        )}
        <input
          id={inputId}
          value={value}
          className={`${inputStyles} ${inputClasses}`}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={isError && errorMessage ? errorId : undefined}
          {...rest}
        />
      </div>
      {isError && (
        <p id={errorId} className="px-24px pt-4px text-12 font-medium leading-16 text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
