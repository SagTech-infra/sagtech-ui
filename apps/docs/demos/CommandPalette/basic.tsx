'use client';
import { useState } from 'react';
import { CommandPalette, Button, type CommandItem } from '@sagtech-infra/ui';

const items: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Go to the main dashboard', shortcut: '⌘D', group: 'Navigation', onSelect: () => {} },
  { id: 'projects', label: 'Projects', description: 'Browse all projects', shortcut: '⌘P', group: 'Navigation', onSelect: () => {} },
  { id: 'settings', label: 'Settings', description: 'Application settings', shortcut: '⌘,', group: 'Navigation', onSelect: () => {} },
  { id: 'new-project', label: 'New Project', description: 'Create a new project', shortcut: '⌘N', group: 'Actions', onSelect: () => {} },
];

export default function Demo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <Button text="Press ⌘K" variant="secondary" buttonSize="large" onClick={() => setIsOpen(true)} />
      <CommandPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        placeholder="Type a command or search..."
      />
    </div>
  );
}
