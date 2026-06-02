'use client';
import { GanttTimeline, type GanttItem } from '@sagtech-infra/ui';

const base = new Date('2026-04-20T00:00:00');
const day = (n: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

const items: GanttItem[] = [
  { id: '1', lane: 'Discovery', label: 'Interviews', start: base, end: day(4), color: 'purple', progress: 100 },
  { id: '2', lane: 'Discovery', label: 'Research', start: day(2), end: day(6), color: 'blue', progress: 60 },
  { id: '3', lane: 'Design', label: 'Wireframes', start: day(5), end: day(10), color: 'success', progress: 20 },
  { id: '4', lane: 'Build', label: 'Backend API', start: day(10), end: day(22), color: 'purple' },
  { id: '5', lane: 'Launch', label: 'Release', start: day(22), end: day(26), color: 'error' },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[920px]">
      <GanttTimeline items={items} scale="day" />
    </div>
  );
}
