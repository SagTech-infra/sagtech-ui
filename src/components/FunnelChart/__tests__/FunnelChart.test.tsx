import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import FunnelChart from "../FunnelChart";

const stages = [
  { label: "Awareness", value: 1000 },
  { label: "Interest", value: 600 },
  { label: "Decision", value: 300 },
  { label: "Purchase", value: 150 },
];

describe("FunnelChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(
      <FunnelChart stages={stages} width={400} height={350} />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies the height style to the canvas", () => {
    const { container } = render(
      <FunnelChart stages={stages} width={400} height={280} />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.height).toBe("280px");
  });

  it("renders without throwing in horizontal orientation", () => {
    const { container } = render(
      <FunnelChart stages={stages} width={600} height={200} orientation="horizontal" />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
