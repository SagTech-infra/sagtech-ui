'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import useOutsideClick from '@/hooks/useOutsideClick';

export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right';
  width?: string;
  className?: string;
}

export default function DropdownMenu({
  trigger,
  items,
  align = 'left',
  width = '220px',
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => setIsOpen(false), []);
  const ref = useOutsideClick<HTMLDivElement>(handleClose);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleItemClick = useCallback((item: MenuItem) => {
    if (item.disabled || item.divider) return;
    item.onClick?.();
    setIsOpen(false);
  }, []);

  return (
    <div ref={ref} className={classNames('relative', className)} style={{ width }}>
      <button
        type="button"
        onClick={handleToggle}
        className="cursor-pointer w-full"
      >
        {trigger}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={classNames(
              'absolute z-50 mt-8px border border-black_3 rounded-16px py-8px shadow-6xl overflow-hidden',
              align === 'left' ? 'left-0' : 'right-0',
            )}
            style={{
              width,
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
            }}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div key={`divider-${index}`} className="my-4px mx-12px">
                    <div
                      style={{
                        height: '1px',
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(109,62,241,0.3) 50%, transparent 100%)',
                      }}
                    />
                  </div>
                );
              }

              return (
                <button
                  key={`item-${index}`}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={classNames(
                    'w-full px-16px py-10px flex items-center gap-10px transition-all duration-150 font-manrope text-14',
                    {
                      'text-error hover:bg-error/10 hover:pl-20px': item.danger && !item.disabled,
                      'text-grey_4 hover:bg-pr_purple/8 hover:text-white_4 hover:pl-20px':
                        !item.danger && !item.disabled,
                      'text-grey_1 opacity-40 cursor-not-allowed': item.disabled,
                      'cursor-pointer': !item.disabled,
                    },
                  )}
                >
                  {item.icon && (
                    <span className="flex-shrink-0 w-[18px] h-[18px]">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
