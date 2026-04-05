'use client';

import { useState, useCallback, useRef, type KeyboardEvent, type ChangeEvent } from 'react';
import classNames from 'classnames';

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function TagInput({
  value,
  onChange,
  placeholder = 'Add a tag...',
  maxTags,
  disabled = false,
  error,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMaxReached = maxTags !== undefined && value.length >= maxTags;

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      if (value.includes(trimmed)) return;
      if (isMaxReached) return;

      onChange([...value, trimmed]);
      setInputValue('');
    },
    [value, onChange, isMaxReached],
  );

  const removeTag = useCallback(
    (index: number) => {
      if (disabled) return;
      const next = value.filter((_, i) => i !== index);
      onChange(next);
    },
    [value, onChange, disabled],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
        removeTag(value.length - 1);
      }
    },
    [inputValue, addTag, removeTag, value.length],
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(',')) {
      const parts = val.split(',');
      parts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed) addTag(trimmed);
      });
    } else {
      setInputValue(val);
    }
  }, [addTag]);

  const handleContainerClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  return (
    <div className={className}>
      <div
        onClick={handleContainerClick}
        className={classNames(
          'bg-black_1 border rounded-16px min-h-[56px] px-16px py-8px flex flex-wrap items-center gap-8px font-manrope transition-colors',
          {
            'border-pr_purple': !error && !disabled,
            'ring-2 ring-pr_purple/30': isFocused && !error && !disabled,
            'border-error ring-2 ring-error/30': error && isFocused,
            'border-error': error && !isFocused,
            'opacity-50 cursor-not-allowed': disabled,
            'cursor-text': !disabled,
          },
        )}
      >
        {value.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-4px bg-pr_purple/20 text-pr_purple text-12 font-semibold px-8px py-4px rounded-circle"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="hover:text-white_4 cursor-pointer transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 3L3 9M3 3l6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </span>
        ))}

        {!isMaxReached && !disabled && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="bg-transparent outline-none text-14 text-white_4 placeholder:text-grey_2 flex-1 min-w-[80px]"
          />
        )}

        {isMaxReached && !disabled && (
          <span className="text-grey_2 text-12 font-manrope">
            Max {maxTags} tags
          </span>
        )}
      </div>

      {error && (
        <p className="text-error text-12 mt-4px font-manrope">{error}</p>
      )}
    </div>
  );
}
