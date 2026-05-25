// Internal shared overlay variant objects. These deduplicate variant objects
// that were copy-pasted identically across components. Values and key names
// (initial/animate, open/closed) are preserved exactly — no behavior change.

/** Directional fade used by Popover and Tooltip (4px offset by position). */
export const directionalFadeVariants = {
  top: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
  bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 } },
} as const;

/** Fade + slight downward slide used by DatePicker and DateRangePicker. */
export const dropdownFadeSlideVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -4 },
} as const;
