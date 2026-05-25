'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { useOverlayTransition, useSpringTransition } from '@/hooks/useMotion';
import {
  getOverlayDepth,
  registerOverlay,
  subscribeOverlayStack,
  unregisterOverlay,
} from '@/components/Modal/ModalStack';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';
export type SheetSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SheetProps {
  /** Whether the sheet is open. */
  open: boolean;
  /** Called when the user requests to close the sheet (Esc, backdrop, close button). */
  onOpenChange: (open: boolean) => void;
  /** Side of the viewport the sheet anchors to. */
  side?: SheetSide;
  /** Size variant — controls width (left/right) or height (top/bottom). */
  size?: SheetSize;
  /** Optional title rendered in the header. */
  title?: ReactNode;
  /** Optional footer slot rendered under the body. */
  footer?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /** When false, hides the backdrop (click-outside still works). Default true. */
  showBackdrop?: boolean;
  /** Additional class for the sheet panel. */
  className?: string;
  'aria-label'?: string;
}

const Z_STEP = 10;

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

const sizeClassMap: Record<SheetSide, Record<SheetSize, string>> = {
  left: {
    sm: 'w-[280px]',
    md: 'w-[400px]',
    lg: 'w-[520px]',
    xl: 'w-[680px]',
  },
  right: {
    sm: 'w-[280px]',
    md: 'w-[400px]',
    lg: 'w-[520px]',
    xl: 'w-[680px]',
  },
  top: {
    sm: 'h-[200px]',
    md: 'h-[320px]',
    lg: 'h-[440px]',
    xl: 'h-[560px]',
  },
  bottom: {
    sm: 'h-[200px]',
    md: 'h-[320px]',
    lg: 'h-[440px]',
    xl: 'h-[560px]',
  },
};

function sideToVariants(side: SheetSide) {
  switch (side) {
    case 'left':
      return { hidden: { x: '-100%' }, visible: { x: 0 }, exit: { x: '-100%' } };
    case 'right':
      return { hidden: { x: '100%' }, visible: { x: 0 }, exit: { x: '100%' } };
    case 'top':
      return { hidden: { y: '-100%' }, visible: { y: 0 }, exit: { y: '-100%' } };
    case 'bottom':
      return { hidden: { y: '100%' }, visible: { y: 0 }, exit: { y: '100%' } };
  }
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(function Sheet(
  {
    open,
    onOpenChange,
    side = 'right',
    size = 'md',
    title,
    footer,
    children,
    showBackdrop = true,
    className,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const backdropTransition = useOverlayTransition('normal');
  const springTransition = useSpringTransition();
  const idRef = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [, forceRender] = useState(0);
  const titleId = useId();

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    idRef.current = registerOverlay(close);
    const unsubscribe = subscribeOverlayStack(() => forceRender((v) => v + 1));

    const frame = requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusable ?? dialog).focus();
    });

    return () => {
      if (idRef.current !== null) {
        unregisterOverlay(idRef.current);
        idRef.current = null;
      }
      unsubscribe();
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus?.();
    };
  }, [open, close]);

  if (typeof document === 'undefined') return null;

  const depth = idRef.current !== null ? getOverlayDepth(idRef.current) : 0;
  // base z-index from CSS var resolved through computed; we approximate using numeric scale
  const Z_DRAWER = 4001;
  const Z_DRAWER_BACKDROP = 4000;
  const sheetZ = Z_DRAWER + depth * Z_STEP;
  const backdropZ = Z_DRAWER_BACKDROP + depth * Z_STEP;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
    if (focusables.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const variants = sideToVariants(side);
  const isHorizontalEdge = side === 'left' || side === 'right';

  const setRefs = (node: HTMLDivElement | null) => {
    dialogRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {showBackdrop && (
            <motion.div
              className="fixed inset-0 bg-backdrop"
              style={{ zIndex: backdropZ }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={backdropTransition}
              onClick={close}
              aria-hidden="true"
            />
          )}

          <motion.aside
            ref={setRefs}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : ariaLabel}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className={classNames(
              'fixed bg-black_1 flex flex-col outline-none',
              {
                'top-0 right-0 h-full border-l border-black_3': side === 'right',
                'top-0 left-0 h-full border-r border-black_3': side === 'left',
                'top-0 left-0 right-0 w-full border-b border-black_3': side === 'top',
                'bottom-0 left-0 right-0 w-full border-t border-black_3': side === 'bottom',
              },
              isHorizontalEdge ? sizeClassMap[side][size] : sizeClassMap[side][size],
              className,
            )}
            style={{ zIndex: sheetZ }}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={springTransition}
          >
            <div className="flex items-center justify-between p-24px border-b border-black_3 flex-shrink-0">
              {title ? (
                <h2
                  id={titleId}
                  className="font-manrope text-18 font-semibold text-white_4"
                >
                  {title}
                </h2>
              ) : (
                <span aria-hidden="true" />
              )}
              <button
                type="button"
                onClick={close}
                className="text-grey_4 hover:text-white_4 cursor-pointer transition-colors duration-200 ml-auto"
                aria-label="Close sheet"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-24px custom-scrollbar min-h-0">
              {children}
            </div>

            {footer && (
              <div className="flex items-center justify-end gap-12px p-24px border-t border-black_3 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
});

export default Sheet;
