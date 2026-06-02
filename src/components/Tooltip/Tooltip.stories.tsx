import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './Tooltip';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-64px">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const TriggerButton = ({ label }: { label: string }) => (
  <button
    type="button"
    className="px-16px py-8px bg-pr_purple text-white text-14 font-manrope rounded-8px"
  >
    {label}
  </button>
);

export const Top: Story = {
  args: {
    content: 'Tooltip on top',
    position: 'top',
    children: <TriggerButton label="Hover me" />,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    position: 'bottom',
    children: <TriggerButton label="Hover me" />,
  },
};

export const Left: Story = {
  args: {
    content: 'Tooltip on left',
    position: 'left',
    children: <TriggerButton label="Hover me" />,
  },
};

export const Right: Story = {
  args: {
    content: 'Tooltip on right',
    position: 'right',
    children: <TriggerButton label="Hover me" />,
  },
};

export const WithRichContent: Story = {
  args: {
    position: 'top',
    content: (
      <div className="flex flex-col gap-4px">
        <span className="text-white_4 font-semibold">Rich Tooltip</span>
        <span className="text-grey_3 text-10">This tooltip contains structured content</span>
      </div>
    ),
    children: <TriggerButton label="Rich content" />,
  },
};
