'use client';
import { Sidebar, type SidebarItem } from '@sagtech-infra/ui';

const icon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const items: SidebarItem[] = [
  { label: 'Dashboard', icon, href: '#', active: true },
  { label: 'Users', icon, href: '#' },
  { label: 'Inbox', icon, href: '#', badge: 12 },
  { label: 'Settings', icon, href: '#' },
];

export default function Demo() {
  return (
    <div className="flex h-[480px] overflow-hidden rounded-16px bg-black_1 border border-black_3">
      <Sidebar items={items} />
      <div className="flex-1 border-l border-black_3 p-24px">
        <h3 className="font-manrope text-18 font-semibold text-white_4">Dashboard</h3>
        <p className="mt-8px font-manrope text-14 text-grey_2">
          Your main content area lives here, beside the sidebar.
        </p>
        <div className="mt-16px grid grid-cols-2 gap-12px">
          <div className="h-72px rounded-12px bg-black_2" />
          <div className="h-72px rounded-12px bg-black_2" />
          <div className="h-72px rounded-12px bg-black_2" />
          <div className="h-72px rounded-12px bg-black_2" />
        </div>
      </div>
    </div>
  );
}
