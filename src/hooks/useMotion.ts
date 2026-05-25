'use client';

import { useReducedMotion, type Transition } from 'framer-motion';

/**
 * Motion durations in **seconds** — numeric mirror of the `--motion-duration-*`
 * CSS tokens in `theme.css` (framer-motion's `transition.duration` wants seconds,
 * not a CSS-var string). Keep these in sync with theme.css.
 */
export const MOTION_DURATION = { fast: 0.12, normal: 0.2, slow: 0.32 } as const;

/** Cubic-bezier easing arrays — numeric mirror of the `--motion-ease-*` tokens. */
export const MOTION_EASE = {
  standard: [0.2, 0, 0, 1],
  emphasized: [0.3, 0, 0, 1],
  decelerated: [0, 0, 0, 1],
} as const;

/** Shared spring for sliding panels (Drawer / Sheet / BottomSheet). */
export const MOTION_SPRING: Transition = { type: 'spring', damping: 30, stiffness: 300 };

export type MotionSpeed = keyof typeof MOTION_DURATION;
export type MotionEaseName = keyof typeof MOTION_EASE;

/**
 * framer-motion transition built from motion tokens, collapsed to an instant
 * transition when the user prefers reduced motion.
 */
export function useOverlayTransition(
  speed: MotionSpeed = 'fast',
  ease: MotionEaseName = 'standard',
): Transition {
  const reduce = useReducedMotion();
  if (reduce) return { duration: 0 };
  return { duration: MOTION_DURATION[speed], ease: MOTION_EASE[ease] };
}

/** Spring transition that respects reduced-motion (instant when reduced). */
export function useSpringTransition(): Transition {
  const reduce = useReducedMotion();
  return reduce ? { duration: 0 } : MOTION_SPRING;
}

type MotionOffset = { opacity: number; x?: number; y?: number };

/** Shared fade+slide variants for dropdown-style overlays (DatePicker, Select, …). */
export const dropdownVariants: { open: MotionOffset; closed: MotionOffset } = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -4 },
};

export type OverlaySide = 'top' | 'bottom' | 'left' | 'right';

/**
 * Positional fade variants for Popover / Tooltip — the panel fades in from a
 * small offset toward its trigger. `exit` reuses `initial`.
 */
export const positionVariants: Record<OverlaySide, { initial: MotionOffset; animate: MotionOffset }> = {
  top: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
  bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 } },
};
