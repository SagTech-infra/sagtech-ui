import type { Meta, StoryObj } from "@storybook/react";
import NumberTicker from "./NumberTicker";

const meta = {
  title: "Feedback/NumberTicker",
  component: NumberTicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NumberTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 12345,
    startOnView: true,
  },
  render: (args) => (
    <span className="font-orbitron text-48 text-white_4">
      <NumberTicker {...args} />
    </span>
  ),
};

export const CustomFrom: Story = {
  args: {
    value: 1000,
    from: 500,
    duration: 1500,
    startOnView: true,
  },
  render: (args) => (
    <span className="font-orbitron text-48 text-pr_purple">
      <NumberTicker {...args} />
    </span>
  ),
};

export const CustomFormatter: Story = {
  args: {
    value: 9999.99,
    from: 0,
    duration: 2000,
    startOnView: true,
    formatter: (n) =>
      n.toLocaleString("en-US", { style: "currency", currency: "USD" }),
  },
  render: (args) => (
    <span className="font-manrope text-32 text-success">
      <NumberTicker {...args} />
    </span>
  ),
};

export const ReducedMotion: Story = {
  name: "Reduced Motion (final value, no animation)",
  args: {
    value: 42000,
    from: 0,
    startOnView: true,
  },
  render: (args) => (
    <div className="flex flex-col gap-8px items-center">
      <p className="font-manrope text-12 text-grey_4">
        With reduced-motion preference the final value renders immediately.
      </p>
      <span className="font-orbitron text-48 text-white_4">
        <NumberTicker {...args} />
      </span>
    </div>
  ),
};

export const ScrollTriggered: Story = {
  args: {
    value: 99999,
    startOnView: true,
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-16px">
      <p className="font-manrope text-12 text-grey_4">
        Scroll down to trigger the animation when the number enters view.
      </p>
      <div style={{ marginTop: 600 }}>
        <span className="font-orbitron text-48 text-sec_blue">
          <NumberTicker {...args} />
        </span>
      </div>
    </div>
  ),
};
