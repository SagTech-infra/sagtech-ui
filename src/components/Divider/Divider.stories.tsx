import type { Meta, StoryObj } from '@storybook/react';
import Divider from './Divider';

const meta = {
  title: 'Foundations/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'gradient', 'dashed'],
    },
    label: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '480px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <p className="text-grey_2 font-manrope text-12 mb-12px">Solid</p>
        <Divider variant="solid" />
      </div>
      <div>
        <p className="text-grey_2 font-manrope text-12 mb-12px">Gradient</p>
        <Divider variant="gradient" />
      </div>
      <div>
        <p className="text-grey_2 font-manrope text-12 mb-12px">Dashed</p>
        <Divider variant="dashed" />
      </div>
      <div>
        <p className="text-grey_2 font-manrope text-12 mb-12px">With label</p>
        <Divider variant="gradient" label="OR" />
      </div>
      <div>
        <p className="text-grey_2 font-manrope text-12 mb-12px">Vertical</p>
        <div style={{ height: 80, display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span className="text-grey_4 font-manrope text-14">Left</span>
          <Divider orientation="vertical" variant="gradient" />
          <span className="text-grey_4 font-manrope text-14">Right</span>
        </div>
      </div>
    </div>
  ),
};

export const Solid: Story = {
  args: { variant: 'solid' },
};

export const Gradient: Story = {
  args: { variant: 'gradient' },
};

export const Dashed: Story = {
  args: { variant: 'dashed' },
};

export const WithLabel: Story = {
  args: { variant: 'gradient', label: 'OR' },
};
