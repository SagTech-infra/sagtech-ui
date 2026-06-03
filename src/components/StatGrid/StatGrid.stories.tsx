import type { Meta, StoryObj } from "@storybook/react";
import StatGrid from "./StatGrid";

const meta = {
  title: "Marketing/StatGrid",
  component: StatGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof StatGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { value: 107, label: "Components" },
      { value: 749, label: "Tests" },
      { value: 12, label: "Chart types" },
      { value: 4, label: "3D scenes" },
    ],
  },
};
