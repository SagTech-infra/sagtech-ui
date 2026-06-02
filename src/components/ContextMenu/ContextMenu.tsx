"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import classNames from "classnames";
import { useRovingTabindex, useTypeahead } from "../../hooks";
import { Portal } from "../../utils";

/** A single actionable row in a {@link ContextMenu}. */
export interface MenuItem {
  /** Visible text; also the type-ahead search target. */
  label: string;
  /** Invoked when the item is selected (click / Enter). */
  onSelect: () => void;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** When true the item is skipped by keyboard navigation and not selectable. */
  disabled?: boolean;
  /** Renders the item in the destructive (error) tone. */
  danger?: boolean;
}

export interface ContextMenuProps {
  /** The trigger area that opens the menu on right-click / long-press. */
  children: ReactNode;
  /** Menu rows rendered when open. */
  items: MenuItem[];
  /** Optional class for the wrapping trigger element. */
  className?: string;
}

/** Viewport gutter so the menu never butts against the window edge. */
const VIEWPORT_GUTTER = 8;
/** Estimated menu footprint used to keep it on-screen before measuring. */
const ESTIMATED_MENU_WIDTH = 220;
const ESTIMATED_MENU_HEIGHT = 200;
/** Long-press duration (ms) that opens the menu on touch devices. */
const LONG_PRESS_MS = 500;

interface Point {
  x: number;
  y: number;
}

function clampToViewport({ x, y }: Point): Point {
  if (typeof window === "undefined") return { x, y };
  const maxX = window.innerWidth - ESTIMATED_MENU_WIDTH - VIEWPORT_GUTTER;
  const maxY = window.innerHeight - ESTIMATED_MENU_HEIGHT - VIEWPORT_GUTTER;
  return {
    x: Math.max(VIEWPORT_GUTTER, Math.min(x, Math.max(VIEWPORT_GUTTER, maxX))),
    y: Math.max(VIEWPORT_GUTTER, Math.min(y, Math.max(VIEWPORT_GUTTER, maxY))),
  };
}

/**
 * Right-click / long-press context menu.
 *
 * Opens at the pointer coordinates, renders through a {@link Portal}, and
 * closes on outside click, `Escape`, or selection. Keyboard support follows the
 * ARIA menu pattern: `ArrowUp`/`ArrowDown`/`Home`/`End` move the active item
 * (roving tabindex), printable keys jump via type-ahead, and `Enter` selects.
 */
export default function ContextMenu({
  children,
  items,
  className,
}: ContextMenuProps) {
  const baseId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<Point>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const longPressTimer = useRef<number | null>(null);

  // The shared Portal renders into #portal-root; create it if a host app
  // (or the Storybook/test harness) has not provided one.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("portal-root")) return;
    const root = document.createElement("div");
    root.id = "portal-root";
    document.body.appendChild(root);
  }, []);

  const indices = useMemo(() => items.map((_, index) => index), [items]);
  const isDisabled = useCallback(
    (index: number) => items[index]?.disabled ?? false,
    [items],
  );

  const focusItem = useCallback((index: number) => {
    itemRefs.current[index]?.focus();
  }, []);

  const { activeValue, getTabIndex, setActiveValue, onKeyDown } =
    useRovingTabindex<number>({
      values: indices,
      isDisabled,
      onActiveChange: focusItem,
    });

  const { onType, reset: resetTypeahead } = useTypeahead<number>({
    items: indices,
    getText: (index) => items[index]?.label ?? "",
    onMatch: (index) => setActiveValue(index),
    getActiveItem: () => activeValue,
  });

  const close = useCallback(() => {
    setIsOpen(false);
    resetTypeahead();
  }, [resetTypeahead]);

  const open = useCallback((point: Point) => {
    setCoords(clampToViewport(point));
    setIsOpen(true);
  }, []);

  const handleContextMenu = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      open({ x: event.clientX, y: event.clientY });
    },
    [open],
  );

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const point = { x: touch.clientX, y: touch.clientY };
      clearLongPress();
      longPressTimer.current = window.setTimeout(
        () => open(point),
        LONG_PRESS_MS,
      );
    },
    [clearLongPress, open],
  );

  useEffect(() => clearLongPress, [clearLongPress]);

  const select = useCallback(
    (item: MenuItem) => {
      if (item.disabled) return;
      item.onSelect();
      close();
    },
    [close],
  );

  // Focus the first enabled item (or the menu) on the open transition only.
  // Keying the effect on the `isOpen` boolean means it runs once per open and
  // re-renders during keyboard navigation do NOT reset the active item.
  useEffect(() => {
    if (!isOpen) return;
    const firstEnabled = indices.find((index) => !isDisabled(index));
    if (firstEnabled !== undefined) {
      setActiveValue(firstEnabled);
      itemRefs.current[firstEnabled]?.focus();
    } else {
      menuRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on outside pointer-down and Escape while open.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: globalThis.MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, close]);

  const handleMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape" || event.key === "Tab") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (activeValue !== null) {
          const item = items[activeValue];
          if (item) select(item);
        }
        return;
      }
      if (onKeyDown(event) !== null) return;
      if (event.key.length === 1 && /\S/.test(event.key)) onType(event.key);
    },
    [activeValue, close, items, onKeyDown, onType, select],
  );

  return (
    <>
      <div
        className={className}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={clearLongPress}
        onTouchMove={clearLongPress}
      >
        {children}
      </div>

      {isOpen && (
        <Portal>
          <div
            ref={menuRef}
            role="menu"
            tabIndex={-1}
            aria-orientation="vertical"
            onKeyDown={handleMenuKeyDown}
            style={{ top: coords.y, left: coords.x }}
            className="fixed z-50 min-w-[180px] py-8px rounded-16px border border-border-default bg-bg-secondary shadow-elevate-md outline-none"
          >
            {items.map((item, index) => {
              const isActive = activeValue === index;
              return (
                <button
                  key={`${baseId}-${index}`}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={getTabIndex(index)}
                  disabled={item.disabled}
                  onClick={() => select(item)}
                  onMouseEnter={() => {
                    if (!item.disabled) setActiveValue(index);
                  }}
                  className={classNames(
                    "flex w-full items-center gap-12px px-16px py-10px font-manrope text-14 outline-none transition-colors",
                    {
                      "cursor-pointer": !item.disabled,
                      "cursor-not-allowed opacity-40 text-fg-muted":
                        item.disabled,
                      "text-fg-error": item.danger && !item.disabled,
                      "text-fg-primary": !item.danger && !item.disabled,
                      "bg-bg-tertiary": isActive && !item.disabled,
                    },
                  )}
                >
                  {item.icon && (
                    <span className="inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </Portal>
      )}
    </>
  );
}
