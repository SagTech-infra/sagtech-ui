import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Sheet from './Sheet';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    side: { control: 'radio', options: ['left', 'right', 'top', 'bottom'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg', 'xl'] },
    showBackdrop: { control: 'boolean' },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultStory(args) {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-24px">
        <Button text="Open sheet" variant="primary" buttonSize="small" onClick={() => setOpen(true)} />
        <Sheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Sheet title"
          footer={
            <>
              <Button text="Cancel" variant="secondary" buttonSize="small" onClick={() => setOpen(false)} />
              <Button text="Save" variant="primary" buttonSize="small" />
            </>
          }
        >
          <p className="font-manrope text-14 text-grey_4 leading-24">
            A Sheet is similar to a Drawer but uses the shared overlay stack so multiple sheets can be open simultaneously.
          </p>
        </Sheet>
      </div>
    );
  },
  args: {
    side: 'right',
    size: 'md',
    showBackdrop: true,
  } as never,
};

export const FromLeft: Story = {
  render: function LeftStory() {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-24px">
        <Button text="Open" variant="primary" buttonSize="small" onClick={() => setOpen(true)} />
        <Sheet open={open} onOpenChange={setOpen} side="left" title="Navigation">
          <ul className="flex flex-col gap-8px">
            <li className="text-white_4 font-manrope text-14">Dashboard</li>
            <li className="text-grey_4 font-manrope text-14">Settings</li>
            <li className="text-grey_4 font-manrope text-14">Account</li>
          </ul>
        </Sheet>
      </div>
    );
  },
};

export const FromBottom: Story = {
  render: function BottomStory() {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-24px">
        <Button text="Open" variant="primary" buttonSize="small" onClick={() => setOpen(true)} />
        <Sheet open={open} onOpenChange={setOpen} side="bottom" size="md" title="Filters">
          <p className="font-manrope text-14 text-grey_4">Bottom-anchored sheet content.</p>
        </Sheet>
      </div>
    );
  },
};

export const Stacked: Story = {
  render: function StackedStory() {
    const [first, setFirst] = useState(false);
    const [second, setSecond] = useState(false);
    return (
      <div className="p-24px">
        <Button text="Open outer" variant="primary" buttonSize="small" onClick={() => setFirst(true)} />
        <Sheet
          open={first}
          onOpenChange={setFirst}
          title="Outer sheet"
          footer={
            <Button
              text="Open inner"
              variant="primary"
              buttonSize="small"
              onClick={() => setSecond(true)}
            />
          }
        >
          <p className="font-manrope text-14 text-grey_4">
            Open the inner sheet to verify they stack correctly.
          </p>
        </Sheet>
        <Sheet open={second} onOpenChange={setSecond} title="Inner sheet" size="sm">
          <p className="font-manrope text-14 text-grey_4">Inner sheet content.</p>
        </Sheet>
      </div>
    );
  },
};
