'use client';
import { FaqDropdown } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="w-full max-w-[720px]">
      <FaqDropdown
        faqList={[
          {
            title: 'What services do you offer?',
            description:
              'We offer web applications, mobile apps, and cloud solutions across the full product lifecycle.',
          },
          {
            title: 'How long does a typical project take?',
            description: 'A typical project takes between 3-6 months from kickoff to launch.',
          },
          {
            title: 'Do you provide ongoing support?',
            description:
              'Yes, we provide ongoing maintenance and support packages after launch.',
          },
        ]}
      />
    </div>
  );
}
