import type { Meta, StoryObj } from '@storybook/react';
import SliderArrow from './SliderArrow';

const meta = {
  title: 'Feedback/SliderArrow',
  component: SliderArrow,
  tags: ['autodocs'],
  argTypes: {
    isReversed: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
} satisfies Meta<typeof SliderArrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Reversed: Story = {
  args: { isReversed: true },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const NavigationPair: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <SliderArrow />
      <span style={{ color: '#B5B5B9', fontFamily: 'var(--font-manrope)', fontSize: '14px' }}>
        Slide 1 / 5
      </span>
      <SliderArrow isReversed />
    </div>
  ),
};
