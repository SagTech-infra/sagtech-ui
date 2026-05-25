import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import BarChart from "../BarChart";

const series = [
  { name: "Alpha", data: [{ x: "Q1", y: 200 }, { x: "Q2", y: 350 }, { x: "Q3", y: 280 }] },
  { name: "Beta", data: [{ x: "Q1", y: 120 }, { x: "Q2", y: 190 }, { x: "Q3", y: 160 }] },
];

describe("BarChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(<BarChart series={series} width={400} height={300} />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies the height style to the canvas", () => {
    const { container } = render(<BarChart series={series} width={400} height={250} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.height).toBe("250px");
  });

  it("renders without throwing in horizontal orientation", () => {
    const { container } = render(
      <BarChart series={series} width={400} height={300} orientation="horizontal" />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
