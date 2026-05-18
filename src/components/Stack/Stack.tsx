"use client";

import classNames from "classnames";
import React, { forwardRef } from "react";

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  as?: React.ElementType;
  children: React.ReactNode;
}

const gapMap: Record<NonNullable<StackProps["gap"]>, string> = {
  xs: "gap-8px",
  sm: "gap-12px",
  md: "gap-16px",
  lg: "gap-24px",
  xl: "gap-32px",
};

const alignMap: Record<NonNullable<StackProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyMap: Record<NonNullable<StackProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const Stack = forwardRef<HTMLElement, StackProps>(
  (
    {
      gap = "md",
      align,
      justify,
      as: Tag = "div",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <Tag
        ref={ref}
        className={classNames(
          "flex flex-col",
          gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

Stack.displayName = "Stack";

export default Stack;
