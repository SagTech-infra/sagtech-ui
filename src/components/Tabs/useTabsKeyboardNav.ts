"use client";

import { type KeyboardEvent } from "react";
import { type TabsContextValue } from "./TabsContext";

/**
 * Returns a keydown handler for a tab trigger.
 *
 * Implements the ARIA Authoring Practices Guide tab widget keyboard pattern:
 *   - ArrowLeft / ArrowRight  (horizontal) or ArrowUp / ArrowDown (vertical)
 *     cycle focus among enabled triggers.
 *   - Home → first enabled trigger; End → last enabled trigger.
 *   - automatic mode: focus also activates.
 *   - manual mode: Enter or Space activates the focused trigger.
 */
export function useTabsKeyboardNav(
  ctx: Pick<
    TabsContextValue,
    "orientation" | "activationMode" | "triggerRefs" | "setValue"
  >,
) {
  const { orientation, activationMode, triggerRefs, setValue } = ctx;

  return function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    // Collect values in DOM order by iterating the Map in insertion order.
    // Disabled buttons (aria-disabled or disabled attr) are skipped for
    // activation but NOT for focus-target calculation until we filter.
    const entries = Array.from(triggerRefs.entries()).filter(
      ([, ref]) =>
        ref.current !== null && !ref.current.hasAttribute("disabled"),
    );

    if (entries.length === 0) return;

    const currentIndex = entries.findIndex(
      ([, ref]) => ref.current === e.currentTarget,
    );

    const prev = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const next = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";

    let targetIndex: number;

    if (e.key === prev) {
      e.preventDefault();
      targetIndex = currentIndex <= 0 ? entries.length - 1 : currentIndex - 1;
    } else if (e.key === next) {
      e.preventDefault();
      targetIndex = currentIndex >= entries.length - 1 ? 0 : currentIndex + 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      targetIndex = entries.length - 1;
    } else if (e.key === "Enter" || e.key === " ") {
      // manual mode: activate on Enter / Space
      if (activationMode === "manual") {
        e.preventDefault();
        const focused = entries[currentIndex];
        if (focused) setValue(focused[0]);
      }
      return;
    } else {
      return;
    }

    const [targetValue, targetRef] = entries[targetIndex];
    targetRef.current?.focus();

    if (activationMode === "automatic") {
      setValue(targetValue);
    }
  };
}
