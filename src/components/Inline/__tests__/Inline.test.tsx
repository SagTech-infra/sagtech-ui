import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Inline from "../Inline";

describe("Inline", () => {
  it("renders children", () => {
    render(<Inline>child content</Inline>);
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("applies the correct gap class", () => {
    const { container } = render(<Inline gap="sm">x</Inline>);
    expect(container.firstChild).toHaveClass("gap-12px");
  });

  it("applies the correct align class", () => {
    const { container } = render(<Inline align="center">x</Inline>);
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("applies flex-wrap when wrap is true", () => {
    const { container } = render(<Inline wrap>x</Inline>);
    expect(container.firstChild).toHaveClass("flex-wrap");
  });

  it("does not apply flex-wrap when wrap is false", () => {
    const { container } = render(<Inline wrap={false}>x</Inline>);
    expect(container.firstChild).not.toHaveClass("flex-wrap");
  });

  it("renders as an alternative element", () => {
    const { container } = render(<Inline as="nav">x</Inline>);
    expect((container.firstChild as HTMLElement).tagName).toBe("NAV");
  });

  it("defaults to gap-16px when no gap prop is provided", () => {
    const { container } = render(<Inline>x</Inline>);
    expect(container.firstChild).toHaveClass("gap-16px");
  });
});
