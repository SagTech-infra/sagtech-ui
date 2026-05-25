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

export type SlideEdge = "left" | "right" | "top" | "bottom";

/**
 * Edge-anchored slide offsets for Drawer/Sheet. `dir` inverts the horizontal
 * axis so an inline-end panel slides from the correct visual side in RTL.
 * Transition (spring) is applied by the component, not here.
 */
export function edgeSlideVariants(
  edge: SlideEdge,
  dir: "ltr" | "rtl" = "ltr",
) {
  const axis = edge === "left" || edge === "right" ? "x" : "y";
  let off: string;
  if (edge === "right") off = dir === "rtl" ? "-100%" : "100%";
  else if (edge === "left") off = dir === "rtl" ? "100%" : "-100%";
  else if (edge === "top") off = "-100%";
  else off = "100%"; // bottom
  return {
    hidden: { [axis]: off },
    visible: { [axis]: 0 },
    exit: { [axis]: off },
  } as const;
}
