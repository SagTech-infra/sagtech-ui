import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Slider from "../Slider";

describe("Slider", () => {
  it("renders a single thumb with aria-valuenow reflecting value", () => {
    render(<Slider value={40} onChange={vi.fn()} />);
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "40");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
    expect(thumb).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("increases by step on ArrowRight and decreases on ArrowLeft", () => {
    const onChange = vi.fn();
    render(<Slider value={50} step={5} onChange={onChange} />);
    const thumb = screen.getByRole("slider");

    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(55);

    fireEvent.keyDown(thumb, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith(45);
  });

  it("jumps to min on Home and max on End", () => {
    const onChange = vi.fn();
    render(<Slider value={50} min={10} max={90} onChange={onChange} />);
    const thumb = screen.getByRole("slider");

    fireEvent.keyDown(thumb, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith(10);

    fireEvent.keyDown(thumb, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith(90);
  });

  it("clamps at the boundaries", () => {
    const onChange = vi.fn();
    render(<Slider value={100} onChange={onChange} />);
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders two thumbs in range mode and prevents crossing", () => {
    const onChange = vi.fn();
    render(
      <Slider range value={[20, 60]} step={5} onChange={onChange} />,
    );
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "20");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "60");

    // lower thumb cannot pass the upper one: aria-valuemax is the upper value
    expect(thumbs[0]).toHaveAttribute("aria-valuemax", "60");
    expect(thumbs[1]).toHaveAttribute("aria-valuemin", "20");
  });

  it("does not let the lower range thumb cross above the upper thumb", () => {
    const onChange = vi.fn();
    render(<Slider range value={[58, 60]} step={5} onChange={onChange} />);
    const [low] = screen.getAllByRole("slider");
    // ArrowRight would move 58 -> 63, but it must clamp to upper (60)
    fireEvent.keyDown(low, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith([60, 60]);
  });

  it("does not fire onChange when disabled", () => {
    const onChange = vi.fn();
    render(<Slider value={50} disabled onChange={onChange} />);
    const thumb = screen.getByRole("slider");
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
    expect(thumb).toHaveAttribute("aria-disabled", "true");
    expect(thumb).toHaveAttribute("tabindex", "-1");
  });

  it("renders marks", () => {
    render(
      <Slider
        value={50}
        onChange={vi.fn()}
        marks={[
          { value: 0, label: "0" },
          { value: 50, label: "Half" },
          { value: 100, label: "100" },
        ]}
      />,
    );
    expect(screen.getAllByTestId("slider-mark")).toHaveLength(3);
    expect(screen.getByText("Half")).toBeInTheDocument();
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Slider value={50} onChange={vi.fn()} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
