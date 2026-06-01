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
  const { items, getText, onMatch, resetMs = DEFAULT_RESET_MS } = options;

  const bufferRef = useRef("");
  const timerRef = useRef<number | null>(null);

  // Keep latest callbacks/data in refs so `onType` stays referentially stable.
  const itemsRef = useRef(items);
  const getTextRef = useRef(getText);
  const onMatchRef = useRef(onMatch);
  itemsRef.current = items;
  getTextRef.current = getText;
  onMatchRef.current = onMatch;

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
      const match = itemsRef.current.find((item) =>
        getTextRef.current(item).toLowerCase().startsWith(buffer),
      );
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
