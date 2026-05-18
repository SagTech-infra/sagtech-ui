import { describe, expect, it, vi } from "vitest";
import { createRef, useRef, useState } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Drawer from "../Drawer";

function flushRAF() {
  return act(async () => {
    await new Promise<void>((r) =>
      requestAnimationFrame(() => {
        r();
      }),
    );
  });
}

describe("Drawer — focus management", () => {
  it("forwards ref to the panel element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Drawer ref={ref} isOpen onClose={vi.fn()} title="t">
        <button>First</button>
      </Drawer>,
    );
    expect(ref.current).not.toBeNull();
  });

  it("without initialFocusTarget, focuses the first focusable element (the close button)", async () => {
    render(
      <Drawer isOpen onClose={vi.fn()}>
        <button>First</button>
        <button>Second</button>
      </Drawer>,
    );
    await flushRAF();
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Close drawer" }),
      ),
    );
  });

  it("initialFocusTarget = CSS selector focuses the matching node", async () => {
    render(
      <Drawer isOpen onClose={vi.fn()} initialFocusTarget="[data-safe]">
        <button>First</button>
        <button data-safe>Safe</button>
      </Drawer>,
    );
    await flushRAF();
    await waitFor(() => {
      const safe = screen.getByText("Safe");
      expect(document.activeElement).toBe(safe);
    });
  });

  it("initialFocusTarget = ref focuses ref.current", async () => {
    function Fixture() {
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <Drawer isOpen onClose={vi.fn()} initialFocusTarget={ref}>
          <button>First</button>
          <button ref={ref}>Target</button>
        </Drawer>
      );
    }
    render(<Fixture />);
    await flushRAF();
    await waitFor(() =>
      expect(document.activeElement?.textContent).toBe("Target"),
    );
  });

  it("initialFocusTarget = null suppresses auto-focus", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Trigger";
    document.body.appendChild(trigger);
    trigger.focus();

    render(
      <Drawer isOpen onClose={vi.fn()} initialFocusTarget={null}>
        <button>First</button>
      </Drawer>,
    );
    await flushRAF();
    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });

  it("restores focus to the previously focused element on close", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Opener";
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    function Fixture() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button onClick={() => setOpen(false)}>Close it</button>
          <Drawer isOpen={open} onClose={() => setOpen(false)}>
            <button>Inside</button>
          </Drawer>
        </>
      );
    }
    render(<Fixture />);
    await flushRAF();

    fireEvent.click(screen.getByText("Close it"));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    document.body.removeChild(trigger);
  });

  it("Escape key triggers onClose", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose}>
        <button>x</button>
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
