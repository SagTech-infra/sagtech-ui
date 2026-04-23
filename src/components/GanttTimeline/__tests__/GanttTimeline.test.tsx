import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GanttTimeline, { type GanttItem } from '../GanttTimeline';

const start = new Date('2026-04-01');
const items: GanttItem[] = [
  { id: '1', label: 'Task A', start, end: new Date('2026-04-03'), lane: 'Build' },
  { id: '2', label: 'Task B', start: new Date('2026-04-02'), end: new Date('2026-04-05'), lane: 'Build' },
  { id: '3', label: 'Task C', start: new Date('2026-04-06'), end: new Date('2026-04-07'), lane: 'QA' },
];

describe('GanttTimeline', () => {
  it('renders bars for each item', () => {
    render(<GanttTimeline items={items} />);
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
    expect(screen.getByText('Task C')).toBeInTheDocument();
  });

  it('renders lane labels', () => {
    render(<GanttTimeline items={items} />);
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('QA')).toBeInTheDocument();
  });

  it('fires onItemClick', () => {
    const onClick = vi.fn();
    render(<GanttTimeline items={items} onItemClick={onClick} />);
    fireEvent.click(screen.getByText('Task A'));
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('renders empty without error', () => {
    render(<GanttTimeline items={[]} />);
    // Header with "Lane" should still exist
    expect(screen.getByText('Lane')).toBeInTheDocument();
  });
});
