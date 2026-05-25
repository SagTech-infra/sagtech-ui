"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import { directionalFadeVariants as motionVariants } from "@/motion/overlayVariants";
import classNames from "classnames";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useLocale } from "@/providers/LocaleContext";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
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

export default function Popover({
  trigger,
  children,
  position = "bottom",
  align = "center",
  className,
}: PopoverProps) {
  const { dir } = useLocale();
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => setIsOpen(false), []);
  const ref = useOutsideClick<HTMLDivElement>(handleClose);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <div ref={ref} dir={dir} className={classNames("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {trigger}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{ zIndex: "var(--z-popover)" }}
            className={classNames(
              "absolute",
              positionClasses[position],
              alignClasses[position][align],
            )}
            initial={reduceMotion ? false : motionVariants[position].initial}
            animate={motionVariants[position].animate}
            exit={
              reduceMotion ? { opacity: 0 } : motionVariants[position].initial
            }
            transition={
              reduceMotion ? { duration: 0 } : tokenTransition("fast")
            }
          >
            <div className="relative bg-surface-overlay border border-border-default rounded-16px p-20px shadow-6xl min-w-[240px] max-w-[400px] w-max">
              {children}
              <span
                className={classNames(
                  "absolute w-0 h-0",
                  arrowClasses[position],
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
