import { describe, expect, it, vi } from "vitest";
import { useRef } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Modal } from "../Modal";

function flushRAF() {
  return act(async () => {
    await new Promise<void>((r) =>
      requestAnimationFrame(() => {
        r();
      }),
    );
  });
}

describe("Modal — initialFocusTarget", () => {
  it("without initialFocusTarget, focuses the first focusable element", async () => {
    render(
      <Modal isOpen toggle={vi.fn()} aria-label="m">
        <button>First</button>
        <button>Second</button>
      </Modal>,
    );
    await flushRAF();
    await waitFor(() =>
      expect(document.activeElement?.textContent).toBe("First"),
    );
  });

  it("initialFocusTarget = CSS selector focuses the matching node", async () => {
    render(
      <Modal
        isOpen
        toggle={vi.fn()}
        aria-label="m"
        initialFocusTarget="[data-safe]"
      >
        <button>First</button>
        <button data-safe>Safe</button>
      </Modal>,
    );
    await flushRAF();
    await waitFor(() => {
      const safe = screen.getByText("Safe");
      expect(document.activeElement).toBe(safe);
    });
  });

  it("initialFocusTarget = HTMLElement focuses that element directly", async () => {
    const el = document.createElement("button");
    el.textContent = "External";
    document.body.appendChild(el);
    render(
      <Modal isOpen toggle={vi.fn()} aria-label="m" initialFocusTarget={el}>
        <button>First</button>
      </Modal>,
    );
    await flushRAF();
    await waitFor(() => expect(document.activeElement).toBe(el));
    document.body.removeChild(el);
  });

  it("initialFocusTarget = ref focuses ref.current", async () => {
    function Fixture() {
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <Modal isOpen toggle={vi.fn()} aria-label="m" initialFocusTarget={ref}>
          <button>First</button>
          <button ref={ref}>Target</button>
        </Modal>
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
    expect(document.activeElement).toBe(trigger);

    render(
      <Modal isOpen toggle={vi.fn()} aria-label="m" initialFocusTarget={null}>
        <button>First</button>
      </Modal>,
    );
    await flushRAF();
    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });
});
