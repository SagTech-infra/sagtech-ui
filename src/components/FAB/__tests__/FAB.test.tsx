import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FAB } from '../FAB';

describe('FAB', () => {
  it('renders with aria-label', () => {
    render(<FAB icon={<span>+</span>} aria-label="Add item" />);
    expect(screen.getByLabelText('Add item')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FAB icon={<span>+</span>} aria-label="Add" onClick={onClick} />);
    fireEvent.click(screen.getByLabelText('Add'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<FAB icon={<span>+</span>} aria-label="Add" disabled />);
    expect(screen.getByLabelText('Add')).toBeDisabled();
  });

  it('shows label when extended', () => {
    render(<FAB icon={<span>+</span>} label="Create" extended />);
    expect(screen.getByText('Create')).toBeInTheDocument();
  });
});
