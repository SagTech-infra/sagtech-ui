import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { ConfirmProvider, useConfirm } from './ConfirmProvider';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Overlays/Confirm',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Declarative: Story = {
  name: 'Declarative <ConfirmDialog>',
  render: function DeclarativeStory() {
    const [open, setOpen] = useState(false);
    const [log, setLog] = useState<string>('');
    return (
      <div className="flex flex-col gap-16px">
        <Button text="Delete file" buttonSize="small" variant="primary" onClick={() => setOpen(true)} />
        <span className="text-grey_4 text-14 font-manrope">Result: {log || '—'}</span>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete this file?"
          description="This action cannot be undone."
          confirmText="Delete"
          variant="danger"
          onConfirm={() => {
            setLog('confirmed');
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

function ImperativeDemo() {
  const confirm = useConfirm();
  const [log, setLog] = useState<string>('');

  return (
    <div className="flex flex-col gap-16px">
      <Button
        text="Ask me (default)"
        buttonSize="small"
        variant="secondary"
        onClick={async () => {
          const ok = await confirm({
            title: 'Save changes?',
            description: 'Your edits will be applied to the current draft.',
          });
          setLog(ok ? 'accepted' : 'cancelled');
        }}
      />
      <Button
        text="Ask me (danger + async)"
        buttonSize="small"
        variant="primary"
        onClick={async () => {
          const ok = await confirm({
            title: 'Delete 3 records?',
            description: 'The records will be removed permanently.',
            confirmText: 'Delete',
            variant: 'danger',
            onConfirm: () => new Promise((resolve) => setTimeout(resolve, 1200)),
          });
          setLog(ok ? 'deleted' : 'cancelled');
        }}
      />
      <span className="text-grey_4 text-14 font-manrope">Last result: {log || '—'}</span>
    </div>
  );
}

export const Imperative: Story = {
  name: 'Imperative useConfirm()',
  render: () => (
    <ConfirmProvider>
      <ImperativeDemo />
    </ConfirmProvider>
  ),
};

export const ImperativeQueue: Story = {
  name: 'Imperative — sequential queue',
  render: function QueueStory() {
    function Queue() {
      const confirm = useConfirm();
      const [log, setLog] = useState<string[]>([]);
      return (
        <div className="flex flex-col gap-16px">
          <Button
            text="Trigger 3 confirmations"
            buttonSize="small"
            variant="primary"
            onClick={async () => {
              const a = await confirm({ title: 'Step 1 / 3', description: 'Confirm or cancel.' });
              const b = await confirm({ title: 'Step 2 / 3', description: 'Confirm or cancel.' });
              const c = await confirm({ title: 'Step 3 / 3', description: 'Final confirmation.' });
              setLog([`step1=${a}`, `step2=${b}`, `step3=${c}`]);
            }}
          />
          {log.length > 0 && (
            <ul className="text-grey_4 text-14 font-manrope">
              {log.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    return (
      <ConfirmProvider>
        <Queue />
      </ConfirmProvider>
    );
  },
};
