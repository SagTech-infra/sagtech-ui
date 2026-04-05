'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from './Sidebar';
import type { SidebarItem } from './Sidebar';

/* ------------------------------------------------------------------ */
/* Inline SVG icon helpers                                             */
/* ------------------------------------------------------------------ */

const DashboardIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const UsersIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M3 17C3 14.2386 6.13401 12 10 12C13.866 12 17 14.2386 17 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const SettingsIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 2V4M10 16V18M18 10H16M4 10H2M15.66 4.34L14.24 5.76M5.76 14.24L4.34 15.66M15.66 15.66L14.24 14.24M5.76 5.76L4.34 4.34"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const InboxIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 8L10 12L18 8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const AnalyticsIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 17V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 17V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 17V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HelpIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.5 7.5C7.5 6.12 8.62 5 10 5C11.38 5 12.5 6.12 12.5 7.5C12.5 8.88 11.38 10 10 10V11.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
  </svg>
);

const FileIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M5 2H12L16 6V18H5V2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const LogoIcon = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="6" fill="#6D3EF1" />
    <text x="6" y="20" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
      S
    </text>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Default items set                                                   */
/* ------------------------------------------------------------------ */

const defaultItems: SidebarItem[] = [
  { label: 'Dashboard', icon: DashboardIcon, href: '#' },
  { label: 'Users', icon: UsersIcon, href: '#', active: true },
  { label: 'Settings', icon: SettingsIcon, href: '#' },
  { label: 'Inbox', icon: InboxIcon, href: '#' },
  { label: 'Analytics', icon: AnalyticsIcon, href: '#' },
  { label: 'Help', icon: HelpIcon, href: '#' },
];

/* ------------------------------------------------------------------ */
/* Meta                                                                */
/* ------------------------------------------------------------------ */

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {
    collapsed: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] bg-black_1">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const WithSubmenu: Story = {
  args: {
    items: [
      { label: 'Dashboard', icon: DashboardIcon, href: '#' },
      {
        label: 'Projects',
        icon: FileIcon,
        children: [
          { label: 'All Projects', href: '#' },
          { label: 'Active', href: '#', active: true },
          { label: 'Archived', href: '#' },
        ],
      },
      {
        label: 'Users',
        icon: UsersIcon,
        children: [
          { label: 'Members', href: '#' },
          { label: 'Roles', href: '#' },
          { label: 'Invitations', href: '#' },
        ],
      },
      { label: 'Settings', icon: SettingsIcon, href: '#' },
      { label: 'Analytics', icon: AnalyticsIcon, href: '#' },
    ],
  },
};

export const Collapsed: Story = {
  args: {
    items: defaultItems,
    collapsed: true,
  },
};

export const WithBadge: Story = {
  args: {
    items: [
      { label: 'Dashboard', icon: DashboardIcon, href: '#' },
      { label: 'Users', icon: UsersIcon, href: '#', active: true },
      { label: 'Inbox', icon: InboxIcon, href: '#', badge: 12 },
      { label: 'Settings', icon: SettingsIcon, href: '#' },
      { label: 'Analytics', icon: AnalyticsIcon, href: '#', badge: 'New' },
      { label: 'Help', icon: HelpIcon, href: '#' },
    ],
  },
};

export const WithHeaderFooter: Story = {
  args: {
    items: defaultItems,
    header: (
      <div className="flex items-center gap-12px">
        {LogoIcon}
        <span className="font-manrope text-16 font-bold text-white_4">SagTech</span>
      </div>
    ),
    footer: (
      <div className="flex items-center gap-12px">
        <div className="w-[32px] h-[32px] rounded-[50%] bg-pr_purple flex items-center justify-center text-white text-14 font-manrope font-semibold">
          A
        </div>
        <div className="flex flex-col">
          <span className="text-white_4 text-14 font-manrope font-semibold">Admin User</span>
          <span className="text-grey_2 text-12 font-manrope">admin@sagtech.io</span>
        </div>
      </div>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <Sidebar
        items={defaultItems}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        header={
          <div className="flex items-center gap-12px overflow-hidden">
            {LogoIcon}
            <span
              className={`font-manrope text-16 font-bold text-white_4 whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
            >
              SagTech
            </span>
          </div>
        }
      />
    );
  },
};
