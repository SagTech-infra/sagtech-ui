import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CommandPalette from './CommandPalette';
import type { CommandItem } from './CommandPalette';
import Button from '@/components/Button/Button';

function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14 13H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4l2 2h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M13.7 6.3l-1-.2a4.7 4.7 0 0 0-.5-.9l.5-.9a.5.5 0 0 0-.1-.6l-1.3-1.3a.5.5 0 0 0-.6-.1l-.9.5a4.7 4.7 0 0 0-.9-.5l-.2-1a.5.5 0 0 0-.5-.4H6.4a.5.5 0 0 0-.5.4l-.2 1a4.7 4.7 0 0 0-.9.5l-.9-.5a.5.5 0 0 0-.6.1L2.1 4a.5.5 0 0 0-.1.6l.5.9a4.7 4.7 0 0 0-.5.9l-1 .2a.5.5 0 0 0-.4.5v1.8a.5.5 0 0 0 .4.5l1 .2a4.7 4.7 0 0 0 .5.9l-.5.9a.5.5 0 0 0 .1.6l1.3 1.3a.5.5 0 0 0 .6.1l.9-.5a4.7 4.7 0 0 0 .9.5l.2 1a.5.5 0 0 0 .5.4h1.8a.5.5 0 0 0 .5-.4l.2-1a4.7 4.7 0 0 0 .9-.5l.9.5a.5.5 0 0 0 .6-.1l1.3-1.3a.5.5 0 0 0 .1-.6l-.5-.9a4.7 4.7 0 0 0 .5-.9l1-.2a.5.5 0 0 0 .4-.5V6.8a.5.5 0 0 0-.4-.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14 10v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3M8 2v8M5 7l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 12.5A2.5 2.5 0 0 1 4.5 10H14M2 12.5V3.5A2.5 2.5 0 0 1 4.5 1H14v14H4.5A2.5 2.5 0 0 1 2 12.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LifeBuoyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.9 5.9 2.5 2.5M10.1 5.9l3.4-3.4M10.1 10.1l3.4 3.4M5.9 10.1l-3.4 3.4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M11 14v-1.33A2.67 2.67 0 0 0 8.33 10H3.67A2.67 2.67 0 0 0 1 12.67V14M6 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM15 14v-1.33a2.67 2.67 0 0 0-2-2.58M10 1.09a2.67 2.67 0 0 1 0 5.16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const sampleItems: CommandItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Go to the main dashboard',
    icon: <DashboardIcon />,
    shortcut: '⌘D',
    group: 'Navigation',
    onSelect: () => console.log('Dashboard selected'),
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Browse all projects',
    icon: <FolderIcon />,
    shortcut: '⌘P',
    group: 'Navigation',
    onSelect: () => console.log('Projects selected'),
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Application settings',
    icon: <GearIcon />,
    shortcut: '⌘,',
    group: 'Navigation',
    onSelect: () => console.log('Settings selected'),
  },
  {
    id: 'team',
    label: 'Team Members',
    description: 'Manage your team',
    icon: <UsersIcon />,
    group: 'Navigation',
    onSelect: () => console.log('Team selected'),
  },
  {
    id: 'new-project',
    label: 'New Project',
    description: 'Create a new project from scratch',
    icon: <PlusIcon />,
    shortcut: '⌘N',
    group: 'Actions',
    onSelect: () => console.log('New Project selected'),
  },
  {
    id: 'import-data',
    label: 'Import Data',
    description: 'Import data from external sources',
    icon: <ImportIcon />,
    group: 'Actions',
    onSelect: () => console.log('Import Data selected'),
  },
  {
    id: 'documentation',
    label: 'Documentation',
    description: 'Read the developer documentation',
    icon: <BookIcon />,
    shortcut: '⌘?',
    group: 'Help',
    onSelect: () => console.log('Documentation selected'),
  },
  {
    id: 'support',
    label: 'Support',
    description: 'Contact the support team',
    icon: <LifeBuoyIcon />,
    group: 'Help',
    onSelect: () => console.log('Support selected'),
  },
];

const meta = {
  title: 'Layout/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    items: sampleItems,
    placeholder: 'Search commands...',
    onClose: () => {},
  },
};

export const Interactive: Story = {
  render: function InteractivePalette() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-24px">
        <Button
          text="Press ⌘K"
          variant="secondary"
          buttonSize="large"
          onClick={() => setIsOpen(true)}
        />
        <p className="mt-16px font-manrope text-12 text-grey_2">
          Or click the button above to open the command palette
        </p>
        <CommandPalette
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          items={sampleItems}
          placeholder="Type a command or search..."
        />
      </div>
    );
  },
};

export const WithSearch: Story = {
  render: function SearchPalette() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-24px">
        <Button
          text="Open Search"
          variant="primary"
          buttonSize="large"
          onClick={() => setIsOpen(true)}
        />
        <p className="mt-16px font-manrope text-12 text-grey_2">
          Try typing &quot;project&quot; or &quot;settings&quot; to filter results
        </p>
        <CommandPalette
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          items={sampleItems}
          placeholder="Search for anything..."
        />
      </div>
    );
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    items: [],
    placeholder: 'Search commands...',
    onClose: () => {},
  },
};
