import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LocaleProvider } from "../LocaleProvider";
import { useLocale } from "../LocaleContext";
import { SagtechUIProvider } from "../SagtechUIProvider";

function Probe() {
  const { locale, dir } = useLocale();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="dir">{dir}</span>
    </div>
  );
}

describe("useLocale — no provider", () => {
  it("returns en-US / ltr defaults without any provider", () => {
    render(<Probe />);
    expect(screen.getByTestId("locale").textContent).toBe("en-US");
    expect(screen.getByTestId("dir").textContent).toBe("ltr");
  });
});

describe("LocaleProvider", () => {
  it("passes locale and dir to consumers", () => {
    render(
      <LocaleProvider locale="ar-EG" dir="rtl">
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("locale").textContent).toBe("ar-EG");
    expect(screen.getByTestId("dir").textContent).toBe("rtl");
  });

  it("uses DEFAULT_LOCALE when locale prop is omitted", () => {
    render(
      <LocaleProvider dir="rtl">
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("locale").textContent).toBe("en-US");
    expect(screen.getByTestId("dir").textContent).toBe("rtl");
  });
});

describe("SagtechUIProvider — locale integration", () => {
  it("forwards dir to LocaleProvider when dir prop is set", () => {
    render(
      <SagtechUIProvider dir="rtl">
        <Probe />
      </SagtechUIProvider>,
    );
    expect(screen.getByTestId("dir").textContent).toBe("rtl");
    expect(screen.getByTestId("locale").textContent).toBe("en-US");
  });

  it("returns defaults when no locale/dir props are passed (back-compat)", () => {
    render(
      <SagtechUIProvider>
        <Probe />
      </SagtechUIProvider>,
    );
    expect(screen.getByTestId("locale").textContent).toBe("en-US");
    expect(screen.getByTestId("dir").textContent).toBe("ltr");
  });
});
