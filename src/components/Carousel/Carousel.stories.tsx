import type { Meta, StoryObj } from "@storybook/react";
import Carousel from "./Carousel";

const meta = {
  title: "Layout/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  argTypes: {
    slidesToShow: { control: "number" },
    gap: { control: "number" },
    loop: { control: "boolean" },
    showDots: { control: "boolean" },
    showArrows: { control: "boolean" },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const slideCls =
  "flex items-center justify-center h-[200px] rounded-16px font-orbitron text-24 text-fg-primary";

const colors = [
  "bg-pr_purple",
  "bg-pr_blue",
  "bg-sec_purple",
  "bg-sec_blue",
  "bg-grey_2",
];

function makeSlides(count: number) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className={`${slideCls} ${colors[i % colors.length]}`}>
      Slide {i + 1}
    </div>
  ));
}

export const Default: Story = {
  args: {
    ariaLabel: "Featured items",
    children: makeSlides(4),
  },
};

export const WithAutoplay: Story = {
  args: {
    ariaLabel: "Auto-rotating promos",
    autoplay: 2000,
    loop: true,
    children: makeSlides(4),
  },
};

export const MultipleSlides: Story = {
  args: {
    ariaLabel: "Product grid",
    slidesToShow: 3,
    gap: 16,
    children: makeSlides(6),
  },
};
