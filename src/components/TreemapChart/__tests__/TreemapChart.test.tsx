import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import TreemapChart from "../TreemapChart";
import type { TreemapNode } from "../types";

const data: TreemapNode[] = [
  {
    id: "tech",
    label: "Technology",
    value: 400,
    children: [
      { id: "hw", label: "Hardware", value: 150 },
      { id: "sw", label: "Software", value: 250 },
    ],
  },
  { id: "finance", label: "Finance", value: 200 },
  { id: "health", label: "Healthcare", value: 150 },
];

describe("TreemapChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(
      <TreemapChart data={data} width={600} height={400} />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies the height style to the canvas", () => {
    const { container } = render(
      <TreemapChart data={data} width={500} height={350} />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.height).toBe("100%");
  });

  it("renders flat data (no children) without throwing", () => {
    const flatData: TreemapNode[] = [
      { id: "a", label: "Alpha", value: 100 },
      { id: "b", label: "Beta", value: 200 },
      { id: "c", label: "Gamma", value: 150 },
    ];
    const { container } = render(
      <TreemapChart data={flatData} width={500} height={300} />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
