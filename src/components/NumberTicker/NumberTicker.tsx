"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  from?: number;
  duration?: number;
  formatter?: (n: number) => string;
  startOnView?: boolean;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const defaultFormatter = (n: number) => Math.round(n).toLocaleString();

const NumberTicker = forwardRef<HTMLSpanElement, NumberTickerProps>(
  (
    {
      value,
      from = 0,
      duration = 1000,
      formatter = defaultFormatter,
      startOnView = true,
      ...rest
    },
    forwardedRef,
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [current, setCurrent] = useState(prefersReducedMotion ? value : from);
    const [intersectionRef, isVisible] = useIntersectionObserver({
      threshold: 0.1,
    });
    const rafRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const hasStartedRef = useRef(false);

    // Merge the intersection ref with the forwarded ref
    const setRef = useCallback(
      (node: HTMLSpanElement | null) => {
        (
          intersectionRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node as HTMLDivElement | null;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [forwardedRef],
    );

    const startAnimation = useCallback(() => {
      if (prefersReducedMotion) {
        setCurrent(value);
        return;
      }
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      startTimeRef.current = null;

      const tick = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setCurrent(from + (value - from) * eased);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCurrent(value);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, [prefersReducedMotion, value, from, duration]);

    useEffect(() => {
      if (prefersReducedMotion) {
        setCurrent(value);
        return;
      }

      const shouldStart = !startOnView || isVisible;
      if (shouldStart) {
        startAnimation();
      }

      return () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }, [isVisible, startOnView, startAnimation, prefersReducedMotion, value]);

    // Reset when `value` or `from` change
    useEffect(() => {
      hasStartedRef.current = false;
      setCurrent(prefersReducedMotion ? value : from);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      startTimeRef.current = null;
      // Re-trigger only if already visible (or view not required)
      if (!startOnView || isVisible) {
        startAnimation();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, from]);

    return (
      <span ref={setRef} {...rest}>
        {formatter(current)}
      </span>
    );
  },
);

NumberTicker.displayName = "NumberTicker";
export default NumberTicker;
