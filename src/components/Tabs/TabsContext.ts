"use client";

import { createContext, type RefObject, useContext } from "react";

export interface TabsContextValue {
  /** The currently active tab value */
  value: string;
  /** Set the active tab value */
  setValue: (value: string) => void;
  /** Orientation of the tab list */
  orientation: "horizontal" | "vertical";
  /** Whether arrow keys activate immediately or require Enter/Space */
  activationMode: "automatic" | "manual";
  /** Whether inactive panels are removed from the DOM */
  lazyMount: boolean;
  /**
   * Map of registered trigger values to their button refs.
   * Used by keyboard navigation to find sibling triggers.
   */
  triggerRefs: Map<string, RefObject<HTMLButtonElement | null>>;
  /** Register a trigger value (called by TabsTrigger on mount) */
  register: (value: string, ref: RefObject<HTMLButtonElement | null>) => void;
  /** Unregister a trigger value (called by TabsTrigger on unmount) */
  unregister: (value: string) => void;
  /** Get the HTML id for the trigger button of a given tab value */
  getTriggerId: (value: string) => string;
  /** Get the HTML id for the panel div of a given tab value */
  getPanelId: (value: string) => string;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(
      "[TabsContext] A Tabs sub-component was rendered outside of <Tabs.Root>. " +
        "Wrap your triggers and panels in a <Tabs.Root> (or <TabsRoot>).",
    );
  }
  return ctx;
}
