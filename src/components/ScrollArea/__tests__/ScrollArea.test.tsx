import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import ScrollArea from "../ScrollArea";

describe("ScrollArea", () => {
  it("renders children inside the scroll viewport", () => {
    render(
      <ScrollArea>
        <p>scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText("scrollable content")).toBeInTheDocument();
  });

  it("applies the styled scrollbar and vertical overflow by default", () => {
    render(
      <ScrollArea>
        <span data-testid="child">x</span>
      </ScrollArea>,
    );
    const viewport = screen.getByTestId("child").parentElement!;
    expect(viewport).toHaveClass("custom-scrollbar");
    expect(viewport).toHaveClass("overflow-y-auto");
  });

  it("enables both axes when orientation is 'both'", () => {
    render(
      <ScrollArea orientation="both">
        <span data-testid="child">x</span>
      </ScrollArea>,
    );
    const viewport = screen.getByTestId("child").parentElement!;
    expect(viewport).toHaveClass("overflow-auto");
  });

  it("caps the viewport height from a numeric maxHeight", () => {
    render(
      <ScrollArea maxHeight={200}>
        <span data-testid="child">x</span>
      </ScrollArea>,
    );
    const viewport = screen.getByTestId("child").parentElement!;
    expect(viewport).toHaveStyle({ maxHeight: "200px" });
  });

  it("accepts a string maxHeight verbatim", () => {
    render(
      <ScrollArea maxHeight="50vh">
        <span data-testid="child">x</span>
      </ScrollArea>,
    );
    const viewport = screen.getByTestId("child").parentElement!;
    expect(viewport.style.maxHeight).toBe("50vh");
  });

  it("forwards the ref to the scroll viewport div", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref}>
        <span>x</span>
      </ScrollArea>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("custom-scrollbar");
  });

  it("renders decorative fade masks marked aria-hidden when fade is enabled", () => {
    const { container } = render(
      <ScrollArea fade maxHeight={100}>
        <span>x</span>
      </ScrollArea>,
    );
    const masks = container.querySelectorAll('[aria-hidden="true"]');
    expect(masks).toHaveLength(2);
  });

  it("renders no fade masks by default", () => {
    const { container } = render(
      <ScrollArea>
        <span>x</span>
      </ScrollArea>,
    );
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });
});
