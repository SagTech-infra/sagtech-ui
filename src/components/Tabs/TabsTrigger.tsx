"use client";

import { forwardRef, useEffect, useRef, type ReactNode } from "react";
import classNames from "classnames";
import { useTabsContext } from "./TabsContext";
import { useTabsKeyboardNav } from "./useTabsKeyboardNav";
import {
  TRIGGER_ACTIVE,
  TRIGGER_BASE,
  TRIGGER_DISABLED,
  TRIGGER_INACTIVE,
} from "./tabs.const";

export interface TabsTriggerProps {
  /** Identifies which panel this trigger controls */
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ value, disabled = false, className, children }, ref) {
    const ctx = useTabsContext();
    const {
      value: activeValue,
      setValue,
      getTriggerId,
      getPanelId,
      register,
      unregister,
    } = ctx;

    const isActive = value === activeValue;

    // Internal ref for keyboard-nav registry; merge with forwarded ref
    const internalRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      register(value, internalRef as React.RefObject<HTMLButtonElement | null>);
      return () => unregister(value);
    }, [value, register, unregister]);

    const handleKeyDown = useTabsKeyboardNav(ctx);

    return (
      <button
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
              node;
          }
        }}
        type="button"
        role="tab"
        id={getTriggerId(value)}
        aria-selected={isActive}
        aria-controls={getPanelId(value)}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        tabIndex={isActive ? 0 : -1}
        onClick={() => {
          if (!disabled) setValue(value);
        }}
        onKeyDown={handleKeyDown}
        className={classNames(
          TRIGGER_BASE,
          {
            [TRIGGER_ACTIVE]: isActive && !disabled,
            [TRIGGER_INACTIVE]: !isActive && !disabled,
            [TRIGGER_DISABLED]: disabled,
          },
          className,
        )}
      >
        {children}
      </button>
    );
  },
);

TabsTrigger.displayName = "TabsTrigger";
export default TabsTrigger;
