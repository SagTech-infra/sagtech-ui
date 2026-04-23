import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Drawer from './Drawer';
import Input from '@/components/Input/Input';
import { TextArea } from '@/components/TextArea/TextArea';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Layout/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    position: { control: 'select', options: ['left', 'right'] },
    width: { control: 'text' },
    title: { control: 'text' },
    showOverlay: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Drawer Title',
    position: 'right',
    showOverlay: true,
    onClose: () => {},
    children: (
      <div className="flex flex-col gap-16px">
        <p className="font-manrope text-14 text-grey_4 leading-24">
          This is a drawer panel that slides in from the side of the screen. It can contain any
          content you need, such as forms, settings, or detailed information.
        </p>
        <p className="font-manrope text-14 text-grey_4 leading-24">
          Click the overlay or press Escape to close it. You can also click the X button in the
          header.
        </p>
      </div>
    ),
  },
};

export const LeftSide: Story = {
  args: {
    isOpen: true,
    title: 'Left Drawer',
    position: 'left',
    showOverlay: true,
    onClose: () => {},
    children: (
      <div className="flex flex-col gap-16px">
        <p className="font-manrope text-14 text-grey_4 leading-24">
          This drawer slides in from the left side. Useful for navigation panels or sidebars.
        </p>
        <div className="flex flex-col gap-8px">
          {['Dashboard', 'Projects', 'Settings', 'Profile'].map((item) => (
            <div
              key={item}
              className="px-16px py-12px rounded-8px text-14 font-manrope text-grey_4 hover:bg-black_3 hover:text-white_4 cursor-pointer transition-colors"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export const Interactive: Story = {
  render: function InteractiveDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-24px">
        <Button
          text="Open Drawer"
          variant="primary"
          buttonSize="large"
          onClick={() => setIsOpen(true)}
        />
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Interactive Drawer">
          <div className="flex flex-col gap-16px">
            <p className="font-manrope text-14 text-grey_4 leading-24">
              This drawer was opened by clicking the button. Close it by clicking the X, pressing
              Escape, or clicking the overlay.
            </p>
            <Button
              text="Close Drawer"
              variant="secondary"
              buttonSize="small"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </Drawer>
      </div>
    );
  },
};

export const WithForm: Story = {
  render: function DrawerWithForm() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-24px">
        <Button
          text="Open Contact Form"
          variant="primary"
          buttonSize="large"
          onClick={() => setIsOpen(true)}
        />
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Contact Us">
          <div className="flex flex-col gap-16px">
            <Input name="name" placeholder="Your name" label="Name" />
            <Input name="email" placeholder="your@email.com" label="Email" type="email" />
            <TextArea name="message" placeholder="Write your message..." rows={5} />
            <div className="flex gap-12px pt-8px">
              <Button text="Submit" variant="primary" buttonSize="large" />
              <Button
                text="Cancel"
                variant="secondary"
                buttonSize="large"
                onClick={() => setIsOpen(false)}
              />
            </div>
          </div>
        </Drawer>
      </div>
    );
  },
};
