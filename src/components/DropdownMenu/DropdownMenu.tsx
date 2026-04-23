'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

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

const TYPEAHEAD_RESET_MS = 800;

export default function DropdownMenu({
  trigger,
  items,
  align = 'left',
  width = '220px',
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const typeaheadBufferRef = useRef('');
  const typeaheadTimerRef = useRef<number | null>(null);

  const selectableIndices = useMemo(
    () =>
      items
        .map((item, idx) => (!item.divider && !item.disabled ? idx : -1))
        .filter((i) => i !== -1),
    [items],
  );

  const firstSelectable = selectableIndices[0] ?? -1;
  const lastSelectable = selectableIndices[selectableIndices.length - 1] ?? -1;

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      setIsOpen(false);
      setActiveIndex(-1);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  const computePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = parseInt(width, 10) || 220;
    const vw = window.innerWidth;

    let left: number;
    if (align === 'right') {
      left = rect.right - menuWidth;
    } else {
      left = rect.left;
    }

    if (left + menuWidth > vw - 8) left = rect.right - menuWidth;
    if (left < 8) left = 8;

    setPos({ top: rect.bottom + 8, left });
  }, [align, width]);

  const openWithFocus = useCallback(
    (targetIndex: number) => {
      computePosition();
      setIsOpen(true);
      setActiveIndex(targetIndex);
    },
    [computePosition],
  );

  const handleToggle = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    openWithFocus(firstSelectable);
  }, [isOpen, firstSelectable, openWithFocus]);

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openWithFocus(firstSelectable);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        openWithFocus(lastSelectable);
      }
    },
    [firstSelectable, lastSelectable, openWithFocus],
  );

  const moveActive = useCallback(
    (direction: 1 | -1) => {
      if (selectableIndices.length === 0) return;
      setActiveIndex((current) => {
        const currentPos = selectableIndices.indexOf(current);
        if (currentPos === -1) {
          return direction === 1 ? firstSelectable : lastSelectable;
        }
        const nextPos =
          (currentPos + direction + selectableIndices.length) % selectableIndices.length;
        return selectableIndices[nextPos];
      });
    },
    [selectableIndices, firstSelectable, lastSelectable],
  );

  const handleTypeAhead = useCallback(
    (ch: string) => {
      typeaheadBufferRef.current += ch.toLowerCase();
      if (typeaheadTimerRef.current !== null) {
        window.clearTimeout(typeaheadTimerRef.current);
      }
      typeaheadTimerRef.current = window.setTimeout(() => {
        typeaheadBufferRef.current = '';
      }, TYPEAHEAD_RESET_MS);

      const buffer = typeaheadBufferRef.current;
      const match = selectableIndices.find((idx) =>
        items[idx].label.toLowerCase().startsWith(buffer),
      );
      if (match !== undefined) {
        setActiveIndex(match);
      }
    },
    [items, selectableIndices],
  );

  const handleMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActive(1);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActive(-1);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        setActiveIndex(firstSelectable);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        setActiveIndex(lastSelectable);
        return;
      }
      if (event.key === 'Tab') {
        setIsOpen(false);
        setActiveIndex(-1);
        return;
      }
      if (event.key.length === 1 && event.key.match(/\S/)) {
        handleTypeAhead(event.key);
      }
    },
    [moveActive, firstSelectable, lastSelectable, handleTypeAhead, handleClose],
  );

  const handleItemClick = useCallback(
    (item: MenuItem) => {
      if (item.disabled || item.divider) return;
      item.onClick?.();
      handleClose();
    },
    [handleClose],
  );

  return (
    <div className={classNames('relative inline-flex', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        onKeyDown={handleTriggerKeyDown}
        className="cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </button>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={dropdownRef}
              role="menu"
              tabIndex={-1}
              onKeyDown={handleMenuKeyDown}
              className="fixed border border-black_3 rounded-16px py-8px shadow-6xl overflow-hidden outline-none"
              style={{
                top: pos.top,
                left: pos.left,
                width,
                zIndex: 9999,
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
                    <div key={`divider-${index}`} className="my-4px mx-12px" aria-hidden="true">
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

                const isActive = index === activeIndex;
                return (
                  <button
                    key={`item-${index}`}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    onMouseEnter={() => {
                      if (!item.disabled) setActiveIndex(index);
                    }}
                    disabled={item.disabled}
                    className={classNames(
                      'w-full px-16px py-10px flex items-center gap-15px transition-all duration-150 font-manrope text-14 outline-none',
                      {
                        'text-error hover:bg-error/10 hover:pl-20px focus:bg-error/10':
                          item.danger && !item.disabled,
                        'text-grey_4 hover:bg-pr_purple/8 hover:text-white_4 hover:pl-20px focus:bg-pr_purple/8 focus:text-white_4':
                          !item.danger && !item.disabled,
                        'text-grey_1 opacity-40 cursor-not-allowed': item.disabled,
                        'cursor-pointer': !item.disabled,
                        'bg-pr_purple/8 text-white_4':
                          isActive && !item.danger && !item.disabled,
                        'bg-error/10': isActive && item.danger && !item.disabled,
                      },
                    )}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-[18px] h-[18px] [&>svg]:w-full [&>svg]:h-full">
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
