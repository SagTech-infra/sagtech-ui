import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import VariablePicker, { type VariableItem } from './VariablePicker';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Form Controls/VariablePicker',
  component: VariablePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof VariablePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const variables: VariableItem[] = [
  { token: '{{lead.firstName}}', label: 'First name', description: "Lead's first name.", example: 'Ada', source: 'Lead' },
  { token: '{{lead.lastName}}', label: 'Last name', description: "Lead's surname.", example: 'Lovelace', source: 'Lead' },
  { token: '{{lead.company}}', label: 'Company', description: 'Where the lead works.', example: 'Analytical Engine Co.', source: 'Lead' },
  { token: '{{lead.linkedin}}', label: 'LinkedIn URL', source: 'Lead' },
  { token: '{{icp.industry}}', label: 'Industry', description: 'From ICP profile.', example: 'FinTech', source: 'ICP' },
  { token: '{{icp.headcount}}', label: 'Headcount', source: 'ICP' },
  { token: '{{sender.firstName}}', label: 'Sender first name', example: 'Alan', source: 'Sender' },
  { token: '{{sender.signature}}', label: 'Email signature', source: 'Sender' },
  { token: '{{case.title}}', label: 'Case title', description: 'Relevant case study.', source: 'Case' },
  { token: '{{case.outcome}}', label: 'Case outcome', source: 'Case' },
];

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = useState(true);
    const [picked, setPicked] = useState<string | null>(null);
    return (
      <div className="flex flex-col gap-12px items-start">
        <Button text="Open picker" variant="primary" buttonSize="small" onClick={() => setOpen(true)} />
        {picked && (
          <code className="text-12 text-pr_purple font-mono">Picked: {picked}</code>
        )}
        <VariablePicker
          isOpen={open}
          onClose={() => setOpen(false)}
          variables={variables}
          onPick={(v) => setPicked(v.token)}
        />
      </div>
    );
  },
};
