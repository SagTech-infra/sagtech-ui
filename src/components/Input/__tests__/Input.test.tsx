import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Input from "../Input";

describe("Input", () => {
  it("renders a textbox", () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("reflects the controlled value", () => {
    render(<Input value="hello" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("hello");
  });

  it("fires onChange when the user types", () => {
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "a" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("associates the label with the input via htmlFor", () => {
    render(<Input name="email" label="Email address" />);
    const input = screen.getByLabelText("Email address");
    expect(input).toBe(screen.getByRole("textbox"));
    // id falls back to name when no explicit id is provided
    expect(input).toHaveAttribute("id", "email");
  });

  it("uses an explicit id over the name for the label association", () => {
    render(<Input id="custom-id" name="email" label="Email address" />);
    expect(screen.getByLabelText("Email address")).toHaveAttribute(
      "id",
      "custom-id",
    );
  });

  it("does not set aria-invalid when there is no error", () => {
    render(<Input value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("sets aria-invalid and renders the error message when isError", () => {
    render(<Input isError errorMessage="Required field" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("associates the error message via aria-describedby when isError", () => {
    render(
      <Input name="email" isError errorMessage="Required field" />,
    );
    const input = screen.getByRole("textbox");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("Required field")).toHaveAttribute(
      "id",
      describedBy as string,
    );
  });

  it("omits aria-describedby when isError but no errorMessage is given", () => {
    render(<Input isError />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("forwards the disabled attribute to the input", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("renders the floating label only when state is active and not in error", () => {
    const { rerender } = render(
      <Input state="active" floatingLabel="Floaty" />,
    );
    expect(screen.getByText("Floaty")).toBeInTheDocument();

    rerender(<Input state="default" floatingLabel="Floaty" />);
    expect(screen.queryByText("Floaty")).not.toBeInTheDocument();

    rerender(
      <Input state="active" floatingLabel="Floaty" isError />,
    );
    expect(screen.queryByText("Floaty")).not.toBeInTheDocument();
  });

  it("spreads native input attributes from rest props", () => {
    render(<Input type="email" placeholder="you@example.com" />);
    const input = screen.getByPlaceholderText("you@example.com");
    expect(input).toHaveAttribute("type", "email");
  });
});
