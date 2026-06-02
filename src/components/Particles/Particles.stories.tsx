import type { Meta, StoryObj } from "@storybook/react";
import Particles from "./Particles";

const meta = {
  title: "Feedback/Particles",
  component: Particles,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Particles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 600,
        height: 400,
        position: "relative",
        background: "var(--color-black_1)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <Particles style={{ width: "100%", height: "100%" }} />
    </div>
  ),
};

export const ManyParticles: Story = {
  render: () => (
    <div
      style={{
        width: 600,
        height: 400,
        position: "relative",
        background: "var(--color-black_2)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <Particles
        quantity={150}
        color="var(--color-pr_purple)"
        size={0.6}
        velocity={1}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  ),
};

export const BlueParticles: Story = {
  render: () => (
    <div
      style={{
        width: 600,
        height: 400,
        position: "relative",
        background: "var(--color-black_1)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <Particles
        quantity={80}
        color="var(--color-pr_blue)"
        size={0.5}
        velocity={0.3}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  ),
};

export const SlowDrift: Story = {
  render: () => (
    <div
      style={{
        width: 600,
        height: 400,
        position: "relative",
        background: "var(--color-black_3)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <Particles
        quantity={40}
        velocity={0.1}
        size={0.8}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div
      style={{
        width: 600,
        height: 400,
        position: "relative",
        background: "var(--color-black_1)",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Particles
        quantity={60}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <h2 className="font-orbitron text-32 text-white_4">SagTech</h2>
        <p className="font-manrope text-14 text-grey_4 mt-8px">
          Particles as background layer
        </p>
      </div>
    </div>
  ),
};
