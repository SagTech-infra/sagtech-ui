"use client";

import { useCallback, useState, type KeyboardEvent } from "react";

/**
 * Generic roving-tabindex / Arrow-key navigation primitive.
 *
 * Generalizes the keyboard pattern in `src/components/Tabs/useTabsKeyboardNav.ts`
 * for any widget that exposes a flat, ordered collection of focusable items
 * (tabs, menus, tree rows, listbox options, toolbars).
 *
 * The hook owns the index of the single tabbable item (roving tabindex: exactly
 * one item has `tabIndex={0}`, the rest `tabIndex={-1}`). It does NOT move DOM
 * focus itself — the consumer wires `getTabIndex` into rendering and calls the
 * returned `focusItem`/handler results to imperatively focus elements it owns.
 *
 * @template T value type identifying each item (e.g. a node id)
 *
 * Keyboard pattern (ARIA APG):
 *   - `prevKey` / `nextKey` move to the previous / next enabled item.
 *   - `Home` / `End` jump to the first / last enabled item.
 *   - When `loop` is true, movement wraps around the ends; otherwise it clamps.
 *
 * @example
 * const { activeValue, getTabIndex, onKeyDown, setActiveValue } =
 *   useRovingTabindex({
 *     values: visibleIds,
 *     isDisabled: (id) => nodeMap.get(id)?.disabled ?? false,
 *     onActiveChange: (id) => rowRefs.current.get(id)?.focus(),
 *   });
 */
export interface UseRovingTabindexOptions<T> {
  /** Ordered list of item values, in DOM/visible order. */
  values: T[];
  /** Currently active value (controlled). Falls back to internal state. */
  activeValue?: T | null;
  /** Initial active value when uncontrolled. Defaults to the first value. */
  defaultActiveValue?: T | null;
  /** Called whenever the active value changes (move, Home/End, explicit set). */
  onActiveChange?: (value: T) => void;
  /** Returns true for values that should be skipped during navigation. */
  isDisabled?: (value: T) => boolean;
  /** Key that moves to the previous item. Default `"ArrowUp"`. */
  prevKey?: string;
  /** Key that moves to the next item. Default `"ArrowDown"`. */
  nextKey?: string;
  /** Wrap around the ends instead of clamping. Default `true`. */
  loop?: boolean;
}

export interface UseRovingTabindexResult<T> {
  /** The resolved active value (controlled or internal). */
  activeValue: T | null;
  /** `0` for the active item, `-1` for the rest — spread onto each item. */
  getTabIndex: (value: T) => 0 | -1;
  /** Imperatively set the active value (e.g. on click / focus). */
  setActiveValue: (value: T) => void;
  /**
   * Keydown handler implementing the Arrow/Home/End pattern. Returns the value
   * it moved to (or `null` if the key was not handled) so the consumer can act
   * on it (focus the element, etc.). Calls `preventDefault` when it handles a key.
   */
  onKeyDown: (event: KeyboardEvent) => T | null;
}

export function useRovingTabindex<T>(
  options: UseRovingTabindexOptions<T>,
): UseRovingTabindexResult<T> {
  const {
    values,
    activeValue: controlledActive,
    defaultActiveValue,
    onActiveChange,
    isDisabled,
    prevKey = "ArrowUp",
    nextKey = "ArrowDown",
    loop = true,
  } = options;

  const [internalActive, setInternalActive] = useState<T | null>(
    defaultActiveValue ?? values[0] ?? null,
  );

  const isControlled = controlledActive !== undefined;
  const activeValue = isControlled ? controlledActive ?? null : internalActive;

  const enabled = useCallback(
    (value: T) => !(isDisabled?.(value) ?? false),
    [isDisabled],
  );

  const commit = useCallback(
    (value: T) => {
      if (!isControlled) setInternalActive(value);
      onActiveChange?.(value);
    },
    [isControlled, onActiveChange],
  );

  const setActiveValue = useCallback(
    (value: T) => {
      commit(value);
    },
    [commit],
  );

  const getTabIndex = useCallback(
    (value: T): 0 | -1 => {
      // First enabled value is the fallback tabbable when nothing is active yet.
      const fallback = values.find(enabled);
      const target =
        activeValue !== null && values.includes(activeValue)
          ? activeValue
          : fallback ?? null;
      return value === target ? 0 : -1;
    },
    [values, activeValue, enabled],
  );

  const findEnabled = useCallback(
    (startIndex: number, step: 1 | -1): T | null => {
      const count = values.length;
      if (count === 0) return null;
      let index = startIndex;
      for (let i = 0; i < count; i += 1) {
        let next = index + step;
        if (next < 0) {
          if (!loop) return null;
          next = count - 1;
        } else if (next >= count) {
          if (!loop) return null;
          next = 0;
        }
        index = next;
        const value = values[index];
        if (enabled(value)) return value;
      }
      return null;
    },
    [values, enabled, loop],
  );

  const firstEnabled = useCallback((): T | null => {
    for (const value of values) if (enabled(value)) return value;
    return null;
  }, [values, enabled]);

  const lastEnabled = useCallback((): T | null => {
    for (let i = values.length - 1; i >= 0; i -= 1) {
      if (enabled(values[i])) return values[i];
    }
    return null;
  }, [values, enabled]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent): T | null => {
      if (values.length === 0) return null;

      const currentIndex =
        activeValue !== null ? values.indexOf(activeValue) : -1;

      let target: T | null;

      if (event.key === prevKey) {
        target = findEnabled(currentIndex === -1 ? 0 : currentIndex, -1);
      } else if (event.key === nextKey) {
        target = findEnabled(currentIndex === -1 ? -1 : currentIndex, 1);
      } else if (event.key === "Home") {
        target = firstEnabled();
      } else if (event.key === "End") {
        target = lastEnabled();
      } else {
        return null;
      }

      event.preventDefault();
      if (target !== null) commit(target);
      return target;
    },
    [
      values,
      activeValue,
      prevKey,
      nextKey,
      findEnabled,
      firstEnabled,
      lastEnabled,
      commit,
    ],
  );

  return { activeValue, getTabIndex, setActiveValue, onKeyDown };
}

export default useRovingTabindex;
