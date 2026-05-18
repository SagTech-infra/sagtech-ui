import { describe, expect, it, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import NumberTicker from "../NumberTicker";

afterEach(() => {
  vi.useRealTimers();
});

describe("NumberTicker", () => {
  it("renders the final value immediately when startOnView=false (no IntersectionObserver delay)", async () => {
    vi.useFakeTimers();

    // Mock rAF to run callbacks synchronously
    let rafCallback: FrameRequestCallback | null = null;
    const rafSpy = vi
      .spyOn(globalThis, "requestAnimationFrame")
      .mockImplementation((cb) => {
        rafCallback = cb;
        return 1;
      });

    render(
      <NumberTicker value={100} from={0} duration={1000} startOnView={false} />,
    );

    // Flush all rAF frames by advancing time and running callbacks
    await act(async () => {
      // Advance through full duration
      let ts = 0;
      while (rafCallback) {
        const cb = rafCallback;
        rafCallback = null;
        ts += 100;
        cb(ts);
      }
    });

    expect(screen.getByText("100")).toBeInTheDocument();
    rafSpy.mockRestore();
  });

  it("renders immediately with the final value when from === value", () => {
    render(<NumberTicker value={42} from={42} startOnView={false} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("applies the custom formatter", async () => {
    vi.useFakeTimers();

    let rafCallback: FrameRequestCallback | null = null;
    const rafSpy = vi
      .spyOn(globalThis, "requestAnimationFrame")
      .mockImplementation((cb) => {
        rafCallback = cb;
        return 1;
      });

    const formatter = (n: number) => `$${Math.round(n)}`;
    render(
      <NumberTicker
        value={50}
        from={0}
        duration={500}
        formatter={formatter}
        startOnView={false}
      />,
    );

    await act(async () => {
      let ts = 0;
      while (rafCallback) {
        const cb = rafCallback;
        rafCallback = null;
        ts += 600; // exceed duration
        cb(ts);
      }
    });

    expect(screen.getByText("$50")).toBeInTheDocument();
    rafSpy.mockRestore();
  });

  it("forwards ref to the span element", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<NumberTicker value={0} startOnView={false} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("passes through HTML attributes to the span", () => {
    render(
      <NumberTicker
        value={1}
        startOnView={false}
        data-testid="ticker"
        className="custom-class"
      />,
    );
    const el = screen.getByTestId("ticker");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("custom-class");
  });
});
