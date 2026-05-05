import type { Meta, StoryObj } from '@storybook/react';
import * as tokens from '@/tokens/tokens';
import Scene3D from './Scene3D';

const meta = {
  title: 'Data Display/Scene3D',
  component: Scene3D,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 500, height: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Scene3D>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpinningCube: Story = {
  args: {
    width: 500,
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
