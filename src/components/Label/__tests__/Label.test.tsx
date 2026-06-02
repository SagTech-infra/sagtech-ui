import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import Label from "../Label";

describe("Label", () => {
  it("renders the children text", () => {
    render(<Label>Email address</Label>);
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });

  it("associates with a control via htmlFor", () => {
    render(<Label htmlFor="email">Email</Label>);
    expect(screen.getByText("Email").closest("label")).toHaveAttribute(
      "for",
      "email",
    );
  });

  it("renders a decorative asterisk when required", () => {
    render(<Label required>Password</Label>);
    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveAttribute("aria-hidden", "true");
  });

  it("omits the asterisk when not required", () => {
    render(<Label>Username</Label>);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("marks the label as disabled via data attribute", () => {
    render(<Label disabled>Locked</Label>);
    expect(screen.getByText("Locked").closest("label")).toHaveAttribute(
      "data-disabled",
      "true",
    );
  });

  it("does not set data-disabled when enabled", () => {
    render(<Label>Active</Label>);
    expect(screen.getByText("Active").closest("label")).not.toHaveAttribute(
      "data-disabled",
    );
  });

  it("merges a custom className", () => {
    render(<Label className="custom-class">Styled</Label>);
    expect(screen.getByText("Styled").closest("label")).toHaveClass(
      "custom-class",
    );
  });

  it("forwards native label attributes", () => {
    render(<Label id="my-label">Native</Label>);
    expect(screen.getByText("Native").closest("label")).toHaveAttribute(
      "id",
      "my-label",
    );
  });

  it("forwards ref to the underlying label element", () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
