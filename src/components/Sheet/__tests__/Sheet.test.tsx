import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Sheet } from '../Sheet';

describe('Sheet — smoke tests', () => {
  it('renders dialog content when open=true', () => {
    render(
      <Sheet open onOpenChange={vi.fn()} aria-label="Test sheet">
        <p>Sheet body</p>
      </Sheet>,
    );
    expect(screen.getByText('Sheet body')).toBeInTheDocument();
  });

  it('renders with role="dialog"', () => {
    render(
      <Sheet open onOpenChange={vi.fn()} aria-label="Test sheet">
        Content
      </Sheet>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the title when provided', () => {
    render(
      <Sheet open onOpenChange={vi.fn()} title="My Sheet">
        Content
      </Sheet>,
    );
    expect(screen.getByText('My Sheet')).toBeInTheDocument();
  });

  it('renders a close button', () => {
    render(
      <Sheet open onOpenChange={vi.fn()} aria-label="Closeable sheet">
        Content
      </Sheet>,
    );
    expect(screen.getByLabelText('Close sheet')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when close button is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open onOpenChange={onOpenChange} aria-label="Closeable sheet">
        Content
      </Sheet>,
    );
    fireEvent.click(screen.getByLabelText('Close sheet'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not render content when open=false', () => {
    render(
      <Sheet open={false} onOpenChange={vi.fn()} aria-label="Hidden sheet">
        <p>Hidden content</p>
      </Sheet>,
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Sheet open onOpenChange={vi.fn()} aria-label="Sheet with footer" footer={<button>Save</button>}>
        Content
      </Sheet>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
