import type { Meta, StoryObj } from "@storybook/react";
import CTASection from "./CTASection";
import Button from "../Button/Button";

const meta = {
  title: "Marketing/CTASection",
  component: CTASection,
  tags: ["autodocs"],
} satisfies Meta<typeof CTASection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Build your next product on it",
    subtitle: "Install from GitHub Packages and import the tokens — you're set.",
    actions: <Button variant="secondary">Get started</Button>,
  },
};
