"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Type-ahead buffer for keyboard-navigable widgets.
 *
 * Extracts the 800ms type-ahead pattern from `DropdownMenu` (a buffer that
 * accumulates printable keystrokes and resets after a quiet period, matching
 * the first item whose searchable text starts with the buffer).
 *
 * Generic over the item type; the consumer supplies the searchable text for
 * each item via `getText` and is notified of the matched item via `onMatch`.
 *
 * @template T item type (e.g. a tree node id)
 *
 * @example
 * const { onType } = useTypeahead<string>({
 *   items: visibleIds,
 *   getText: (id) => labelOf(id),
 *   onMatch: (id) => focusRow(id),
 * });
 * // in keydown handler:
 * if (event.key.length === 1 && /\S/.test(event.key)) onType(event.key);
 */
export interface UseTypeaheadOptions<T> {
  /** Ordered list of candidate items to search, in visible order. */
  items: T[];
  /** Returns the searchable text for an item. */
  getText: (item: T) => string;
  /** Called with the matched item when the buffer matches one. */
  onMatch: (item: T) => void;
  /** Milliseconds of inactivity before the buffer resets. Default `800`. */
  resetMs?: number;
  /**
   * Returns the currently-active/focused item so repeated same-character
   * presses cycle through all matches after it (ARIA APG type-ahead).
   * When omitted the hook falls back to finding the first match from the
   * list start (backward-compatible behaviour).
   */
  getActiveItem?: () => T | null;
}

export interface UseTypeaheadResult {
  /** Feed a single printable character into the buffer. */
  onType: (char: string) => void;
  /** Clear the buffer immediately (e.g. on blur / close). */
  reset: () => void;
}

const DEFAULT_RESET_MS = 800;

export function useTypeahead<T>(
  options: UseTypeaheadOptions<T>,
): UseTypeaheadResult {
  const { items, getText, onMatch, resetMs = DEFAULT_RESET_MS, getActiveItem } = options;

  const bufferRef = useRef("");
  const timerRef = useRef<number | null>(null);

  // Keep latest callbacks/data in refs so `onType` stays referentially stable.
  const itemsRef = useRef(items);
  const getTextRef = useRef(getText);
  const onMatchRef = useRef(onMatch);
  const getActiveItemRef = useRef(getActiveItem);
  itemsRef.current = items;
  getTextRef.current = getText;
  onMatchRef.current = onMatch;
  getActiveItemRef.current = getActiveItem;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    bufferRef.current = "";
    clearTimer();
  }, [clearTimer]);

  const onType = useCallback(
    (char: string) => {
      bufferRef.current += char.toLowerCase();

      clearTimer();
      timerRef.current = window.setTimeout(() => {
        bufferRef.current = "";
        timerRef.current = null;
      }, resetMs);

      const buffer = bufferRef.current;
      const currentItems = itemsRef.current;
      const getText = getTextRef.current;

      // ARIA APG cycling: when the buffer is all the same character (e.g. "f",
      // "ff", "fff"), search for the next item whose text starts with that
      // single character AFTER the currently-active item, wrapping around.
      const isAllSameChar =
        buffer.length >= 1 && buffer.split("").every((c) => c === buffer[0]);

      let match: T | undefined;

      if (isAllSameChar && getActiveItemRef.current) {
        const singleChar = buffer[0];
        const activeItem = getActiveItemRef.current();
        const activeIdx =
          activeItem !== null && activeItem !== undefined
            ? currentItems.indexOf(activeItem)
            : -1;

        // Search from the item AFTER the active one, wrapping around.
        const len = currentItems.length;
        for (let offset = 1; offset <= len; offset++) {
          const candidate = currentItems[(activeIdx + offset) % len];
          if (getText(candidate).toLowerCase().startsWith(singleChar)) {
            match = candidate;
            break;
          }
        }
      } else {
        match = currentItems.find((item) =>
          getText(item).toLowerCase().startsWith(buffer),
        );
      }

      if (match !== undefined) {
        onMatchRef.current(match);
      }
    },
    [clearTimer, resetMs],
  );

  // Clean up the pending reset timer on unmount.
  useEffect(() => clearTimer, [clearTimer]);

  return { onType, reset };
}

export default useTypeahead;
