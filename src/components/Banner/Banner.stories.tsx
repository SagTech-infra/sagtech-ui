import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Banner from './Banner';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Feedback/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: { control: 'radio', options: ['info', 'success', 'warning', 'error'] },
    position: { control: 'radio', options: ['top', 'bottom'] },
    sticky: { control: 'boolean' },
    dismissible: { control: 'boolean' },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'info',
    title: 'Maintenance scheduled',
    children: 'We will be performing scheduled maintenance on Sunday from 2:00 to 4:00 UTC.',
    sticky: false,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8px">
      <Banner sticky={false} variant="info" title="Heads up">
        New beta features available.
      </Banner>
      <Banner sticky={false} variant="success" title="Saved">
        Your changes were saved successfully.
      </Banner>
      <Banner sticky={false} variant="warning" title="Trial ending">
        Your trial expires in 3 days.
      </Banner>
      <Banner sticky={false} variant="error" title="Connection lost">
        Reconnecting to server...
      </Banner>
    </div>
  ),
};

export const WithAction: Story = {
  args: {
    sticky: false,
    variant: 'warning',
    title: 'Trial ending soon',
    children: 'Upgrade to keep your team running.',
    action: <Button text="Upgrade" variant="primary" buttonSize="small" />,
  },
};

export const Dismissible: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(true);
      if (!open) {
        return (
          <Button
            text="Show banner"
            variant="primary"
            buttonSize="small"
            onClick={() => setOpen(true)}
          />
        );
      }
      return (
        <Banner
          sticky={false}
          variant="info"
          dismissible
          onClose={() => setOpen(false)}
          title="Welcome back"
        >
          Click the × to close this banner.
        </Banner>
      );
    }
    return <Demo />;
  },
};

export const StickyTop: Story = {
  args: {
    variant: 'info',
    sticky: true,
    position: 'top',
    title: 'Sticky banner',
    children: 'This banner is fixed at the top of the viewport.',
    dismissible: true,
  },
};
