import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Slider from "./Slider";

const meta = {
  title: "Form Controls/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { min: 0, max: 100, step: 1, label: "Volume" },
  render: function InteractiveSlider(args) {
    const [value, setValue] = useState(40);
    return <Slider {...args} value={value} onChange={setValue} />;
  },
};

export const Range: Story = {
  args: { min: 0, max: 100, step: 1, label: "Price range" },
  render: function RangeSlider(args) {
    const [value, setValue] = useState<[number, number]>([25, 75]);
    return <Slider {...args} range value={value} onChange={setValue} />;
  },
};

export const WithMarks: Story = {
  args: {
    min: 0,
    max: 100,
    step: 25,
    label: "Quality",
    marks: [
      { value: 0, label: "Low" },
      { value: 25, label: "25%" },
      { value: 50, label: "Mid" },
      { value: 75, label: "75%" },
      { value: 100, label: "High" },
    ],
  },
  render: function MarksSlider(args) {
    const [value, setValue] = useState(50);
    return <Slider {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: { label: "Disabled", disabled: true },
  render: function DisabledSlider(args) {
    const [value, setValue] = useState(30);
    return <Slider {...args} value={value} onChange={setValue} />;
  },
};
