'use client';
import { useState } from 'react';
import { FaqList } from '@sagtech-infra/ui';

const faqList = [
  {
    title: 'What services do you offer?',
    description: 'Web applications, mobile apps, and cloud solutions across the product lifecycle.',
  },
  {
    title: 'How long does a typical project take?',
    description: 'A typical project takes between 3-6 months from kickoff to launch.',
  },
  {
    title: 'Do you provide ongoing support?',
    description: 'Yes, we provide ongoing maintenance and support packages after launch.',
  },
];

export default function Demo() {
  const [activeItem, setActiveItem] = useState(faqList[0].title);

  return (
    <div className="w-full max-w-[720px]">
      <FaqList
        faqList={faqList}
        activeItem={activeItem}
        onSelect={(target) => setActiveItem((prev) => (prev === target ? '' : target))}
      />
    </div>
  );
}
