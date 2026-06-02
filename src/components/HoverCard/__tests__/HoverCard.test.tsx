import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import HoverCard from "../HoverCard";

const setup = (props?: Partial<React.ComponentProps<typeof HoverCard>>) =>
  render(
    <HoverCard
      trigger={<button type="button">Open</button>}
      openDelay={200}
      closeDelay={150}
      {...props}
    >
      <span>Card body</span>
    </HoverCard>,
  );

describe("HoverCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("does not render the card content initially", () => {
    setup();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens after openDelay on mouseenter", () => {
    setup();
    fireEvent.mouseEnter(screen.getByText("Open").parentElement!.parentElement!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Card body")).toBeInTheDocument();
  });

  it("opens on focus after openDelay", () => {
    setup();
    fireEvent.focus(screen.getByText("Open").parentElement!.parentElement!);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes after closeDelay on mouseleave", () => {
    setup();
    const root = screen.getByText("Open").parentElement!.parentElement!;
    fireEvent.mouseEnter(root);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.mouseLeave(root);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("cancels the pending open when leaving before openDelay elapses", () => {
    setup();
    const root = screen.getByText("Open").parentElement!.parentElement!;
    fireEvent.mouseEnter(root);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    fireEvent.mouseLeave(root);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape", () => {
    setup();
    const root = screen.getByText("Open").parentElement!.parentElement!;
    fireEvent.mouseEnter(root);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the trigger content", () => {
    setup();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });
});
