'use client';
import { useState } from 'react';
import { NotificationCenter, type NotificationItem } from '@sagtech-infra/ui';

const now = Date.now();
const sample: NotificationItem[] = [
  { id: '1', title: 'New teammate joined', description: 'Alan Turing was added to the Engineering team.', variant: 'info', timestamp: now - 2 * 60 * 1000, read: false },
  { id: '2', title: 'Deploy succeeded', description: 'Build #482 shipped to production.', variant: 'success', timestamp: now - 35 * 60 * 1000, read: false },
  { id: '3', title: 'Disk almost full', description: 'Only 8% of storage quota remaining on prod-db-01.', variant: 'warning', timestamp: now - 4 * 60 * 60 * 1000, read: true },
  { id: '4', title: 'Payment failed', description: 'Your card ending in 4242 was declined.', variant: 'error', timestamp: now - 26 * 60 * 60 * 1000, read: true },
];

export default function Demo() {
  const [items, setItems] = useState(sample);
  return (
    <div className="flex items-center justify-center w-full min-h-[480px] py-32px">
      <NotificationCenter
        notifications={items}
        onMarkRead={(id) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))}
        onMarkAllRead={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
        onClearAll={() => setItems([])}
        onNotificationClick={(n) => console.log('Clicked', n)}
      />
    </div>
  );
}
