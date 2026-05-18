import type { Meta, StoryObj } from "@storybook/react";
import Inline from "./Inline";

const meta = {
  title: "Layout/Inline",
  component: Inline,
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
    wrap: { control: "boolean" },
    as: { control: "text" },
  },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

const Chip = ({ label }: { label: string }) => (
  <div className="bg-black_2 border border-grey_2 rounded-24px px-12px py-4px text-white_4 font-manrope text-14">
    {label}
  </div>
);

export const Default: Story = {
  args: {
    gap: "sm",
    align: "center",
    children: (
      <>
        <Chip label="Design" />
        <Chip label="Engineering" />
        <Chip label="Product" />
      </>
    ),
  },
};

export const WrappingTags: Story = {
  args: {
    gap: "xs",
    wrap: true,
    align: "center",
    children: (
      <>
        {[
          "React",
          "TypeScript",
          "Next.js",
          "Tailwind",
          "Framer Motion",
          "Vitest",
          "Storybook",
          "pnpm",
        ].map((tag) => (
          <Chip key={tag} label={tag} />
        ))}
      </>
    ),
  },
};

export const SpaceBetween: Story = {
  args: {
    gap: "md",
    justify: "between",
    align: "center",
    children: (
      <>
        <Chip label="Left" />
        <Chip label="Right" />
      </>
    ),
  },
};
