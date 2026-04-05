import type { Meta, StoryObj } from '@storybook/react';
import LazyImage from './LazyImage';

const meta = {
  title: 'Data Display/LazyImage',
  component: LazyImage,
  tags: ['autodocs'],
  argTypes: {
    url: { control: 'text' },
    alt: { control: 'text' },
    className: { control: 'text' },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none'],
    },
  },
} satisfies Meta<typeof LazyImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: 'https://via.placeholder.com/400x300',
    alt: 'Lazy loaded image',
    className: 'relative w-[400px] h-[300px]',
  },
};

export const WithPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ color: '#999' }}>
        Scroll down to see the lazy-loaded image appear when it enters the viewport.
      </p>
      <div style={{ height: '80vh' }} />
      <LazyImage
        url="https://via.placeholder.com/600x400"
        alt="Lazy loaded on scroll"
        className="relative w-[600px] h-[400px]"
        objectFit="cover"
      />
      <div style={{ height: '40vh' }} />
    </div>
  ),
};
