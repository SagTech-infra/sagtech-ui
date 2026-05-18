import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Stack from "../Stack";

describe("Stack", () => {
  it("renders children", () => {
    render(<Stack>child content</Stack>);
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("applies the correct gap class", () => {
    const { container } = render(<Stack gap="lg">x</Stack>);
    expect(container.firstChild).toHaveClass("gap-24px");
  });

  it("applies the correct align class", () => {
    const { container } = render(<Stack align="center">x</Stack>);
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("applies the correct justify class", () => {
    const { container } = render(<Stack justify="between">x</Stack>);
    expect(container.firstChild).toHaveClass("justify-between");
  });

  it("renders as an alternative element", () => {
    const { container } = render(<Stack as="section">x</Stack>);
    expect((container.firstChild as HTMLElement).tagName).toBe("SECTION");
  });

  it("defaults to gap-16px when no gap prop is provided", () => {
    const { container } = render(<Stack>x</Stack>);
    expect(container.firstChild).toHaveClass("gap-16px");
  });

  it("merges extra className", () => {
    const { container } = render(<Stack className="custom-cls">x</Stack>);
    expect(container.firstChild).toHaveClass("custom-cls");
  });
});
