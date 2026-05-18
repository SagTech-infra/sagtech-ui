"use client";

import { forwardRef } from "react";
import type { ReactNode } from "react";
import TabsRoot from "./TabsRoot";
import TabsList from "./TabsList";
import TabsTrigger from "./TabsTrigger";
import TabsContent from "./TabsContent";

export interface TabItem {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  /**
   * @deprecated Use `defaultValue` with the compound API (Tabs.Root).
   * `defaultIndex` will be removed in v2.0.
   */
  defaultIndex?: number;
  className?: string;
  onChange?: (index: number) => void;
}

const TabsBase = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, defaultIndex = 0, className, onChange },
  ref,
) {
  const defaultValue = `tab-${defaultIndex}`;

  function handleValueChange(value: string) {
    if (onChange) {
      const index = parseInt(value.replace("tab-", ""), 10);
      if (!isNaN(index)) onChange(index);
    }
  }

  return (
    <TabsRoot
      ref={ref}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      className={className}
    >
      <TabsList>
        {items.map((item, index) => (
          <TabsTrigger key={item.label} value={`tab-${index}`}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-0">
        {items.map((item, index) => (
          <TabsContent key={item.label} value={`tab-${index}`}>
            {item.content}
          </TabsContent>
        ))}
      </div>
    </TabsRoot>
  );
});

TabsBase.displayName = "Tabs";

const Tabs = Object.assign(TabsBase, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export default Tabs;
