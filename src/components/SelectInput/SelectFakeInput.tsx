'use client';

import React from 'react';
import { motion } from 'framer-motion';

function ChevrondownIcon({ width = 24, height = 24 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white_4"
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
  displayValue: string | Array<string>;
  placeholder: string;
  isOpen: boolean;
  className?: string;
};

function SelectFakeInput({ onClick, displayValue, placeholder, isOpen, className = '' }: Props) {
  const hasSomeValue = typeof displayValue === 'string' ? !!displayValue : displayValue?.length;

  return (
    <div className="relative w-full">
      <input
        placeholder={hasSomeValue ? String(displayValue) : placeholder}
        className={`cursor-pointer bg-black_1 border-[1px] border-solid font-medium w-full leading-24 outline-none rounded-16px h-[56px] placeholder:text-grey_2 text-grey_4 border-pr_purple py-15px px-24px ${className}`}
        onFocus={(e) => e.currentTarget.blur()}
        onClick={onClick}
      />
      <motion.div
        initial={{ rotateX: 0 }}
        animate={{ rotateX: isOpen ? 180 : 0 }}
        transition={{ duration: 0.15 }}
        style={{ perspective: 1000 }}
        className="absolute right-[24px] top-[16px]"
      >
        <ChevrondownIcon width={24} height={24} />
      </motion.div>
    </div>
  );
}

export default SelectFakeInput;
