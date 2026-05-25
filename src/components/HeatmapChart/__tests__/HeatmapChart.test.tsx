import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import HeatmapChart from "../HeatmapChart";
import type { HeatmapDatum } from "../types";

const xLabels = ["Mon", "Tue", "Wed"];
const yLabels = ["Morning", "Afternoon", "Evening"];

const data: HeatmapDatum[] = [
  { x: "Mon", y: "Morning", value: 10 },
  { x: "Tue", y: "Afternoon", value: 55 },
  { x: "Wed", y: "Evening", value: 80 },
];

describe("HeatmapChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(
      <HeatmapChart data={data} xLabels={xLabels} yLabels={yLabels} width={400} height={300} />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies the height style to the canvas", () => {
    const { container } = render(
      <HeatmapChart data={data} xLabels={xLabels} yLabels={yLabels} width={400} height={200} />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.height).toBe("200px");
  });
});
