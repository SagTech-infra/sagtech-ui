import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Wizard } from './Wizard';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography/Typography';
import { useWizard } from './useWizard';

const meta = {
  title: 'Layout/Wizard',
  component: Wizard.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Wizard.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { id: 'profile', title: 'Profile', description: 'About you' },
  { id: 'team', title: 'Team', description: 'Invite teammates' },
  { id: 'billing', title: 'Billing', description: 'Plan & card' },
];

export const Basic: Story = {
  render: () => (
    <Wizard.Root steps={steps} onComplete={() => alert('All done!')}>
      <Wizard.Progress />
      <Wizard.Content className="min-h-[160px] bg-black_2 border border-solid border-black_3 rounded-16px p-24px">
        {({ currentStep }) => (
          <div className="flex flex-col gap-8px">
            <Typography tag="h3">{currentStep.title}</Typography>
            <Typography tag="p" type="BodyS" color="text-grey_4">
              Placeholder body for step &quot;{currentStep.id}&quot;.
            </Typography>
          </div>
        )}
      </Wizard.Content>
      <Wizard.Footer />
    </Wizard.Root>
  ),
};

export const WithValidation: Story = {
  name: 'With step validation',
  render: function ValidationStory() {
    const [name, setName] = useState('');
    return (
      <Wizard.Root
        steps={steps}
        onComplete={() => alert(`Welcome, ${name || 'friend'}!`)}
      >
        <Wizard.Progress />
        <Wizard.Content className="min-h-[200px] bg-black_2 border border-solid border-black_3 rounded-16px p-24px">
          {({ currentStep }) => {
            if (currentStep.id === 'profile') {
              return (
                <div className="flex flex-col gap-8px">
                  <Typography tag="h3">Profile</Typography>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Your full name"
                    externalLabel="Name"
                    state="default"
                  />
                </div>
              );
            }
            return (
              <Typography tag="p" color="text-grey_4">
                Step: {currentStep.title}
              </Typography>
            );
          }}
        </Wizard.Content>
        <Wizard.Footer
          onNext={() => {
            // Block advancing past profile without a name
            if (name.trim().length === 0) {
              alert('Please enter your name first');
              return false;
            }
            return true;
          }}
        />
      </Wizard.Root>
    );
  },
};

export const HookOnly: Story = {
  name: 'Hook-only (custom layout)',
  render: function HookStory() {
    const wiz = useWizard({ steps });
    return (
      <div className="flex flex-col gap-16px">
        <Typography tag="p" color="text-grey_2" type="LabelsS">
          Step {wiz.currentIndex + 1} of {wiz.totalSteps}: {wiz.currentStep.title}
        </Typography>
        <div className="bg-black_2 border border-solid border-black_3 rounded-16px p-24px">
          <Typography tag="p" color="text-grey_4">
            {wiz.currentStep.description}
          </Typography>
        </div>
        <div className="flex gap-8px">
          <button
            type="button"
            onClick={wiz.back}
            disabled={wiz.isFirst}
            className="px-16px py-8px border border-white text-white rounded-[50px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={wiz.next}
            className="px-16px py-8px bg-pr_purple text-white rounded-[50px] cursor-pointer"
          >
            {wiz.isLast ? 'Done' : 'Continue'}
          </button>
        </div>
      </div>
    );
  },
};
