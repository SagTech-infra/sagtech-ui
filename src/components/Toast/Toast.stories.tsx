import type { Meta, StoryObj } from '@storybook/react';
import Toaster from './Toaster';
import { toast } from './toast';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Overlays/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-wrap gap-12px">
        <Button text="default" buttonSize="small" variant="secondary" onClick={() => toast('Saved')} />
        <Button text="success" buttonSize="small" variant="secondary" onClick={() => toast.success('Saved successfully')} />
        <Button text="error" buttonSize="small" variant="secondary" onClick={() => toast.error('Something went wrong', { description: 'Check the console for details.' })} />
        <Button text="warning" buttonSize="small" variant="secondary" onClick={() => toast.warning('Disk almost full')} />
        <Button text="info" buttonSize="small" variant="secondary" onClick={() => toast.info('New version available')} />
      </div>
    </>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster position="top-right" />
      <Button
        text="Delete record"
        buttonSize="small"
        variant="primary"
        onClick={() =>
          toast.success('Record deleted', {
            description: 'You can undo within 5 seconds.',
            duration: 5000,
            action: {
              label: 'Undo',
              onClick: () => toast.info('Undo pressed'),
            },
          })
        }
      />
    </>
  ),
};

export const Promise: Story = {
  name: 'toast.promise()',
  render: () => (
    <>
      <Toaster position="bottom-right" />
      <Button
        text="Save (1s delay)"
        buttonSize="small"
        variant="primary"
        onClick={() => {
          const pending = new window.Promise<{ id: number }>((resolve) =>
            setTimeout(() => resolve({ id: 42 }), 1000),
          );
          toast.promise(pending, {
            loading: 'Saving…',
            success: (data) => `Saved as #${data.id}`,
            error: 'Failed to save',
          });
        }}
      />
      <Button
        text="Save (fails)"
        buttonSize="small"
        variant="secondary"
        onClick={() => {
          const pending = new window.Promise<unknown>((_, reject) =>
            setTimeout(() => reject(new Error('Network down')), 800),
          );
          toast.promise(pending.catch((err) => Promise.reject(err)), {
            loading: 'Saving…',
            success: 'Saved',
            error: (err) => `Failed: ${(err as Error).message}`,
          });
        }}
      />
    </>
  ),
};

export const Stacking: Story = {
  render: () => (
    <>
      <Toaster position="top-right" visibleToasts={4} />
      <Button
        text="Fire 6 toasts"
        buttonSize="small"
        variant="primary"
        onClick={() => {
          for (let i = 1; i <= 6; i += 1) {
            toast(`Message ${i}`, { description: `Toast number ${i}` });
          }
        }}
      />
    </>
  ),
};

export const Positions: Story = {
  render: () => (
    <>
      <Toaster position="bottom-center" />
      <div className="flex flex-col gap-8px text-white_4 font-manrope text-14">
        <p>Use the buttons to preview — this story uses bottom-center.</p>
        <Button
          text="Fire"
          buttonSize="small"
          variant="primary"
          onClick={() => toast.success('Hello from the bottom-center', { description: 'Toaster accepts 6 positions.' })}
        />
      </div>
    </>
  ),
};
