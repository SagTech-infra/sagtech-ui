import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PhoneInput from "../PhoneInput";

// The underlying react-international-phone control renders an <input type="tel">
// (implicit ARIA role "textbox") plus a country-selector button exposed with
// role="combobox". The wrapper adds a <label htmlFor={name}>, an `error`
// styling flag, and forwards `ref` to the outer <div>.
const getPhoneInput = () =>
  screen.getByRole("textbox") as HTMLInputElement;

describe("PhoneInput", () => {
  it("renders the tel input and the country selector button", () => {
    render(<PhoneInput value="" onChange={() => {}} />);
    const input = getPhoneInput();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "tel");
    // Country selector is exposed as a combobox alongside the input.
    expect(
      screen.getByRole("combobox", { name: "Country selector" }),
    ).toBeInTheDocument();
  });

  it("reflects the controlled value in the input", () => {
    render(<PhoneInput value="+12025550123" onChange={() => {}} />);
    // The library reformats the E.164 value for display; assert it surfaces the
    // significant digits rather than an exact mask.
    expect(getPhoneInput().value).toContain("202");
  });

  it("calls onChange when the user types into the input", () => {
    const onChange = vi.fn();
    render(<PhoneInput value="" onChange={onChange} />);
    fireEvent.change(getPhoneInput(), { target: { value: "+1 202 555 0123" } });
    expect(onChange).toHaveBeenCalled();
    // First positional arg is the phone string in E.164 format.
    expect(typeof onChange.mock.calls[0][0]).toBe("string");
  });

  it("renders the label with htmlFor matching the name", () => {
    render(
      <PhoneInput value="" onChange={() => {}} label="Phone number" name="phone" />,
    );
    const label = screen.getByText("Phone number");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("for", "phone");
  });

  it("does not render a label when none is provided", () => {
    render(<PhoneInput value="" onChange={() => {}} />);
    expect(screen.queryByText("Phone number")).not.toBeInTheDocument();
  });

  it("disables the input when disabled is set", () => {
    render(<PhoneInput value="" onChange={() => {}} disabled />);
    expect(getPhoneInput()).toBeDisabled();
  });

  it("applies the error styling to the input", () => {
    render(<PhoneInput value="" onChange={() => {}} error />);
    expect(getPhoneInput().className).toContain("!border-error");
  });

  it("forwards ref to the outer container div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<PhoneInput value="" onChange={() => {}} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toContainElement(getPhoneInput());
  });
});
