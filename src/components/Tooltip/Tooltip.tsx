"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import { directionalFadeVariants as motionVariants } from "@/motion/overlayVariants";
import classNames from "classnames";
import { useLocale } from "@/providers/LocaleContext";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const positionClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-8px",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-8px",
  left: "end-full top-1/2 -translate-y-1/2 me-8px",
  right: "start-full top-1/2 -translate-y-1/2 ms-8px",
} as const;

const arrowClasses = {
  top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-border-default",
  bottom:
    "top-[-4px] left-1/2 -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-border-default",
  left: "right-[-4px] top-1/2 -translate-y-1/2 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-border-default rtl:right-auto rtl:left-[-4px] rtl:border-l-0 rtl:border-r-[5px] rtl:border-r-border-default",
  right:
    "left-[-4px] top-1/2 -translate-y-1/2 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-border-default rtl:left-auto rtl:right-[-4px] rtl:border-r-0 rtl:border-l-[5px] rtl:border-l-border-default",
} as const;

export default function Tooltip({
  children,
  content,
  position = "top",
  className,
}: TooltipProps) {
  const { dir } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  const variant = motionVariants(position, dir);
  const motionProps = reduceMotion
    ? {
        initial: false as const,
        animate: variant.animate,
        exit: { opacity: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: variant.initial,
        animate: variant.animate,
        exit: variant.initial,
        transition: tokenTransition("fast"),
      };

  return (
    <div
      dir={dir}
      className={classNames("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            style={{ zIndex: "var(--z-tooltip)" }}
            className={classNames(
              "absolute pointer-events-none",
              positionClasses[position],
            )}
            {...motionProps}
          >
            <div className="bg-surface-overlay border border-border-default rounded-8px px-12px py-8px text-fg-muted text-12 font-manrope shadow-lg whitespace-nowrap">
              {content}
            </div>
            <span
              className={classNames("absolute w-0 h-0", arrowClasses[position])}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
