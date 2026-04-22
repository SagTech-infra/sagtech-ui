'use client';

import React, { useState, useId, PropsWithChildren, memo, useCallback } from 'react';
import useOutsideClick from '@/hooks/useOutsideClick';
import { AnimatePresence } from 'framer-motion';
import { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';
import type { SelectOption } from './types';
import SelectDropdownLayout from './SelectDropdownLayout';
import SelectOptionItem from './SelectOption';
import SelectFakeInput from './SelectFakeInput';

type VariableValuePropType =
  | {
      value: string;
      multiple?: false;
    }
  | {
      value: Array<string>;
      multiple?: true;
    };

type Props<T extends FieldValues> = {
  options: Array<SelectOption<string>>;
  placeholder: string;
  valueAsPlaceholder?: boolean;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  /**
   * @deprecated Use `onChange` instead. `onSelect` is kept for backwards
   * compatibility with earlier versions of the library and will be removed
   * in a future major release.
   */
  onSelect?: (value: string) => void;
  /**
   * @deprecated Passing `react-hook-form`'s `register` is now optional.
   * Prefer the controlled API via `value` + `onChange`. When both `register`
   * and `name` are provided the hidden native `<select>` is rendered so
   * existing RHF integrations keep working.
   */
  register?: UseFormRegister<T>;
  /**
   * @deprecated See `register`. Still accepted for backwards compatibility.
   */
  name?: FieldPath<T>;
} & VariableValuePropType &
  PropsWithChildren;

function Select<T extends FieldValues>({
  options,
  value,
  name,
  placeholder,
  register,
  onChange,
  onSelect,
  children,
  multiple,
  disabled = false,
  valueAsPlaceholder = false,
  className = '',
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const emitChange = useCallback(
    (next: string) => {
      if (onChange) onChange(next);
      if (onSelect && onSelect !== onChange) onSelect(next);
    },
    [onChange, onSelect],
  );

  const handleSelect = useCallback(
    (newValue: string) => {
      if (disabled) return;
      emitChange(newValue);
      if (!multiple) setIsOpen(false);
    },
    [emitChange, multiple, disabled],
  );

  const handleOpen = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (disabled) return;
      setIsOpen(true);
    },
    [disabled],
  );

  const getIsActiveValue = (option: SelectOption<string>) =>
    Array.isArray(value) ? value.includes(option.value) : value === option.value;

  const unifiedValue = multiple ? value.join(', ') : value;
  const hasRhf = Boolean(register && name);

  return (
    <div
      className="relative flex flex-col"
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
    >
      {hasRhf && (
        <select
          {...register!(name as FieldPath<T>)}
          id={id}
          name={name as string}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
        >
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      )}
      <SelectFakeInput
        isOpen={isOpen}
        onClick={handleOpen}
        placeholder={placeholder}
        displayValue={valueAsPlaceholder ? placeholder : unifiedValue}
        className={className}
      />
      <AnimatePresence>
        {isOpen && !disabled && (
          <SelectDropdownLayout onClose={() => setIsOpen(false)}>
            <div ref={ref}>
              <ul className="flex flex-col px-16px">
                {children && <li className="list-none">{children}</li>}
                {options.map((option, index) => (
                  <SelectOptionItem
                    key={index}
                    option={option}
                    onSelect={handleSelect}
                    withChecbox={multiple}
                    isActive={getIsActiveValue(option)}
                  />
                ))}
              </ul>
            </div>
          </SelectDropdownLayout>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(Select) as <T extends FieldValues>(props: Props<T>) => React.ReactElement;
