import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { BottomSheet } from '../BottomSheet';

describe('BottomSheet', () => {
  it('renders content when open', () => {
    render(
      <BottomSheet open onOpenChange={() => {}} title="My Sheet">
        <p>Sheet content</p>
      </BottomSheet>,
    );
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
    expect(screen.getByText('My Sheet')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <BottomSheet open={false} onOpenChange={() =>{}}>
        <p>Hidden</p>
      </BottomSheet>,
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('calls onOpenChange(false) when backdrop clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <BottomSheet open onOpenChange={onOpenChange} aria-label="bottom-sheet">
        <p>content</p>
      </BottomSheet>,
    );
    // Click the backdrop (first fixed inset-0 div rendered before the sheet)
    const backdrop = document.querySelector('.bg-backdrop') as HTMLElement;
    fireEvent.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
