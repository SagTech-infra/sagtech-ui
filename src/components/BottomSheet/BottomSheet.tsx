"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import classNames from "classnames";
import {
  registerOverlay,
  unregisterOverlay,
} from "@/components/Modal/ModalStack";

export interface BottomSheetProps {
  /** Whether the sheet is open. */
  open: boolean;
  /** Called when the user requests to close. */
  onOpenChange: (open: boolean) => void;
  /**
   * Heights as fractions of viewport height (0..1). The list MUST contain at
   * least one entry. The lowest entry is the closed dismissal threshold.
   * Default: [1].
   */
  snapPoints?: number[];
  /** Index into snapPoints to start at. Defaults to last (most expanded). */
  defaultSnap?: number;
  /** Optional title rendered in the drag header. */
  title?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /** Show backdrop behind the sheet. Default true. */
  showBackdrop?: boolean;
  className?: string;
  "aria-label"?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function BottomSheet({
  open,
  onOpenChange,
  snapPoints = [1],
  defaultSnap,
  title,
  children,
  showBackdrop = true,
  className,
  "aria-label": ariaLabel,
}: BottomSheetProps) {
  const reduceMotion = useReducedMotion();
  const sortedSnaps = [...snapPoints].sort((a, b) => a - b);
  const startIndex =
    defaultSnap !== undefined
      ? clamp(defaultSnap, 0, sortedSnaps.length - 1)
      : sortedSnaps.length - 1;

  const [activeSnapIndex, setActiveSnapIndex] = useState<number>(startIndex);
  const idRef = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const y = useMotionValue(0);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    setActiveSnapIndex(startIndex);
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    idRef.current = registerOverlay(close);

    const frame = requestAnimationFrame(() => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const focusable = sheet.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusable ?? sheet).focus();
    });

    return () => {
      if (idRef.current !== null) {
        unregisterOverlay(idRef.current);
        idRef.current = null;
      }
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus?.();
    };
    // we intentionally do not depend on startIndex (only snapPoints define it)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close]);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (typeof window === "undefined") return;
    const viewportH = window.innerHeight;
    // Determine current effective fraction visible after drag
    const currentFraction = sortedSnaps[activeSnapIndex];
    const draggedPx = info.offset.y;
    const newVisiblePx = currentFraction * viewportH - draggedPx;
    const newFraction = clamp(newVisiblePx / viewportH, 0, 1);

    const velocity = info.velocity.y;
    // If user flicks down hard from the lowest snap, dismiss.
    if (velocity > 700 && newFraction < sortedSnaps[0] + 0.05) {
      onOpenChange(false);
      return;
    }
    // If they swipe far below the lowest snap, dismiss.
    if (newFraction < sortedSnaps[0] * 0.5) {
      onOpenChange(false);
      return;
    }

    // Snap to nearest snap point.
    let nearestIndex = 0;
    let nearestDist = Math.abs(sortedSnaps[0] - newFraction);
    for (let i = 1; i < sortedSnaps.length; i++) {
      const d = Math.abs(sortedSnaps[i] - newFraction);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIndex = i;
      }
    }
    setActiveSnapIndex(nearestIndex);
    y.set(0);
  };

  if (typeof document === "undefined") return null;

  const activeFraction = sortedSnaps[activeSnapIndex];

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {showBackdrop && (
            <motion.div
              className="fixed inset-0 bg-backdrop"
              style={{ zIndex: "var(--z-drawer-backdrop)" }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                reduceMotion ? { duration: 0 } : tokenTransition("normal")
              }
              onClick={close}
              aria-hidden="true"
            />
          )}

          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={
              ariaLabel ?? (typeof title === "string" ? title : "Bottom sheet")
            }
            tabIndex={-1}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            style={{
              y,
              height: `${activeFraction * 100}vh`,
              zIndex: "var(--z-drawer)",
            }}
            className={classNames(
              "fixed left-0 right-0 bottom-0 bg-surface-overlay rounded-halfRound border-t border-border-default flex flex-col outline-none",
              className,
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            <div className="flex flex-col items-center pt-12px pb-8px flex-shrink-0 cursor-grab active:cursor-grabbing">
              <div
                aria-hidden="true"
                className="w-[36px] h-[4px] rounded-circle bg-bg-tertiary"
              />
              {title && (
                <h2 className="mt-12px font-manrope text-16 font-semibold text-fg-primary px-24px text-center break-words">
                  {title}
                </h2>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-24px pb-24px custom-scrollbar min-h-0">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default BottomSheet;
