import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InlineEdit from '../InlineEdit';

describe('InlineEdit', () => {
  it('renders display mode by default', () => {
    render(<InlineEdit value="Ada" onSave={() => {}} />);
    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('switches to edit on click and saves on Enter', () => {
    const onSave = vi.fn();
    render(<InlineEdit value="Ada" onSave={onSave} />);
    fireEvent.click(screen.getByText('Ada'));
    const input = screen.getByDisplayValue('Ada') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Grace' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSave).toHaveBeenCalledWith('Grace');
  });

  it('cancels on Escape without calling onSave', () => {
    const onSave = vi.fn();
    render(<InlineEdit value="Ada" onSave={onSave} />);
    fireEvent.click(screen.getByText('Ada'));
    const input = screen.getByDisplayValue('Ada');
    fireEvent.change(input, { target: { value: 'Nope' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('runs validate and blocks save on invalid input', () => {
    const onSave = vi.fn();
    render(
      <InlineEdit
        value="ok"
        onSave={onSave}
        validate={(v) => (v.length < 3 ? 'Too short' : null)}
      />,
    );
    fireEvent.click(screen.getByText('ok'));
    const input = screen.getByDisplayValue('ok');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toBe('Too short');
  });

  it('respects disabled', () => {
    render(<InlineEdit value="readonly" onSave={() => {}} disabled />);
    fireEvent.click(screen.getByText('readonly'));
    // should not enter edit mode
    expect(screen.queryByDisplayValue('readonly')).not.toBeInTheDocument();
  });
});
