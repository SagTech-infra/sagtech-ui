import { motionDuration, motionEase } from "@/tokens/tokens";

/** Strip the 'ms' suffix from a CSS-token duration string and return seconds. */
function toSeconds(durationToken: string): number {
  const n = parseFloat(durationToken);
  return durationToken.endsWith("ms") ? n / 1000 : n;
}

/** Framer-motion-ready durations (seconds, numeric) sourced from CSS motion tokens. */
export const motionDurationS = {
  fast: toSeconds(motionDuration.fast),
  normal: toSeconds(motionDuration.normal),
  slow: toSeconds(motionDuration.slow),
} as const;

/** Framer-motion-ready easing tuples sourced from CSS cubic-bezier tokens. */
function parseBezier(token: string): [number, number, number, number] {
  const match = token.match(/cubic-bezier\(([^)]+)\)/);
  if (!match) return [0.4, 0, 0.2, 1];
  const parts = match[1].split(",").map((s) => parseFloat(s.trim()));
  return [parts[0], parts[1], parts[2], parts[3]];
}

export const motionEaseBezier = {
  standard: parseBezier(motionEase.standard),
  emphasized: parseBezier(motionEase.emphasized),
  decelerated: parseBezier(motionEase.decelerated),
} as const;

/** Build a transition object from named motion tokens. */
export function tokenTransition(
  duration: keyof typeof motionDurationS = "normal",
  ease: keyof typeof motionEaseBezier = "standard",
) {
  return {
    duration: motionDurationS[duration],
    ease: motionEaseBezier[ease],
  } as const;
}
