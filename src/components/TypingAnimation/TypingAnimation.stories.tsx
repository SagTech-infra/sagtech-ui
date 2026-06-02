import type { Meta, StoryObj } from "@storybook/react";
import TypingAnimation from "./TypingAnimation";

const meta = {
  title: "Feedback/TypingAnimation",
  component: TypingAnimation,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TypingAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Hello, world!",
    startOnView: false,
  },
  render: (args) => (
    <span className="font-manrope text-24 text-white_4">
      <TypingAnimation {...args} />
    </span>
  ),
};

export const SlowTyping: Story = {
  args: {
    children: "Typing slowly…",
    duration: 120,
    startOnView: false,
  },
  render: (args) => (
    <span className="font-manrope text-24 text-pr_purple">
      <TypingAnimation {...args} />
    </span>
  ),
};

export const WithDelay: Story = {
  args: {
    children: "Delayed start.",
    delay: 800,
    duration: 60,
    startOnView: false,
  },
  render: (args) => (
    <span className="font-manrope text-24 text-sec_blue">
      <TypingAnimation {...args} />
    </span>
  ),
};

export const ReducedMotion: Story = {
  name: "Reduced Motion (full text, no animation)",
  args: {
    children: "Reduced motion — full text shown immediately.",
    startOnView: false,
  },
  render: (args) => (
    <div className="flex flex-col gap-8px items-center">
      <p className="font-manrope text-12 text-grey_4">
        With reduced-motion preference the full text renders without animation.
      </p>
      <span className="font-manrope text-20 text-white_4">
        <TypingAnimation {...args} />
      </span>
    </div>
  ),
};

export const ScrollTriggered: Story = {
  args: {
    children: "This text animates when it enters the viewport.",
    duration: 40,
    startOnView: true,
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-16px">
      <p className="font-manrope text-12 text-grey_4">
        Scroll down to trigger the typing animation.
      </p>
      <div style={{ marginTop: 600 }}>
        <span className="font-orbitron text-20 text-success">
          <TypingAnimation {...args} />
        </span>
      </div>
    </div>
  ),
};
