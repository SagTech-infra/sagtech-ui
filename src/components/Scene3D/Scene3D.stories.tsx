import type { Meta, StoryObj } from '@storybook/react';
import * as tokens from '@/tokens/tokens';
import Scene3D from './Scene3D';

const meta = {
  title: '3D/Scene3D',
  component: Scene3D,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ height: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Scene3D>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpinningCube: Story = {
  args: {
    height: 500,
    lighting: 'studio',
    controls: 'orbit',
  },
  render: (args) => (
    <Scene3D {...args}>
      <mesh rotation={[0.4, 0.6, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={tokens.colors.pr_purple} metalness={0.4} roughness={0.3} />
      </mesh>
    </Scene3D>
  ),
};
