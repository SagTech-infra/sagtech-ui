import type { Meta, StoryObj } from '@storybook/react';
import Container from './Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    as: {
      control: 'radio',
      options: ['div', 'section', 'main', 'article'],
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Centred, horizontally-padded wrapper. `size` caps `max-width`; `as` changes the rendered element.',
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const Swatch = ({ label }: { label: string }) => (
  <div
    style={{
      background: 'rgba(109,62,241,0.15)',
      border: '1px dashed #6D3EF1',
      borderRadius: 8,
      padding: '24px 16px',
      textAlign: 'center',
      color: '#a78bfa',
      fontFamily: 'monospace',
      fontSize: 13,
    }}
  >
    {label}
  </div>
);

export const Default: Story = {
  args: { size: 'md', as: 'div' },
  render: (args) => (
    <Container {...args}>
      <Swatch label={`size="${args.size}" as="${args.as}"`} />
    </Container>
  ),
};

export const Sm: Story = {
  name: 'sm — 640 px',
  args: { size: 'sm' },
  render: (args) => (
    <Container {...args}>
      <Swatch label="size=sm  max-w-[640px]" />
    </Container>
  ),
};

export const Md: Story = {
  name: 'md — 960 px',
  args: { size: 'md' },
  render: (args) => (
    <Container {...args}>
      <Swatch label="size=md  max-w-[960px]" />
    </Container>
  ),
};

export const Lg: Story = {
  name: 'lg — 1200 px',
  args: { size: 'lg' },
  render: (args) => (
    <Container {...args}>
      <Swatch label="size=lg  max-w-[1200px]" />
    </Container>
  ),
};

export const Xl: Story = {
  name: 'xl — 1440 px',
  args: { size: 'xl' },
  render: (args) => (
    <Container {...args}>
      <Swatch label="size=xl  max-w-[1440px]" />
    </Container>
  ),
};

export const Full: Story = {
  name: 'full — no cap',
  args: { size: 'full' },
  render: (args) => (
    <Container {...args}>
      <Swatch label="size=full  max-w-none" />
    </Container>
  ),
};

export const SemanticElements: Story = {
  name: 'Semantic elements (as)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['div', 'section', 'main', 'article'] as const).map((tag) => (
        <Container key={tag} as={tag} size="sm">
          <Swatch label={`as="${tag}"`} />
        </Container>
      ))}
    </div>
  ),
};
