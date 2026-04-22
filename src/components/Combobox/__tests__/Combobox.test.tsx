import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { useState } from 'react';
import Combobox from '../Combobox';
import type { ComboboxOption } from '../types';

const options: ComboboxOption[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
];

function SingleHost({ onChange }: { onChange?: (v: string | null) => void }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Combobox
      options={options}
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
      placeholder="Pick one"
      portal={false}
      searchable={false}
    />
  );
}

function MultiHost({ onChange }: { onChange?: (v: string[]) => void }) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Combobox
      options={options}
      multiple
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
      placeholder="Pick many"
      portal={false}
      searchable={false}
    />
  );
}

describe('Combobox', () => {
  it('renders a trigger with the placeholder when no value is set', () => {
    render(<SingleHost />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick one');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the listbox on trigger click and selects an option', () => {
    const spy = vi.fn();
    render(<SingleHost onChange={spy} />);
    fireEvent.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText('Vue'));
    expect(spy).toHaveBeenCalledWith('vue');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('Vue');
  });

  it('toggles selection and stays open in multiple mode', () => {
    const spy = vi.fn();
    render(<MultiHost onChange={spy} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('React'));
    expect(spy).toHaveBeenLastCalledWith(['react']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('listbox')).getByText('Vue'));
    expect(spy).toHaveBeenLastCalledWith(['react', 'vue']);
    fireEvent.click(within(screen.getByRole('listbox')).getByText('React'));
    expect(spy).toHaveBeenLastCalledWith(['vue']);
  });

  it('filters client-side with the built-in search', () => {
    function Host() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <Combobox
          options={options}
          value={value}
          onChange={setValue}
          portal={false}
          searchable
        />
      );
    }
    render(<Host />);
    fireEvent.click(screen.getByRole('combobox'));
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'sv' } });
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByText('Svelte')).toBeInTheDocument();
    expect(within(listbox).queryByText('React')).not.toBeInTheDocument();
  });

  it('uses onSearch for controlled async search', () => {
    const onSearch = vi.fn();
    function Host() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <Combobox
          options={options}
          value={value}
          onChange={setValue}
          portal={false}
          searchable
          searchValue=""
          onSearch={onSearch}
        />
      );
    }
    render(<Host />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'ng' } });
    expect(onSearch).toHaveBeenCalledWith('ng');
  });

  it('shows the loading row when loading=true', () => {
    render(
      <Combobox
        options={options}
        value={null}
        onChange={() => {}}
        portal={false}
        searchable={false}
        loading
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('clears the value when the clear affordance is clicked', () => {
    const spy = vi.fn();
    function Host() {
      const [value, setValue] = useState<string | null>('react');
      return (
        <Combobox
          options={options}
          value={value}
          onChange={(v) => {
            setValue(v);
            spy(v);
          }}
          portal={false}
          searchable={false}
        />
      );
    }
    render(<Host />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('honours the disabled prop', () => {
    render(
      <Combobox
        options={options}
        value={null}
        onChange={() => {}}
        portal={false}
        disabled
        searchable={false}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('navigates with ArrowDown/Enter keys', () => {
    const spy = vi.fn();
    render(<SingleHost onChange={spy} />);
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(spy).toHaveBeenCalledWith('vue');
  });

  it('closes on Escape without changing the value', () => {
    render(<SingleHost />);
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('uses the custom renderOption when provided', () => {
    render(
      <Combobox
        options={options}
        value={null}
        onChange={() => {}}
        portal={false}
        searchable={false}
        renderOption={(o) => <span data-testid={`custom-${o.value}`}>{o.label.toUpperCase()}</span>}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByTestId('custom-react')).toHaveTextContent('REACT');
  });
});
