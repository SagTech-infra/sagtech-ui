import type { Meta, StoryObj } from "@storybook/react";
import Label from "./Label";

const meta = {
  title: "Form Controls/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    htmlFor: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Email address", htmlFor: "email" },
};

export const Required: Story = {
  args: { children: "Password", htmlFor: "password", required: true },
};

export const Disabled: Story = {
  args: { children: "Unavailable field", htmlFor: "unavailable", disabled: true },
};

export const RequiredDisabled: Story = {
  args: {
    children: "Locked field",
    htmlFor: "locked",
    required: true,
    disabled: true,
  },
};
