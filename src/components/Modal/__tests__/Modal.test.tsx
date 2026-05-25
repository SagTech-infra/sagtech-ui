import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('renders content when open', () => {
    render(<Modal isOpen toggle={() => {}}><p>Modal body</p></Modal>);
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal isOpen={false} toggle={() => {}}><p>Hidden</p></Modal>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('calls toggle when backdrop clicked', () => {
    const toggle = vi.fn();
    render(<Modal isOpen toggle={toggle}><p>content</p></Modal>);
    const backdrop = document.querySelector('.bg-backdrop') as HTMLElement;
    fireEvent.click(backdrop);
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('renders title when provided', () => {
    render(<Modal isOpen toggle={() => {}} title="Confirm action"><p>body</p></Modal>);
    expect(screen.getByText('Confirm action')).toBeInTheDocument();
  });
});
