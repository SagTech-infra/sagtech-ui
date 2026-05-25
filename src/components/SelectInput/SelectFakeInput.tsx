'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

function ChevrondownIcon({ width = 24, height = 24 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-fg-primary"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  onClick: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  displayValue: string | Array<string>;
  placeholder: string;
  isOpen: boolean;
  className?: string;
  listboxId?: string;
  disabled?: boolean;
};

const SelectFakeInput = forwardRef<HTMLInputElement, Props>(
  ({ onClick, onKeyDown, displayValue, placeholder, isOpen, className = '', listboxId, disabled }, ref) => {
    const hasSomeValue = typeof displayValue === 'string' ? !!displayValue : displayValue?.length;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          readOnly
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          placeholder={hasSomeValue ? String(displayValue) : placeholder}
          className={`cursor-pointer bg-bg-secondary border-[1px] border-solid font-medium w-full leading-24 outline-none focus-visible:ring-2 focus-visible:ring-pr_purple rounded-16px h-[56px] placeholder:text-fg-muted text-fg-muted border-pr_purple py-15px px-24px disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          onClick={onClick}
          onKeyDown={onKeyDown}
        />
        <motion.div
          initial={{ rotateX: 0 }}
          animate={{ rotateX: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          style={{ perspective: 1000 }}
          className="absolute right-[24px] top-[16px] pointer-events-none"
        >
          <ChevrondownIcon width={24} height={24} />
        </motion.div>
      </div>
    );
  },
);

SelectFakeInput.displayName = 'SelectFakeInput';

export default SelectFakeInput;
