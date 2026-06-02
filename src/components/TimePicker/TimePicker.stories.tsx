import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import TimePicker, { type TimeValue } from "./TimePicker";

const meta = {
  title: "Form Controls/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  argTypes: {
    step: { control: "number" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: function InteractiveTimePicker(args) {
    const [value, setValue] = useState<TimeValue>({ hours: 9, minutes: 30 });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: {
    value: { hours: 12, minutes: 0 },
    disabled: true,
  },
};

export const FifteenMinuteStep: Story = {
  args: {
    step: 15,
  },
  render: function SteppedTimePicker(args) {
    const [value, setValue] = useState<TimeValue>({ hours: 0, minutes: 0 });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
};

export const CustomLabel: Story = {
  args: {
    label: "Start",
  },
  render: function LabeledTimePicker(args) {
    const [value, setValue] = useState<TimeValue>({ hours: 8, minutes: 45 });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
};
