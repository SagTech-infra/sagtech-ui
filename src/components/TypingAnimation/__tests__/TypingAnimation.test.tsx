import { describe, expect, it, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import TypingAnimation from "../TypingAnimation";

afterEach(() => {
  vi.useRealTimers();
});

describe("TypingAnimation", () => {
  it("reveals the full text after all timers fire with startOnView=false", async () => {
    vi.useFakeTimers();

    render(
      <TypingAnimation startOnView={false} duration={50} delay={0}>
        Hello
      </TypingAnimation>,
    );

    await act(async () => {
      // Advance past the full animation: 5 chars × 50ms + some buffer
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("starts with empty text and progressively reveals characters", async () => {
    vi.useFakeTimers();

    const { container } = render(
      <TypingAnimation startOnView={false} duration={100} delay={0}>
        AB
      </TypingAnimation>,
    );

    // Initially empty (delay=0 but first char hasn't fired yet)
    // Advance just past the first character timeout (100ms)
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(container.querySelector("span")?.textContent).toBe("A");

    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(container.querySelector("span")?.textContent).toBe("AB");
  });

  it("respects the delay prop before starting", async () => {
    vi.useFakeTimers();

    const { container } = render(
      <TypingAnimation startOnView={false} duration={50} delay={300}>
        Hi
      </TypingAnimation>,
    );

    // Before delay completes (200ms < 300ms delay), still empty
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(container.querySelector("span")?.textContent).toBe("");

    // Advance to 360ms total: past delay(300) + first char(50ms) but before second char(100ms)
    await act(async () => {
      vi.advanceTimersByTime(160);
    });
    expect(container.querySelector("span")?.textContent).toBe("H");
  });

  it("forwards ref to the span element", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <TypingAnimation startOnView={false} ref={ref}>
        test
      </TypingAnimation>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("passes through HTML attributes to the span", () => {
    render(
      <TypingAnimation
        startOnView={false}
        data-testid="typing"
        className="custom"
      >
        x
      </TypingAnimation>,
    );
    const el = screen.getByTestId("typing");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("custom");
  });
});
