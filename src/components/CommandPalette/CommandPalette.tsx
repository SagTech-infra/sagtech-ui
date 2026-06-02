"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { tokenTransition } from "@/utils/motion";
import classNames from "classnames";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  group?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="flex-shrink-0"
    >
      <path
        d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM19 19l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CommandPalette({
  isOpen,
  onClose,
  items,
  placeholder = "Search commands...",
  className,
}: CommandPaletteProps) {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        (item.description &&
          item.description.toLowerCase().includes(lowerQuery)),
    );
  }, [items, query]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    const ungrouped: CommandItem[] = [];

    for (const item of filteredItems) {
      if (item.group) {
        if (!groups[item.group]) {
          groups[item.group] = [];
        }
        groups[item.group].push(item);
      } else {
        ungrouped.push(item);
      }
    }

    const flatList: Array<
      { type: "header"; label: string } | { type: "item"; item: CommandItem }
    > = [];

    for (const [groupName, groupItems] of Object.entries(groups)) {
      flatList.push({ type: "header", label: groupName });
      for (const item of groupItems) {
        flatList.push({ type: "item", item });
      }
    }

    if (ungrouped.length > 0) {
      for (const item of ungrouped) {
        flatList.push({ type: "item", item });
      }
    }

    return flatList;
  }, [filteredItems]);

  const selectableItems = useMemo(
    () => groupedItems.filter((entry) => entry.type === "item"),
    [groupedItems],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(
          (prev) => (prev + 1) % Math.max(selectableItems.length, 1),
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev <= 0 ? Math.max(selectableItems.length - 1, 0) : prev - 1,
        );
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(Math.max(selectableItems.length - 1, 0));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const selected = selectableItems[activeIndex];
        if (selected && selected.type === "item") {
          selected.item.onSelect();
          onClose();
        }
      }
    },
    [onClose, selectableItems, activeIndex],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setQuery("");
    setActiveIndex(0);
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  let itemIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{ zIndex: "var(--z-modal)" }}
          className="fixed inset-0 bg-backdrop flex items-start justify-center pt-[20vh]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : tokenTransition("fast")}
          onClick={onClose}
        >
          <motion.div
            className={classNames(
              "w-full max-w-[560px] bg-surface-overlay border border-border-default rounded-16px overflow-hidden shadow-6xl",
              className,
            )}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={
              reduceMotion ? { duration: 0 } : tokenTransition("fast")
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-16px border-b border-border-default flex items-center gap-12px">
              <span className="text-fg-muted">
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="bg-transparent text-fg-primary font-manrope text-16 outline-none w-full placeholder:text-fg-muted"
              />
              <span className="text-10 text-fg-muted border border-border-default rounded-[4px] px-6px py-[2px] flex-shrink-0 select-none">
                ESC
              </span>
            </div>

            <div
              ref={listRef}
              className="max-h-[320px] overflow-y-auto custom-scrollbar"
            >
              {filteredItems.length === 0 ? (
                <div className="py-40px flex items-center justify-center">
                  <p className="font-manrope text-14 text-fg-muted">
                    No results found
                  </p>
                </div>
              ) : (
                groupedItems.map((entry) => {
                  if (entry.type === "header") {
                    return (
                      <div
                        key={`header-${entry.label}`}
                        className="px-16px py-8px text-10 text-fg-muted uppercase tracking-wider font-semibold font-manrope"
                      >
                        {entry.label}
                      </div>
                    );
                  }

                  itemIndex++;
                  const currentIndex = itemIndex;
                  const isActive = currentIndex === activeIndex;
                  const { item } = entry;

                  return (
                    <div
                      key={item.id}
                      data-active={isActive}
                      className={classNames(
                        "px-16px py-12px flex items-center gap-12px cursor-pointer transition-colors",
                        {
                          "bg-pr_purple/10": isActive,
                          "hover:bg-bg-tertiary": !isActive,
                        },
                      )}
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      onMouseEnter={() => setActiveIndex(currentIndex)}
                    >
                      {item.icon && (
                        <span
                          className={classNames("flex-shrink-0", {
                            "text-pr_purple": isActive,
                            "text-fg-muted": !isActive,
                          })}
                        >
                          {item.icon}
                        </span>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span
                          className={classNames("text-14 font-manrope", {
                            "text-pr_purple": isActive,
                            "text-fg-primary": !isActive,
                          })}
                        >
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="text-12 text-fg-muted truncate">
                            {item.description}
                          </span>
                        )}
                      </div>
                      {item.shortcut && (
                        <span className="ml-auto text-10 text-fg-muted border border-border-default rounded-[4px] px-6px py-[2px] flex-shrink-0 select-none">
                          {item.shortcut}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
