import type { Meta, StoryObj } from "@storybook/react";
import AspectRatio from "./AspectRatio";

const meta = {
  title: "Layout/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: "number" },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Widescreen: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-[320px]">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center rounded-16px bg-bg-secondary text-fg-primary">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  args: { ratio: 1 },
  render: (args) => (
    <div className="w-[240px]">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center rounded-16px bg-bg-secondary text-fg-primary">
          1 : 1
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  args: { ratio: 3 / 4 },
  render: (args) => (
    <div className="w-[240px]">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center rounded-16px bg-bg-secondary text-fg-primary">
          3 : 4
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Image: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-[360px]">
      <AspectRatio {...args}>
        <img
          src="https://picsum.photos/640/360"
          alt="Sample"
          className="h-full w-full rounded-16px object-cover"
        />
      </AspectRatio>
    </div>
  ),
};
