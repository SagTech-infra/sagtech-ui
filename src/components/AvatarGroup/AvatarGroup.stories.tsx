import type { Meta, StoryObj } from "@storybook/react";
import AvatarGroup from "./AvatarGroup";

const meta = {
  title: "Data Display/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  argTypes: {
    max: { control: { type: "number" } },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    overlap: { control: { type: "number" } },
    label: { control: "text" },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const team = [
  { name: "Alice Adams" },
  { name: "Bob Brown" },
  { name: "Carol Clark" },
  { name: "Dan Davis" },
  { name: "Eve Evans" },
  { name: "Frank Ford" },
];

export const Default: Story = {
  args: { avatars: team, max: 5, label: "Project team" },
};

export const WithOverflow: Story = {
  args: { avatars: team, max: 3, label: "Project team" },
};

export const Large: Story = {
  args: { avatars: team, max: 4, size: "lg" },
};
