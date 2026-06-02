import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import RadarChart from "../RadarChart";

const axes = ["Speed", "Strength", "Agility", "Endurance", "Intelligence"];

const series = [
  { name: "Team A", values: [80, 60, 70, 50, 90] },
  { name: "Team B", values: [50, 90, 40, 80, 60] },
];

describe("RadarChart — mount smoke", () => {
  it("renders a canvas element without throwing", () => {
    const { container } = render(
      <RadarChart series={series} axes={axes} width={400} height={350} />,
    );
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("applies the height style to the canvas", () => {
    const { container } = render(
      <RadarChart series={series} axes={axes} width={400} height={300} />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.height).toBe("300px");
  });
});
