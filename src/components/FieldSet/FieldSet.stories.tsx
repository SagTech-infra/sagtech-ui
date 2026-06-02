import type { Meta, StoryObj } from "@storybook/react";
import FieldSet from "./FieldSet";

const meta = {
  title: "Form Controls/FieldSet",
  component: FieldSet,
  tags: ["autodocs"],
  argTypes: {
    legend: { control: "text" },
    legendHidden: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof FieldSet>;

export default meta;
type Story = StoryObj<typeof meta>;

function SampleFields() {
  return (
    <>
      <label className="flex items-center gap-8px font-manrope text-14 text-fg-primary">
        <input type="radio" name="plan" value="free" /> Free
      </label>
      <label className="flex items-center gap-8px font-manrope text-14 text-fg-primary">
        <input type="radio" name="plan" value="pro" /> Pro
      </label>
      <label className="flex items-center gap-8px font-manrope text-14 text-fg-primary">
        <input type="radio" name="plan" value="team" /> Team
      </label>
    </>
  );
}

export const Default: Story = {
  args: { legend: "Choose a plan" },
  render: (args) => (
    <FieldSet {...args}>
      <SampleFields />
    </FieldSet>
  ),
};

export const LegendHidden: Story = {
  args: { legend: "Choose a plan", legendHidden: true },
  render: (args) => (
    <FieldSet {...args}>
      <SampleFields />
    </FieldSet>
  ),
};

export const Disabled: Story = {
  args: { legend: "Choose a plan", disabled: true },
  render: (args) => (
    <FieldSet {...args}>
      <SampleFields />
    </FieldSet>
  ),
};
