import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "../Avatar";

describe("Avatar — size prop", () => {
  it('renders with correct dimensions for string size "sm"', () => {
    const { container } = render(<Avatar size="sm" name="John Doe" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: "32px", height: "32px" });
  });

  it('renders with correct dimensions for string size "xl"', () => {
    const { container } = render(<Avatar size="xl" name="Jane Smith" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: "64px", height: "64px" });
  });

  it("renders with inline width/height for numeric size", () => {
    const { container } = render(<Avatar size={80} name="Alex Brown" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: "80px", height: "80px" });
  });

  it("applies font size proportional to numeric size", () => {
    const { container } = render(<Avatar size={100} name="Pat Lee" />);
    const span = container.querySelector("span");
    expect(span).toHaveStyle({ fontSize: "40px" });
  });

  it('uses default "md" size (40px) when no size is provided', () => {
    const { container } = render(<Avatar name="Default Size" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: "40px", height: "40px" });
  });

  it("renders initials for named avatar", () => {
    render(<Avatar size={48} name="John Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
