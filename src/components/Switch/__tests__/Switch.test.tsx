import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Switch from "../Switch";

describe("Switch", () => {
  it("renders a switch role with the label", () => {
    render(<Switch checked={false} label="Notifications" />);
    const sw = screen.getByRole("switch", { name: "Notifications" });
    expect(sw).toBeInTheDocument();
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("reflects the checked state via aria-checked", () => {
    render(<Switch checked label="On" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with the toggled value on click", () => {
    const onChange = vi.fn();
    render(<Switch checked={false} label="Toggle me" onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    render(<Switch checked={false} label="Disabled" disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("associates the description via aria-describedby", () => {
    render(
      <Switch checked={false} label="Wi-Fi" description="Connect to network" />,
    );
    const sw = screen.getByRole("switch");
    const describedBy = sw.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("Connect to network")).toHaveAttribute(
      "id",
      describedBy as string,
    );
  });

  it("forwards ref to the underlying button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch checked={false} label="Ref" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveAttribute("role", "switch");
  });
});
