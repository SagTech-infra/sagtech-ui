"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import { directionalFadeVariants as motionVariants } from "@/motion/overlayVariants";
import classNames from "classnames";
import { useLocale } from "@/providers/LocaleContext";

export interface HoverCardProps {
  /** Element that opens the card on hover/focus. */
  trigger: React.ReactNode;
  /** Rich card content shown in the floating panel. */
  children: React.ReactNode;
  /** Side the card is anchored to relative to the trigger. */
  side?: "top" | "bottom" | "left" | "right";
  /** Alignment of the card along the chosen side. */
  align?: "start" | "center" | "end";
  /** Delay before opening on mouseenter/focus, in ms. */
  openDelay?: number;
  /** Delay before closing on mouseleave/blur, in ms. */
  closeDelay?: number;
  className?: string;
}

const positionClasses = {
  top: "bottom-full mb-8px",
  bottom: "top-full mt-8px",
  left: "end-full me-8px",
  right: "start-full ms-8px",
} as const;

const alignClasses = {
  top: {
    start: "start-0",
    center: "left-1/2 -translate-x-1/2",
    end: "end-0",
  },
  bottom: {
    start: "start-0",
    center: "left-1/2 -translate-x-1/2",
    end: "end-0",
  },
  left: {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  },
  right: {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  },
} as const;

const arrowClasses = {
  top: "bottom-[-5px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-border-default",
  bottom:
    "top-[-5px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-border-default",
  left: "right-[-5px] top-1/2 -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-border-default rtl:right-auto rtl:left-[-5px] rtl:border-l-0 rtl:border-r-[6px] rtl:border-r-border-default",
  right:
    "left-[-5px] top-1/2 -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-border-default rtl:left-auto rtl:right-[-5px] rtl:border-r-0 rtl:border-l-[6px] rtl:border-l-border-default",
} as const;

const DEFAULT_OPEN_DELAY = 200;
const DEFAULT_CLOSE_DELAY = 150;

export default function HoverCard({
  trigger,
  children,
  side = "bottom",
  align = "center",
  openDelay = DEFAULT_OPEN_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  className,
}: HoverCardProps) {
  const { dir } = useLocale();
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const scheduleOpen = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setIsOpen(true), openDelay);
  }, [clearTimer, openDelay]);

  const scheduleClose = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setIsOpen(false), closeDelay);
  }, [clearTimer, closeDelay]);

  useEffect(() => clearTimer, [clearTimer]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        clearTimer();
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, clearTimer]);

  const variant = motionVariants(side, dir);

  return (
    <div
      dir={dir}
      className={classNames("relative inline-block", className)}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={scheduleOpen}
      onBlur={scheduleClose}
    >
      <div className="inline-flex">{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            style={{ zIndex: "var(--z-popover)" }}
            className={classNames(
              "absolute",
              positionClasses[side],
              alignClasses[side][align],
            )}
            initial={reduceMotion ? false : variant.initial}
            animate={variant.animate}
            exit={reduceMotion ? { opacity: 0 } : variant.initial}
            transition={reduceMotion ? { duration: 0 } : tokenTransition("fast")}
            onMouseEnter={scheduleOpen}
            onMouseLeave={scheduleClose}
          >
            <div className="relative bg-surface-overlay border border-border-default rounded-16px p-20px shadow-6xl min-w-[240px] max-w-[400px] w-max">
              {children}
              <span
                className={classNames("absolute w-0 h-0", arrowClasses[side])}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
