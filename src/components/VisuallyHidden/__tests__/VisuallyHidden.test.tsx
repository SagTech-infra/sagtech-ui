import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import VisuallyHidden from "../VisuallyHidden";

describe("VisuallyHidden", () => {
  it("renders its children as a span by default", () => {
    render(<VisuallyHidden>Hidden label</VisuallyHidden>);
    const el = screen.getByText("Hidden label");
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("SPAN");
  });

  it("keeps content in the accessibility tree (queryable by text)", () => {
    render(<VisuallyHidden>Close dialog</VisuallyHidden>);
    expect(screen.getByText("Close dialog")).toBeInTheDocument();
  });

  it("applies sr-only clip styles inline", () => {
    render(<VisuallyHidden>Clipped</VisuallyHidden>);
    const el = screen.getByText("Clipped");
    expect(el).toHaveStyle({
      position: "absolute",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      whiteSpace: "nowrap",
    });
    expect(el.style.clipPath).toBe("inset(50%)");
  });

  it("renders a custom element via the polymorphic `as` prop", () => {
    render(<VisuallyHidden as="div">Region</VisuallyHidden>);
    const el = screen.getByText("Region");
    expect(el.tagName).toBe("DIV");
  });

  it("merges a custom className without dropping clip styles", () => {
    render(<VisuallyHidden className="extra-class">Styled</VisuallyHidden>);
    const el = screen.getByText("Styled");
    expect(el).toHaveClass("extra-class");
    expect(el).toHaveStyle({ position: "absolute" });
  });

  it("merges a custom style without overriding the hide positioning", () => {
    render(
      <VisuallyHidden style={{ color: "red" }}>Colored</VisuallyHidden>,
    );
    const el = screen.getByText("Colored");
    expect(el).toHaveStyle({ color: "red", position: "absolute" });
  });

  it("forwards arbitrary HTML attributes", () => {
    render(<VisuallyHidden id="vh-1">Attrs</VisuallyHidden>);
    expect(screen.getByText("Attrs")).toHaveAttribute("id", "vh-1");
  });

  it("forwards ref to the underlying element", () => {
    const ref = createRef<HTMLElement>();
    render(<VisuallyHidden ref={ref}>Ref</VisuallyHidden>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.textContent).toBe("Ref");
  });
});
