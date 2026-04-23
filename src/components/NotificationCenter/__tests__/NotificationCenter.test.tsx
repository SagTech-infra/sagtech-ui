import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationCenter, { type NotificationItem } from '../NotificationCenter';

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
});
