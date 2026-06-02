import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Accordion, AccordionItem } from "../Accordion";

function renderBasic(props?: Partial<React.ComponentProps<typeof Accordion>>) {
  return render(
    <Accordion {...props}>
      <AccordionItem value="a" label="Section A">
        Content A
      </AccordionItem>
      <AccordionItem value="b" label="Section B">
        Content B
      </AccordionItem>
      <AccordionItem value="c" label="Section C">
        Content C
      </AccordionItem>
    </Accordion>,
  );
}

describe("Accordion", () => {
  it("renders headers as buttons collapsed by default", () => {
    renderBasic();
    const header = screen.getByRole("button", { name: "Section A" });
    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("wires aria-controls / aria-labelledby between header and panel", () => {
    renderBasic({ defaultValue: ["a"] });
    const header = screen.getByRole("button", { name: "Section A" });
    const region = screen.getByRole("region");
    expect(header.getAttribute("aria-controls")).toBe(region.getAttribute("id"));
    expect(region.getAttribute("aria-labelledby")).toBe(header.getAttribute("id"));
  });

  it("opens a panel on click in single mode and reflects aria-expanded", () => {
    renderBasic({ type: "single" });
    const header = screen.getByRole("button", { name: "Section A" });
    fireEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("region", { name: "Section A" }),
    ).toBeInTheDocument();
  });

  it("single mode keeps at most one panel open", () => {
    renderBasic({ type: "single", defaultValue: ["a"] });
    fireEvent.click(screen.getByRole("button", { name: "Section B" }));
    expect(screen.getByRole("button", { name: "Section A" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Section B" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("multiple mode allows several panels open at once", () => {
    renderBasic({ type: "multiple" });
    fireEvent.click(screen.getByRole("button", { name: "Section A" }));
    fireEvent.click(screen.getByRole("button", { name: "Section C" }));
    expect(screen.getByRole("button", { name: "Section A" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Section C" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("invokes onValueChange with the next open values (controlled)", () => {
    const onValueChange = vi.fn();
    render(
      <Accordion type="multiple" value={["a"]} onValueChange={onValueChange}>
        <AccordionItem value="a" label="Section A">
          Content A
        </AccordionItem>
        <AccordionItem value="b" label="Section B">
          Content B
        </AccordionItem>
      </Accordion>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Section B" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("moves the roving tabindex with ArrowDown / ArrowUp", () => {
    renderBasic();
    const a = screen.getByRole("button", { name: "Section A" });
    const b = screen.getByRole("button", { name: "Section B" });
    // First enabled header is tabbable.
    expect(a).toHaveAttribute("tabindex", "0");
    expect(b).toHaveAttribute("tabindex", "-1");

    fireEvent.focus(a);
    fireEvent.keyDown(a, { key: "ArrowDown" });
    expect(b).toHaveAttribute("tabindex", "0");
    expect(a).toHaveAttribute("tabindex", "-1");

    fireEvent.focus(b);
    fireEvent.keyDown(b, { key: "ArrowUp" });
    expect(a).toHaveAttribute("tabindex", "0");
  });

  it("End / Home jump to the last / first header", () => {
    renderBasic();
    const a = screen.getByRole("button", { name: "Section A" });
    const c = screen.getByRole("button", { name: "Section C" });
    fireEvent.focus(a);
    fireEvent.keyDown(a, { key: "End" });
    expect(c).toHaveAttribute("tabindex", "0");
    fireEvent.focus(c);
    fireEvent.keyDown(c, { key: "Home" });
    expect(a).toHaveAttribute("tabindex", "0");
  });

  it("does not toggle a disabled item", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="a" label="Section A" disabled>
          Content A
        </AccordionItem>
      </Accordion>,
    );
    const header = screen.getByRole("button", { name: "Section A" });
    fireEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
