import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Banner } from '../Banner';

describe('Banner', () => {
  it('renders content', () => {
    render(<Banner>Something happened</Banner>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Banner title="Alert title" variant="error" />);
    expect(screen.getByText('Alert title')).toBeInTheDocument();
  });

  it('calls onClose when dismiss button clicked', () => {
    const onClose = vi.fn();
    render(<Banner dismissible onClose={onClose}>Info</Banner>);
    fireEvent.click(screen.getByLabelText('Dismiss banner'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render dismiss button when dismissible is false', () => {
    render(<Banner>Info</Banner>);
    expect(screen.queryByLabelText('Dismiss banner')).not.toBeInTheDocument();
  });
});
