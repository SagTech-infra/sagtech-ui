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
    <div className="h-[480px] bg-black_1">
      <Sidebar items={items} />
    </div>
  );
}
