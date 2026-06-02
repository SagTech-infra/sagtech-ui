'use client';
import { Timeline } from '@sagtech-infra/ui';

const steps = [
  {
    title: 'Discovery',
    text: 'We analyze your business requirements and define the project scope to ensure alignment with your goals.',
  },
  {
    title: 'Design',
    text: 'Our team creates wireframes and visual designs that bring your vision to life with a user-centered approach.',
  },
  {
    title: 'Development',
    text: 'We build your solution using modern technologies and agile methodology for rapid delivery.',
  },
  {
    title: 'Launch',
    text: 'We deploy your solution and provide ongoing support to ensure smooth operation.',
  },
];

export default function Demo() {
  return (
    <div className="w-full">
      <Timeline data={steps} isInView />
    </div>
  );
}
