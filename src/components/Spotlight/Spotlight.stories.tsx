import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import Spotlight from './Spotlight';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Overlays/Spotlight',
  component: Spotlight,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Spotlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(true);
    const ref = useRef<HTMLButtonElement>(null);
    return (
      <div className="p-40px flex flex-col gap-32px">
        <h2 className="font-manrope text-18 text-white_4">Welcome tour</h2>
        <button
          ref={ref}
          type="button"
          className="self-start px-24px py-12px rounded-8px bg-pr_purple text-white_4 font-manrope text-14"
        >
          Click me first
        </button>
        <Button text="Open spotlight" variant="secondary" buttonSize="small" onClick={() => setOpen(true)} />
        <Spotlight
          targetRef={ref}
          open={open}
          onOpenChange={setOpen}
          title="Get started here"
          description="This button creates your first project. Click it to begin."
          placement="bottom"
        />
      </div>
    );
  },
};

export const MultiStep: Story = {
  render: function MultiStepStory() {
    const [step, setStep] = useState(1);
    const [open, setOpen] = useState(true);
    const refA = useRef<HTMLButtonElement>(null);
    const refB = useRef<HTMLButtonElement>(null);
    const refC = useRef<HTMLButtonElement>(null);
    const refs = [refA, refB, refC];
    const titles = ['Step 1', 'Step 2', 'Step 3'];
    const descriptions = [
      'Start by clicking here.',
      'Then configure your settings.',
      'Finally, save your work.',
    ];
    return (
      <div className="p-40px flex flex-col gap-32px">
        <div className="flex gap-16px">
          <button ref={refA} type="button" className="px-24px py-12px rounded-8px bg-pr_purple text-white_4">
            Action A
          </button>
          <button ref={refB} type="button" className="px-24px py-12px rounded-8px bg-pr_purple text-white_4">
            Action B
          </button>
          <button ref={refC} type="button" className="px-24px py-12px rounded-8px bg-pr_purple text-white_4">
            Action C
          </button>
        </div>
        <Spotlight
          targetRef={refs[step - 1]}
          open={open}
          onOpenChange={setOpen}
          title={titles[step - 1]}
          description={descriptions[step - 1]}
          step={step}
          totalSteps={3}
          onNext={() => {
            if (step < 3) setStep(step + 1);
            else setOpen(false);
          }}
          onSkip={() => setOpen(false)}
        />
      </div>
    );
  },
};
