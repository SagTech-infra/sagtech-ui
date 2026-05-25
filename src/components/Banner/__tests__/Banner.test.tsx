import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Banner } from '../Banner';

describe('Banner — smoke tests', () => {
  it('renders children in the document', () => {
    render(<Banner>System message</Banner>);
    expect(screen.getByText('System message')).toBeInTheDocument();
  });

  it('renders with role="status" by default (info variant)', () => {
    render(<Banner variant="info">Info</Banner>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with role="alert" for error variant', () => {
    render(<Banner variant="error">Error message</Banner>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Banner title="Heads up">Body text</Banner>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
  });

  it('shows dismiss button when dismissible=true', () => {
    render(<Banner dismissible onClose={vi.fn()}>Dismissible</Banner>);
    expect(screen.getByLabelText('Dismiss banner')).toBeInTheDocument();
  });

  it('calls onClose when dismiss button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Banner dismissible onClose={onClose}>
        Close me
      </Banner>,
    );
    fireEvent.click(screen.getByLabelText('Dismiss banner'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render dismiss button when dismissible is false', () => {
    render(<Banner>No dismiss</Banner>);
    expect(screen.queryByLabelText('Dismiss banner')).not.toBeInTheDocument();
  });
});
