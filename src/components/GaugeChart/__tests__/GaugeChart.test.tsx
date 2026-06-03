import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import GaugeChart from "../GaugeChart";

describe("GaugeChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(
      <GaugeChart value={65} min={0} max={100} width={200} height={120} />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies width and height styles to the canvas", () => {
    const { container } = render(
      <GaugeChart value={40} min={0} max={100} width={240} height={140} />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.width).toBe("100%");
    expect(canvas.style.height).toBe("140px");
  });

  it("renders without throwing when label and thresholds are provided", () => {
    const { container } = render(
      <GaugeChart
        value={75}
        min={0}
        max={100}
        label="CPU"
        thresholds={[
          { value: 50, color: "#00c853" },
          { value: 80, color: "#ffd600" },
          { value: 100, color: "#d50000" },
        ]}
      />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
