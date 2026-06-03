import type { Meta, StoryObj } from "@storybook/react";
import Particles from "./Particles";

const meta = {
  title: "Feedback/Particles",
  component: Particles,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Particles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Particles style={{ width: "100%", height: 400, borderRadius: 16 }} />
  ),
};

export const ManyParticles: Story = {
  render: () => (
    <Particles
      quantity={150}
      color="var(--color-pr_purple)"
      size={0.6}
      velocity={1}
      style={{ width: "100%", height: 400, borderRadius: 16 }}
    />
  ),
};

export const BlueParticles: Story = {
  render: () => (
    <Particles
      quantity={80}
      color="var(--color-pr_blue)"
      size={0.5}
      velocity={0.3}
      style={{ width: "100%", height: 400, borderRadius: 16 }}
    />
  ),
};

export const SlowDrift: Story = {
  render: () => (
    <Particles
      quantity={40}
      velocity={0.1}
      size={0.8}
      style={{ width: "100%", height: 400, borderRadius: 16 }}
    />
  ),
};

export const WithContent: Story = {
  render: () => (
    <Particles
      quantity={60}
      style={{
        width: "100%",
        height: 400,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <h2 className="font-orbitron text-32 text-white_4">SagTech</h2>
        <p className="font-manrope text-14 text-grey_4 mt-8px">
          Particles as background layer
        </p>
      </div>
    </Particles>
  ),
};
