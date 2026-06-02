import type { Meta, StoryObj } from "@storybook/react";
import VisuallyHidden from "./VisuallyHidden";

const meta = {
  title: "Foundations/VisuallyHidden",
  component: VisuallyHidden,
  tags: ["autodocs"],
  argTypes: {
    as: { control: false },
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Screen-reader only text" },
  render: (args) => (
    <p className="font-manrope text-14 text-fg-primary">
      This sentence has hidden context for assistive tech.
      <VisuallyHidden {...args} />
    </p>
  ),
};

export const IconButtonLabel: Story = {
  render: () => (
    <button
      type="button"
      className="inline-flex items-center justify-center w-[40px] h-[40px] rounded-circle bg-grey_2 text-fg-primary"
    >
      <span aria-hidden="true">x</span>
      <VisuallyHidden>Close dialog</VisuallyHidden>
    </button>
  ),
};

export const PolymorphicAsDiv: Story = {
  args: { as: "div", children: "Announced as a block-level region" },
};
