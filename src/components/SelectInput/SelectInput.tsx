'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  memo,
  type PropsWithChildren,
} from 'react';
import useOutsideClick from '@/hooks/useOutsideClick';
import { AnimatePresence } from 'framer-motion';
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

type Props = {
  options: Array<SelectOption<string>>;
  placeholder: string;
  valueAsPlaceholder?: boolean;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
} & VariableValuePropType &
  PropsWithChildren;

function Select({
  options,
  value,
  placeholder,
  onChange,
  children,
  multiple,
  disabled = false,
  valueAsPlaceholder = false,
  className = '',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const reactId = useId();
  const listboxId = `${reactId}-listbox`;
  const triggerInputRef = useRef<HTMLInputElement>(null);

  const closeAndRestore = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    triggerInputRef.current?.focus();
  }, []);

  const outsideRef = useOutsideClick<HTMLDivElement>(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  });

  const handleSelect = useCallback(
    (newValue: string) => {
      if (disabled) return;
      onChange?.(newValue);
      if (!multiple) {
        closeAndRestore();
      }
    },
    [onChange, multiple, disabled, closeAndRestore],
  );

  const handleOpen = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (disabled) return;
      setIsOpen((prev) => !prev);
      setActiveIndex(0);
    },
    [disabled],
  );

  const selectedIndexForValue = useCallback(() => {
    if (multiple) {
      const first = (value as Array<string>)[0];
      if (!first) return 0;
      const idx = options.findIndex((o) => o.value === first);
      return idx === -1 ? 0 : idx;
    }
    const idx = options.findIndex((o) => o.value === value);
    return idx === -1 ? 0 : idx;
  }, [multiple, options, value]);

  const openWithActive = useCallback(
    (index: number) => {
      setIsOpen(true);
      setActiveIndex(Math.max(0, Math.min(index, options.length - 1)));
    },
    [options.length],
  );

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (!isOpen) {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openWithActive(selectedIndexForValue());
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          openWithActive(options.length - 1);
        }
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeAndRestore();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((i) => (i <= 0 ? options.length - 1 : i - 1));
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        setActiveIndex(0);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        setActiveIndex(options.length - 1);
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const opt = options[activeIndex];
        if (opt) handleSelect(opt.value);
        return;
      }
      if (event.key === 'Tab') {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    },
    [
      isOpen,
      disabled,
      options,
      activeIndex,
      handleSelect,
      closeAndRestore,
      openWithActive,
      selectedIndexForValue,
    ],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAndRestore();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeAndRestore]);

  const getIsActiveValue = (option: SelectOption<string>) =>
    Array.isArray(value) ? value.includes(option.value) : value === option.value;

  const unifiedValue = multiple ? (value as string[]).join(', ') : (value as string);

  return (
    <div
      className="relative flex flex-col"
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
    >
      <SelectFakeInput
        ref={triggerInputRef}
        isOpen={isOpen}
        onClick={handleOpen}
        onKeyDown={handleTriggerKeyDown}
        placeholder={placeholder}
        displayValue={valueAsPlaceholder ? placeholder : unifiedValue}
        className={className}
        listboxId={listboxId}
        disabled={disabled}
      />
      <AnimatePresence>
        {isOpen && !disabled && (
          <SelectDropdownLayout onClose={() => setIsOpen(false)}>
            <div ref={outsideRef}>
              <ul id={listboxId} role="listbox" className="flex flex-col px-16px">
                {children && <li className="list-none">{children}</li>}
                {options.map((option, index) => (
                  <SelectOptionItem
                    key={option.value}
                    option={option}
                    onSelect={handleSelect}
                    withChecbox={multiple}
                    isActive={getIsActiveValue(option)}
                    isHighlighted={index === activeIndex}
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

export default memo(Select) as (props: Props) => React.ReactElement;
