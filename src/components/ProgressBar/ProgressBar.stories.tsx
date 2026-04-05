import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './ProgressBar';

const meta = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['purple', 'blue', 'success', 'warning', 'error'],
    },
    showLabel: { control: 'boolean' },
    label: { control: 'text' },
    animated: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '480px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 65,
    size: 'lg',
    showLabel: true,
  },
};

export const Sizes: Story = {
  args: { value: 60 },
  render: () => (
    <div className="flex flex-col gap-24px" style={{ maxWidth: 400 }}>
      <div>
        <span className="text-grey_2 text-12 font-manrope mb-8px block">Small (4px)</span>
        <ProgressBar value={60} size="sm" />
      </div>
      <div>
        <span className="text-grey_2 text-12 font-manrope mb-8px block">Medium (8px)</span>
        <ProgressBar value={60} size="md" />
      </div>
      <div>
        <span className="text-grey_2 text-12 font-manrope mb-8px block">Large (12px)</span>
        <ProgressBar value={60} size="lg" />
      </div>
    </div>
  ),
};

const colors = ['purple', 'blue', 'success', 'warning', 'error'] as const;

export const Colors: Story = {
  args: { value: 70 },
  render: () => (
    <div className="flex flex-col gap-16px" style={{ maxWidth: 400 }}>
      {colors.map((color) => (
        <div key={color}>
          <span className="text-grey_2 text-12 font-manrope mb-4px block capitalize">
            {color}
          </span>
          <ProgressBar value={70} color={color} size="md" />
        </div>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    value: 75,
    showLabel: true,
  },
};

export const Animated: Story = {
  args: {
    value: 60,
    animated: true,
    size: 'lg',
    color: 'purple',
  },
};

export const AllVariants: Story = {
  args: { value: 50 },
  render: () => (
    <div
      className="grid gap-24px"
      style={{ maxWidth: 480, gridTemplateColumns: '1fr 1fr' }}
    >
      {colors.map((color) =>
        (['sm', 'md', 'lg'] as const).map((size) => (
          <div key={`${color}-${size}`}>
            <span className="text-grey_2 text-10 font-manrope mb-4px block capitalize">
              {color} / {size}
            </span>
            <ProgressBar value={65} color={color} size={size} showLabel />
          </div>
        )),
      )}
      <div style={{ gridColumn: '1 / -1' }}>
        <span className="text-grey_2 text-12 font-manrope mb-4px block">
          Animated with custom label
        </span>
        <ProgressBar
          value={42}
          color="purple"
          size="lg"
          animated
          showLabel
          label="42 / 100 tasks"
        />
      </div>
    </div>
  ),
};
