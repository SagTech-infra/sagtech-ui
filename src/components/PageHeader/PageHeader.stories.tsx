import type { Meta, StoryObj } from "@storybook/react";
import PageHeader from "./PageHeader";

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "Settings",
    title: "Members",
    subtitle: "Manage who can access your organisation.",
    actions: (
      <button className="bg-pr_purple text-white_4 font-manrope text-14 font-semibold px-16px py-8px rounded-8px">
        Invite member
      </button>
    ),
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Dashboard",
  },
};

export const WithSubtitleNoActions: Story = {
  args: {
    eyebrow: "Analytics",
    title: "Usage Report",
    subtitle: "API calls and token consumption across all workspaces.",
  },
};
