import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CTASection from "../CTASection";

describe("CTASection", () => {
  it("renders title, subtitle and actions", () => {
    render(<CTASection title="TITLE" subtitle="SUB" actions={<button>Go</button>} />);
    expect(screen.getByRole("heading", { name: "TITLE" })).toBeInTheDocument();
    expect(screen.getByText("SUB")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("forwards ref to the section element", () => {
    const ref = createRef<HTMLElement>();
    render(<CTASection title="X" ref={ref} />);
    expect(ref.current?.tagName).toBe("SECTION");
  });
});
