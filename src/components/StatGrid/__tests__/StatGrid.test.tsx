import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatGrid from "../StatGrid";

const items = [
  { value: 107, label: "Components" },
  { value: 749, label: "Tests" },
];

describe("StatGrid", () => {
  it("renders each stat's label", () => {
    render(<StatGrid items={items} />);
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Tests")).toBeInTheDocument();
  });

  it("forwards ref to the grid div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<StatGrid items={items} ref={ref} />);
    expect(ref.current?.tagName).toBe("DIV");
  });
});
