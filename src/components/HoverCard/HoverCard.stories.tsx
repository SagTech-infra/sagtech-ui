import type { Meta, StoryObj } from "@storybook/react";
import HoverCard from "./HoverCard";

const meta = {
  title: "Data Display/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    align: { control: "select", options: ["start", "center", "end"] },
    openDelay: { control: "number" },
    closeDelay: { control: "number" },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerLink = (
  <button type="button" className="text-pr_purple underline cursor-pointer">
    @sagtech
  </button>
);

const profileCard = (
  <div className="flex flex-col gap-8px">
    <span className="font-manrope text-14 text-fg-primary">SagTech UI</span>
    <span className="font-manrope text-12 text-fg-muted">
      A dark-mode-only React component library built on design tokens.
    </span>
  </div>
);

export const Default: Story = {
  args: {
    trigger: triggerLink,
    children: profileCard,
  },
};

export const SideTop: Story = {
  args: {
    trigger: triggerLink,
    children: profileCard,
    side: "top",
  },
};

export const FastOpen: Story = {
  args: {
    trigger: triggerLink,
    children: profileCard,
    openDelay: 0,
    closeDelay: 0,
  },
};
