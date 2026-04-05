import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumbs from './Breadcrumbs';

/* ------------------------------------------------------------------ */
/* Inline SVG icon helpers                                             */
/* ------------------------------------------------------------------ */

const HomeIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 8L8 2L14 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 9V14H6.5V11H9.5V14H12.5V9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FolderIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 4V13H14V6H8L6.5 4H2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const FileIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M4 1H10L13 4V15H4V1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M10 1V4H13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Meta                                                                */
/* ------------------------------------------------------------------ */

const meta = {
  title: 'Layout/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-24px bg-black_1">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Projects', href: '#' },
      { label: 'Dashboard' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', href: '#', icon: HomeIcon },
      { label: 'Documents', href: '#', icon: FolderIcon },
      { label: 'Report.pdf', icon: FileIcon },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Projects', href: '#' },
      { label: 'Settings', href: '#' },
      { label: 'General' },
    ],
    separator: <span className="text-grey_1 text-14 font-manrope select-none">&rarr;</span>,
  },
};

export const Long: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Organization', href: '#' },
      { label: 'Engineering', href: '#' },
      { label: 'Frontend', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'Breadcrumbs' },
    ],
  },
};
