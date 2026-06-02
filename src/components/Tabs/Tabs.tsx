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
  /** Default active tab id (`tab-<index>`); defaults to the first tab. */
  defaultValue?: string;
  className?: string;
  onChange?: (index: number) => void;
}

const TabsBase = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, defaultValue = "tab-0", className, onChange },
  ref,
) {
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
