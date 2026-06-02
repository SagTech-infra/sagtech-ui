import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import TreeView from "./TreeView";
import type { TreeNode } from "./types";
import { LocaleProvider } from "@/providers/LocaleProvider";

const meta = {
  title: "Data Display/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleNodes: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [
          { id: "button", label: "Button.tsx" },
          { id: "input", label: "Input.tsx" },
          {
            id: "treeview",
            label: "TreeView",
            children: [
              { id: "tv-tsx", label: "TreeView.tsx" },
              { id: "tv-types", label: "types.ts" },
            ],
          },
        ],
      },
      { id: "index", label: "index.ts" },
      { id: "disabled", label: "secret.ts (locked)", disabled: true },
    ],
  },
  {
    id: "public",
    label: "public",
    children: [{ id: "favicon", label: "favicon.ico" }],
  },
  { id: "readme", label: "README.md" },
];

export const Default: Story = {
  args: {
    nodes: sampleNodes,
    "aria-label": "Project files",
    defaultExpandedIds: ["src", "components"],
  },
};

export const Controlled: Story = {
  args: {
    nodes: sampleNodes,
    "aria-label": "Project files",
  },
  render: function ControlledTree(args) {
    const [expanded, setExpanded] = useState<string[]>(["src"]);
    const [selected, setSelected] = useState<string | undefined>();
    return (
      <div className="flex flex-col gap-16px">
        <TreeView
          {...args}
          expandedIds={expanded}
          onExpandedChange={setExpanded}
          selectedId={selected}
          onSelect={setSelected}
        />
        <p className="font-manrope text-12 text-fg-muted">
          Selected: {selected ?? "none"} — Expanded: {expanded.join(", ") || "none"}
        </p>
      </div>
    );
  },
};

const lazyRoots: TreeNode[] = [
  { id: "team-a", label: "Team A", hasChildren: true },
  { id: "team-b", label: "Team B", hasChildren: true },
];

export const LazyLoading: Story = {
  args: {
    nodes: lazyRoots,
    "aria-label": "Teams",
  },
  render: function LazyTree(args) {
    const loadChildren = (node: TreeNode): Promise<TreeNode[]> =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: `${node.id}-1`, label: `${node.label} · Member 1` },
            { id: `${node.id}-2`, label: `${node.label} · Member 2` },
            {
              id: `${node.id}-3`,
              label: `${node.label} · Subteam`,
              hasChildren: true,
            },
          ]);
        }, 700);
      });
    return <TreeView {...args} loadChildren={loadChildren} />;
  },
};

export const RTL: Story = {
  args: {
    nodes: sampleNodes,
    "aria-label": "Project files",
    defaultExpandedIds: ["src", "components"],
  },
  render: function RtlTree(args) {
    return (
      <LocaleProvider dir="rtl">
        <TreeView {...args} />
      </LocaleProvider>
    );
  },
};
