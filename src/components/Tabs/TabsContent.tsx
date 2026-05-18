"use client";

import { forwardRef, type ReactNode } from "react";
import classNames from "classnames";
import { useTabsContext } from "./TabsContext";

export interface TabsContentProps {
  /** Must match the value passed to the corresponding Tabs.Trigger */
  value: string;
  className?: string;
  children: ReactNode;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ value, className, children }, ref) {
    const {
      value: activeValue,
      lazyMount,
      getTriggerId,
      getPanelId,
    } = useTabsContext();

    const isActive = value === activeValue;

    if (lazyMount && !isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={getPanelId(value)}
        aria-labelledby={getTriggerId(value)}
        tabIndex={0}
        hidden={!lazyMount && !isActive}
        className={classNames(className)}
      >
        {children}
      </div>
    );
  },
);

TabsContent.displayName = "TabsContent";
export default TabsContent;
