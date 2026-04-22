import type { Meta, StoryObj } from '@storybook/react';
import { SagtechUIProvider } from './SagtechUIProvider';
import Point from '@/components/Point/Point';
import CardWrapper from '@/components/CardWrapper/CardWrapper';
import type { UIImageComponent, UILinkComponent } from './defaults';

const meta = {
  title: 'Providers/SagtechUIProvider',
  component: SagtechUIProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Optional provider that lets consumers inject custom implementations for `next/image` and `next/link` (or any other framework link/image). Without the provider, components fall back to plain `<img>` and `<a>` shims so the library works in any React environment.',
      },
    },
  },
} satisfies Meta<typeof SagtechUIProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const OutlinedImage: UIImageComponent = ({ src, alt, width, height }) => (
  <img
    src={typeof src === 'string' ? src : ''}
    alt={alt}
    width={width as number | undefined}
    height={height as number | undefined}
    style={{ outline: '2px dashed #6D3EF1', padding: 2 }}
  />
);

const OutlinedLink: UILinkComponent = ({ href, children, className }) => (
  <a
    href={href}
    className={className}
    style={{ outline: '2px dashed #58A61B', display: 'inline-block' }}
  >
    {children}
  </a>
);

export const DefaultShims: Story = {
  name: 'Default (no provider)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Point text="Icon via <img> shim" type="BodyM" textColor="text-grey_4" iconName="users" />
      <CardWrapper href="#default">
        <div style={{ padding: 24 }}>CardWrapper with href (default &lt;a&gt; shim)</div>
      </CardWrapper>
    </div>
  ),
};

export const WithCustomProvider: Story = {
  name: 'With custom imageComponent / linkComponent',
  render: () => (
    <SagtechUIProvider imageComponent={OutlinedImage} linkComponent={OutlinedLink}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Point text="Icon via custom component" type="BodyM" textColor="text-grey_4" iconName="users" />
        <CardWrapper href="#custom">
          <div style={{ padding: 24 }}>CardWrapper with custom link</div>
        </CardWrapper>
      </div>
    </SagtechUIProvider>
  ),
};

export const NextImageRecipe: Story = {
  name: 'Recipe: wiring next/image and next/link',
  render: () => (
    <pre
      style={{
        background: '#111',
        color: '#eee',
        padding: 16,
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
{`// app/layout.tsx
'use client';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { SagtechUIProvider } from '@sagtech-infra/ui';

export default function RootLayout({ children }) {
  return (
    <SagtechUIProvider
      imageComponent={NextImage}
      linkComponent={NextLink}
    >
      {children}
    </SagtechUIProvider>
  );
}`}
    </pre>
  ),
};
