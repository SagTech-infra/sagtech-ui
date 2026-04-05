import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'subtle'],
    },
    color: {
      control: 'select',
      options: ['purple', 'blue', 'success', 'warning', 'error', 'grey'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const colors = ['purple', 'blue', 'success', 'warning', 'error', 'grey'] as const;
const variants = ['filled', 'outlined', 'subtle'] as const;

export const AllVariants: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div className="flex flex-col gap-16px">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col gap-8px">
          <span className="text-grey_2 text-12 font-manrope capitalize">{variant}</span>
          <div className="flex flex-wrap gap-8px">
            {colors.map((color) => (
              <Badge key={`${variant}-${color}`} variant={variant} color={color}>
                {color}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div className="flex items-center gap-8px">
      <Badge size="sm" color="purple">
        Small
      </Badge>
      <Badge size="md" color="purple">
        Medium
      </Badge>
    </div>
  ),
};

export const WithDot: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div className="flex flex-wrap gap-8px">
      {colors.map((color) => (
        <Badge key={color} color={color} dot>
          {color}
        </Badge>
      ))}
    </div>
  ),
};
