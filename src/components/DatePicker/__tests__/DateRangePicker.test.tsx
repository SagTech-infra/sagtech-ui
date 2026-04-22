import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import DateRangePicker, { type DateRange } from '../DateRangePicker';

function Host({
  onChange,
  initial = { from: null, to: null },
}: {
  onChange?: (r: DateRange) => void;
  initial?: DateRange;
}) {
  const [range, setRange] = useState<DateRange>(initial);
  return (
    <DateRangePicker
      value={range}
      onChange={(next) => {
        setRange(next);
        onChange?.(next);
      }}
    />
  );
}

describe('DateRangePicker', () => {
  it('shows the placeholder when empty', () => {
    render(<Host />);
    expect(screen.getByRole('button', { name: /select range/i })).toBeInTheDocument();
  });

  it('opens the calendar dialog on trigger click', () => {
    render(<Host />);
    fireEvent.click(screen.getByRole('button', { name: /select range/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('selects start then end date and calls onChange in order', () => {
    const spy = vi.fn();
    render(<Host onChange={spy} />);
    fireEvent.click(screen.getByRole('button', { name: /select range/i }));

    const dayButtons = screen.getAllByRole('button', { name: /^\d+$/ });
    const day5 = dayButtons.find((b) => b.textContent === '5')!;
    const day12 = dayButtons.find((b) => b.textContent === '12')!;

    fireEvent.click(day5);
    expect(spy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: expect.any(Date),
        to: null,
      }),
    );

    fireEvent.click(day12);
    const last = spy.mock.calls.at(-1)![0] as DateRange;
    expect(last.from).toBeInstanceOf(Date);
    expect(last.to).toBeInstanceOf(Date);
    expect(last.from!.getDate()).toBe(5);
    expect(last.to!.getDate()).toBe(12);
  });

  it('swaps endpoints when user clicks an earlier date second', () => {
    const spy = vi.fn();
    render(<Host onChange={spy} />);
    fireEvent.click(screen.getByRole('button', { name: /select range/i }));

    const dayButtons = screen.getAllByRole('button', { name: /^\d+$/ });
    fireEvent.click(dayButtons.find((b) => b.textContent === '15')!);
    fireEvent.click(dayButtons.find((b) => b.textContent === '5')!);

    const last = spy.mock.calls.at(-1)![0] as DateRange;
    expect(last.from!.getDate()).toBe(5);
    expect(last.to!.getDate()).toBe(15);
  });

  it('clears the selection via the Clear affordance', () => {
    const spy = vi.fn();
    const initial = new Date(2026, 3, 10);
    render(<Host onChange={spy} initial={{ from: initial, to: new Date(2026, 3, 15) }} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.click(screen.getByText('Clear'));
    const last = spy.mock.calls.at(-1)![0] as DateRange;
    expect(last).toEqual({ from: null, to: null });
  });

  it('stays closed when disabled', () => {
    render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} disabled />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates months with prev/next arrows', () => {
    render(<Host />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    const dialog = screen.getByRole('dialog');
    const beforeLabel = dialog.querySelector('span.font-semibold')!.textContent;
    fireEvent.click(screen.getByLabelText('Next month'));
    const afterLabel = dialog.querySelector('span.font-semibold')!.textContent;
    expect(afterLabel).not.toBe(beforeLabel);
  });
});
