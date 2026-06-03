'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { mergeRefs } from '@/utils/mergeRefs';
import type { ComboboxOption, ComboboxProps } from './types';

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

function defaultSearchable<V extends string>(options: Array<ComboboxOption<V>>) {
  return options.length > 7;
}

function filterOptions<V extends string>(
  options: Array<ComboboxOption<V>>,
  query: string,
): Array<ComboboxOption<V>> {
  if (!query) return options;
  const q = query.toLowerCase();
  return options.filter(
    (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
  );
}

function Combobox<V extends string = string>(props: ComboboxProps<V>) {
  const {
    options,
    placeholder = 'Select...',
    disabled = false,
    error,
    label,
    className,
    searchable,
    searchValue,
    onSearch,
    loading = false,
    emptyText = 'No options',
    maxHeight = 240,
    clearable,
    portal = true,
    portalContainer,
    renderOption,
    renderValue,
    ref,
    id,
    name,
  } = props;

  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;

  const [open, setOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const controlledSearch = onSearch !== undefined;
  const query = controlledSearch ? searchValue ?? '' : internalQuery;
  const showSearch = searchable ?? defaultSearchable(options);

  const selectedValues = useMemo<Array<V>>(() => {
    if (props.multiple) return props.value;
    const v = props.value;
    return v ? [v as V] : [];
  }, [props.multiple, props.value]);

  const selectedOptions = useMemo(
    () => selectedValues.map((v) => options.find((o) => o.value === v)).filter(Boolean) as Array<ComboboxOption<V>>,
    [selectedValues, options],
  );

  const visibleOptions = useMemo(
    () => (controlledSearch ? options : filterOptions(options, query)),
    [controlledSearch, options, query],
  );

  const hasValue = selectedValues.length > 0;
  const showClear = (clearable ?? hasValue) && hasValue && !disabled;

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setOpen(true);
    setActiveIndex(-1);
  }, [disabled, updatePosition]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    if (!controlledSearch) setInternalQuery('');
  }, [controlledSearch]);

  const toggleDropdown = useCallback(() => {
    if (open) closeDropdown();
    else openDropdown();
  }, [open, openDropdown, closeDropdown]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: Event) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      closeDropdown();
    };
    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, closeDropdown, updatePosition]);

  useEffect(() => {
    if (open && showSearch) searchInputRef.current?.focus();
  }, [open, showSearch]);

  const emitSingle = (next: V | null) => {
    if (!props.multiple) props.onChange(next);
  };

  const emitMulti = (next: Array<V>) => {
    if (props.multiple) props.onChange(next);
  };

  const handleSelect = useCallback(
    (option: ComboboxOption<V>) => {
      if (option.disabled || disabled) return;
      if (props.multiple) {
        const current = props.value;
        const next = current.includes(option.value)
          ? current.filter((v) => v !== option.value)
          : [...current, option.value];
        emitMulti(next);
      } else {
        const same = props.value === option.value;
        emitSingle(same ? null : option.value);
        closeDropdown();
      }
    },
    // emitMulti / emitSingle are stable thin wrappers around props.onChange —
    // they read from `props` directly, which is already in the dep list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props, disabled, closeDropdown],
  );

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    if (props.multiple) emitMulti([]);
    else emitSingle(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) openDropdown();
      setActiveIndex((i) => Math.min(i + 1, visibleOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!open) {
        e.preventDefault();
        openDropdown();
        return;
      }
      if (activeIndex >= 0 && activeIndex < visibleOptions.length) {
        e.preventDefault();
        handleSelect(visibleOptions[activeIndex]);
      }
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      closeDropdown();
      triggerRef.current?.focus();
    }
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, visibleOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < visibleOptions.length) {
        e.preventDefault();
        handleSelect(visibleOptions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
      triggerRef.current?.focus();
    }
  };

  const handleQueryChange = (next: string) => {
    if (controlledSearch) onSearch?.(next);
    else setInternalQuery(next);
    setActiveIndex(-1);
  };

  const triggerLabel = renderValue ? (
    renderValue(selectedOptions)
  ) : hasValue ? (
    props.multiple ? (
      <span className="truncate">
        {selectedOptions.length === 1
          ? selectedOptions[0].label
          : `${selectedOptions.length} selected`}
      </span>
    ) : (
      <span className="truncate">{selectedOptions[0]?.label}</span>
    )
  ) : (
    <span className="truncate text-fg-muted">{placeholder}</span>
  );

  const dropdown = open ? (
    <div
      ref={dropdownRef}
      id={listboxId}
      role="listbox"
      aria-multiselectable={props.multiple ? true : undefined}
      style={
        portal
          ? {
              position: 'fixed',
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 50,
            }
          : undefined
      }
      className={classNames(
        'bg-surface-overlay border border-border-default rounded-8px shadow-6xl overflow-hidden font-manrope',
        !portal && 'absolute left-0 right-0 top-full mt-4px z-50',
      )}
    >
      {showSearch && (
        <div className="p-8px border-b border-border-default">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            className="w-full bg-bg-primary text-fg-primary placeholder:text-fg-muted rounded-8px px-12px py-6px text-14 outline-none border border-transparent focus:border-pr_purple"
          />
        </div>
      )}
      <ul
        className="overflow-y-auto custom-scrollbar"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {loading && (
          <li className="px-12px py-8px text-14 text-fg-muted">Loading…</li>
        )}
        {!loading && visibleOptions.length === 0 && (
          <li className="px-12px py-8px text-14 text-fg-muted">{emptyText}</li>
        )}
        {!loading &&
          visibleOptions.map((option, index) => {
            const selected = selectedValues.includes(option.value);
            const active = index === activeIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
                aria-disabled={option.disabled || undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(option)}
                className={classNames(
                  'px-12px py-8px text-14 cursor-pointer flex items-center justify-between gap-8px',
                  {
                    'bg-bg-tertiary text-fg-primary': active && !option.disabled,
                    'text-fg-muted': !active && !option.disabled,
                    'text-fg-muted cursor-not-allowed': option.disabled,
                  },
                )}
              >
                {renderOption ? (
                  renderOption(option, { selected, active })
                ) : (
                  <>
                    <span className="truncate">{option.label}</span>
                    {selected && (
                      <span aria-hidden="true" className="text-pr_purple shrink-0">
                        ✓
                      </span>
                    )}
                  </>
                )}
              </li>
            );
          })}
      </ul>
    </div>
  ) : null;

  const portalNode = typeof document !== 'undefined' ? portalContainer ?? document.body : null;

  return (
    <div className={classNames('flex flex-col gap-6px relative', className)}>
      {label && (
        <label htmlFor={triggerId} className="text-12 font-bold leading-18 text-fg-primary">
          {label}
        </label>
      )}
      <button
        ref={mergeRefs(triggerRef, ref)}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-name={name}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={classNames(
          'w-full flex items-center justify-between bg-bg-primary border border-solid rounded-16px h-56px px-24px text-left font-manrope text-14 transition-colors gap-8px',
          {
            'border-border-strong': disabled,
            'border-pr_purple': !error && !disabled,
            'border-error': error,
            'cursor-pointer hover:border-sec_purple': !disabled,
            'cursor-not-allowed opacity-50': disabled,
          },
        )}
      >
        <span
          className={classNames('flex-1 min-w-0 flex items-center gap-8px', {
            'text-fg-primary': hasValue,
            'text-fg-muted': !hasValue,
          })}
        >
          {triggerLabel}
        </span>
        <span className="flex items-center gap-4px shrink-0">
          {showClear && (
            <span
              role="button"
              aria-label="Clear selection"
              tabIndex={-1}
              onClick={handleClear}
              className="text-fg-muted hover:text-fg-primary cursor-pointer w-16px h-16px flex items-center justify-center"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M9 3L3 9M3 3l6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={classNames('text-fg-muted transition-transform', {
              'rotate-180': open,
            })}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {error && (
        <p className="px-24px pt-4px text-12 font-medium leading-16 text-error">{error}</p>
      )}
      {portal && dropdown && portalNode ? createPortal(dropdown, portalNode) : dropdown}
    </div>
  );
}

export default Combobox;
