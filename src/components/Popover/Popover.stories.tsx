import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Popover from './Popover';

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-[120px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const TriggerButton = ({ label }: { label: string }) => (
  <span className="px-16px py-8px bg-pr_purple text-white text-14 font-manrope rounded-8px inline-block">
    {label}
  </span>
);

export const Default: Story = {
  args: {
    trigger: <TriggerButton label="Click me" />,
    children: (
      <p className="text-grey_4 text-14 font-manrope">
        This is a simple popover with text content. Click the trigger to toggle.
      </p>
    ),
  },
};

export const Top: Story = {
  args: {
    trigger: <TriggerButton label="Top Popover" />,
    position: 'top',
    children: (
      <p className="text-grey_4 text-14 font-manrope">
        Popover positioned on top of the trigger element.
      </p>
    ),
  },
};

export const WithRichContent: Story = {
  args: {
    trigger: <TriggerButton label="Details" />,
    position: 'bottom',
    children: (
      <div className="flex flex-col gap-12px">
        <h4 className="text-white_4 text-16 font-manrope font-semibold">User Profile</h4>
        <p className="text-grey_4 text-14 font-manrope">
          Senior developer with 5+ years of experience.
        </p>
        <div className="flex gap-8px">
          <span className="inline-flex items-center gap-4px rounded-circle font-manrope font-semibold text-12 py-4px px-12px bg-pr_purple/10 text-pr_purple">
            React
          </span>
          <span className="inline-flex items-center gap-4px rounded-circle font-manrope font-semibold text-12 py-4px px-12px bg-success/10 text-success">
            Active
          </span>
        </div>
        <button
          type="button"
          className="px-16px py-8px bg-pr_purple text-white text-14 font-manrope rounded-8px w-full"
        >
          View Profile
        </button>
      </div>
    ),
  },
};

const InteractivePopover = () => {
  const [value, setValue] = useState('');

  return (
    <Popover
      trigger={<TriggerButton label="Open Form" />}
      position="bottom"
      align="start"
    >
      <div className="flex flex-col gap-12px min-w-[240px]">
        <h4 className="text-white_4 text-16 font-manrope font-semibold">Quick Feedback</h4>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your feedback..."
          className="bg-black_1 border border-black_3 rounded-8px px-12px py-8px text-14 text-white_4 placeholder:text-grey_2 font-manrope outline-none focus:border-pr_purple"
        />
        <button
          type="button"
          onClick={() => console.log('Submitted:', value)}
          className="px-16px py-8px bg-pr_purple text-white text-14 font-manrope rounded-8px"
        >
          Submit
        </button>
      </div>
    </Popover>
  );
};

export const Interactive: Story = {
  render: () => <InteractivePopover />,
  args: {
    trigger: <TriggerButton label="Open Form" />,
    children: null,
  },
};
