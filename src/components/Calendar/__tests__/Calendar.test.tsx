import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Calendar from "../Calendar";
import { LocaleProvider } from "@/providers/LocaleProvider";

// A fixed month avoids flakiness around month boundaries / "today".
const JAN_2026 = new Date(2026, 0, 15);

describe("Calendar", () => {
  it("renders the current month grid with a Monday-first weekday header", () => {
    render(<Calendar value={JAN_2026} />);
    // 7 weekday columnheaders, Monday first (en-US short label starts with "M").
    const headers = document.querySelectorAll(".grid-cols-7 .text-10");
    expect(headers).toHaveLength(7);
    expect(headers[0].textContent).toMatch(/^M/i);
    // Month label is rendered.
    const label = document.querySelector("span.font-semibold");
    expect(label?.textContent).toMatch(/January 2026/);
  });

  it("calls onChange with the clicked day's Date", () => {
    const onChange = vi.fn();
    render(<Calendar value={JAN_2026} onChange={onChange} />);
    // Day "20" of January 2026 is in the current month.
    fireEvent.click(
      screen.getByRole("button", { name: /January 20, 2026/ }),
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    const arg = onChange.mock.calls[0][0] as Date;
    expect(arg.getFullYear()).toBe(2026);
    expect(arg.getMonth()).toBe(0);
    expect(arg.getDate()).toBe(20);
  });

  it("navigates to the previous month", () => {
    render(<Calendar value={JAN_2026} />);
    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    const label = document.querySelector("span.font-semibold");
    expect(label?.textContent).toMatch(/December 2025/);
  });

  it("navigates to the next month", () => {
    render(<Calendar value={JAN_2026} />);
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    const label = document.querySelector("span.font-semibold");
    expect(label?.textContent).toMatch(/February 2026/);
  });

  it("disables days outside [minDate, maxDate] and does not call onChange", () => {
    const onChange = vi.fn();
    render(
      <Calendar
        value={JAN_2026}
        onChange={onChange}
        minDate={new Date(2026, 0, 10)}
        maxDate={new Date(2026, 0, 20)}
      />,
    );
    const outOfRange = screen.getByRole("button", { name: /January 5, 2026/ });
    expect(outOfRange).toBeDisabled();
    expect(outOfRange).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(outOfRange);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("marks the selected day with aria-pressed and aria-selected", () => {
    render(<Calendar value={JAN_2026} />);
    const selected = screen.getByRole("button", { name: /January 15, 2026/ });
    expect(selected).toHaveAttribute("aria-pressed", "true");
    expect(selected).toHaveAttribute("aria-selected", "true");
  });

  it("renders locale-driven weekday labels from LocaleProvider (de-DE)", () => {
    render(
      <LocaleProvider locale="de-DE">
        <Calendar value={JAN_2026} />
      </LocaleProvider>,
    );
    const headers = Array.from(
      document.querySelectorAll(".grid-cols-7 .text-10"),
    ).map((h) => h.textContent ?? "");
    expect(headers).toHaveLength(7);
    expect(headers.every((t) => t.length > 0)).toBe(true);
    // German January month label is "Januar", not "January".
    const label = document.querySelector("span.font-semibold");
    expect(label?.textContent).not.toMatch(/^January/);
    expect(label?.textContent).toMatch(/Januar/);
  });

  it("locale prop overrides the LocaleProvider value", () => {
    render(
      <LocaleProvider locale="de-DE">
        <Calendar value={JAN_2026} locale="en-US" />
      </LocaleProvider>,
    );
    const label = document.querySelector("span.font-semibold");
    expect(label?.textContent).toMatch(/January 2026/);
  });

  it("forwards ref to the root div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Calendar value={JAN_2026} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    // The root contains the weekday grid.
    expect(within(ref.current!).getAllByRole("columnheader")).toHaveLength(7);
  });
});
