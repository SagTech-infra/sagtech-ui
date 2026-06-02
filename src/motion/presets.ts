import type { Variants } from "framer-motion";
import { motionDurationS, motionEaseBezier } from "@/utils/motion";

export interface MotionPresetOptions {
  /** Travel distance in px (slideUp/popIn). */
  distance?: number;
  /** Duration: a motion token name or explicit seconds. Default "normal". */
  duration?: keyof typeof motionDurationS | number;
  /** Easing token name. Default "standard". */
  ease?: keyof typeof motionEaseBezier;
}

function resolveDuration(d: MotionPresetOptions["duration"]): number {
  if (typeof d === "number") return d;
  return motionDurationS[d ?? "normal"];
}

function transition(o: MotionPresetOptions = {}) {
  return {
    duration: resolveDuration(o.duration),
    ease: motionEaseBezier[o.ease ?? "standard"],
  };
}

export function fadeIn(o: MotionPresetOptions = {}): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: transition(o) },
    exit: { opacity: 0, transition: transition(o) },
  };
}

export function slideUp(o: MotionPresetOptions = {}): Variants {
  const y = o.distance ?? 8;
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: transition(o) },
    exit: { opacity: 0, y, transition: transition(o) },
  };
}

export function scaleIn(o: MotionPresetOptions = {}): Variants {
  return {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: transition(o) },
    exit: { opacity: 0, scale: 0.96, transition: transition(o) },
  };
}

export function popIn(o: MotionPresetOptions = {}): Variants {
  return {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: transition({ ease: "emphasized", ...o }),
    },
    exit: { opacity: 0, scale: 0.9, transition: transition(o) },
  };
}
