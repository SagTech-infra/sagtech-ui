import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, render, screen, fireEvent } from "@testing-library/react";
import JsonView from "../JsonView";

// ─── clipboard mock ───────────────────────────────────────────────────────────
// happy-dom may not have navigator.clipboard; stub it globally.
beforeEach(() => {
  const mockClipboard = {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(""),
    read: vi.fn(),
    write: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  vi.stubGlobal("navigator", { ...navigator, clipboard: mockClipboard });
});

describe("JsonView", () => {
  it("renders object keys and values", () => {
    render(
      <JsonView
        data={{ name: "Alice", age: 30, active: true }}
        collapsed={false}
      />,
    );
    expect(screen.getByText(/"name"/)).toBeInTheDocument();
    expect(screen.getByText(/"Alice"/)).toBeInTheDocument();
    expect(screen.getByText(/"age"/)).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("renders null values", () => {
    render(<JsonView data={{ missing: null }} collapsed={false} />);
    expect(screen.getByText("null")).toBeInTheDocument();
  });

  it("renders array items", () => {
    render(<JsonView data={[1, 2, 3]} collapsed={false} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("collapsed=true initially collapses the root node", () => {
    render(<JsonView data={{ key: "value" }} collapsed={true} />);
    // The details element should not be open
    const details = document.querySelector("details");
    expect(details).not.toBeNull();
    expect(details!.open).toBe(false);
  });

  it("collapsed=false expands all nodes", () => {
    render(<JsonView data={{ outer: { inner: "deep" } }} collapsed={false} />);
    const allDetails = document.querySelectorAll("details");
    allDetails.forEach((d) => {
      expect(d.open).toBe(true);
    });
  });

  it("collapsed=number collapses nodes at or beyond that depth", () => {
    render(
      <JsonView data={{ level1: { level2: { level3: "x" } } }} collapsed={1} />,
    );
    const allDetails = document.querySelectorAll("details");
    // depth 0 → open (0 < 1), depth 1 → collapsed (1 >= 1)
    expect(allDetails[0].open).toBe(true);
    expect(allDetails[1].open).toBe(false);
  });

  it("copy button calls navigator.clipboard.writeText", async () => {
    render(<JsonView data={{ hello: "world" }} copy={true} />);
    const btn = screen.getByRole("button", { name: /copy/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify({ hello: "world" }, null, 2),
    );
  });

  it("does not render copy button when copy=false", () => {
    render(<JsonView data={{ a: 1 }} copy={false} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<JsonView data={{}} ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.tagName).toBe("DIV");
  });

  it("passes extra HTML attributes to the root div", () => {
    render(<JsonView data={{}} data-testid="jv-root" />);
    expect(screen.getByTestId("jv-root")).toBeInTheDocument();
  });
});
