"use client";

import React, { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import type { ConfirmVariant } from "./types";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  icon?: ReactNode;
  loading?: boolean;
  /**
   * When true, the primary confirm button is disabled (e.g. while a parent
   * form is invalid). The cancel/close path remains active. Default: false.
   */
  confirmDisabled?: boolean;
  onConfirm?: () => void;
  /**
   * Controls which element receives focus when the dialog opens.
   * - `string` — CSS selector queried within the dialog root.
   * - `HTMLElement` — focused directly.
   * - `React.RefObject<HTMLElement>` — focuses `ref.current` if non-null.
   * - `null` — suppresses auto-focus entirely.
   * - `undefined` (default) — focuses the primary confirm button via the
   *   `data-sagtech-confirm-primary="true"` attribute.
   */
  initialFocusTarget?:
    | string
    | HTMLElement
    | React.RefObject<HTMLElement>
    | null;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  icon,
  loading = false,
  confirmDisabled = false,
  onConfirm,
  initialFocusTarget,
}: ConfirmDialogProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onOpenChange(false);
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
      const primary = dialog.querySelector<HTMLButtonElement>(
        'button[data-sagtech-confirm-primary="true"]',
      );
      primary?.focus();
    });
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(frame);
    };
  }, [open, loading, onOpenChange, initialFocusTarget]);

  const handleBackdropClick = useCallback(() => {
    if (!loading) onOpenChange(false);
  }, [loading, onOpenChange]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sagtech-confirm-title"
          aria-describedby={description ? "sagtech-confirm-desc" : undefined}
          style={{ zIndex: "var(--z-modal)" }}
          className="fixed inset-0 flex items-center justify-center p-16px"
        >
          <motion.div
            className="absolute inset-0 bg-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              reduceMotion ? { duration: 0 } : tokenTransition("fast")
            }
            onClick={handleBackdropClick}
          />
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={
              reduceMotion ? { duration: 0 } : tokenTransition("fast")
            }
            className="relative w-full max-w-[420px] rounded-24px border border-border-default bg-surface-overlay p-24px shadow-4xl"
          >
            <div className="flex flex-col gap-16px">
              {icon && (
                <div className="flex items-center justify-center">{icon}</div>
              )}
              <Typography
                tag="h3"
                color="text-white_4"
                id="sagtech-confirm-title"
              >
                {title}
              </Typography>
              {description && (
                <Typography
                  tag="p"
                  type="BodyM"
                  color="text-grey_4"
                  id="sagtech-confirm-desc"
                >
                  {description}
                </Typography>
              )}
              <div className="flex justify-end gap-12px pt-8px">
                <Button
                  text={cancelText}
                  buttonSize="small"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                />
                <Button
                  data-sagtech-confirm-primary="true"
                  text={confirmText}
                  buttonSize="small"
                  variant={variant === "danger" ? "danger" : "primary"}
                  onClick={onConfirm}
                  loadingType={loading}
                  disabled={loading || confirmDisabled}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
