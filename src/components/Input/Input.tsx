import React, { type InputHTMLAttributes, type DetailedHTMLProps, useMemo } from 'react';
import classNames from 'classnames';
import inputConsts from './input.const';

interface InputTypes
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  state?: 'default' | 'active';
  disabled?: boolean;
  isError?: boolean;
  errorMessage?: string;
  label?: string;
  classes?: string;
  inputClasses?: string;
  externalLabel?: string;
}

export default function Input({
  state = 'default',
  value,
  label,
  errorMessage,
  classes,
  disabled,
  isError,
  inputClasses,
  externalLabel,
  ...rest
}: InputTypes) {
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
      {externalLabel && (
        <label htmlFor={rest.name} className="text-12 font-bold leading-18 text-white_1">
          {externalLabel}
        </label>
      )}
      <div className={`${spanDefault} ${classes}`}>
        {state === 'active' && !isError && (
          <span className="absolute left-24px top-8px text-10 font-medium leading-16 text-grey_2 ">
            {label}
          </span>
        )}
        <input
          id={rest.name}
          value={value}
          className={`${inputStyles} ${inputClasses}`}
          disabled={disabled}
          {...rest}
        />
      </div>
      {isError && (
        <p className="px-24px pt-4px text-12 font-medium leading-16 text-error">{errorMessage}</p>
      )}
    </div>
  );
}
