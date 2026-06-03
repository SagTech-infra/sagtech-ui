import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FeatureGrid from "../FeatureGrid";

const items = [
  { title: "One", description: "first" },
  { title: "Two", description: "second" },
];

describe("FeatureGrid", () => {
  it("renders each feature's title and description", () => {
    render(<FeatureGrid items={items} />);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("second")).toBeInTheDocument();
  });

  it("forwards ref to the grid div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<FeatureGrid items={items} ref={ref} />);
    expect(ref.current?.tagName).toBe("DIV");
  });
});
