import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta = {
  title: 'Foundations/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: [
        'arrow', 'attach', 'barChartBox', 'BriefCase', 'call',
        'Check', 'chevrondown', 'chevronLeft', 'chevronRight',
      ],
    },
    size: { control: { type: 'number', min: 12, max: 64 } },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { icon: 'arrow', size: 32, color: '#fff' },
};

export const WithText: Story = {
  args: { icon: 'attach', size: 24, color: '#B5B5B9', text: 'Attach file' },
};

export const Small: Story = {
  args: { icon: 'chevrondown', size: 16, color: '#F8F8F8' },
};

export const Large: Story = {
  args: { icon: 'call', size: 48, color: '#6D3EF1' },
};

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
      {(
        ['arrow', 'attach', 'barChartBox', 'BriefCase', 'call', 'Check', 'chevrondown', 'chevronLeft', 'chevronRight'] as const
      ).map((icon) => (
        <Icon key={icon} icon={icon} size={32} color="#F8F8F8" text={icon} />
      ))}
    </div>
  ),
};
