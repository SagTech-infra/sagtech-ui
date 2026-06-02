import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ContextMenu, { type MenuItem } from "../ContextMenu";

function renderMenu(items: MenuItem[], triggerLabel = "Trigger") {
  return render(
    <ContextMenu items={items}>
      <div>{triggerLabel}</div>
    </ContextMenu>,
  );
}

function openAt(label = "Trigger", coords = { clientX: 120, clientY: 80 }) {
  fireEvent.contextMenu(screen.getByText(label), coords);
}

const sampleItems = (overrides: Partial<MenuItem>[] = []): MenuItem[] => {
  const base: MenuItem[] = [
    { label: "Edit", onSelect: vi.fn() },
    { label: "Duplicate", onSelect: vi.fn() },
    { label: "Delete", danger: true, onSelect: vi.fn() },
  ];
  return base.map((item, i) => ({ ...item, ...overrides[i] }));
};

describe("ContextMenu", () => {
  it("does not render the menu until the trigger is right-clicked", () => {
    renderMenu(sampleItems());
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens a role=menu with role=menuitem rows on contextmenu", () => {
    renderMenu(sampleItems());
    openAt();
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("positions the menu at the pointer coordinates", () => {
    renderMenu(sampleItems());
    openAt("Trigger", { clientX: 150, clientY: 90 });
    const menu = screen.getByRole("menu");
    expect(menu).toHaveStyle({ top: "90px", left: "150px" });
  });

  it("calls onSelect and closes when an item is clicked", () => {
    const items = sampleItems();
    renderMenu(items);
    openAt();
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(items[0].onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("selects the active item with Enter and closes", () => {
    const items = sampleItems();
    renderMenu(items);
    openAt();
    const menu = screen.getByRole("menu");
    // First enabled item (Edit) is active on open; ArrowDown -> Duplicate.
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "Enter" });
    expect(items[1].onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("End moves the active item to the last enabled row", () => {
    const items = sampleItems();
    renderMenu(items);
    openAt();
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "End" });
    fireEvent.keyDown(menu, { key: "Enter" });
    expect(items[2].onSelect).toHaveBeenCalledTimes(1);
  });

  it("type-ahead activates the first matching item", () => {
    const items = sampleItems();
    renderMenu(items);
    openAt();
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "d" });
    fireEvent.keyDown(menu, { key: "Enter" });
    expect(items[1].onSelect).toHaveBeenCalledTimes(1);
  });

  it("does not select a disabled item", () => {
    const items = sampleItems([{}, { disabled: true }]);
    renderMenu(items);
    openAt();
    const disabled = screen.getByRole("menuitem", { name: "Duplicate" });
    fireEvent.click(disabled);
    expect(items[1].onSelect).not.toHaveBeenCalled();
    expect(disabled).toBeDisabled();
  });

  it("closes on Escape", () => {
    renderMenu(sampleItems());
    openAt();
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on outside click", () => {
    renderMenu(sampleItems());
    openAt();
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("exposes a vertical orientation on the menu", () => {
    renderMenu(sampleItems());
    openAt();
    expect(screen.getByRole("menu")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });
});
