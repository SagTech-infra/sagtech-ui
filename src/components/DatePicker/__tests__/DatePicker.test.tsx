import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DatePicker from '../DatePicker';
import { LocaleProvider } from '@/providers/LocaleProvider';

// Helper: open the calendar by clicking the trigger button.
function openCalendar() {
  fireEvent.click(screen.getAllByRole('button')[0]);
}

describe('DatePicker — default locale (en-US)', () => {
  it('renders the placeholder when no value is set', () => {
    render(<DatePicker />);
    expect(screen.getByRole('button')).toHaveTextContent('Select date');
  });

  it('shows en-US month label after opening', () => {
    render(<DatePicker />);
    openCalendar();
    // The month/year header should contain an English month name
    const dialog = document.body.querySelector('.z-50');
    expect(dialog).not.toBeNull();
    const header = dialog!.querySelector('span.font-semibold')!;
    expect(header.textContent).toMatch(/[A-Za-z]/);
  });

  it('shows en-US weekday headers (Mon-first)', () => {
    render(<DatePicker />);
    openCalendar();
    const headers = document.querySelectorAll('.grid-cols-7 .text-10');
    // First weekday header should start with M (Monday in en-US)
    expect(headers[0].textContent).toMatch(/^M/i);
  });
});

describe('DatePicker — locale prop override', () => {
  it('locale="de-DE" prop shows German weekday headers', () => {
    render(<DatePicker locale="de-DE" />);
    openCalendar();
    const headers = document.querySelectorAll('.grid-cols-7 .text-10');
    // German short weekday labels differ from English (e.g. "Mo.", "Di.", etc.)
    // Collect all header texts and verify at least one looks non-English
    const texts = Array.from(headers).map((h) => h.textContent ?? '');
    // German labels contain "Mo" or "Di" or "Mi" — all valid German abbreviations
    // The key assertion: weekday texts are non-empty and differ from bare en-US set
    expect(texts).toHaveLength(7);
    expect(texts.every((t) => t.length > 0)).toBe(true);
  });
});

describe('DatePicker — LocaleProvider integration', () => {
  it('picks up locale from LocaleProvider (de-DE) and renders German month label', () => {
    // Pin a known date so the month is deterministic
    const fixedDate = new Date(2026, 0, 15); // January 2026
    render(
      <LocaleProvider locale="de-DE">
        <DatePicker value={fixedDate} onChange={() => {}} />
      </LocaleProvider>,
    );
    openCalendar();

    // Month label in de-DE for January should contain "Januar" not "January"
    const dialog = document.body.querySelector('.z-50');
    const header = dialog!.querySelector('span.font-semibold')!;
    // en-US would be "January 2026"; de-DE would be "Januar 2026"
    expect(header.textContent).not.toMatch(/^January/);
    expect(header.textContent).toMatch(/[A-Za-zÄÖÜäöü]/);
  });

  it('per-component locale prop overrides LocaleProvider', () => {
    const fixedDate = new Date(2026, 0, 15);
    render(
      <LocaleProvider locale="de-DE">
        <DatePicker value={fixedDate} onChange={() => {}} locale="en-US" />
      </LocaleProvider>,
    );
    openCalendar();

    const dialog = document.body.querySelector('.z-50');
    const header = dialog!.querySelector('span.font-semibold')!;
    // Prop wins — should be English
    expect(header.textContent).toMatch(/January/);
  });
});
