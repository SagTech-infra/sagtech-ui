import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Switch from "./Switch";

const meta = {
  title: "Form Controls/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    size: { control: "select", options: ["sm", "md"] },
    label: { control: "text" },
    description: { control: "text" },
    labelPosition: { control: "select", options: ["left", "right"] },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function Interactive(args: React.ComponentProps<typeof Switch>) {
  const [checked, setChecked] = useState(args.checked ?? false);
  return <Switch {...args} checked={checked} onChange={setChecked} />;
}

export const Default: Story = {
  args: { label: "Enable notifications" },
  render: (args) => <Interactive {...args} />,
};

export const WithDescription: Story = {
  args: {
    label: "Wi-Fi",
    description: "Connect automatically to known networks",
  },
  render: (args) => <Interactive {...args} />,
};

export const LabelLeft: Story = {
  args: { label: "Airplane mode", labelPosition: "left" },
  render: (args) => <Interactive {...args} />,
};

export const Disabled: Story = {
  args: { label: "Unavailable", checked: true, disabled: true },
};
