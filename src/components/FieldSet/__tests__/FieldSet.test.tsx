import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import FieldSet from "../FieldSet";

describe("FieldSet", () => {
  it("renders a group labelled by its legend", () => {
    render(
      <FieldSet legend="Choose a plan">
        <input type="radio" name="plan" aria-label="Free" />
      </FieldSet>,
    );
    const group = screen.getByRole("group", { name: "Choose a plan" });
    expect(group.tagName).toBe("FIELDSET");
  });

  it("renders the legend text in a <legend> element", () => {
    render(<FieldSet legend="Contact details">{null}</FieldSet>);
    const legend = screen.getByText("Contact details");
    expect(legend.tagName).toBe("LEGEND");
  });

  it("renders its children", () => {
    render(
      <FieldSet legend="Group">
        <button type="button">Child</button>
      </FieldSet>,
    );
    expect(
      screen.getByRole("button", { name: "Child" }),
    ).toBeInTheDocument();
  });

  it("keeps the legend in the accessibility tree when visually hidden", () => {
    render(
      <FieldSet legend="Hidden but accessible" legendHidden>
        {null}
      </FieldSet>,
    );
    // Still labels the group for screen readers.
    expect(
      screen.getByRole("group", { name: "Hidden but accessible" }),
    ).toBeInTheDocument();
    // And is visually hidden via the sr-only utility.
    expect(screen.getByText("Hidden but accessible")).toHaveClass("sr-only");
  });

  it("disables the whole group via the native disabled attribute", () => {
    render(
      <FieldSet legend="Disabled group" disabled>
        <input type="text" aria-label="field" />
      </FieldSet>,
    );
    const group = screen.getByRole("group", { name: "Disabled group" });
    expect(group).toBeDisabled();
    expect(screen.getByLabelText("field")).toBeDisabled();
  });

  it("merges a custom className", () => {
    render(
      <FieldSet legend="Styled" className="custom-class">
        {null}
      </FieldSet>,
    );
    expect(screen.getByRole("group", { name: "Styled" })).toHaveClass(
      "custom-class",
    );
  });

  it("forwards ref to the underlying fieldset", () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <FieldSet legend="Ref" ref={ref}>
        {null}
      </FieldSet>,
    );
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });
});
