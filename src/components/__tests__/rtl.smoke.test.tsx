import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Input from "@/components/Input/Input";
import DateRangePicker from "@/components/DatePicker/DateRangePicker";
import { SagtechUIProvider } from "@/providers/SagtechUIProvider";

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
});
