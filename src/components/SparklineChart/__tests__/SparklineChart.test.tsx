import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import SparklineChart from "../SparklineChart";

const data = [10, 25, 18, 40, 35, 55, 48, 60];

describe("SparklineChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(<SparklineChart data={data} width={80} height={24} />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies width and height styles to the canvas", () => {
    const { container } = render(<SparklineChart data={data} width={120} height={32} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.width).toBe("120px");
    expect(canvas.style.height).toBe("32px");
  });

  it("renders without throwing for each tone variant", () => {
    const tones = ["success", "warning", "error", "neutral"] as const;
    tones.forEach((tone) => {
      const { container } = render(
        <SparklineChart data={data} width={80} height={24} tone={tone} />,
      );
      expect(container.querySelector("canvas")).not.toBeNull();
    });
  });
});
