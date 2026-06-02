import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import NumberInput from "../NumberInput";

describe("NumberInput", () => {
  it("renders a spinbutton exposing aria value range", () => {
    render(<NumberInput value={5} min={0} max={10} onChange={() => {}} />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("aria-valuenow", "5");
    expect(input).toHaveAttribute("aria-valuemin", "0");
    expect(input).toHaveAttribute("aria-valuemax", "10");
    expect(input).toHaveAttribute("inputMode", "numeric");
  });

  it("increments by step when the Increment button is clicked", () => {
    const onChange = vi.fn();
    render(<NumberInput value={2} step={2} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Increment" }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("decrements by step when the Decrement button is clicked", () => {
    const onChange = vi.fn();
    render(<NumberInput value={3} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Decrement" }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("steps up and down with arrow keys", () => {
    const onChange = vi.fn();
    render(<NumberInput value={5} onChange={onChange} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(6);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it("clamps to max and disables the Increment button at the ceiling", () => {
    const onChange = vi.fn();
    render(<NumberInput value={10} max={10} onChange={onChange} />);
    const incr = screen.getByRole("button", { name: "Increment" });
    expect(incr).toBeDisabled();
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it("clamps to min and disables the Decrement button at the floor", () => {
    render(<NumberInput value={0} min={0} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Decrement" })).toBeDisabled();
  });

  it("ignores non-numeric typed input", () => {
    const onChange = vi.fn();
    render(<NumberInput value={5} onChange={onChange} />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "abc" },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not step when disabled", () => {
    const onChange = vi.fn();
    render(<NumberInput value={5} disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Increment" }));
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowUp" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards ref to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<NumberInput value={1} ref={ref} onChange={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute("role", "spinbutton");
  });
});
