import { describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRef } from "react";
import ConfirmDialog from "../ConfirmDialog";
import { ConfirmProvider, useConfirm } from "../ConfirmProvider";

describe("ConfirmDialog (declarative)", () => {
  it("renders title and description when open", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="Delete?"
        description="This cannot be undone."
      />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete?")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(<ConfirmDialog open={false} onOpenChange={() => {}} title="x" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onConfirm when the primary button is clicked", () => {
    const spy = vi.fn();
    render(
      <ConfirmDialog open onOpenChange={() => {}} title="x" onConfirm={spy} />,
    );
    fireEvent.click(screen.getByText("Confirm"));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange(false) when cancel is clicked", () => {
    const spy = vi.fn();
    render(<ConfirmDialog open onOpenChange={spy} title="x" />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(spy).toHaveBeenCalledWith(false);
  });

  it("disables buttons while loading", () => {
    render(<ConfirmDialog open onOpenChange={() => {}} title="x" loading />);
    expect(screen.getByText("Confirm").closest("button")).toBeDisabled();
    expect(screen.getByText("Cancel").closest("button")).toBeDisabled();
  });
});

describe("useConfirm() imperative API", () => {
  function Probe({
    onResult,
    options = {},
  }: {
    onResult: (accepted: boolean) => void;
    options?: Parameters<ReturnType<typeof useConfirm>>[0] extends infer O
      ? Partial<O>
      : never;
  }) {
    const confirm = useConfirm();
    const promiseRef = useRef<Promise<boolean> | null>(null);
    return (
      <button
        type="button"
        onClick={() => {
          promiseRef.current = confirm({
            title: "Are you sure?",
            ...options,
          });
          promiseRef.current.then(onResult);
        }}
      >
        trigger
      </button>
    );
  }

  it("throws outside of a provider", () => {
    function UnsafeCaller() {
      useConfirm();
      return null;
    }
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<UnsafeCaller />)).toThrow(/ConfirmProvider/);
    spy.mockRestore();
  });

  it("resolves true when the user confirms", async () => {
    const result = vi.fn();
    render(
      <ConfirmProvider>
        <Probe onResult={result} />
      </ConfirmProvider>,
    );
    fireEvent.click(screen.getByText("trigger"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() => expect(result).toHaveBeenCalledWith(true));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("resolves false when the user cancels", async () => {
    const result = vi.fn();
    render(
      <ConfirmProvider>
        <Probe onResult={result} />
      </ConfirmProvider>,
    );
    fireEvent.click(screen.getByText("trigger"));
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => expect(result).toHaveBeenCalledWith(false));
  });

  it("keeps the dialog open in loading state while an async onConfirm runs", async () => {
    const result = vi.fn();
    let resolveInner!: () => void;
    const pending = new Promise<void>((resolve) => {
      resolveInner = resolve;
    });

    render(
      <ConfirmProvider>
        <Probe onResult={result} options={{ onConfirm: () => pending }} />
      </ConfirmProvider>,
    );

    fireEvent.click(screen.getByText("trigger"));
    fireEvent.click(screen.getByText("Confirm"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Cancel").closest("button")).toBeDisabled();
    expect(result).not.toHaveBeenCalled();

    await act(async () => {
      resolveInner();
      await pending;
    });

    await waitFor(() => expect(result).toHaveBeenCalledWith(true));
  });

  it("processes queued confirm() calls sequentially", async () => {
    const results: boolean[] = [];
    function Queue() {
      const confirm = useConfirm();
      return (
        <button
          type="button"
          onClick={() => {
            confirm({ title: "A" }).then((v) => results.push(v));
            confirm({ title: "B" }).then((v) => results.push(v));
          }}
        >
          fire
        </button>
      );
    }

    render(
      <ConfirmProvider>
        <Queue />
      </ConfirmProvider>,
    );

    fireEvent.click(screen.getByText("fire"));
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() => expect(screen.getByText("B")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => expect(results).toEqual([true, false]));
  });
});

describe("ConfirmDialog — initialFocusTarget", () => {
  function flushRAF() {
    return act(async () => {
      await new Promise<void>((r) =>
        requestAnimationFrame(() => {
          r();
        }),
      );
    });
  }

  it("without initialFocusTarget, focuses the primary confirm button (existing behavior)", async () => {
    render(<ConfirmDialog open onOpenChange={() => {}} title="Delete?" />);
    await flushRAF();
    await waitFor(() => {
      const primary = document.querySelector<HTMLButtonElement>(
        'button[data-sagtech-confirm-primary="true"]',
      );
      expect(document.activeElement).toBe(primary);
    });
  });

  it("initialFocusTarget = selector overrides the primary-button default", async () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="Delete?"
        cancelText="Cancel"
        initialFocusTarget="button:not([data-sagtech-confirm-primary])"
      />,
    );
    await flushRAF();
    await waitFor(() => {
      expect(document.activeElement?.textContent).toBe("Cancel");
    });
  });
});
