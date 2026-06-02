import type { Meta, StoryObj } from "@storybook/react";
import ContextMenu, { type MenuItem } from "./ContextMenu";

const EditIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" className="h-full w-full">
    <path
      d="M12.75 2.25a1.77 1.77 0 0 1 2.5 2.5L5.5 14.5l-3.5 1 1-3.5L12.75 2.25Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" className="h-full w-full">
    <path
      d="M3 5h12M14 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5m2 0V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TriggerArea = ({ label }: { label: string }) => (
  <div className="flex h-[200px] w-[360px] select-none items-center justify-center rounded-16px border border-dashed border-border-default bg-bg-secondary font-manrope text-14 text-fg-muted">
    {label}
  </div>
);

const baseItems: MenuItem[] = [
  { label: "Edit", icon: <EditIcon />, onSelect: () => {} },
  { label: "Duplicate", onSelect: () => {} },
  { label: "Rename", onSelect: () => {} },
  { label: "Delete", icon: <TrashIcon />, danger: true, onSelect: () => {} },
];

const meta = {
  title: "Layout/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: baseItems,
    children: <TriggerArea label="Right-click anywhere here" />,
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { label: "Open", onSelect: () => {} },
      { label: "Share (unavailable)", disabled: true, onSelect: () => {} },
      { label: "Archive", onSelect: () => {} },
      { label: "Delete", danger: true, onSelect: () => {} },
    ],
    children: <TriggerArea label="Right-click (one item disabled)" />,
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      "Cut",
      "Copy",
      "Paste",
      "Select all",
      "Find",
      "Replace",
      "Format",
    ].map((label) => ({ label, onSelect: () => {} })),
    children: <TriggerArea label="Right-click for type-ahead demo" />,
  },
};
