import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import ColorPicker from "../ColorPicker";

function openPanel() {
  // The Popover trigger is the only button rendered before opening.
  fireEvent.click(screen.getAllByRole("button")[0]);
}

describe("ColorPicker", () => {
  it("renders the trigger with the current value", () => {
    render(<ColorPicker value="#3B82F6" onChange={() => {}} />);
    expect(screen.getByText("#3B82F6")).toBeInTheDocument();
  });

  it("renders a label when provided", () => {
    render(<ColorPicker value="#3B82F6" onChange={() => {}} label="Brand color" />);
    expect(screen.getByText("Brand color")).toBeInTheDocument();
  });

  it("opens the panel when the trigger is clicked", () => {
    render(<ColorPicker value="#3B82F6" onChange={() => {}} />);
    expect(screen.queryByTestId("colorpicker-panel")).not.toBeInTheDocument();
    openPanel();
    expect(screen.getByTestId("colorpicker-panel")).toBeInTheDocument();
  });

  it("calls onChange with a normalized hex when a swatch is clicked", () => {
    const onChange = vi.fn();
    render(
      <ColorPicker value="#000000" onChange={onChange} swatches={["#ef4444"]} />,
    );
    openPanel();
    fireEvent.click(screen.getByLabelText("Select color #EF4444"));
    expect(onChange).toHaveBeenCalledWith("#EF4444");
  });

  const hexInput = () =>
    screen.getByLabelText("Hex color value") as HTMLInputElement;

  it("commits a valid hex from the text input on blur", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#000000" onChange={onChange} />);
    openPanel();
    fireEvent.change(hexInput(), { target: { value: "#abc" } });
    fireEvent.blur(hexInput());
    expect(onChange).toHaveBeenCalledWith("#AABBCC");
  });

  it("commits a valid hex on Enter", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#000000" onChange={onChange} />);
    openPanel();
    fireEvent.change(hexInput(), { target: { value: "ff0000" } });
    fireEvent.keyDown(hexInput(), { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("#FF0000");
  });

  it("rejects invalid hex input without calling onChange", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#123456" onChange={onChange} />);
    openPanel();
    fireEvent.change(hexInput(), { target: { value: "not-a-color" } });
    fireEvent.blur(hexInput());
    expect(onChange).not.toHaveBeenCalled();
    // Draft reverts to the controlled value.
    expect(hexInput().value).toBe("#123456");
  });

  it("renders H/S/L sliders but no alpha slider by default", () => {
    render(<ColorPicker value="#3B82F6" onChange={() => {}} />);
    openPanel();
    const panel = screen.getByTestId("colorpicker-panel");
    expect(within(panel).getByText("Hue")).toBeInTheDocument();
    expect(within(panel).getByText("Saturation")).toBeInTheDocument();
    expect(within(panel).getByText("Lightness")).toBeInTheDocument();
    expect(within(panel).queryByText("Alpha")).not.toBeInTheDocument();
  });

  it("renders an alpha slider when alpha is enabled", () => {
    render(<ColorPicker value="#3B82F6FF" alpha onChange={() => {}} />);
    openPanel();
    expect(
      within(screen.getByTestId("colorpicker-panel")).getByText("Alpha"),
    ).toBeInTheDocument();
  });

  it("emits an 8-digit hex when alpha is enabled and a swatch is picked", () => {
    const onChange = vi.fn();
    render(
      <ColorPicker
        value="#000000FF"
        alpha
        onChange={onChange}
        swatches={["#ff0000"]}
      />,
    );
    openPanel();
    fireEvent.click(screen.getByLabelText("Select color #FF0000FF"));
    expect(onChange).toHaveBeenCalledWith("#FF0000FF");
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ColorPicker value="#3B82F6" onChange={() => {}} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders a hidden input mirroring the value when name is set", () => {
    const { container } = render(
      <ColorPicker value="#3B82F6" onChange={() => {}} name="brand" />,
    );
    const hidden = container.querySelector(
      'input[type="hidden"][name="brand"]',
    ) as HTMLInputElement;
    expect(hidden).not.toBeNull();
    expect(hidden.value).toBe("#3B82F6");
  });
});
