import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import TreeView from "../TreeView";
import { LocaleProvider } from "@/providers/LocaleProvider";
import type { TreeNode } from "../types";

const tree: TreeNode[] = [
  {
    id: "fruits",
    label: "Fruits",
    children: [
      { id: "apple", label: "Apple" },
      { id: "banana", label: "Banana" },
      {
        id: "citrus",
        label: "Citrus",
        children: [
          { id: "orange", label: "Orange" },
          { id: "lemon", label: "Lemon" },
        ],
      },
    ],
  },
  { id: "vegetables", label: "Vegetables", children: [{ id: "carrot", label: "Carrot" }] },
];

function getRow(name: string): HTMLElement {
  // The focusable row div is inside the treeitem li.
  return screen.getByText(name).closest("[tabindex]") as HTMLElement;
}

describe("TreeView", () => {
  it("renders the tree with role=tree and root treeitems at level 1", () => {
    render(<TreeView nodes={tree} aria-label="Catalog" />);
    const treeEl = screen.getByRole("tree", { name: "Catalog" });
    expect(treeEl).toBeInTheDocument();
    const fruits = screen.getByText("Fruits").closest('[role="treeitem"]')!;
    expect(fruits).toHaveAttribute("aria-level", "1");
    expect(fruits).toHaveAttribute("aria-expanded", "false");
    // collapsed: children not rendered
    expect(screen.queryByText("Apple")).toBeNull();
  });

  it("exposes aria-expanded only on expandable nodes", () => {
    render(
      <TreeView nodes={tree} aria-label="Catalog" defaultExpandedIds={["fruits"]} />,
    );
    const apple = screen.getByText("Apple").closest('[role="treeitem"]')!;
    expect(apple).not.toHaveAttribute("aria-expanded");
    expect(apple).toHaveAttribute("aria-level", "2");
  });

  it("expands and collapses on click of the row", () => {
    render(<TreeView nodes={tree} aria-label="Catalog" />);
    const fruits = getRow("Fruits");
    fireEvent.click(fruits);
    expect(screen.getByText("Apple")).toBeInTheDocument();
    fireEvent.click(fruits);
    expect(screen.queryByText("Apple")).toBeNull();
  });

  it("expands and collapses via ArrowRight/ArrowLeft on a branch", () => {
    render(<TreeView nodes={tree} aria-label="Catalog" />);
    const fruits = getRow("Fruits");
    fireEvent.keyDown(fruits, { key: "ArrowRight" });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    fireEvent.keyDown(fruits, { key: "ArrowLeft" });
    expect(screen.queryByText("Apple")).toBeNull();
  });

  it("renders child lists inside role=group", () => {
    render(
      <TreeView nodes={tree} aria-label="Catalog" defaultExpandedIds={["fruits"]} />,
    );
    const group = screen.getAllByRole("group")[0];
    expect(within(group).getByText("Apple")).toBeInTheDocument();
  });

  it("navigates visible items with ArrowDown/ArrowUp", () => {
    render(
      <TreeView nodes={tree} aria-label="Catalog" defaultExpandedIds={["fruits"]} />,
    );
    const fruits = getRow("Fruits");
    fruits.focus();
    fireEvent.keyDown(fruits, { key: "ArrowDown" });
    expect(getRow("Apple")).toHaveFocus();
    fireEvent.keyDown(getRow("Apple"), { key: "ArrowUp" });
    expect(getRow("Fruits")).toHaveFocus();
  });

  it("ArrowRight on an expanded node moves into the first child", () => {
    render(
      <TreeView nodes={tree} aria-label="Catalog" defaultExpandedIds={["fruits"]} />,
    );
    const fruits = getRow("Fruits");
    fruits.focus();
    fireEvent.keyDown(fruits, { key: "ArrowRight" });
    expect(getRow("Apple")).toHaveFocus();
  });

  it("ArrowLeft on a leaf moves focus to the parent", () => {
    render(
      <TreeView nodes={tree} aria-label="Catalog" defaultExpandedIds={["fruits"]} />,
    );
    const apple = getRow("Apple");
    apple.focus();
    fireEvent.keyDown(apple, { key: "ArrowLeft" });
    expect(getRow("Fruits")).toHaveFocus();
  });

  it("Home and End jump to first and last visible item", () => {
    render(
      <TreeView nodes={tree} aria-label="Catalog" defaultExpandedIds={["fruits", "citrus"]} />,
    );
    const apple = getRow("Apple");
    apple.focus();
    act(() => {
      fireEvent.keyDown(apple, { key: "End" });
    });
    expect(getRow("Vegetables")).toHaveFocus();
    act(() => {
      fireEvent.keyDown(getRow("Vegetables"), { key: "Home" });
    });
    expect(getRow("Fruits")).toHaveFocus();
  });

  it("selects a node with Enter and sets aria-selected", () => {
    const onSelect = vi.fn();
    render(<TreeView nodes={tree} aria-label="Catalog" onSelect={onSelect} />);
    const fruits = getRow("Fruits");
    fruits.focus();
    fireEvent.keyDown(fruits, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("fruits");
    expect(
      screen.getByText("Fruits").closest('[role="treeitem"]'),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("lazy-loads children via loadChildren and renders them", async () => {
    const loadChildren = vi.fn().mockResolvedValue([
      { id: "lazy-1", label: "Lazy One" },
      { id: "lazy-2", label: "Lazy Two" },
    ]);
    const lazyTree: TreeNode[] = [
      { id: "root", label: "Root", hasChildren: true },
    ];
    render(
      <TreeView nodes={lazyTree} aria-label="Lazy" loadChildren={loadChildren} />,
    );
    const root = getRow("Root");
    fireEvent.keyDown(root, { key: "ArrowRight" });
    expect(loadChildren).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Lazy One")).toBeInTheDocument();
    expect(screen.getByText("Lazy Two")).toBeInTheDocument();
  });

  it("type-ahead focuses the matching visible node", () => {
    render(
      <TreeView nodes={tree} aria-label="Catalog" defaultExpandedIds={["fruits"]} />,
    );
    const fruits = getRow("Fruits");
    fruits.focus();
    // 'b' should match "Banana"
    fireEvent.keyDown(fruits, { key: "b" });
    expect(getRow("Banana")).toHaveFocus();
  });

  it("keeps exactly one tabbable row (roving tabindex)", () => {
    render(
      <TreeView nodes={tree} aria-label="Catalog" defaultExpandedIds={["fruits"]} />,
    );
    const tabbable = screen
      .getAllByRole("treeitem")
      .map((li) => li.querySelector('[tabindex="0"]'))
      .filter(Boolean);
    expect(tabbable).toHaveLength(1);
  });

  it("flips ArrowLeft/ArrowRight semantics in RTL", () => {
    render(
      <LocaleProvider dir="rtl">
        <TreeView nodes={tree} aria-label="Catalog" />
      </LocaleProvider>,
    );
    const fruits = getRow("Fruits");
    fruits.focus();
    // In RTL, ArrowLeft expands.
    fireEvent.keyDown(fruits, { key: "ArrowLeft" });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    // ArrowRight collapses.
    fireEvent.keyDown(fruits, { key: "ArrowRight" });
    expect(screen.queryByText("Apple")).toBeNull();
  });

  it("skips disabled nodes during keyboard navigation", () => {
    const withDisabled: TreeNode[] = [
      { id: "a", label: "Alpha" },
      { id: "b", label: "Bravo", disabled: true },
      { id: "c", label: "Charlie" },
    ];
    render(<TreeView nodes={withDisabled} aria-label="Catalog" />);
    const alpha = getRow("Alpha");
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "ArrowDown" });
    expect(getRow("Charlie")).toHaveFocus();
  });

  // BUG 1 — type-ahead cycling with repeated same character
  it("type-ahead cycles f1→f2→f3→f1 when the same letter is pressed repeatedly", () => {
    const fNodes: TreeNode[] = [
      { id: "fig", label: "Fig" },
      { id: "foo", label: "Foo" },
      { id: "fizz", label: "Fizz" },
      { id: "mango", label: "Mango" },
    ];
    render(<TreeView nodes={fNodes} aria-label="Fruits" />);

    const fig = getRow("Fig");
    fig.focus();

    // First 'f': active is "Fig" → should cycle to "Foo"
    fireEvent.keyDown(getRow("Fig"), { key: "f" });
    expect(getRow("Foo")).toHaveFocus();

    // Second 'f': active is now "Foo" → should cycle to "Fizz"
    fireEvent.keyDown(getRow("Foo"), { key: "f" });
    expect(getRow("Fizz")).toHaveFocus();

    // Third 'f': active is now "Fizz" → should wrap back to "Fig"
    fireEvent.keyDown(getRow("Fizz"), { key: "f" });
    expect(getRow("Fig")).toHaveFocus();
  });

  // BUG 2 — lazy load returning [] must not leave node aria-expanded=true
  it("lazy-loads [] → node becomes a non-expandable leaf (no aria-expanded, no spinner)", async () => {
    const loadChildren = vi.fn().mockResolvedValue([]);
    const lazyTree: TreeNode[] = [
      { id: "empty-branch", label: "Empty Branch", hasChildren: true },
    ];
    render(
      <TreeView nodes={lazyTree} aria-label="Lazy Empty" loadChildren={loadChildren} />,
    );
    const row = getRow("Empty Branch");
    // Before expanding: has aria-expanded (it's declared as having children)
    expect(
      screen.getByText("Empty Branch").closest('[role="treeitem"]'),
    ).toHaveAttribute("aria-expanded");

    fireEvent.keyDown(row, { key: "ArrowRight" });

    // Wait for the promise to resolve and state to settle
    await act(async () => {});

    // After empty resolve: node is no longer expandable → no aria-expanded
    const treeitem = screen.getByText("Empty Branch").closest('[role="treeitem"]')!;
    expect(treeitem).not.toHaveAttribute("aria-expanded");
    // No spinner
    expect(screen.queryByTestId("tree-loading-empty-branch")).toBeNull();
  });
});
