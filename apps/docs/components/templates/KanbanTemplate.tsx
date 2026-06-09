'use client';

import { useState } from 'react';
import {
  CardWrapper,
  Badge,
  AvatarGroup,
  Button,
  SortableList,
  type AvatarProps,
} from '@sagtech-infra/ui';

type LabelColor = 'purple' | 'blue' | 'success' | 'warning' | 'error';

interface Task {
  id: string;
  title: string;
  labels: { text: string; color: LabelColor }[];
  assignees: AvatarProps[];
  due?: string;
}

interface Column {
  id: string;
  title: string;
  accent: 'grey' | 'blue' | 'warning' | 'success';
  tasks: Task[];
}

const a = (name: string): AvatarProps => ({ name, size: 'xs' });

const INITIAL_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To do',
    accent: 'grey',
    tasks: [
      {
        id: 't1',
        title: 'Audit color tokens for AA contrast',
        labels: [{ text: 'Design', color: 'purple' }],
        assignees: [a('Ava Chen'), a('Mia Torres')],
        due: 'Jun 12',
      },
      {
        id: 't2',
        title: 'Draft migration guide to public npm',
        labels: [{ text: 'Docs', color: 'blue' }],
        assignees: [a('Liam Brooks')],
      },
      {
        id: 't3',
        title: 'Spike: virtualized DataTable rows',
        labels: [{ text: 'Research', color: 'warning' }],
        assignees: [a('Noah Patel'), a('Sofia Marenko')],
        due: 'Jun 15',
      },
    ],
  },
  {
    id: 'progress',
    title: 'In progress',
    accent: 'blue',
    tasks: [
      {
        id: 't4',
        title: 'Rebalance dashboard chart grid',
        labels: [{ text: 'Frontend', color: 'success' }],
        assignees: [a('Ava Chen')],
        due: 'Today',
      },
      {
        id: 't5',
        title: 'AuroraHero blob mesh background',
        labels: [{ text: 'Frontend', color: 'success' }, { text: 'Design', color: 'purple' }],
        assignees: [a('Mia Torres'), a('Daniel Reyes')],
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    accent: 'warning',
    tasks: [
      {
        id: 't6',
        title: 'PricingTable yearly toggle logic',
        labels: [{ text: 'Frontend', color: 'success' }],
        assignees: [a('Liam Brooks'), a('Ava Chen')],
        due: 'Jun 10',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    accent: 'success',
    tasks: [
      {
        id: 't7',
        title: 'Ship Checkout + Inbox templates',
        labels: [{ text: 'Release', color: 'error' }],
        assignees: [a('Noah Patel')],
      },
      {
        id: 't8',
        title: 'Wire SortableList into Kanban cards',
        labels: [{ text: 'Frontend', color: 'success' }],
        assignees: [a('Daniel Reyes'), a('Sofia Marenko')],
      },
    ],
  },
];

type AccentStyle = { dot: string; bar: string; pill: string };

const accentStyles: Record<Column['accent'], AccentStyle> = {
  grey: {
    dot: 'bg-grey_2',
    bar: 'bg-grey_2/60',
    pill: 'bg-grey_2/15 text-fg-secondary',
  },
  blue: {
    dot: 'bg-pr_blue',
    bar: 'bg-pr_blue',
    pill: 'bg-pr_blue/15 text-pr_blue',
  },
  warning: {
    dot: 'bg-warning',
    bar: 'bg-warning',
    pill: 'bg-warning/15 text-warning',
  },
  success: {
    dot: 'bg-success',
    bar: 'bg-success',
    pill: 'bg-success/15 text-success',
  },
};

function TaskCard({
  task,
  dragHandleProps,
}: {
  task: Task;
  dragHandleProps: Record<string, unknown>;
}) {
  // CardWrapper doesn't forward arbitrary DOM props, so the dnd-kit drag
  // listeners live on a wrapping div instead.
  return (
    <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
      <CardWrapper
        rounded="16"
        stoke="2"
        className="group/card p-16px transition-all hover:-translate-y-[2px] hover:border-border-strong hover:shadow-3xl"
      >
        <div className="flex flex-wrap gap-6px">
          {task.labels.map((label) => (
            <Badge key={label.text} variant="subtle" color={label.color} size="sm">
              {label.text}
            </Badge>
          ))}
        </div>
        <p className="mt-12px font-manrope text-14 leading-20 text-fg-primary transition-colors group-hover/card:text-sec_purple">
          {task.title}
        </p>
        <div className="mt-16px flex items-center justify-between">
          <AvatarGroup avatars={task.assignees} size="xs" max={3} label="Assignees" />
          {task.due && (
            <span className="flex items-center gap-4px rounded-full bg-bg-tertiary px-8px py-2px font-manrope text-12 text-fg-muted">
              <svg viewBox="0 0 24 24" fill="none" width="12" height="12" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {task.due}
            </span>
          )}
        </div>
      </CardWrapper>
    </div>
  );
}

function BoardColumn({ column, onReorder }: { column: Column; onReorder: (tasks: Task[]) => void }) {
  const accent = accentStyles[column.accent];
  return (
    <div className="group/col flex w-[312px] flex-shrink-0 flex-col overflow-hidden rounded-16px border border-border-default bg-bg-secondary">
      {/* Accent top bar */}
      <span className={`h-[3px] w-full ${accent.bar}`} aria-hidden="true" />

      <div className="flex flex-col gap-12px p-12px">
        <div className="flex items-center justify-between px-4px">
          <div className="flex items-center gap-8px">
            <span className={`h-[8px] w-[8px] rounded-full ${accent.dot}`} />
            <h2 className="font-orbitron text-16 font-semibold text-fg-primary">{column.title}</h2>
            <span
              className={`flex h-[20px] min-w-[20px] items-center justify-center rounded-full px-6px font-manrope text-12 font-semibold ${accent.pill}`}
            >
              {column.tasks.length}
            </span>
          </div>
          <button
            type="button"
            aria-label={`Add task to ${column.title}`}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-8px text-fg-muted opacity-0 transition-opacity hover:bg-bg-tertiary hover:text-fg-primary focus-visible:opacity-100 group-hover/col:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <SortableList
          items={column.tasks}
          getItemId={(task) => task.id}
          onReorder={onReorder}
          direction="vertical"
          className="min-h-[80px] rounded-12px bg-bg-primary/40 p-8px"
          renderItem={(task, ctx) => (
            <div className="mb-12px last:mb-0">
              <TaskCard task={task} dragHandleProps={ctx.dragHandleProps} />
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default function KanbanTemplate() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);

  const reorderColumn = (columnId: string, tasks: Task[]) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, tasks } : col)),
    );
  };

  const team: AvatarProps[] = [
    { name: 'Ava Chen' },
    { name: 'Liam Brooks' },
    { name: 'Mia Torres' },
    { name: 'Noah Patel' },
    { name: 'Daniel Reyes' },
    { name: 'Sofia Marenko' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <header className="flex flex-wrap items-center justify-between gap-16px border-b border-border-default bg-surface-wash px-24px py-20px">
        <div className="flex flex-col gap-6px">
          <span className="font-manrope text-12 font-semibold uppercase tracking-widest text-sec_purple">
            UI library
          </span>
          <h1 className="font-orbitron text-28 font-bold leading-32 text-fg-primary">
            Sprint 24 board
          </h1>
          <p className="font-manrope text-14 text-fg-muted">
            8 active tasks across 4 stages · drag cards to reorder
          </p>
        </div>
        <div className="flex items-center gap-16px">
          <AvatarGroup avatars={team} size="sm" max={4} label="Team members" />
          <Button text="Filter" variant="secondary" buttonSize="small" />
          <Button text="New task" variant="primary" buttonSize="small" />
        </div>
      </header>

      <div className="flex-1 overflow-x-auto p-24px">
        <div className="flex gap-24px">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              onReorder={(tasks) => reorderColumn(column.id, tasks)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
