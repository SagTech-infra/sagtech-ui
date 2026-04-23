'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import useOutsideClick from '@/hooks/useOutsideClick';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

const positionClasses = {
  top: 'bottom-full mb-8px',
  bottom: 'top-full mt-8px',
  left: 'right-full mr-8px',
  right: 'left-full ml-8px',
} as const;

const alignClasses = {
  top: {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  },
  bottom: {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  },
  left: {
    start: 'top-0',
    center: 'top-1/2 -translate-y-1/2',
    end: 'bottom-0',
  },
  right: {
    start: 'top-0',
    center: 'top-1/2 -translate-y-1/2',
    end: 'bottom-0',
  },
} as const;

const motionVariants = {
  top: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
  bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 } },
} as const;

const arrowClasses = {
  top: 'bottom-[-5px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black_3',
  bottom:
    'top-[-5px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-black_3',
  left: 'right-[-5px] top-1/2 -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-black_3',
  right:
    'left-[-5px] top-1/2 -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-black_3',
} as const;

export default function Popover({
  trigger,
  children,
  position = 'bottom',
  align = 'center',
  className,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => setIsOpen(false), []);
  const ref = useOutsideClick<HTMLDivElement>(handleClose);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  return (
    <div ref={ref} className={classNames('relative inline-block', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {trigger}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={classNames(
              'absolute z-50',
              positionClasses[position],
              alignClasses[position][align],
            )}
            initial={motionVariants[position].initial}
            animate={motionVariants[position].animate}
            exit={motionVariants[position].initial}
            transition={{ duration: 0.15 }}
          >
            <div className="relative bg-black_2 border border-black_3 rounded-16px p-20px shadow-6xl min-w-[240px] max-w-[400px] w-max">
              {children}
              <span
                className={classNames('absolute w-0 h-0', arrowClasses[position])}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
