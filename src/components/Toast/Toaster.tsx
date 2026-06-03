"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import classNames from "classnames";
import { toastStore } from "./ToastStore";
import type { ToastData, ToastVariant } from "./types";
import { useLocale } from "@/providers/LocaleContext";

export type ToasterPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export interface ToasterProps {
  position?: ToasterPosition;
  /** Max number of stacked toasts. Older ones past this count are hidden but still in the store. */
  visibleToasts?: number;
  /** Gap in pixels between stacked toasts. */
  gap?: number;
}

const positionStyles: Record<ToasterPosition, string> = {
  "top-right": "top-16px end-16px items-end",
  "top-left": "top-16px start-16px items-start",
  "top-center": "top-16px left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-16px end-16px items-end",
  "bottom-left": "bottom-16px start-16px items-start",
  "bottom-center": "bottom-16px left-1/2 -translate-x-1/2 items-center",
};

const variantClasses: Record<ToastVariant, string> = {
  default: "border-border-default bg-surface-overlay",
  info: "border-pr_blue bg-surface-overlay",
  success: "border-success bg-surface-overlay",
  error: "border-error bg-surface-overlay",
  warning: "border-warning bg-surface-overlay",
  loading: "border-border-default bg-surface-overlay",
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "success") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-success"
      >
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6 10L9 13L14 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === "error") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-error"
      >
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 7L13 13M13 7L7 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-warning"
      >
        <path
          d="M10 2L18 17H2L10 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 8v4M10 14.5v.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (variant === "loading") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-fg-muted animate-spin"
      >
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.25"
        />
        <path
          d="M10 2a8 8 0 0 1 8 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (variant === "info") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-pr_blue"
      >
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 9v5M10 6v.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return null;
}

function ToastRow({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: string | number) => void;
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!Number.isFinite(toast.duration)) return;
    const handle = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => window.clearTimeout(handle);
  }, [toast.id, toast.duration, onDismiss]);

  const motionProps = reduceMotion
    ? {
        initial: false as const,
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.98 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: -8, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.98 },
        transition: tokenTransition("fast"),
      };

  return (
    <motion.div
      role="status"
      aria-live={toast.variant === "error" ? "assertive" : "polite"}
      layout
      {...motionProps}
      className={classNames(
        "pointer-events-auto inline-flex w-fit gap-8px rounded-8px border border-solid px-12px py-6px shadow-4xl font-manrope text-14 text-fg-primary max-w-[min(420px,calc(100vw-32px))]",
        toast.description ? "items-start" : "items-center",
        variantClasses[toast.variant],
      )}
    >
      <ToastIcon variant={toast.variant} />
      <div className="min-w-0">
        <div className="font-semibold leading-18 wrap-break-word">
          {toast.message}
        </div>
        {toast.description && (
          <div className="text-12 text-fg-secondary mt-2px wrap-break-word">
            {toast.description}
          </div>
        )}
      </div>
      {toast.action && (
        <button
          type="button"
          onClick={(e) => {
            toast.action!.onClick(e);
            onDismiss(toast.id);
          }}
          className="text-12 font-bold text-pr_purple hover:text-sec_purple cursor-pointer shrink-0"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        aria-label="Close notification"
        onClick={() => onDismiss(toast.id)}
        className="text-fg-muted hover:text-fg-primary cursor-pointer shrink-0"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 4L4 12M4 4l8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </motion.div>
  );
}

export default function Toaster({
  position = "top-right",
  visibleToasts = 5,
  gap = 12,
}: ToasterProps) {
  const { dir } = useLocale();
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => toastStore.subscribe(setToasts), []);

  if (typeof document === "undefined") return null;

  const handleDismiss = (id: string | number) => toastStore.dismiss(id);

  const visible = toasts.slice(-visibleToasts);

  return createPortal(
    <div
      dir={dir}
      className={classNames(
        "fixed flex flex-col pointer-events-none",
        positionStyles[position],
      )}
      style={{ gap: `${gap}px`, zIndex: "var(--z-toast)" }}
    >
      <AnimatePresence initial={false}>
        {visible.map((t) => (
          <ToastRow key={t.id} toast={t} onDismiss={handleDismiss} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
