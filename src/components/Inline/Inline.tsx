"use client";

import classNames from "classnames";
import React, { forwardRef } from "react";

export interface InlineProps extends React.HTMLAttributes<HTMLElement> {
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  as?: React.ElementType;
  children: React.ReactNode;
}

const gapMap: Record<NonNullable<InlineProps["gap"]>, string> = {
  xs: "gap-8px",
  sm: "gap-12px",
  md: "gap-16px",
  lg: "gap-24px",
  xl: "gap-32px",
};

const alignMap: Record<NonNullable<InlineProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyMap: Record<NonNullable<InlineProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const Inline = forwardRef<HTMLElement, InlineProps>(
  (
    {
      gap = "md",
      align,
      justify,
      wrap = false,
      as: Tag = "div",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    // Render via createElement: with the polymorphic `as` typed as
    // React.ElementType, JSX would intersect every intrinsic (incl. r3f's
    // ThreeElements) and collapse `children` to `never`. createElement sidesteps
    // that intrinsic-union resolution.
    return React.createElement(
      Tag,
      {
        ref,
        className: classNames(
          "flex flex-row",
          gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          wrap && "flex-wrap",
          className,
        ),
        ...rest,
      },
      children,
    );
  },
);

Inline.displayName = "Inline";

export default Inline;
