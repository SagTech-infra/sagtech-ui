import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import ColorPicker from "./ColorPicker";

const meta = {
  title: "Form Controls/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "color" },
    alpha: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Brand color" },
  render: function InteractiveColorPicker(args) {
    const [value, setValue] = useState("#3B82F6");
    return <ColorPicker {...args} value={value} onChange={setValue} />;
  },
};

export const WithAlpha: Story = {
  args: { label: "Overlay color", alpha: true },
  render: function AlphaColorPicker(args) {
    const [value, setValue] = useState("#8B5CF6CC");
    return <ColorPicker {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: { label: "Locked color", disabled: true },
  render: function DisabledColorPicker(args) {
    const [value, setValue] = useState("#EF4444");
    return <ColorPicker {...args} value={value} onChange={setValue} />;
  },
};
