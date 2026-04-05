'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  width?: string;
  title?: string;
  children: React.ReactNode;
  showOverlay?: boolean;
  className?: string;
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M15 5L5 15M5 5L15 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Drawer({
  isOpen,
  onClose,
  position = 'right',
  width,
  title,
  children,
  showOverlay = true,
  className,
}: DrawerProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  const slideVariants = {
    hidden: { x: position === 'right' ? '100%' : '-100%' },
    visible: { x: 0 },
    exit: { x: position === 'right' ? '100%' : '-100%' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showOverlay && (
            <motion.div
              className="fixed inset-0 z-[100] bg-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
          )}

          <motion.aside
            className={classNames(
              'fixed top-0 z-[200] h-full bg-black_1 flex flex-col',
              {
                'right-0 border-l border-black_3': position === 'right',
                'left-0 border-r border-black_3': position === 'left',
              },
              width ? undefined : 'w-[400px]',
              className,
            )}
            style={width ? { width } : undefined}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-24px border-b border-black_3">
              {title && (
                <h2 className="font-manrope text-18 font-semibold text-white_4">{title}</h2>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-grey_4 hover:text-white_4 cursor-pointer transition-colors duration-200 ml-auto"
                aria-label="Close drawer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-24px custom-scrollbar">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
