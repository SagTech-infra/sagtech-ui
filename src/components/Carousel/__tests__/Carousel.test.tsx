import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Carousel from "../Carousel";

const slides = [
  <div key="a">Slide A</div>,
  <div key="b">Slide B</div>,
  <div key="c">Slide C</div>,
];

describe("Carousel", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all slides and a dot per page", () => {
    render(<Carousel>{slides}</Carousel>);
    expect(screen.getByText("Slide A")).toBeInTheDocument();
    expect(screen.getByText("Slide B")).toBeInTheDocument();
    expect(screen.getByText("Slide C")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Go to slide/ }),
    ).toHaveLength(3);
  });

  it("exposes the carousel region with roledescription and label", () => {
    render(<Carousel ariaLabel="Promos">{slides}</Carousel>);
    const region = screen.getByRole("region", { name: "Promos" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("advances with the Next button and fires onIndexChange", () => {
    const onIndexChange = vi.fn();
    render(<Carousel onIndexChange={onIndexChange}>{slides}</Carousel>);
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(
      screen.getByRole("button", { name: "Go to slide 2" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("goes back with the Prev button", () => {
    const onIndexChange = vi.fn();
    render(<Carousel onIndexChange={onIndexChange}>{slides}</Carousel>);
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
    expect(
      screen.getByRole("button", { name: "Go to slide 1" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("navigates when a dot is clicked", () => {
    const onIndexChange = vi.fn();
    render(<Carousel onIndexChange={onIndexChange}>{slides}</Carousel>);
    fireEvent.click(screen.getByRole("button", { name: "Go to slide 3" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    expect(
      screen.getByRole("button", { name: "Go to slide 3" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("moves with ArrowRight and ArrowLeft when focused", () => {
    render(<Carousel ariaLabel="Keys">{slides}</Carousel>);
    const region = screen.getByRole("region", { name: "Keys" });
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(
      screen.getByRole("button", { name: "Go to slide 2" }),
    ).toHaveAttribute("aria-current", "true");
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(
      screen.getByRole("button", { name: "Go to slide 1" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("disables arrows at the ends when loop is off", () => {
    render(<Carousel>{slides}</Carousel>);
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  });

  it("wraps around at the ends when loop is on", () => {
    const onIndexChange = vi.fn();
    render(
      <Carousel loop onIndexChange={onIndexChange}>
        {slides}
      </Carousel>,
    );
    expect(screen.getByRole("button", { name: "Previous slide" })).not.toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("respects the controlled index prop", () => {
    const { rerender } = render(
      <Carousel index={0}>{slides}</Carousel>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    // controlled: still on slide 1 until the parent updates the prop
    expect(
      screen.getByRole("button", { name: "Go to slide 1" }),
    ).toHaveAttribute("aria-current", "true");
    rerender(<Carousel index={2}>{slides}</Carousel>);
    expect(
      screen.getByRole("button", { name: "Go to slide 3" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("autoplays and advances on the interval", () => {
    vi.useFakeTimers();
    const onIndexChange = vi.fn();
    render(
      <Carousel autoplay={1000} onIndexChange={onIndexChange}>
        {slides}
      </Carousel>,
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("hides dots and arrows when disabled via props", () => {
    render(
      <Carousel showDots={false} showArrows={false}>
        {slides}
      </Carousel>,
    );
    expect(
      screen.queryByRole("button", { name: "Next slide" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Go to slide/ }),
    ).not.toBeInTheDocument();
  });
});
