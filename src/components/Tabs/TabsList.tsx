"use client";

import { forwardRef, type ReactNode } from "react";
import classNames from "classnames";
import { useTabsContext } from "./TabsContext";

export interface TabsListProps {
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children: ReactNode;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, children, ...rest },
  ref,
) {
  const { orientation } = useTabsContext();

  return (
    <div
      ref={ref}
      role="tablist"
      aria-orientation={orientation}
      className={classNames("flex flex-wrap gap-8px", className)}
      {...rest}
    >
      {children}
    </div>
  );
});

TabsList.displayName = "TabsList";
export default TabsList;
