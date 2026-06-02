import type { Meta, StoryObj } from "@storybook/react";
import ScrollArea from "./ScrollArea";

const meta = {
  title: "Layout/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  argTypes: {
    maxHeight: { control: "text" },
    orientation: { control: "select", options: ["vertical", "both"] },
    fade: { control: "boolean" },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = Array.from({ length: 30 }, (_, i) => i + 1);

export const Vertical: Story = {
  args: { maxHeight: 240 },
  render: (args) => (
    <ScrollArea {...args} className="w-[280px] rounded-16px bg-bg-secondary p-16px">
      <div className="flex flex-col gap-8px">
        {rows.map((n) => (
          <div key={n} className="font-manrope text-14 text-fg-primary">
            Row {n}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const WithFade: Story = {
  args: { maxHeight: 240, fade: true },
  render: (args) => (
    <ScrollArea {...args} className="w-[280px] rounded-16px bg-bg-secondary p-16px">
      <div className="flex flex-col gap-8px">
        {rows.map((n) => (
          <div key={n} className="font-manrope text-14 text-fg-primary">
            Row {n}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const BothAxes: Story = {
  args: { maxHeight: 240, orientation: "both" },
  render: (args) => (
    <ScrollArea {...args} className="w-[280px] rounded-16px bg-bg-secondary p-16px">
      <div className="w-[600px]">
        {rows.map((n) => (
          <div
            key={n}
            className="font-manrope text-14 text-fg-primary whitespace-nowrap"
          >
            Row {n} — this content is wider than the viewport to force horizontal scroll
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
