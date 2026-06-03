import type { Meta, StoryObj } from '@storybook/react';
import Image from './Image';

const meta = {
  title: 'Data Display/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    url: { control: 'text' },
    alt: { control: 'text' },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none'],
    },
    rounded: { control: 'text' },
    maxWidthOn: { control: 'boolean' },
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

// Working placeholder SVG as data URI
const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%2320202D'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236D3EF1' font-family='sans-serif' font-size='20'%3E400 × 300%3C/text%3E%3C/svg%3E`;

export const Default: Story = {
  args: {
    url: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_1280.jpg",
    alt: 'Placeholder image',
    className: 'relative w-full h-full',
    objectFit: 'cover',
  },
};

export const WithFallback: Story = {
  args: {
    url: 'https://invalid-url-that-will-fail.example/image.png',
    alt: 'Error state — loading overlay stays visible',
    className: 'relative w-full min-w-0 h-[300px]',
  },
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p className="text-grey_4 font-manrope text-12">No URL provided — shows loading overlay</p>
      <Image alt="Loading state" className="relative w-full h-full" />
    </div>
  ),
};

export const Rounded: Story = {
  args: {
    url: placeholderSvg,
    alt: 'Rounded corners',
    className: 'relative w-full h-full',
    rounded: '24px',
    objectFit: 'cover',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div>
        <p className="text-grey_2 font-manrope text-12 mb-8px">Loaded</p>
        <Image url={placeholderSvg} alt="Loaded" className="relative w-full h-full" objectFit="cover" />
      </div>
      <div>
        <p className="text-grey_2 font-manrope text-12 mb-8px">Loading (no URL)</p>
        <Image alt="Loading" className="relative w-full h-full" />
      </div>
      <div>
        <p className="text-grey_2 font-manrope text-12 mb-8px">Error (bad URL)</p>
        <Image url="https://bad.url/img.png" alt="Error" className="relative w-full h-full" />
      </div>
    </div>
  ),
};
