/* eslint-disable react/jsx-key -- JSX values are test fixtures, not a rendered list */
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import FieldSet from "@/components/FieldSet/FieldSet";
import VisuallyHidden from "@/components/VisuallyHidden/VisuallyHidden";
import AspectRatio from "@/components/AspectRatio/AspectRatio";

// Curated accessibility smoke. Renders a representative set (including the new
// v2.2 primitives) and asserts axe finds no violations. Not exhaustive — covers
// components whose markup we control directly; grows over time.
const cases: Array<[string, ReactElement]> = [
  ["Button", <Button>Save</Button>],
  [
    "Label + Input",
    <div>
      <Label htmlFor="a11y-name">Name</Label>
      <Input id="a11y-name" />
    </div>,
  ],
  [
    "FieldSet",
    <FieldSet legend="Preferences">
      <Button>Option</Button>
    </FieldSet>,
  ],
  [
    "VisuallyHidden",
    <button type="button">
      <VisuallyHidden>Close dialog</VisuallyHidden>
      <span aria-hidden>×</span>
    </button>,
  ],
  [
    "AspectRatio",
    <AspectRatio ratio={16 / 9}>
      <div>media</div>
    </AspectRatio>,
  ],
];

describe("a11y (jest-axe)", () => {
  it.each(cases)("%s has no axe violations", async (_name, element) => {
    const { container } = render(element);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
