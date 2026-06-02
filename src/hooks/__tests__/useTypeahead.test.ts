import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypeahead } from "../useTypeahead";

describe("useTypeahead", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("matches the first item whose text starts with the typed buffer", () => {
    const items = ["Alpha", "Beta", "Charlie"];
    const onMatch = vi.fn();
    const { result } = renderHook(() =>
      useTypeahead({ items, getText: (x) => x, onMatch }),
    );
    act(() => {
      result.current.onType("b");
    });
    expect(onMatch).toHaveBeenCalledWith("Beta");
  });

  it("resets the buffer after the quiet period", () => {
    const items = ["Alpha", "Beta"];
    const onMatch = vi.fn();
    const { result } = renderHook(() =>
      useTypeahead({ items, getText: (x) => x, onMatch, resetMs: 500 }),
    );
    act(() => {
      result.current.onType("a");
    });
    expect(onMatch).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(600);
      result.current.onType("b");
    });
    expect(onMatch).toHaveBeenLastCalledWith("Beta");
  });

  // BUG 1 tests — repeated same character should cycle past active item
  it("cycles to the NEXT matching item when the same char is typed twice (BUG 1)", () => {
    const items = ["fig", "foo", "bar", "fizz"];
    const onMatch = vi.fn();
    let active = "fig";
    const { result } = renderHook(() =>
      useTypeahead({
        items,
        getText: (x) => x,
        onMatch: (item) => {
          active = item;
          onMatch(item);
        },
        getActiveItem: () => active,
      }),
    );
    // First 'f' — active is "fig", should match next 'f*' after "fig" → "foo"
    act(() => {
      result.current.onType("f");
    });
    expect(onMatch).toHaveBeenLastCalledWith("foo");
    active = "foo";

    // Second 'f' (buffer = 'ff' → all same char → single-char cycle)
    act(() => {
      result.current.onType("f");
    });
    expect(onMatch).toHaveBeenLastCalledWith("fizz");
    active = "fizz";

    // Third 'f' — wraps back to "fig"
    act(() => {
      result.current.onType("f");
    });
    expect(onMatch).toHaveBeenLastCalledWith("fig");
  });

  it("cycles all-same-char sequence across three f-items (f1→f2→f3→f1)", () => {
    const items = ["apple", "fig", "foo", "fizz", "mango"];
    const onMatch = vi.fn();
    let active: string | null = null;
    const { result } = renderHook(() =>
      useTypeahead({
        items,
        getText: (x) => x,
        onMatch: (item) => {
          active = item;
          onMatch(item);
        },
        getActiveItem: () => active,
      }),
    );

    // From null active, first 'f' should pick the first f-item "fig"
    act(() => { result.current.onType("f"); });
    expect(onMatch).toHaveBeenLastCalledWith("fig");
    active = "fig";

    // Reset buffer, then second isolated 'f' — cycles to "foo"
    act(() => { vi.advanceTimersByTime(1000); }); // reset
    act(() => { result.current.onType("f"); });
    expect(onMatch).toHaveBeenLastCalledWith("foo");
    active = "foo";

    // Reset, then 'f' again → "fizz"
    act(() => { vi.advanceTimersByTime(1000); });
    act(() => { result.current.onType("f"); });
    expect(onMatch).toHaveBeenLastCalledWith("fizz");
    active = "fizz";

    // Reset, then 'f' again → wraps back to "fig"
    act(() => { vi.advanceTimersByTime(1000); });
    act(() => { result.current.onType("f"); });
    expect(onMatch).toHaveBeenLastCalledWith("fig");
  });

  it("multi-char buffer still uses full startsWith (not cycling)", () => {
    const items = ["fig", "foo", "fix", "fa"];
    const onMatch = vi.fn();
    const active: string | null = "fig";
    const { result } = renderHook(() =>
      useTypeahead({
        items,
        getText: (x) => x,
        onMatch,
        getActiveItem: () => active,
      }),
    );
    // 'f' then 'i' — buffer is "fi", different chars → full prefix search
    act(() => { result.current.onType("f"); });
    act(() => { result.current.onType("i"); });
    // "fi" matches "fig" first from start of list (not cycling)
    expect(onMatch).toHaveBeenLastCalledWith("fig");
  });

  it("works without getActiveItem (backward-compat, no cycling)", () => {
    const items = ["fig", "foo", "fizz"];
    const onMatch = vi.fn();
    const { result } = renderHook(() =>
      useTypeahead({ items, getText: (x) => x, onMatch }),
    );
    act(() => { result.current.onType("f"); });
    // Without active item, falls back to first match from list start
    expect(onMatch).toHaveBeenCalledWith("fig");
  });
});
