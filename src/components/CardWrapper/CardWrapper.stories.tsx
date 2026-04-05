import type { Meta, StoryObj } from '@storybook/react';
import CardWrapper from './CardWrapper';

const meta = {
  title: 'Layout/CardWrapper',
  component: CardWrapper,
  tags: ['autodocs'],
  argTypes: {
    rounded: {
      control: 'select',
      options: ['0', '8', '12', '16', '24', '40', '100'],
    },
    stoke: {
      control: 'select',
      options: ['1', '2'],
    },
    href: { control: 'text' },
  },
} satisfies Meta<typeof CardWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rounded: '24',
    stoke: '2',
    children: (
      <div style={{ padding: '32px', color: 'white' }}>
        <h3>Card Content</h3>
        <p>Default card with rounded-24 and stroke-2</p>
      </div>
    ),
  },
};

export const Stroke1Rounded24: Story = {
  args: {
    rounded: '24',
    stoke: '1',
    children: (
      <div style={{ padding: '32px', color: 'white' }}>
        <h3>Stroke 1</h3>
        <p>Thinner border gradient</p>
      </div>
    ),
  },
};

export const Rounded40: Story = {
  args: {
    rounded: '40',
    stoke: '2',
    children: (
      <div style={{ padding: '32px', color: 'white' }}>
        <h3>Large Rounded</h3>
        <p>Card with rounded-40</p>
      </div>
    ),
  },
};

export const Rounded100: Story = {
  args: {
    rounded: '100',
    stoke: '1',
    children: (
      <div style={{ padding: '16px 32px', color: 'white' }}>
        Pill shape (rounded-100)
      </div>
    ),
  },
};

export const WithLink: Story = {
  args: {
    rounded: '24',
    stoke: '2',
    href: '#',
    children: (
      <div style={{ padding: '32px', color: 'white' }}>
        <h3>Clickable Card</h3>
        <p>This card is a link</p>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      <CardWrapper rounded="24" stoke="1">
        <div style={{ padding: '24px', color: 'white' }}>Stroke 1, Rounded 24</div>
      </CardWrapper>
      <CardWrapper rounded="24" stoke="2">
        <div style={{ padding: '24px', color: 'white' }}>Stroke 2, Rounded 24</div>
      </CardWrapper>
      <CardWrapper rounded="40" stoke="1">
        <div style={{ padding: '24px', color: 'white' }}>Stroke 1, Rounded 40</div>
      </CardWrapper>
      <CardWrapper rounded="16" stoke="2">
        <div style={{ padding: '24px', color: 'white' }}>Stroke 2, Rounded 16</div>
      </CardWrapper>
      <CardWrapper rounded="12" stoke="2">
        <div style={{ padding: '24px', color: 'white' }}>Stroke 2, Rounded 12</div>
      </CardWrapper>
    </div>
  ),
};
