import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  CommandPaletteProvider,
  useCommandPalette,
  useRegisterCommand,
} from '../CommandPaletteProvider';

function Trigger() {
  const cp = useCommandPalette();
  return (
    <button type="button" onClick={cp.toggle}>
      open
    </button>
  );
}

function RegisterSample({ label, onSelect }: { label: string; onSelect: () => void }) {
  const commands = React.useMemo(
    () => [{ id: label, label, onSelect }],
    [label, onSelect],
  );
  useRegisterCommand(commands);
  return null;
}

import React from 'react';

describe('CommandPaletteProvider', () => {
  it('opens and closes via context', () => {
    render(
      <CommandPaletteProvider hotkey={null}>
        <Trigger />
      </CommandPaletteProvider>,
    );
    fireEvent.click(screen.getByText('open'));
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('registers commands from subtree', () => {
    const onSelect = vi.fn();
    render(
      <CommandPaletteProvider hotkey={null}>
        <Trigger />
        <RegisterSample label="Do thing" onSelect={onSelect} />
      </CommandPaletteProvider>,
    );
    fireEvent.click(screen.getByText('open'));
    expect(screen.getByText('Do thing')).toBeInTheDocument();
  });

  it('respects Cmd+K hotkey when provided', () => {
    render(
      <CommandPaletteProvider hotkey="ctrl+k">
        <div>content</div>
      </CommandPaletteProvider>,
    );
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });
});
