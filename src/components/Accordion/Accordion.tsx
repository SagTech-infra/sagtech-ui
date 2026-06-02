"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useRovingTabindex } from "@/hooks/useRovingTabindex";
import { tokenTransition } from "@/utils/motion";

export type AccordionType = "single" | "multiple";

export interface AccordionProps {
  /** Single open panel, or many open at once. */
  type?: AccordionType;
  /** Controlled open values. */
  value?: string[];
  /** Initial open values when uncontrolled. */
  defaultValue?: string[];
  /** Fires with the next set of open values. */
  onValueChange?: (value: string[]) => void;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export interface AccordionItemProps {
  /** Unique identifier used as the open key. */
  value: string;
  /** Header text rendered inside the trigger button. */
  label: ReactNode;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

interface AccordionContextValue {
  baseId: string;
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  /** Ordered list of registered item values, in DOM order. */
  values: string[];
  register: (value: string, disabled: boolean) => void;
  unregister: (value: string) => void;
  isDisabled: (value: string) => boolean;
  activeValue: string | null;
  getTabIndex: (value: string) => 0 | -1;
  setActiveValue: (value: string) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  registerHeaderRef: (value: string, node: HTMLButtonElement | null) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("AccordionItem must be used within <Accordion>");
  }
  return ctx;
}

export function Accordion({
  type = "single",
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  className,
  children,
  ref,
}: AccordionProps) {
  const baseId = useId();
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultValue);

  const isControlled = controlledValue !== undefined;
  const openValues = isControlled ? controlledValue : uncontrolled;

  const commit = useCallback(
    (next: string[]) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const isOpen = useCallback(
    (val: string) => openValues.includes(val),
    [openValues],
  );

  const toggle = useCallback(
    (val: string) => {
      if (type === "single") {
        commit(openValues.includes(val) ? [] : [val]);
        return;
      }
      commit(
        openValues.includes(val)
          ? openValues.filter((v) => v !== val)
          : [...openValues, val],
      );
    },
    [commit, openValues, type],
  );

  // Item registry — ordered by registration (DOM order under StrictMode-safe effects).
  const [values, setValues] = useState<string[]>([]);
  const disabledMap = useRef<Map<string, boolean>>(new Map());
  const headerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const register = useCallback((val: string, disabled: boolean) => {
    disabledMap.current.set(val, disabled);
    setValues((prev) => (prev.includes(val) ? prev : [...prev, val]));
  }, []);

  const unregister = useCallback((val: string) => {
    disabledMap.current.delete(val);
    headerRefs.current.delete(val);
    setValues((prev) => prev.filter((v) => v !== val));
  }, []);

  const isDisabled = useCallback(
    (val: string) => disabledMap.current.get(val) ?? false,
    [],
  );

  const registerHeaderRef = useCallback(
    (val: string, node: HTMLButtonElement | null) => {
      headerRefs.current.set(val, node);
    },
    [],
  );

  const { activeValue, getTabIndex, setActiveValue, onKeyDown } =
    useRovingTabindex<string>({
      values,
      isDisabled,
      onActiveChange: (val) => headerRefs.current.get(val)?.focus(),
    });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      onKeyDown(event);
    },
    [onKeyDown],
  );

  const ctx = useMemo<AccordionContextValue>(
    () => ({
      baseId,
      isOpen,
      toggle,
      values,
      register,
      unregister,
      isDisabled,
      activeValue,
      getTabIndex,
      setActiveValue,
      onKeyDown: handleKeyDown,
      registerHeaderRef,
    }),
    [
      baseId,
      isOpen,
      toggle,
      values,
      register,
      unregister,
      isDisabled,
      activeValue,
      getTabIndex,
      setActiveValue,
      handleKeyDown,
      registerHeaderRef,
    ],
  );

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        ref={ref}
        className={classNames(
          "flex flex-col rounded-16px border-1 border-solid border-border-default overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  label,
  disabled = false,
  className,
  children,
}: AccordionItemProps) {
  const ctx = useAccordionContext();
  const {
    baseId,
    isOpen,
    toggle,
    register,
    unregister,
    activeValue,
    getTabIndex,
    setActiveValue,
    onKeyDown,
    registerHeaderRef,
  } = ctx;

  useEffect(() => {
    register(value, disabled);
    return () => unregister(value);
  }, [register, unregister, value, disabled]);

  const open = isOpen(value);
  const headerId = `${baseId}-header-${value}`;
  const panelId = `${baseId}-panel-${value}`;
  const isActive = activeValue === value;

  const handleClick = () => {
    if (disabled) return;
    setActiveValue(value);
    toggle(value);
  };

  return (
    <div
      className={classNames(
        "border-b-1 border-solid border-border-default last:border-b-0",
        className,
      )}
    >
      <h3 className="m-0">
        <button
          ref={(node) => registerHeaderRef(value, node)}
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          tabIndex={getTabIndex(value)}
          onClick={handleClick}
          onKeyDown={onKeyDown}
          onFocus={() => setActiveValue(value)}
          data-active={isActive || undefined}
          data-state={open ? "open" : "closed"}
          className={classNames(
            "flex w-full items-center justify-between gap-12px px-16px py-12px text-left font-manrope text-14 text-fg-primary transition-colors duration-200",
            "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pr_purple",
            "hover:bg-bg-secondary",
          )}
        >
          <span className="flex-1">{label}</span>
          <ChevronDown
            className={classNames(
              "h-[20px] w-[20px] flex-shrink-0 text-fg-muted transition-transform duration-200",
              { "rotate-180": open },
            )}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            role="region"
            id={panelId}
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={tokenTransition("normal", "standard")}
            style={{ overflow: "hidden" }}
          >
            <div className="px-16px pb-16px pt-4px font-manrope text-14 text-fg-secondary">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Accordion;
