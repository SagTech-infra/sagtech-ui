import type React from "react";

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
