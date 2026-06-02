'use client';
import { Stepper, type StepperStep } from '@sagtech-infra/ui';

const steps: StepperStep[] = [
  { label: 'Account', description: 'Create your account', status: 'complete' },
  { label: 'Profile', description: 'Tell us about yourself', status: 'active' },
  { label: 'Preferences', description: 'Configure your workspace', status: 'pending' },
  { label: 'Done', description: 'You are ready to go', status: 'pending' },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[640px]">
      <Stepper steps={steps} orientation="horizontal" />
    </div>
  );
}
