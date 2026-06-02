import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PanelGroup, Panel, PanelResizeHandle } from "../PanelGroup";

describe("PanelGroup", () => {
  it("renders a horizontal group with two Panels containing children", () => {
    render(
      <PanelGroup direction="horizontal">
        <Panel>
          <div>left</div>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <div>right</div>
        </Panel>
      </PanelGroup>,
    );
    expect(screen.getByText("left")).toBeInTheDocument();
    expect(screen.getByText("right")).toBeInTheDocument();
  });

  it("renders the resize handle with role=separator", () => {
    render(
      <PanelGroup direction="horizontal">
        <Panel>
          <div>a</div>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <div>b</div>
        </Panel>
      </PanelGroup>,
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("supports the vertical direction", () => {
    const { container } = render(
      <PanelGroup direction="vertical">
        <Panel>
          <div>top</div>
        </Panel>
        <PanelResizeHandle direction="vertical" />
        <Panel>
          <div>bottom</div>
        </Panel>
      </PanelGroup>,
    );
    expect(screen.getByText("top")).toBeInTheDocument();
    expect(screen.getByText("bottom")).toBeInTheDocument();
    const group = container.querySelector<HTMLElement>("[data-group]");
    expect(group?.style.flexDirection).toBe("column");
  });

  it("passes autoSaveId through to the underlying group id", () => {
    const { container } = render(
      <PanelGroup direction="horizontal" autoSaveId="saved-layout">
        <Panel>
          <div>x</div>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <div>y</div>
        </Panel>
      </PanelGroup>,
    );
    const group = container.querySelector("[data-group]");
    expect(group).toHaveAttribute("id", "saved-layout");
  });

  it("merges className onto the group element", () => {
    const { container } = render(
      <PanelGroup direction="horizontal" className="custom-group">
        <Panel>
          <div>only</div>
        </Panel>
      </PanelGroup>,
    );
    const group = container.querySelector("[data-group]");
    expect(group).toHaveClass("flex");
    expect(group).toHaveClass("custom-group");
  });

  it("merges className onto the resize handle", () => {
    render(
      <PanelGroup direction="horizontal">
        <Panel>
          <div>p1</div>
        </Panel>
        <PanelResizeHandle className="custom-handle" />
        <Panel>
          <div>p2</div>
        </Panel>
      </PanelGroup>,
    );
    expect(screen.getByRole("separator")).toHaveClass("custom-handle");
  });
});
