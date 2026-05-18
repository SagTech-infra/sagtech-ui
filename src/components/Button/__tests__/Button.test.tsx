import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../Button";

describe("Button — shape prop", () => {
  it('applies rounded-full when shape="pill"', () => {
    render(<Button shape="pill" text="Pill" />);
    expect(screen.getByRole("button")).toHaveClass("rounded-full");
  });

  it("does not apply rounded-full when shape is omitted", () => {
    render(<Button text="Default" />);
    expect(screen.getByRole("button")).not.toHaveClass("rounded-full");
  });

  it('does not apply rounded-full when shape="default"', () => {
    render(<Button shape="default" text="Default" />);
    expect(screen.getByRole("button")).not.toHaveClass("rounded-full");
  });
});

describe("Button — iconOnly prop", () => {
  it("applies aspect-square when iconOnly={true}", () => {
    render(<Button iconOnly aria-label="Close" />);
    expect(screen.getByRole("button")).toHaveClass("aspect-square");
  });

  it("does not apply aspect-square when iconOnly is omitted", () => {
    render(<Button text="Normal" />);
    expect(screen.getByRole("button")).not.toHaveClass("aspect-square");
  });

  it("warns in dev when iconOnly is true but aria-label is missing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Button iconOnly />);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("iconOnly requires aria-label"),
    );
    warn.mockRestore();
  });

  it("does not warn when iconOnly is true and aria-label is provided", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Button iconOnly aria-label="Close dialog" />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("does not warn when iconOnly is false", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Button text="Normal" />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
