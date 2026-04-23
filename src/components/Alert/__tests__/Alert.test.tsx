import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '../Alert';

describe('Alert', () => {
  it('renders title and description', () => {
    render(<Alert title="Hi" variant="info">Body</Alert>);
    expect(screen.getByText('Hi')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('sets role="alert" for error variant', () => {
    render(<Alert title="Boom" variant="error" />);
    const el = screen.getByRole('alert');
    expect(el).toHaveAttribute('aria-live', 'assertive');
  });

  it('sets role="status" for non-error variants', () => {
    render(<Alert title="Hi" variant="success" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('fires onClose', () => {
    const onClose = vi.fn();
    render(<Alert title="Hi" onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Dismiss alert'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
