import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import AspectRatio from "../AspectRatio";

describe("AspectRatio", () => {
  it("renders its children", () => {
    render(
      <AspectRatio>
        <span>media</span>
      </AspectRatio>,
    );
    expect(screen.getByText("media")).toBeInTheDocument();
  });

  it("applies the default 16/9 ratio", () => {
    const { container } = render(<AspectRatio>x</AspectRatio>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.aspectRatio).toBe(`${16 / 9} / 1`);
  });

  it("applies a custom ratio", () => {
    const { container } = render(<AspectRatio ratio={1}>x</AspectRatio>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.aspectRatio).toBe("1 / 1");
  });

  it("merges a custom className onto the wrapper", () => {
    const { container } = render(
      <AspectRatio className="custom-class">x</AspectRatio>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
    expect(wrapper).toHaveClass("relative");
  });

  it("forwards ref to the underlying div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AspectRatio ref={ref}>x</AspectRatio>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
