import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GanttTimeline, { type GanttItem } from '../GanttTimeline';
import { LocaleProvider } from '@/providers/LocaleProvider';

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

describe('GanttTimeline — locale integration', () => {
  // Use April 2026 items (same as existing fixtures) — scale=day renders weekday ticks.
  const localeItems: GanttItem[] = [
    { id: '1', label: 'Task A', start: new Date('2026-04-01'), end: new Date('2026-04-07') },
  ];

  it('default (no provider) renders tick labels without throwing', () => {
    render(<GanttTimeline items={localeItems} scale="day" />);
    expect(screen.getByText('Task A')).toBeInTheDocument();
  });

  it('locale prop overrides browser default for tick labels', () => {
    // With locale="en-US" tick labels are deterministic even in CI environments
    // where the system locale may differ from en-US.
    const { container } = render(
      <GanttTimeline items={localeItems} scale="day" locale="en-US" />,
    );
    // Tick label spans exist and are non-empty (content varies by day-of-week)
    const tickSpans = container.querySelectorAll('.text-10.uppercase');
    expect(tickSpans.length).toBeGreaterThan(0);
    tickSpans.forEach((s) => expect(s.textContent!.length).toBeGreaterThan(0));
  });

  it('LocaleProvider de-DE month tick label differs from en-US', () => {
    // Use month scale so the month label is rendered in the tick header.
    const monthItems: GanttItem[] = [
      { id: '1', label: 'X', start: new Date('2026-01-01'), end: new Date('2026-06-30') },
    ];
    const { container: deContainer } = render(
      <LocaleProvider locale="de-DE">
        <GanttTimeline items={monthItems} scale="month" />
      </LocaleProvider>,
    );
    const { container: enContainer } = render(
      <GanttTimeline items={monthItems} scale="month" locale="en-US" />,
    );

    const deTexts = Array.from(deContainer.querySelectorAll('.text-10.uppercase')).map(
      (s) => s.textContent,
    );
    const enTexts = Array.from(enContainer.querySelectorAll('.text-10.uppercase')).map(
      (s) => s.textContent,
    );

    // At least one month label must differ between de-DE and en-US
    expect(deTexts.length).toBeGreaterThan(0);
    expect(enTexts.length).toBeGreaterThan(0);
    const hasDiff = deTexts.some((t, i) => t !== enTexts[i]);
    expect(hasDiff).toBe(true);
  });
});
