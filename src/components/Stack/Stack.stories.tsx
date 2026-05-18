import type { Meta, StoryObj } from "@storybook/react";
import Stack from "./Stack";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  argTypes: {
    gap: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around"],
    },
    as: { control: "text" },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ label }: { label: string }) => (
  <div className="bg-black_2 border border-grey_2 rounded-8px p-12px text-white_4 font-manrope text-14">
    {label}
  </div>
);

export const Default: Story = {
  args: {
    gap: "md",
    children: (
      <>
        <Box label="Item one" />
        <Box label="Item two" />
        <Box label="Item three" />
      </>
    ),
  },
};

export const LargeGapCentered: Story = {
  args: {
    gap: "xl",
    align: "center",
    children: (
      <>
        <Box label="Centered — wide" />
        <Box label="Short" />
        <Box label="Also centered" />
      </>
    ),
  },
};

export const AsSection: Story = {
  args: {
    as: "section",
    gap: "sm",
    justify: "between",
    children: (
      <>
        <Box label="Section child A" />
        <Box label="Section child B" />
      </>
    ),
  },
};
