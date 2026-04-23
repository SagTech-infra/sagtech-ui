'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  getOverlayDepth,
  registerOverlay,
  subscribeOverlayStack,
  unregisterOverlay,
} from './ModalStack';

interface ModalProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  toggle?: () => void;
  size?: 'sm' | 'md';
  title?: React.ReactNode;
  footer?: React.ReactNode;
  'aria-label'?: string;
}

const Z_MODAL_BACKDROP = 3000;
const Z_MODAL = 3001;
const Z_STEP = 10;

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

export function Modal({
  children,
  isOpen,
  toggle,
  size = 'sm',
  title,
  footer,
  'aria-label': ariaLabel,
}: ModalProps) {
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
  }, [isOpen, toggle]);

  if (!isOpen) return null;

  const depth = idRef.current !== null ? getOverlayDepth(idRef.current) : 0;
  const backdropZ = Z_MODAL_BACKDROP + depth * Z_STEP;
  const modalZ = Z_MODAL + depth * Z_STEP;

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

  const labelledBy = title ? titleId : undefined;

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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`modalAnim mx-8px flex flex-col w-full h-auto max-h-[90vh] rounded-24px border-[1px] border-solid border-black_3 bg-black_1 p-24px shadow-4xl overflow-hidden outline-none ${
          size === 'md' ? 'xs:w-[670px]' : 'xs:w-[454px]'
        } xs:p-32px sm:rounded-40px`}
        style={{ zIndex: modalZ }}
      >
        {title && (
          <div
            id={titleId}
            className="font-manrope text-18 font-bold text-white_4 mb-16px flex-shrink-0"
          >
            {title}
          </div>
        )}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">{children}</div>
        {footer && (
          <div className="mt-24px pt-16px flex items-center justify-end gap-12px flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
