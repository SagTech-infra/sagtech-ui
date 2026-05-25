import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import DateRangePicker, { type DateRange } from '../DateRangePicker';
import { LocaleProvider } from '@/providers/LocaleProvider';

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

  function findCurrentMonthDay(label: string) {
    const matches = screen.getAllByRole('button').filter((b) => b.textContent === label);
    // Non-disabled current-month day buttons keep the default cursor-pointer class;
    // pick the first enabled one.
    const current = matches.find((b) => !b.hasAttribute('disabled'));
    if (!current) throw new Error(`No clickable day button with label "${label}"`);
    return current;
  }

  it('selects start then end date and calls onChange in order', () => {
    const spy = vi.fn();
    render(<Host onChange={spy} />);
    fireEvent.click(screen.getByRole('button', { name: /select range/i }));

    fireEvent.click(findCurrentMonthDay('5'));
    expect(spy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: expect.any(Date),
        to: null,
      }),
    );

    fireEvent.click(findCurrentMonthDay('12'));
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

    fireEvent.click(findCurrentMonthDay('15'));
    fireEvent.click(findCurrentMonthDay('5'));

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
    const getLabel = () =>
      screen.getByRole('dialog').querySelector('span.font-semibold')!.textContent;
    const before = getLabel();
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(getLabel()).not.toBe(before);
    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(getLabel()).toBe(before);
  });
});

describe('DateRangePicker — locale integration', () => {
  it('LocaleProvider de-DE produces a non-English month label', () => {
    const from = new Date(2026, 0, 5); // January 2026
    render(
      <LocaleProvider locale="de-DE">
        <DateRangePicker
          value={{ from, to: null }}
          onChange={() => {}}
        />
      </LocaleProvider>,
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    const label = screen.getByRole('dialog').querySelector('span.font-semibold')!.textContent;
    // de-DE January is "Januar" — not "January"
    expect(label).not.toMatch(/^January/);
    expect(label).toMatch(/[A-Za-zÄÖÜäöü]/);
  });

  it('locale prop overrides LocaleProvider', () => {
    const from = new Date(2026, 0, 5);
    render(
      <LocaleProvider locale="de-DE">
        <DateRangePicker
          value={{ from, to: null }}
          onChange={() => {}}
          locale="en-US"
        />
      </LocaleProvider>,
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    const label = screen.getByRole('dialog').querySelector('span.font-semibold')!.textContent;
    expect(label).toMatch(/January/);
  });
});
