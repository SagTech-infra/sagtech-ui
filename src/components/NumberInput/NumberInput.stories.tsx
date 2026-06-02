import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import NumberInput from "./NumberInput";

const meta = {
  title: "Form Controls/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    label: { control: "text" },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function Interactive(args: React.ComponentProps<typeof NumberInput>) {
  const [value, setValue] = useState<number | "">(args.value ?? "");
  return <NumberInput {...args} value={value} onChange={setValue} />;
}

export const Default: Story = {
  args: { value: 1, label: "Quantity" },
  render: (args) => <Interactive {...args} />,
};

export const WithBounds: Story = {
  args: { value: 5, min: 0, max: 10, label: "Rating (0–10)" },
  render: (args) => <Interactive {...args} />,
};

export const StepOfFive: Story = {
  args: { value: 0, min: 0, max: 100, step: 5, label: "Volume" },
  render: (args) => <Interactive {...args} />,
};

export const Empty: Story = {
  args: { value: "", placeholder: "Enter a number", label: "Amount" },
  render: (args) => <Interactive {...args} />,
};

export const Disabled: Story = {
  args: { value: 42, disabled: true, label: "Locked" },
};
