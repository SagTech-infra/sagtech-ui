import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Checkbox from "../Checkbox";

describe("Checkbox", () => {
  it("calls onChange with the native event when checked", () => {
    const onChange = vi.fn();
    render(
      <Checkbox
        type="checkbox"
        name="test"
        label="Accept"
        checked={false}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("checkbox", { hidden: true });
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0][0];
    expect(event.target).toBeInstanceOf(HTMLInputElement);
    expect(typeof event.target.checked).toBe("boolean");
  });

  it("calls onCheckedChange with a boolean value", () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        type="checkbox"
        name="test"
        label="Accept"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );
    const input = screen.getByRole("checkbox", { hidden: true });
    fireEvent.click(input);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(typeof onCheckedChange.mock.calls[0][0]).toBe("boolean");
  });

  it("calls both onChange and onCheckedChange when both are supplied", () => {
    const onChange = vi.fn();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        type="checkbox"
        name="test"
        label="Accept"
        checked={false}
        onChange={onChange}
        onCheckedChange={onCheckedChange}
      />,
    );
    const input = screen.getByRole("checkbox", { hidden: true });
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });

  it("does not forward onCheckedChange as a DOM attribute", () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        type="checkbox"
        name="test"
        label="Accept"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );
    const input = screen.getByRole("checkbox", { hidden: true });
    expect(input).not.toHaveAttribute("onCheckedChange");
    expect(input).not.toHaveAttribute("oncheckedchange");
  });
});
