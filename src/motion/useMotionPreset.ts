import { useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  fadeIn,
  slideUp,
  scaleIn,
  popIn,
  type MotionPresetOptions,
} from "./presets";

const PRESETS = { fadeIn, slideUp, scaleIn, popIn } as const;

export type MotionPresetName = keyof typeof PRESETS;

const REDUCED: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

/**
 * Returns a framer-motion Variants object for the named preset, collapsing to
 * an instant opacity-only variant when the user prefers reduced motion.
 */
export function useMotionPreset(
  name: MotionPresetName,
  options?: MotionPresetOptions,
): Variants {
  const reduce = useReducedMotion();
  if (reduce) return REDUCED;
  return PRESETS[name](options);
}
