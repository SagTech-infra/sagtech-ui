import { describe, expect, it, vi } from "vitest";
import { createRef, useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Tabs from "../Tabs";
import TabsRoot from "../TabsRoot";
import TabsList from "../TabsList";
import TabsTrigger from "../TabsTrigger";
import TabsContent from "../TabsContent";

function CompoundFixture(props: {
  defaultValue?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  lazyMount?: boolean;
  disabledValue?: string;
}) {
  return (
    <TabsRoot
      defaultValue={props.defaultValue ?? "one"}
      orientation={props.orientation}
      activationMode={props.activationMode}
      lazyMount={props.lazyMount}
    >
      <TabsList aria-label="Sections">
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two" disabled={props.disabledValue === "two"}>
          Two
        </TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Panel one</TabsContent>
      <TabsContent value="two">Panel two</TabsContent>
      <TabsContent value="three">Panel three</TabsContent>
    </TabsRoot>
  );
}

describe("Tabs — compound API", () => {
  it("emits correct ARIA semantics on tablist, tabs and panels", () => {
    render(<CompoundFixture />);

    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");
    expect(tablist).toHaveAttribute("aria-label", "Sections");

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Panel one");
    expect(panel).toHaveAttribute("aria-labelledby", tabs[0].id);
    expect(tabs[0]).toHaveAttribute("aria-controls", panel.id);
  });

  it("roving tabindex — only active trigger is tabbable", () => {
    render(<CompoundFixture />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(tabs[2]).toHaveAttribute("tabindex", "-1");
  });

  it("ArrowRight cycles forward, ArrowLeft cycles back (automatic mode activates)", () => {
    render(<CompoundFixture />);
    const tabs = screen.getAllByRole("tab");

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tabs[1], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[2]);
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tabs[2], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[0]);

    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(tabs[2]);
  });

  it("Home jumps to first, End jumps to last", () => {
    render(<CompoundFixture defaultValue="two" />);
    const tabs = screen.getAllByRole("tab");

    tabs[1].focus();
    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(document.activeElement).toBe(tabs[2]);

    fireEvent.keyDown(tabs[2], { key: "Home" });
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("vertical orientation uses ArrowUp/ArrowDown", () => {
    render(<CompoundFixture orientation="vertical" />);
    const tabs = screen.getAllByRole("tab");
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(tabs[1]);

    fireEvent.keyDown(tabs[1], { key: "ArrowUp" });
    expect(document.activeElement).toBe(tabs[0]);

    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("disabled triggers are skipped during arrow navigation", () => {
    render(<CompoundFixture disabledValue="two" />);
    const tabs = screen.getAllByRole("tab");

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[2]);
  });

  it("manual activation: arrow moves focus only, Enter activates", () => {
    render(<CompoundFixture activationMode="manual" />);
    const tabs = screen.getAllByRole("tab");

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tabs[1], { key: "Enter" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("controlled mode: value + onValueChange", () => {
    function Controlled() {
      const [value, setValue] = useState("two");
      return (
        <TabsRoot value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">A</TabsContent>
          <TabsContent value="two">B</TabsContent>
        </TabsRoot>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("B");
    fireEvent.click(screen.getByRole("tab", { name: "One" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("A");
  });

  it("lazyMount=true (default) — inactive panel content is not in the DOM", () => {
    render(<CompoundFixture />);
    expect(screen.queryByText("Panel two")).not.toBeInTheDocument();
    expect(screen.queryByText("Panel three")).not.toBeInTheDocument();
    expect(screen.getByText("Panel one")).toBeInTheDocument();
  });

  it("lazyMount=false — all panels render with hidden attribute", () => {
    render(<CompoundFixture lazyMount={false} />);
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels).toHaveLength(3);
    expect(panels.filter((p) => !p.hasAttribute("hidden"))).toHaveLength(1);
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TabsRoot ref={ref} defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
        </TabsList>
        <TabsContent value="one">A</TabsContent>
      </TabsRoot>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("Tabs — items-prop facade (backward compat)", () => {
  it("renders, click cycles, onChange(index) fires", () => {
    const onChange = vi.fn();
    render(
      <Tabs
        items={[
          { label: "A", content: <div>Panel A</div> },
          { label: "B", content: <div>Panel B</div> },
        ]}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel A");
    fireEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel B");
  });

  it("honors defaultValue", () => {
    render(
      <Tabs
        defaultValue="tab-1"
        items={[
          { label: "A", content: <div>Panel A</div> },
          { label: "B", content: <div>Panel B</div> },
        ]}
      />,
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel B");
  });

  it("exposes static compound subcomponents on Tabs.Root etc.", () => {
    expect(Tabs.Root).toBe(TabsRoot);
    expect(Tabs.List).toBe(TabsList);
    expect(Tabs.Trigger).toBe(TabsTrigger);
    expect(Tabs.Content).toBe(TabsContent);
  });
});

describe("TabsContext guards", () => {
  it("TabsTrigger outside of TabsRoot throws a helpful error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <TabsList>
          <TabsTrigger value="x">X</TabsTrigger>
        </TabsList>,
      ),
    ).toThrow(/Tabs sub-component was rendered outside of <Tabs.Root>/);
    spy.mockRestore();
  });
});

// Silence unused-import warning since within is used implicitly via screen
void within;
