import type { Meta, StoryObj } from '@storybook/react';
import DropdownMenu from './DropdownMenu';

const EditIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" className="w-full h-full">
    <path d="M12.75 2.25a1.77 1.77 0 0 1 2.5 2.5L5.5 14.5l-3.5 1 1-3.5L12.75 2.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" className="w-full h-full">
    <rect x="6" y="6" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 6V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ArchiveIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" className="w-full h-full">
    <path d="M16 6v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M1 3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3H1V3Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7.5 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" className="w-full h-full">
    <path d="M3 5h12M14 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5m2 0V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TriggerButton = ({ label }: { label: string }) => (
  <div className="w-full px-20px py-12px bg-black_2 border border-black_3 rounded-16px font-manrope text-14 text-grey_4 flex items-center justify-between hover:border-pr_purple transition-colors">
    <span>{label}</span>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-grey_2">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const meta = {
  title: 'Form Controls/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['left', 'right'] },
    width: { control: 'text' },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <TriggerButton label="Actions" />,
    items: [
      { label: 'Edit', icon: <EditIcon /> },
      { label: 'Duplicate', icon: <CopyIcon /> },
      { label: 'Archive', icon: <ArchiveIcon /> },
      { divider: true, label: '' },
      { label: 'Delete', danger: true, icon: <TrashIcon /> },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    trigger: <TriggerButton label="Manage" />,
    items: [
      { label: 'Edit', icon: <EditIcon /> },
      { label: 'Duplicate', icon: <CopyIcon />, disabled: true },
      { label: 'Archive', icon: <ArchiveIcon /> },
      { divider: true, label: '' },
      { label: 'Delete', danger: true, icon: <TrashIcon /> },
    ],
  },
};

export const Wide: Story = {
  args: {
    trigger: <TriggerButton label="Select action" />,
    width: '280px',
    items: [
      { label: 'Edit project settings', icon: <EditIcon /> },
      { label: 'Duplicate to workspace', icon: <CopyIcon /> },
      { label: 'Move to archive', icon: <ArchiveIcon /> },
      { divider: true, label: '' },
      { label: 'Delete permanently', danger: true, icon: <TrashIcon /> },
    ],
  },
};

export const Interactive: Story = {
  args: {
    trigger: <TriggerButton label="Actions" />,
    items: [
      { label: 'Edit', icon: <EditIcon />, onClick: () => console.log('Edit') },
      { label: 'Duplicate', icon: <CopyIcon />, onClick: () => console.log('Duplicate') },
      { label: 'Archive', icon: <ArchiveIcon />, onClick: () => console.log('Archive') },
      { divider: true, label: '' },
      { label: 'Delete', danger: true, icon: <TrashIcon />, onClick: () => console.log('Delete') },
    ],
  },
};
