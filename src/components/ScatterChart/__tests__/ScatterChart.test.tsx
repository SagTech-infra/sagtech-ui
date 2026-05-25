import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import ScatterChart from "../ScatterChart";

const series = [
  {
    name: "Group A",
    points: [
      { x: 1, y: 2 },
      { x: 3, y: 5 },
      { x: 5, y: 3 },
    ],
  },
  {
    name: "Group B",
    points: [
      { x: 2, y: 4 },
      { x: 4, y: 1 },
    ],
  },
];

describe("ScatterChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(
      <ScatterChart series={series} width={400} height={300} />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies the height style to the canvas", () => {
    const { container } = render(
      <ScatterChart series={series} width={400} height={250} />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.height).toBe("250px");
  });

  it("renders without throwing when axis labels are provided", () => {
    const { container } = render(
      <ScatterChart series={series} width={400} height={300} xLabel="X Axis" yLabel="Y Axis" />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
