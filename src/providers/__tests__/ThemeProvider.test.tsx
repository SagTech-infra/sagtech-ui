import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeProvider } from "../ThemeProvider";
import { useTheme } from "../ThemeContext";
import { ThemeScript } from "../ThemeScript";

function Probe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme("light")}>to-light</button>
    </div>
  );
}

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.colorScheme = "";
    mockMatchMedia(true); // system → dark
  });

  it("applies defaultTheme to <html>", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <Probe />
      </ThemeProvider>,
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
  });

  it("setTheme updates DOM and persists to localStorage", () => {
    render(
      <ThemeProvider defaultTheme="dark" storageKey="test-theme">
        <Probe />
      </ThemeProvider>,
    );
    act(() => {
      screen.getByText("to-light").click();
    });
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("test-theme")).toBe("light");
  });

  it("resolves system theme via matchMedia", () => {
    mockMatchMedia(false); // prefers light
    render(
      <ThemeProvider defaultTheme="system">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("system");
    expect(screen.getByTestId("resolved").textContent).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("controlled mode ignores localStorage and reflects the theme prop", () => {
    localStorage.setItem("sagtech-ui-theme", "dark");
    render(
      <ThemeProvider theme="light">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("resolved").textContent).toBe("light");
  });
});

describe("ThemeScript", () => {
  it("renders a script tag that reads the storage key and sets data-theme", () => {
    const { container } = render(
      <ThemeScript storageKey="test-theme" defaultTheme="dark" />,
    );
    const script = container.querySelector("script");
    expect(script).not.toBeNull();
    expect(script?.innerHTML).toContain("test-theme");
    expect(script?.innerHTML).toContain("data-theme");
    expect(script?.innerHTML).toContain("colorScheme");
  });
});
