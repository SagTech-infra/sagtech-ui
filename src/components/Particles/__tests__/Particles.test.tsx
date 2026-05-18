import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Particles from "../Particles";

beforeEach(() => {
  // happy-dom doesn't implement canvas; stub getContext so no errors are thrown
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Particles", () => {
  it("mounts without throwing", () => {
    expect(() => render(<Particles />)).not.toThrow();
  });

  it("renders a wrapper div", () => {
    render(<Particles data-testid="particles" />);
    const el = screen.getByTestId("particles");
    expect(el.tagName).toBe("DIV");
  });

  it("renders a canvas element inside the wrapper", () => {
    const { container } = render(<Particles />);
    // canvas is present when not in reduced-motion mode
    // (useReducedMotion is mocked to return undefined/falsy in vitest.setup.ts)
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
  });

  it("canvas has aria-hidden", () => {
    const { container } = render(<Particles />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards ref to the wrapper div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Particles ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through HTML attributes to the wrapper div", () => {
    render(<Particles data-testid="p" className="custom" />);
    const el = screen.getByTestId("p");
    expect(el).toHaveClass("custom");
  });

  it("unmounts without errors", () => {
    const { unmount } = render(<Particles />);
    expect(() => unmount()).not.toThrow();
  });
});
