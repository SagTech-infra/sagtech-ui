import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Input from "@/components/Input/Input";
import DateRangePicker from "@/components/DatePicker/DateRangePicker";
import { SagtechUIProvider } from "@/providers/SagtechUIProvider";
import Toaster from "@/components/Toast/Toaster";
import { toast } from "@/components/Toast/toast";
import { toastStore } from "@/components/Toast/ToastStore";
import { Modal } from "@/components/Modal/Modal";
import { Sheet } from "@/components/Sheet/Sheet";

afterEach(() => {
  act(() => toastStore.clear());
});

describe("RTL smoke", () => {
  it("Input floating label uses start-24px (logical) class", () => {
    render(
      <div dir="rtl">
        <Input state="active" label="Name" value="" onChange={() => {}} />
      </div>,
    );
    // The floating label <span> carries start-24px when the swap is applied
    const label = document.querySelector("span.start-24px");
    expect(label).not.toBeNull();
  });

  it("DateRangePicker root carries dir=rtl when wrapped in SagtechUIProvider dir=rtl", () => {
    render(
      <SagtechUIProvider dir="rtl">
        <DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />
      </SagtechUIProvider>,
    );
    // Click the trigger to open so the component is fully mounted
    fireEvent.click(screen.getByRole("button", { name: /select range/i }));
    // The component root div must carry dir="rtl" (wired via useLocale)
    const root = document.querySelector('div[dir="rtl"]');
    expect(root).not.toBeNull();
  });

  it("Toaster portal container carries dir=rtl and logical end-16px class for top-right position", async () => {
    render(
      <SagtechUIProvider dir="rtl">
        <Toaster position="top-right" />
      </SagtechUIProvider>,
    );
    act(() => {
      toast("RTL test");
    });
    // Wait for the toast to appear in the portal
    await waitFor(() => expect(screen.getByRole("status")).toBeInTheDocument());
    // The portal container div on document.body must carry dir="rtl"
    const portalRoot = document.body.querySelector('[dir="rtl"]');
    expect(portalRoot).not.toBeNull();
    // And it must use the logical end-16px class (not right-16px)
    expect(portalRoot!.className).toContain("end-16px");
  });

  it("Modal portal container carries dir=rtl", () => {
    render(
      <SagtechUIProvider dir="rtl">
        <Modal isOpen>
          <p>Modal content</p>
        </Modal>
      </SagtechUIProvider>,
    );
    // The portal renders into document.body — find the element with dir="rtl"
    const portalRoot = document.body.querySelector('[dir="rtl"]');
    expect(portalRoot).not.toBeNull();
  });

  it("Sheet panel carries dir=rtl when wrapped in SagtechUIProvider dir=rtl", () => {
    render(
      <SagtechUIProvider dir="rtl">
        <Sheet open onOpenChange={() => {}} side="right" aria-label="RTL sheet">
          <p>RTL content</p>
        </Sheet>
      </SagtechUIProvider>,
    );
    // The sheet panel (role=dialog) must carry dir="rtl"
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("dir", "rtl");
  });
});
