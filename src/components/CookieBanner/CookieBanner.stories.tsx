import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CookieBanner from './CookieBanner';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Feedback/CookieBanner',
  component: CookieBanner,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    acceptText: { control: 'text' },
    declineText: { control: 'text' },
    privacyHref: { control: 'text' },
    privacyLabel: { control: 'text' },
    cookieName: { control: 'text' },
  },
} satisfies Meta<typeof CookieBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'We use cookies',
    description: 'This website uses cookies to ensure you get the best experience on our website.',
    acceptText: 'Accept',
    declineText: 'Decline',
    privacyHref: '/privacy',
    privacyLabel: 'Privacy Policy',
  },
};

export const Interactive: Story = {
  render: () => {
    const [key, setKey] = useState(0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <Button
          text="Reset Banner"
          variant="primary"
          buttonSize="large"
          onClick={() => setKey((prev) => prev + 1)}
        />
        <p style={{ color: '#999', fontSize: '14px' }}>
          Click Accept or Decline to hide the banner, then click Reset to show it again.
        </p>
        <CookieBanner
          key={key}
          title="We use cookies"
          description="This website uses cookies to ensure you get the best experience on our website."
          onAccept={() => console.log('Cookies accepted')}
          onDecline={() => console.log('Cookies declined')}
        />
      </div>
    );
  },
};
