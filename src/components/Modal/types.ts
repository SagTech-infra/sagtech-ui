import type React from "react";

export interface ModalMotionVariants {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
}

export interface ModalProps {
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
