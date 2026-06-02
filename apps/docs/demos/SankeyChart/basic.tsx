'use client';
import { SankeyChart } from '@sagtech-infra/ui/charts';

const nodes = [
  { id: 'visit', label: 'Visit' },
  { id: 'signup', label: 'Sign-up' },
  { id: 'paid', label: 'Paid' },
  { id: 'free', label: 'Free' },
  { id: 'retain', label: 'Retained' },
  { id: 'churn', label: 'Churned' },
];

const links = [
  { source: 'visit', target: 'signup', value: 60 },
  { source: 'visit', target: 'free', value: 40 },
  { source: 'signup', target: 'paid', value: 35 },
  { source: 'signup', target: 'free', value: 25 },
  { source: 'paid', target: 'retain', value: 25 },
  { source: 'paid', target: 'churn', value: 10 },
  { source: 'free', target: 'retain', value: 30 },
  { source: 'free', target: 'churn', value: 35 },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <SankeyChart nodes={nodes} links={links} width="100%" height={360} />
    </div>
  );
}
