"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

export interface TypingAnimationProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
}

const TypingAnimation = forwardRef<HTMLSpanElement, TypingAnimationProps>(
  (
    { children, duration = 50, delay = 0, startOnView = true, ...rest },
    forwardedRef,
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [visibleText, setVisibleText] = useState(
      prefersReducedMotion ? children : "",
    );
    const [intersectionRef, isVisible] = useIntersectionObserver({
      threshold: 0.1,
    });
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const hasStartedRef = useRef(false);

    const clearTimers = useCallback(() => {
      for (const id of timersRef.current) {
        clearTimeout(id);
      }
      timersRef.current = [];
    }, []);

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
        setVisibleText(children);
        return;
      }
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      setVisibleText("");

      const startId = setTimeout(() => {
        for (let i = 0; i <= children.length; i++) {
          const id = setTimeout(() => {
            setVisibleText(children.slice(0, i));
          }, i * duration);
          timersRef.current.push(id);
        }
      }, delay);

      timersRef.current.push(startId);
    }, [prefersReducedMotion, children, duration, delay]);

    useEffect(() => {
      if (prefersReducedMotion) {
        setVisibleText(children);
        return;
      }

      const shouldStart = !startOnView || isVisible;
      if (shouldStart) {
        startAnimation();
      }

      return clearTimers;
    }, [
      isVisible,
      startOnView,
      startAnimation,
      prefersReducedMotion,
      children,
      clearTimers,
    ]);

    // Reset when children change
    useEffect(() => {
      hasStartedRef.current = false;
      clearTimers();
      setVisibleText(prefersReducedMotion ? children : "");
      if (!startOnView || isVisible) {
        startAnimation();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children]);

    return (
      <span ref={setRef} {...rest}>
        {visibleText}
      </span>
    );
  },
);

TypingAnimation.displayName = "TypingAnimation";
export default TypingAnimation;
