import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import AreaChart from "../AreaChart";

const series = [
  { name: "Revenue", data: [{ x: "Jan", y: 100 }, { x: "Feb", y: 150 }, { x: "Mar", y: 120 }] },
  { name: "Costs", data: [{ x: "Jan", y: 60 }, { x: "Feb", y: 80 }, { x: "Mar", y: 70 }] },
];

describe("AreaChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(<AreaChart series={series} width={400} height={300} />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies the height style to the canvas", () => {
    const { container } = render(<AreaChart series={series} width={400} height={200} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.height).toBe("200px");
  });
});
