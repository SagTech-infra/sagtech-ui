'use client';
import { Wizard } from '@sagtech-infra/ui';

const steps = [
  { id: 'profile', title: 'Profile', description: 'About you' },
  { id: 'team', title: 'Team', description: 'Invite teammates' },
  { id: 'billing', title: 'Billing', description: 'Plan & card' },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <Wizard.Root steps={steps} onComplete={() => alert('All done!')}>
        <Wizard.Progress />
        <Wizard.Content className="min-h-[160px] bg-black_2 border border-solid border-black_3 rounded-16px p-24px">
          {({ currentStep }) => (
            <div className="flex flex-col gap-8px">
              <h3 className="text-white_4 font-orbitron">{currentStep.title}</h3>
              <p className="text-grey_4 font-manrope text-14">{currentStep.description}</p>
            </div>
          )}
        </Wizard.Content>
        <Wizard.Footer />
      </Wizard.Root>
    </div>
  );
}
