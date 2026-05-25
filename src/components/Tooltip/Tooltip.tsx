"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import { directionalFadeVariants as motionVariants } from "@/motion/overlayVariants";
import classNames from "classnames";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const positionClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-8px",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-8px",
  left: "right-full top-1/2 -translate-y-1/2 mr-8px",
  right: "left-full top-1/2 -translate-y-1/2 ml-8px",
} as const;

const arrowClasses = {
  top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-black_3",
  bottom:
    "top-[-4px] left-1/2 -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-black_3",
  left: "right-[-4px] top-1/2 -translate-y-1/2 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-black_3",
  right:
    "left-[-4px] top-1/2 -translate-y-1/2 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-black_3",
} as const;

export default function Tooltip({
  children,
  content,
  position = "top",
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? {
        initial: false as const,
        animate: motionVariants[position].animate,
        exit: { opacity: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: motionVariants[position].initial,
        animate: motionVariants[position].animate,
        exit: motionVariants[position].initial,
        transition: tokenTransition("fast"),
      };

  return (
    <div
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
            <div className="bg-black_2 border border-black_3 rounded-8px px-12px py-8px text-grey_4 text-12 font-manrope shadow-lg whitespace-nowrap">
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
