"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import classNames from "classnames";
import { TabsContext, type TabsContextValue } from "./TabsContext";

export interface TabsRootProps {
  /** Controlled active value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Fired when the active tab changes */
  onValueChange?: (value: string) => void;
  /** Layout direction of the tab list */
  orientation?: "horizontal" | "vertical";
  /**
   * "automatic" — arrow keys move focus AND activate the tab (default).
   * "manual"    — arrow keys move focus only; Enter/Space activates.
   */
  activationMode?: "automatic" | "manual";
  /**
   * When true (default) only the active panel is rendered in the DOM.
   * When false all panels render; inactive ones carry the `hidden` attribute.
   */
  lazyMount?: boolean;
  className?: string;
  children: ReactNode;
}

const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  {
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    orientation = "horizontal",
    activationMode = "automatic",
    lazyMount = true,
    className,
    children,
  },
  ref,
) {
  const uid = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  // Registry of trigger refs keyed by value — stable Map reference
  const triggerRefs = useRef<Map<string, RefObject<HTMLButtonElement | null>>>(
    new Map(),
  );

  const register = useCallback(
    (val: string, r: RefObject<HTMLButtonElement | null>) => {
      triggerRefs.current.set(val, r);
    },
    [],
  );

  const unregister = useCallback((val: string) => {
    triggerRefs.current.delete(val);
  }, []);

  const getTriggerId = useCallback(
    (val: string) => `tabs-${uid}-trigger-${val}`,
    [uid],
  );

  const getPanelId = useCallback(
    (val: string) => `tabs-${uid}-panel-${val}`,
    [uid],
  );

  const ctx = useMemo<TabsContextValue>(
    () => ({
      value: activeValue,
      setValue,
      orientation,
      activationMode,
      lazyMount,
      triggerRefs: triggerRefs.current,
      register,
      unregister,
      getTriggerId,
      getPanelId,
    }),
    [
      activeValue,
      setValue,
      orientation,
      activationMode,
      lazyMount,
      register,
      unregister,
      getTriggerId,
      getPanelId,
    ],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div
        ref={ref}
        className={classNames("flex flex-col", className)}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

TabsRoot.displayName = "TabsRoot";
export default TabsRoot;
