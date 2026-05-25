import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import BottomSheet from './BottomSheet';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Overlays/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-24px">
        <Button text="Open" variant="primary" buttonSize="small" onClick={() => setOpen(true)} />
        <BottomSheet open={open} onOpenChange={setOpen} title="Quick actions" snapPoints={[0.5]}>
          <div className="flex flex-col gap-12px pt-12px">
            <Button text="Share" variant="secondary" buttonSize="small" />
            <Button text="Save" variant="secondary" buttonSize="small" />
            <Button text="Delete" variant="danger" buttonSize="small" />
          </div>
        </BottomSheet>
      </div>
    );
  },
};

export const MultipleSnapPoints: Story = {
  render: function SnapPointsStory() {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-24px">
        <Button
          text="Open multi-snap"
          variant="primary"
          buttonSize="small"
          onClick={() => setOpen(true)}
        />
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          title="Drag to snap"
          snapPoints={[0.3, 0.6, 0.9]}
          defaultSnap={0}
        >
          <p className="font-manrope text-14 text-grey_4 leading-24 mt-8px">
            Drag the handle up to expand or down to collapse. Snaps to 30%, 60%, 90% of viewport. Drag below 30% to dismiss.
          </p>
          <div className="mt-16px flex flex-col gap-12px">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="rounded-8px bg-black_2 px-16px py-12px text-white_4 font-manrope text-14"
              >
                List item {i + 1}
              </div>
            ))}
          </div>
        </BottomSheet>
      </div>
    );
  },
};

export const FullScreen: Story = {
  render: function FullStory() {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-24px">
        <Button text="Open full" variant="primary" buttonSize="small" onClick={() => setOpen(true)} />
        <BottomSheet open={open} onOpenChange={setOpen} title="Full sheet" snapPoints={[1]}>
          <p className="font-manrope text-14 text-grey_4 mt-8px">
            Single full-height snap. Drag the handle down to dismiss.
          </p>
        </BottomSheet>
      </div>
    );
  },
};
