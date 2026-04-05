import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Notification } from './Notification';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Feedback/Notification',
  component: Notification,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    text: { control: 'text' },
    buttonTextFirst: { control: 'text' },
    buttonTextSecond: { control: 'text' },
    state: {
      control: 'select',
      options: ['success', 'error', 'Check', 'mail', 'arrow'],
    },
    isbuttonSecond: { control: 'boolean' },
    useIconButtonFirst: { control: 'boolean' },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    title: 'Message sent!',
    text: 'Your message has been successfully sent. We will get back to you shortly.',
    buttonTextFirst: 'Got it',
    state: 'success',
    color: '#22C55E',
    useIconButtonFirst: false,
  },
};

export const Error: Story = {
  args: {
    title: 'Something went wrong',
    text: 'Please try again or contact support if the problem persists.',
    buttonTextFirst: 'Retry',
    state: 'error',
    color: '#992D2D',
    useIconButtonFirst: false,
  },
};

export const WithTwoButtons: Story = {
  args: {
    title: 'New update available',
    text: 'A new version is available with bug fixes and improvements.',
    buttonTextFirst: 'Update now',
    buttonTextSecond: 'Later',
    isbuttonSecond: true,
    state: 'success',
    color: '#F8F8F8',
    useIconButtonFirst: false,
  },
};

export const Interactive: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <Button
          text="Show Notification"
          variant="primary"
          buttonSize="large"
          onClick={() => setVisible(true)}
        />
        {visible && (
          <div
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              zIndex: 500,
              animation: 'slide-down 300ms ease-out forwards',
            }}
          >
            <Notification
              title="Application submitted!"
              text="We received your application and will review it within 24 hours."
              buttonTextFirst="Got it"
              state="success"
              color="#22C55E"
              useIconButtonFirst={false}
              onClickButtonFirst={() => setVisible(false)}
            />
          </div>
        )}
      </div>
    );
  },
};
