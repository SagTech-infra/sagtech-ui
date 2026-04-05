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
  onSelect: (value: string) => void;
  register: UseFormRegister<T>;
  name: FieldPath<T>;
  placeholder: string;
  valueAsPlaceholder?: boolean;
  className?: string;
} & VariableValuePropType &
  PropsWithChildren;

function Select<T extends FieldValues>({
  options,
  value,
  name,
  placeholder,
  register,
  onSelect,
  children,
  multiple,
  valueAsPlaceholder = false,
  className = '',
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const handleSelect = useCallback(
    (newValue: string) => {
      onSelect(newValue);
      if (!multiple) setIsOpen(false);
    },
    [onSelect, multiple],
  );

  const handleOpen = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  }, []);

  const getIsActiveValue = (option: SelectOption<string>) =>
    Array.isArray(value) ? value.includes(option.value) : value === option.value;

  const unifiedValue = multiple ? value.join(', ') : value;

  return (
    <div className="relative flex flex-col">
      <select {...register(name)} id={id} name={name} multiple={multiple} className="hidden">
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <SelectFakeInput
        isOpen={isOpen}
        onClick={handleOpen}
        placeholder={placeholder}
        displayValue={valueAsPlaceholder ? placeholder : unifiedValue}
        className={className}
      />
      <AnimatePresence>
        {isOpen && (
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
