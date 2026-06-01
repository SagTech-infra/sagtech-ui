"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import classNames from "classnames";
import { useLocale } from "@/providers/LocaleContext";
import { useRovingTabindex } from "@/hooks/useRovingTabindex";
import { useTypeahead } from "@/hooks/useTypeahead";
import type { TreeNode, TreeViewProps } from "./types";

/** A node flattened into the visible (expanded) traversal order. */
interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
  expandable: boolean;
  expanded: boolean;
}

const INDENT_PER_LEVEL_PX = 16;
const BASE_PADDING_PX = 8;

function nodeText(label: ReactNode, id: string): string {
  return typeof label === "string" ? label : id;
}

export default function TreeView({
  nodes,
  expandedIds,
  onExpandedChange,
  defaultExpandedIds,
  selectedId,
  onSelect,
  defaultSelectedId,
  loadChildren,
  className,
  ref,
  ...aria
}: TreeViewProps) {
  const { dir } = useLocale();
  const isRtl = dir === "rtl";

  // --- expanded state (controlled-first) ---
  const [internalExpanded, setInternalExpanded] = useState<string[]>(
    defaultExpandedIds ?? [],
  );
  const expandedIsControlled = expandedIds !== undefined;
  const expanded = expandedIsControlled
    ? (expandedIds as string[])
    : internalExpanded;
  const expandedSet = useMemo(() => new Set(expanded), [expanded]);

  // Always-fresh snapshot of `expanded` so async callbacks (lazy load) compute
  // their payload from the latest value rather than a stale closure capture.
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  const setExpanded = useCallback(
    (next: string[]) => {
      if (!expandedIsControlled) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [expandedIsControlled, onExpandedChange],
  );

  // Adds `id` to the expanded set without dropping concurrent additions:
  // uncontrolled uses a functional updater, controlled derives from the freshest
  // value via `expandedRef`.
  const addExpanded = useCallback(
    (id: string) => {
      if (!expandedIsControlled) {
        setInternalExpanded((prev) =>
          prev.includes(id) ? prev : [...prev, id],
        );
      }
      const current = expandedRef.current;
      if (!current.includes(id)) {
        onExpandedChange?.([...current, id]);
      }
    },
    [expandedIsControlled, onExpandedChange],
  );

  // --- selected state (controlled-first) ---
  const [internalSelected, setInternalSelected] = useState<string | undefined>(
    defaultSelectedId,
  );
  const selectedIsControlled = selectedId !== undefined;
  const selected = selectedIsControlled ? selectedId : internalSelected;

  const select = useCallback(
    (id: string) => {
      if (!selectedIsControlled) setInternalSelected(id);
      onSelect?.(id);
    },
    [selectedIsControlled, onSelect],
  );

  // --- lazy-loaded children, keyed by node id ---
  const [loadedChildren, setLoadedChildren] = useState<
    Record<string, TreeNode[]>
  >({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const childrenOf = useCallback(
    (node: TreeNode): TreeNode[] | undefined =>
      node.children ?? loadedChildren[node.id],
    [loadedChildren],
  );

  const isExpandable = useCallback(
    (node: TreeNode): boolean => {
      const kids = childrenOf(node);
      return (kids !== undefined && kids.length > 0) || node.hasChildren === true;
    },
    [childrenOf],
  );

  // --- flatten visible nodes in traversal order ---
  const flat = useMemo<FlatNode[]>(() => {
    const out: FlatNode[] = [];
    const walk = (list: TreeNode[], level: number, parentId: string | null) => {
      for (const node of list) {
        const expandable = isExpandable(node);
        const isExpanded = expandable && expandedSet.has(node.id);
        out.push({ node, level, parentId, expandable, expanded: isExpanded });
        if (isExpanded) {
          const kids = childrenOf(node);
          if (kids && kids.length > 0) walk(kids, level + 1, node.id);
        }
      }
    };
    walk(nodes, 1, null);
    return out;
  }, [nodes, expandedSet, isExpandable, childrenOf]);

  const visibleIds = useMemo(() => flat.map((f) => f.node.id), [flat]);
  const flatById = useMemo(() => {
    const map = new Map<string, FlatNode>();
    for (const f of flat) map.set(f.node.id, f);
    return map;
  }, [flat]);

  // --- row element refs for imperative focus ---
  const rowRefs = useRef(new Map<string, HTMLDivElement | null>());

  const focusRow = useCallback((id: string) => {
    rowRefs.current.get(id)?.focus();
  }, []);

  // --- roving tabindex over visible rows ---
  const { activeValue, getTabIndex, setActiveValue, onKeyDown: rovingKeyDown } =
    useRovingTabindex<string>({
      values: visibleIds,
      isDisabled: (id) => flatById.get(id)?.node.disabled ?? false,
      onActiveChange: focusRow,
    });

  // --- type-ahead over visible rows ---
  const { onType } = useTypeahead<string>({
    items: visibleIds,
    getText: (id) => {
      const f = flatById.get(id);
      return f ? nodeText(f.node.label, id) : id;
    },
    onMatch: (id) => {
      setActiveValue(id);
      focusRow(id);
    },
  });

  // --- expand / collapse helpers ---

  // True when `candidate` is the collapsing node or any of its descendants in
  // the currently-visible traversal (i.e. it sits below `id` and at a deeper
  // level until the next sibling at `id`'s level).
  const isWithinSubtree = useCallback(
    (id: string, candidate: string): boolean => {
      if (id === candidate) return true;
      const startIdx = flat.findIndex((f) => f.node.id === id);
      if (startIdx === -1) return false;
      const baseLevel = flat[startIdx].level;
      for (let i = startIdx + 1; i < flat.length; i += 1) {
        if (flat[i].level <= baseLevel) break;
        if (flat[i].node.id === candidate) return true;
      }
      return false;
    },
    [flat],
  );

  const collapse = useCallback(
    (id: string) => {
      if (!expandedSet.has(id)) return;
      // If the roving active row is a descendant about to leave the visible set,
      // move the active value up to the collapsing node so Tab re-entry lands on
      // the logically-current row instead of the fallback first row.
      if (
        activeValue !== null &&
        activeValue !== id &&
        isWithinSubtree(id, activeValue)
      ) {
        setActiveValue(id);
      }
      setExpanded(expanded.filter((e) => e !== id));
    },
    [expandedSet, expanded, setExpanded, activeValue, isWithinSubtree, setActiveValue],
  );

  const expandNode = useCallback(
    (node: TreeNode) => {
      if (expandedSet.has(node.id)) return;
      // Lazy load when children not present yet but the node declares it has some.
      const kids = childrenOf(node);
      const needsLoad =
        (kids === undefined || kids.length === 0) &&
        node.hasChildren === true &&
        loadChildren !== undefined;

      if (needsLoad && !loadingIds.has(node.id)) {
        setLoadingIds((prev) => new Set(prev).add(node.id));
        loadChildren(node)
          .then((resolved) => {
            setLoadedChildren((prev) => ({ ...prev, [node.id]: resolved }));
            // Use the concurrency-safe adder so a sibling expansion that landed
            // while this promise was in flight is not clobbered.
            addExpanded(node.id);
          })
          .finally(() => {
            setLoadingIds((prev) => {
              const next = new Set(prev);
              next.delete(node.id);
              return next;
            });
          });
        return;
      }

      addExpanded(node.id);
    },
    [expandedSet, childrenOf, loadChildren, loadingIds, addExpanded],
  );

  const toggle = useCallback(
    (node: TreeNode) => {
      if (expandedSet.has(node.id)) collapse(node.id);
      else expandNode(node);
    },
    [expandedSet, collapse, expandNode],
  );

  // --- keyboard handling ---
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, current: FlatNode) => {
      const { node } = current;

      // Arrow expand/collapse semantics, flipped for RTL.
      const expandKey = isRtl ? "ArrowLeft" : "ArrowRight";
      const collapseKey = isRtl ? "ArrowRight" : "ArrowLeft";

      if (event.key === expandKey) {
        event.preventDefault();
        if (current.expandable && !current.expanded) {
          expandNode(node);
        } else if (current.expanded) {
          // Move into the first child.
          const idx = visibleIds.indexOf(node.id);
          const child = flat[idx + 1];
          if (child && child.parentId === node.id) {
            setActiveValue(child.node.id);
            focusRow(child.node.id);
          }
        }
        return;
      }

      if (event.key === collapseKey) {
        event.preventDefault();
        if (current.expandable && current.expanded) {
          collapse(node.id);
        } else if (current.parentId) {
          setActiveValue(current.parentId);
          focusRow(current.parentId);
        }
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!node.disabled) select(node.id);
        return;
      }

      // Up/Down/Home/End delegated to the roving-tabindex hook.
      const moved = rovingKeyDown(event);
      if (moved !== null) return;

      // Printable single chars feed the type-ahead buffer.
      if (event.key.length === 1 && /\S/.test(event.key)) {
        onType(event.key);
      }
    },
    [
      isRtl,
      expandNode,
      collapse,
      select,
      visibleIds,
      flat,
      setActiveValue,
      focusRow,
      rovingKeyDown,
      onType,
    ],
  );

  const renderRows = useCallback(
    (list: TreeNode[], level: number): ReactNode => (
      <>
        {list.map((node) => {
          const expandable = isExpandable(node);
          const isExpanded = expandable && expandedSet.has(node.id);
          const isSelected = selected === node.id;
          const isLoading = loadingIds.has(node.id);
          const tabIndex = getTabIndex(node.id);
          const isActive = activeValue === node.id;
          const flatNode = flatById.get(node.id);
          const kids = childrenOf(node);

          const paddingInlineStart =
            BASE_PADDING_PX + (level - 1) * INDENT_PER_LEVEL_PX;

          return (
            <li
              key={node.id}
              role="treeitem"
              aria-level={level}
              aria-selected={isSelected}
              {...(expandable ? { "aria-expanded": isExpanded } : {})}
            >
              <div
                ref={(el) => {
                  rowRefs.current.set(node.id, el);
                }}
                tabIndex={node.disabled ? -1 : tabIndex}
                data-active={isActive || undefined}
                data-selected={isSelected || undefined}
                data-disabled={node.disabled || undefined}
                onClick={() => {
                  if (node.disabled) return;
                  setActiveValue(node.id);
                  select(node.id);
                  if (expandable) toggle(node);
                }}
                onFocus={() => {
                  if (!node.disabled) setActiveValue(node.id);
                }}
                onKeyDown={(e) =>
                  flatNode && handleKeyDown(e, flatNode)
                }
                style={{ paddingInlineStart: `${paddingInlineStart}px` }}
                className={classNames(
                  "flex items-center gap-8px rounded-8px py-[6px] pr-8px",
                  "font-manrope text-14 select-none outline-none",
                  "focus-visible:ring-2 focus-visible:ring-pr_purple",
                  {
                    "cursor-pointer": !node.disabled,
                    "cursor-not-allowed opacity-40": node.disabled,
                    "bg-bg-secondary text-fg-primary":
                      isSelected && !node.disabled,
                    "text-fg-primary hover:bg-surface-overlay":
                      !isSelected && !node.disabled,
                    "text-fg-muted": node.disabled,
                  },
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    "inline-flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center text-fg-muted transition-transform duration-150",
                    {
                      "rotate-90": isExpanded && !isRtl,
                      "-rotate-90": isExpanded && isRtl,
                      "rotate-180": !isExpanded && isRtl,
                      "opacity-0": !expandable,
                    },
                  )}
                >
                  {isLoading ? (
                    <span
                      data-testid={`tree-loading-${node.id}`}
                      className="inline-block h-[12px] w-[12px] animate-spin rounded-circle border-2 border-fg-muted border-t-transparent"
                    />
                  ) : (
                    <svg
                      width="8"
                      height="12"
                      viewBox="0 0 8 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 1L6.5 6L1.5 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                {node.icon && (
                  <span className="inline-flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                    {node.icon}
                  </span>
                )}

                <span className="truncate">{node.label}</span>
              </div>

              {isExpanded && kids && kids.length > 0 && (
                <ul role="group" className="m-0 list-none p-0">
                  {renderRows(kids, level + 1)}
                </ul>
              )}
            </li>
          );
        })}
      </>
    ),
    [
      isExpandable,
      expandedSet,
      selected,
      loadingIds,
      getTabIndex,
      activeValue,
      flatById,
      childrenOf,
      isRtl,
      setActiveValue,
      select,
      toggle,
      handleKeyDown,
    ],
  );

  return (
    <ul
      ref={ref}
      role="tree"
      dir={dir}
      aria-label={aria["aria-label"]}
      aria-labelledby={aria["aria-labelledby"]}
      className={classNames("m-0 list-none p-0", className)}
    >
      {renderRows(nodes, 1)}
    </ul>
  );
}
