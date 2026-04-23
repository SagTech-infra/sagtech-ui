import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VariablePicker, { type VariableItem } from '../VariablePicker';

const variables: VariableItem[] = [
  { token: '{{lead.firstName}}', label: 'First name', source: 'Lead' },
  { token: '{{lead.lastName}}', label: 'Last name', source: 'Lead' },
  { token: '{{sender.name}}', label: 'Sender name', source: 'Sender' },
];

describe('VariablePicker', () => {
  it('renders all variables when open', () => {
    render(
      <VariablePicker
        isOpen
        onClose={() => {}}
        variables={variables}
        onPick={() => {}}
      />,
    );
    expect(screen.getByText('First name')).toBeInTheDocument();
    expect(screen.getByText('Sender name')).toBeInTheDocument();
  });

  it('filters by search query', () => {
    render(
      <VariablePicker
        isOpen
        onClose={() => {}}
        variables={variables}
        onPick={() => {}}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText(/search variables/i), {
      target: { value: 'Sender' },
    });
    expect(screen.queryByText('First name')).not.toBeInTheDocument();
    expect(screen.getByText('Sender name')).toBeInTheDocument();
  });

  it('filters by source chip', () => {
    render(
      <VariablePicker
        isOpen
        onClose={() => {}}
        variables={variables}
        onPick={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sender' }));
    expect(screen.queryByText('First name')).not.toBeInTheDocument();
    expect(screen.getByText('Sender name')).toBeInTheDocument();
  });

  it('picks on double-click', () => {
    const onPick = vi.fn();
    const onClose = vi.fn();
    render(
      <VariablePicker
        isOpen
        onClose={onClose}
        variables={variables}
        onPick={onPick}
      />,
    );
    fireEvent.doubleClick(screen.getByText('First name'));
    expect(onPick).toHaveBeenCalledWith(variables[0]);
    expect(onClose).toHaveBeenCalled();
  });
});
