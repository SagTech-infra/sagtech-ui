import type { Meta, StoryObj } from "@storybook/react";
import Hero from "./Hero";
import Button from "../Button/Button";

const meta = {
  title: "Marketing/Hero",
  component: Hero,
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "SagTech UI",
    title: "Components that ship as fast as you do",
    subtitle: "107 components, dark-first, React 19 / Next. Built to move.",
    actions: (
      <>
        <Button variant="primary">Get started</Button>
        <Button variant="secondary">Storybook</Button>
      </>
    ),
  },
};

export const Centered: Story = {
  args: { ...Default.args, align: "center", background: "gradient" },
};
