import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import SankeyChart from "../SankeyChart";

const nodes = [
  { id: "a", label: "Source A" },
  { id: "b", label: "Middle B" },
  { id: "c", label: "Sink C" },
];

const links = [
  { source: "a", target: "b", value: 80 },
  { source: "b", target: "c", value: 60 },
];

describe("SankeyChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(
      <SankeyChart nodes={nodes} links={links} width={600} height={400} />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies the height style to the canvas", () => {
    const { container } = render(
      <SankeyChart nodes={nodes} links={links} width={600} height={350} />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.height).toBe("350px");
  });
});
