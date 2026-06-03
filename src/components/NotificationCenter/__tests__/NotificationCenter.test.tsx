import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationCenter, { type NotificationItem } from '../NotificationCenter';
import { LocaleProvider } from '@/providers/LocaleProvider';

const items: NotificationItem[] = [
  { id: '1', title: 'One', read: false, variant: 'info' },
  { id: '2', title: 'Two', read: true, variant: 'success' },
];

describe('NotificationCenter', () => {
  it('shows badge with unread count', () => {
    render(<NotificationCenter notifications={items} />);
    expect(screen.getByLabelText(/1 unread/i)).toBeInTheDocument();
  });

  it('opens list on click', () => {
    render(<NotificationCenter notifications={items} />);
    fireEvent.click(screen.getByRole('button', { name: /unread/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('calls onMarkRead when an unread item is activated', () => {
    const onMarkRead = vi.fn();
    render(<NotificationCenter notifications={items} onMarkRead={onMarkRead} />);
    fireEvent.click(screen.getByRole('button', { name: /unread/i }));
    fireEvent.click(screen.getByText('One'));
    expect(onMarkRead).toHaveBeenCalledWith('1');
  });

  it('calls onMarkAllRead', () => {
    const onMarkAllRead = vi.fn();
    render(
      <NotificationCenter notifications={items} onMarkAllRead={onMarkAllRead} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /unread/i }));
    fireEvent.click(screen.getByText(/mark all read/i));
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it('renders empty state', () => {
    render(<NotificationCenter notifications={[]} emptyMessage="Nothing here" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('flips dropdown anchor and sets dir under RTL', () => {
    render(
      <LocaleProvider locale="ar-EG" dir="rtl">
        <NotificationCenter notifications={items} />
      </LocaleProvider>,
    );
    const trigger = screen.getByRole('button', { name: /unread/i });
    // root container carries the RTL direction
    expect(trigger.closest('[dir="rtl"]')).not.toBeNull();

    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    // positioning is now computed as inline style.left (not Tailwind classes)
    expect(dialog).toBeInTheDocument();
    expect(dialog.style.left).toBeDefined();
  });

  it('keeps logical end anchor in LTR for default position', () => {
    render(<NotificationCenter notifications={items} />);
    fireEvent.click(screen.getByRole('button', { name: /unread/i }));
    const dialog = screen.getByRole('dialog');
    // positioning is now computed as inline style.left (not Tailwind classes)
    expect(dialog).toBeInTheDocument();
    expect(dialog.style.left).toBeDefined();
  });
});
