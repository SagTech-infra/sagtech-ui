import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Stepper from './Stepper';
import type { StepperStep } from './types';

const meta = {
  title: 'Data Display/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    clickableSteps: { control: 'radio', options: ['all', 'completed', 'none'] },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseSteps: StepperStep[] = [
  { label: 'Account', description: 'Create your account', status: 'complete' },
  { label: 'Profile', description: 'Tell us about yourself', status: 'active' },
  { label: 'Preferences', description: 'Configure your workspace', status: 'pending' },
  { label: 'Done', description: 'You are ready to go', status: 'pending' },
];

export const Horizontal: Story = {
  args: {
    steps: baseSteps,
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    steps: baseSteps,
    orientation: 'vertical',
  },
};

export const WithError: Story = {
  args: {
    steps: [
      { label: 'Connect', description: 'Link your repo', status: 'complete' },
      { label: 'Configure', description: 'Set up CI/CD', status: 'error' },
      { label: 'Deploy', status: 'pending' },
    ],
  },
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [activeIndex, setActiveIndex] = useState(1);
    const steps: StepperStep[] = ['Account', 'Profile', 'Preferences', 'Done'].map(
      (label, idx) => ({
        label,
        description: `Step ${idx + 1}`,
        status:
          idx < activeIndex ? 'complete' : idx === activeIndex ? 'active' : 'pending',
      }),
    );
    return (
      <div className="w-[640px]">
        <Stepper
          steps={steps}
          clickableSteps="completed"
          onStepClick={(i) => setActiveIndex(i)}
        />
        <div className="mt-32px flex gap-8px">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            className="px-16px py-8px rounded-8px bg-black_3 text-white_4 disabled:opacity-50 cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            disabled={activeIndex === steps.length - 1}
            onClick={() => setActiveIndex((i) => Math.min(steps.length - 1, i + 1))}
            className="px-16px py-8px rounded-8px bg-pr_purple text-white_4 disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

export const AllClickable: Story = {
  args: {
    steps: baseSteps,
    clickableSteps: 'all',
    onStepClick: (i) => console.log('clicked', i),
  },
};
