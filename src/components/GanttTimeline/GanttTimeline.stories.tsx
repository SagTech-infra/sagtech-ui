import type { Meta, StoryObj } from '@storybook/react';
import GanttTimeline, { type GanttItem } from './GanttTimeline';

const meta = {
  title: 'Data Display/GanttTimeline',
  component: GanttTimeline,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[920px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GanttTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date('2026-04-20T00:00:00');
function daysFrom(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

const items: GanttItem[] = [
  { id: '1', lane: 'Discovery', label: 'Interviews', start: today, end: daysFrom(today, 4), color: 'purple', progress: 100 },
  { id: '2', lane: 'Discovery', label: 'Research', start: daysFrom(today, 2), end: daysFrom(today, 6), color: 'blue', progress: 60 },
  { id: '3', lane: 'Design', label: 'Wireframes', start: daysFrom(today, 5), end: daysFrom(today, 10), color: 'success', progress: 20 },
  { id: '4', lane: 'Design', label: 'Prototype', start: daysFrom(today, 9), end: daysFrom(today, 14), color: 'warning' },
  { id: '5', lane: 'Build', label: 'Backend API', start: daysFrom(today, 10), end: daysFrom(today, 22), color: 'purple' },
  { id: '6', lane: 'Build', label: 'Frontend', start: daysFrom(today, 12), end: daysFrom(today, 24), color: 'purple' },
  { id: '7', lane: 'Launch', label: 'QA', start: daysFrom(today, 22), end: daysFrom(today, 26), color: 'error' },
  { id: '8', lane: 'Launch', label: 'Release', start: daysFrom(today, 26), end: daysFrom(today, 27), color: 'success' },
];

export const Daily: Story = {
  args: {
    items,
    scale: 'day',
    onItemClick: (item) => console.log('Clicked', item),
  },
};

export const Weekly: Story = {
  args: {
    items,
    scale: 'week',
  },
};

export const Flat: Story = {
  args: {
    items: items.map((it) => ({ ...it, lane: undefined })),
  },
};

export const WithDetailModal: Story = {
  name: 'With detail modal on click',
  args: {
    items,
    scale: 'day',
    detailModalTitle: (item) => `${item.label} — details`,
    renderItemDetail: (item, close) => (
      <div className="flex flex-col gap-12px font-manrope text-14 text-grey_4">
        <div>
          <span className="text-grey_2">Lane:</span> {item.lane ?? '—'}
        </div>
        <div>
          <span className="text-grey_2">Start:</span> {new Date(item.start as string).toLocaleDateString()}
        </div>
        <div>
          <span className="text-grey_2">End:</span> {new Date(item.end as string).toLocaleDateString()}
        </div>
        {typeof item.progress === 'number' && (
          <div>
            <span className="text-grey_2">Progress:</span> {item.progress}%
          </div>
        )}
        <button
          type="button"
          onClick={close}
          className="mt-8px px-16px py-8px rounded-[50px] bg-pr_purple text-white cursor-pointer self-end"
        >
          Close
        </button>
      </div>
    ),
  },
};
