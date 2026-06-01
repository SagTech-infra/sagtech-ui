import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import TimePicker from "../TimePicker";

describe("TimePicker", () => {
  it("renders hour and minute selects with correct option counts", () => {
    render(<TimePicker value={{ hours: 0, minutes: 0 }} />);
    const hours = screen.getByLabelText("Hours");
    const minutes = screen.getByLabelText("Minutes");
    // 24 hours (00-23); minutes default step 5 -> 12 options.
    expect(hours.querySelectorAll("option")).toHaveLength(24);
    expect(minutes.querySelectorAll("option")).toHaveLength(12);
  });

  it("fires onChange with {hours,minutes} when hours change", () => {
    const onChange = vi.fn();
    render(
      <TimePicker value={{ hours: 0, minutes: 15 }} onChange={onChange} />,
    );
    fireEvent.change(screen.getByLabelText("Hours"), {
      target: { value: "9" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ hours: 9, minutes: 15 });
  });

  it("fires onChange with {hours,minutes} when minutes change", () => {
    const onChange = vi.fn();
    render(
      <TimePicker value={{ hours: 8, minutes: 0 }} onChange={onChange} />,
    );
    fireEvent.change(screen.getByLabelText("Minutes"), {
      target: { value: "30" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ hours: 8, minutes: 30 });
  });

  it("changes minute option count with step", () => {
    render(<TimePicker value={{ hours: 0, minutes: 0 }} step={15} />);
    // step 15 -> 0,15,30,45 = 4 options.
    expect(
      screen.getByLabelText("Minutes").querySelectorAll("option"),
    ).toHaveLength(4);
  });

  it("disables both selects when disabled", () => {
    render(<TimePicker value={{ hours: 0, minutes: 0 }} disabled />);
    expect(screen.getByLabelText("Hours")).toBeDisabled();
    expect(screen.getByLabelText("Minutes")).toBeDisabled();
  });

  it("renders the default Time label and reflects the controlled value", () => {
    render(<TimePicker value={{ hours: 14, minutes: 25 }} />);
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Hours")).toHaveValue("14");
    // 25 snaps down to nearest step-5 boundary -> 25.
    expect(screen.getByLabelText("Minutes")).toHaveValue("25");
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<TimePicker value={{ hours: 0, minutes: 0 }} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
