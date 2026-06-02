"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import classNames from "classnames";
import { mergeRefs } from "../../utils/mergeRefs";

export interface ScrollAreaProps {
  /** Scrollable content. */
  children?: ReactNode;
  /** Caps the viewport height; numbers are treated as pixels. */
  maxHeight?: string | number;
  className?: string;
  /** Scroll axes to enable. Defaults to vertical-only. */
  orientation?: "vertical" | "both";
  /**
   * Render subtle fade masks at the scrollable edges, shown only when there
   * is hidden content in that direction.
   */
  fade?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const overflowMap = {
  vertical: "overflow-y-auto overflow-x-hidden",
  both: "overflow-auto",
} as const;

export default function ScrollArea({
  children,
  maxHeight,
  className,
  orientation = "vertical",
  fade = false,
  ref,
}: ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);

  const updateEdges = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setAtTop(scrollTop <= 0);
    setAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
  }, []);

  useEffect(() => {
    if (!fade) return;
    updateEdges();
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    return () => el.removeEventListener("scroll", updateEdges);
  }, [fade, updateEdges, children]);

  const style =
    maxHeight != null
      ? {
          maxHeight:
            typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        }
      : undefined;

  const viewport = (
    <div
      ref={mergeRefs(viewportRef, ref)}
      style={style}
      className={classNames(
        "custom-scrollbar",
        overflowMap[orientation],
        fade ? "h-full" : className,
      )}
    >
      {children}
    </div>
  );

  if (!fade) return viewport;

  return (
    <div className={classNames("relative", className)} style={style}>
      {viewport}
      <div
        aria-hidden
        className={classNames(
          "pointer-events-none absolute inset-x-0 top-0 h-24px bg-gradient-to-b from-bg-primary to-transparent transition-opacity duration-200",
          atTop ? "opacity-0" : "opacity-100",
        )}
      />
      <div
        aria-hidden
        className={classNames(
          "pointer-events-none absolute inset-x-0 bottom-0 h-24px bg-gradient-to-t from-bg-primary to-transparent transition-opacity duration-200",
          atBottom ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
