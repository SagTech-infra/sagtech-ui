import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TextArea } from "../TextArea";

describe("TextArea", () => {
  it("renders a textbox", () => {
    render(<TextArea placeholder="Notes" />);
    const area = screen.getByRole("textbox");
    expect(area).toBeInTheDocument();
    expect(area.tagName).toBe("TEXTAREA");
  });

  it("renders the placeholder", () => {
    render(<TextArea placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("renders a controlled value", () => {
    render(<TextArea value="hello" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("hello");
  });

  it("fires onChange when the user types", () => {
    const onChange = vi.fn();
    render(<TextArea value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "x" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("applies the disabled attribute", () => {
    render(<TextArea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("renders the error message when isError is true", () => {
    render(<TextArea isError errorMessage="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("does not render the error message when isError is false", () => {
    render(<TextArea errorMessage="Required field" />);
    expect(screen.queryByText("Required field")).not.toBeInTheDocument();
  });

  it("appends custom classes to the textarea", () => {
    render(<TextArea classes="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

  it("forwards extra props to the underlying textarea", () => {
    render(<TextArea name="bio" aria-label="Biography" />);
    const area = screen.getByRole("textbox", { name: "Biography" });
    expect(area).toHaveAttribute("name", "bio");
  });

  it("forwards ref to the underlying textarea", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
