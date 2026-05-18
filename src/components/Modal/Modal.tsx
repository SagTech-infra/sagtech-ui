"use client";

import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  getOverlayDepth,
  registerOverlay,
  subscribeOverlayStack,
  unregisterOverlay,
} from "./ModalStack";

export interface ModalMotionVariants {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
}

interface ModalProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  toggle?: () => void;
  size?: "sm" | "md";
  title?: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Optional overrides for the modal's framer-motion variants. Pass any subset;
   * unspecified entries fall back to the default scale/opacity behavior.
   */
  motionVariants?: ModalMotionVariants;
  "aria-label"?: string;
  /**
   * Controls which element receives focus when the modal opens.
   * - `string` — CSS selector queried within the modal root.
   * - `HTMLElement` — focused directly.
   * - `React.RefObject<HTMLElement>` — focuses `ref.current` if non-null.
   * - `null` — suppresses auto-focus entirely.
   * - `undefined` (default) — focuses the first focusable element (existing behavior).
   */
  initialFocusTarget?:
    | string
    | HTMLElement
    | React.RefObject<HTMLElement>
    | null;
}

const Z_MODAL_BACKDROP = 3000;
const Z_MODAL = 3001;
const Z_STEP = 10;

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    children,
    isOpen,
    toggle,
    size = "sm",
    title,
    footer,
    motionVariants,
    "aria-label": ariaLabel,
    initialFocusTarget,
  },
  ref,
) {
  const idRef = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [, forceRender] = useState(0);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    idRef.current = registerOverlay(toggle);
    const unsubscribe = subscribeOverlayStack(() => forceRender((v) => v + 1));

    const frame = requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (initialFocusTarget === null) return;
      if (initialFocusTarget !== undefined) {
        let target: HTMLElement | null = null;
        if (typeof initialFocusTarget === "string") {
          target = dialog.querySelector<HTMLElement>(initialFocusTarget);
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
  }, [isOpen, toggle, initialFocusTarget]);

  if (!isOpen) return null;

  const depth = idRef.current !== null ? getOverlayDepth(idRef.current) : 0;
  const backdropZ = Z_MODAL_BACKDROP + depth * Z_STEP;
  const modalZ = Z_MODAL + depth * Z_STEP;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
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

  const labelledBy = title ? titleId : undefined;

  // Apply optional motion variants as inline style overrides on the dialog.
  // Variants intentionally remain a non-breaking additive prop: when not
  // provided, the dialog uses its existing CSS-driven `modalAnim` animation.
  const motionStyle: React.CSSProperties = motionVariants?.animate
    ? (motionVariants.animate as React.CSSProperties)
    : {};

  const setRefs = (node: HTMLDivElement | null) => {
    dialogRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  return createPortal(
    <div
      data-tid="modal"
      className="fixed inset-0 flex w-full justify-center h-full items-center"
      style={{ zIndex: modalZ }}
    >
      <div
        onClick={toggle}
        className="fixed left-0px top-0px h-full w-full bg-backdrop cursor-pointer"
        style={{ zIndex: backdropZ }}
        aria-hidden="true"
      />
      <div
        ref={setRefs}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`modalAnim mx-8px flex flex-col w-full h-auto max-h-[90vh] rounded-24px border-[1px] border-solid border-black_3 bg-black_1 p-24px shadow-4xl overflow-hidden outline-none ${
          size === "md" ? "xs:w-[670px]" : "xs:w-[454px]"
        } xs:p-32px sm:rounded-40px`}
        style={{ zIndex: modalZ, ...motionStyle }}
      >
        {title && (
          <div
            id={titleId}
            className="font-manrope text-18 font-bold text-white_4 mb-16px flex-shrink-0"
          >
            {title}
          </div>
        )}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          {children}
        </div>
        {footer && (
          <div className="mt-24px pt-16px flex items-center justify-end gap-12px flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
});

export default Modal;
