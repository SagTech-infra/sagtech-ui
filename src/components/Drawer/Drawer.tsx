"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import classNames from "classnames";
import {
  getOverlayDepth,
  registerOverlay,
  subscribeOverlayStack,
  unregisterOverlay,
} from "@/components/Modal/ModalStack";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right";
  width?: string;
  title?: string;
  children: React.ReactNode;
  showOverlay?: boolean;
  className?: string;
  /**
   * Controls which element receives focus when the drawer opens.
   * - `string` — CSS selector queried within the drawer panel.
   * - `HTMLElement` — focused directly.
   * - `React.RefObject<HTMLElement>` — focuses `ref.current` if non-null.
   * - `null` — suppresses auto-focus entirely.
   * - `undefined` (default) — focuses the first focusable element in the panel.
   */
  initialFocusTarget?:
    | string
    | HTMLElement
    | React.RefObject<HTMLElement>
    | null;
}

const Z_DRAWER_BACKDROP = 4000;
const Z_DRAWER = 4001;
const Z_STEP = 10;

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

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

const Drawer = forwardRef<HTMLElement, DrawerProps>(function Drawer(
  {
    isOpen,
    onClose,
    position = "right",
    width,
    title,
    children,
    showOverlay = true,
    className,
    initialFocusTarget,
  },
  ref,
) {
  const reduceMotion = useReducedMotion();
  const idRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [, forceRender] = useState(0);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    idRef.current = registerOverlay(onClose);
    const unsubscribe = subscribeOverlayStack(() => forceRender((v) => v + 1));
    document.addEventListener("keydown", handleEscape);

    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      if (initialFocusTarget === null) return;
      if (initialFocusTarget !== undefined) {
        let target: HTMLElement | null = null;
        if (typeof initialFocusTarget === "string") {
          target = panel.querySelector<HTMLElement>(initialFocusTarget);
        } else if (initialFocusTarget instanceof HTMLElement) {
          target = initialFocusTarget;
        } else if (
          typeof initialFocusTarget === "object" &&
          "current" in initialFocusTarget
        ) {
          target = initialFocusTarget.current;
        }
        target?.focus();
        return;
      }
      const focusable = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      focusable?.focus();
    });

    return () => {
      if (idRef.current !== null) {
        unregisterOverlay(idRef.current);
        idRef.current = null;
      }
      unsubscribe();
      document.removeEventListener("keydown", handleEscape);
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, handleEscape, onClose, initialFocusTarget]);

  const setRefs = (node: HTMLElement | null) => {
    panelRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  const depth = idRef.current !== null ? getOverlayDepth(idRef.current) : 0;
  const drawerZ = Z_DRAWER + depth * Z_STEP;
  const backdropZ = Z_DRAWER_BACKDROP + depth * Z_STEP;

  const slideVariants = {
    hidden: { x: position === "right" ? "100%" : "-100%" },
    visible: { x: 0 },
    exit: { x: position === "right" ? "100%" : "-100%" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showOverlay && (
            <motion.div
              className="fixed inset-0 bg-backdrop"
              style={{ zIndex: backdropZ }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                reduceMotion ? { duration: 0 } : tokenTransition("normal")
              }
              onClick={onClose}
            />
          )}

          <motion.aside
            ref={setRefs}
            className={classNames(
              "fixed top-0 h-full bg-black_1 flex flex-col",
              {
                "right-0 border-l border-black_3": position === "right",
                "left-0 border-r border-black_3": position === "left",
              },
              width ? undefined : "w-[400px]",
              className,
            )}
            style={{ zIndex: drawerZ, ...(width ? { width } : {}) }}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-24px border-b border-black_3">
              {title && (
                <h2 className="font-manrope text-18 font-semibold text-white_4">
                  {title}
                </h2>
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

            <div className="flex-1 overflow-y-auto p-24px custom-scrollbar">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
});

Drawer.displayName = "Drawer";
export default Drawer;
