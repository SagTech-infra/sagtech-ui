'use client';
import { useState } from 'react';
import { VariablePicker, Button, type VariableItem } from '@sagtech-infra/ui';

const variables: VariableItem[] = [
  { token: '{{lead.firstName}}', label: 'First name', description: "Lead's first name.", example: 'Ada', source: 'Lead' },
  { token: '{{lead.company}}', label: 'Company', description: 'Where the lead works.', example: 'Analytical Engine Co.', source: 'Lead' },
  { token: '{{icp.industry}}', label: 'Industry', description: 'From ICP profile.', example: 'FinTech', source: 'ICP' },
  { token: '{{sender.firstName}}', label: 'Sender first name', example: 'Alan', source: 'Sender' },
];

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-start gap-12px">
      <Button text="Open picker" variant="primary" buttonSize="small" onClick={() => setOpen(true)} />
      {picked && <code className="text-12 text-pr_purple font-mono">Picked: {picked}</code>}
      <VariablePicker
        isOpen={open}
        onClose={() => setOpen(false)}
        variables={variables}
        onPick={(v) => setPicked(v.token)}
      />
    </div>
  );
}
