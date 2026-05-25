import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FAB } from '../FAB';

describe('FAB — smoke tests', () => {
  it('renders the button in the document', () => {
    render(<FAB icon={<span>+</span>} aria-label="Add item" />);
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('uses label as aria-label when aria-label prop is not provided', () => {
    render(<FAB icon={<span>+</span>} label="Create" />);
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FAB icon={<span>+</span>} aria-label="Action" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Action' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled=true', () => {
    render(<FAB icon={<span>+</span>} aria-label="Disabled" disabled />);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  it('is disabled when loading=true', () => {
    render(<FAB icon={<span>+</span>} aria-label="Loading" loading />);
    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled();
  });

  it('shows label text when extended=true and label is provided', () => {
    render(<FAB icon={<span>+</span>} label="New Task" extended />);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });
});
