import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Sheet } from '../Sheet';

describe('Sheet', () => {
  it('renders content when open', () => {
    render(
      <Sheet open onOpenChange={() => {}} title="My Sheet">
        <p>Sheet body</p>
      </Sheet>,
    );
    expect(screen.getByText('Sheet body')).toBeInTheDocument();
    expect(screen.getByText('My Sheet')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Sheet open={false} onOpenChange={() => {}}>
        <p>Hidden</p>
      </Sheet>,
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('calls onOpenChange(false) when close button is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open onOpenChange={onOpenChange}>
        <p>content</p>
      </Sheet>,
    );
    fireEvent.click(screen.getByLabelText('Close sheet'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(false) on Escape key', () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open onOpenChange={onOpenChange}>
        <p>content</p>
      </Sheet>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
