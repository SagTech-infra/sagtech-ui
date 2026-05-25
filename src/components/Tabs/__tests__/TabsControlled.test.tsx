import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Tabs from '../Tabs';

const items = [
  { label: 'Alpha', content: <p>Alpha content</p> },
  { label: 'Beta', content: <p>Beta content</p> },
  { label: 'Gamma', content: <p>Gamma content</p> },
];

describe('Tabs (controlled)', () => {
  it('renders active tab content based on value prop', () => {
    render(<Tabs items={items} value={1} onValueChange={() => {}} />);
    // Beta tab is active (index 1)
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('calls onValueChange with correct index on tab click', () => {
    const onValueChange = vi.fn();
    render(<Tabs items={items} value={0} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByText('Gamma'));
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it('does not change internal state when controlled', () => {
    const onValueChange = vi.fn();
    render(<Tabs items={items} value={0} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByText('Beta'));
    expect(onValueChange).toHaveBeenCalledWith(1);
    // value prop is still 0 so Alpha tab stays active (not Beta)
    const alphaBtn = screen.getByText('Alpha').closest('button');
    expect(alphaBtn?.className).toContain('bg-pr_purple');
  });

  it('also calls legacy onChange when provided', () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(<Tabs items={items} value={0} onValueChange={onValueChange} onChange={onChange} />);
    fireEvent.click(screen.getByText('Beta'));
    expect(onChange).toHaveBeenCalledWith(1);
    expect(onValueChange).toHaveBeenCalledWith(1);
  });
});
