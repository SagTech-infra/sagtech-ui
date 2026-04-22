import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectInput from '../SelectInput';
import type { SelectOption } from '../types';

const options: SelectOption[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
];

function openDropdown(container: HTMLElement) {
  const trigger = container.querySelector('input');
  if (!trigger) throw new Error('Select trigger not found');
  fireEvent.click(trigger);
}

describe('SelectInput (controlled)', () => {
  it('renders without register/name (no hidden native select)', () => {
    const { container } = render(
      <SelectInput options={options} value="" onChange={() => {}} placeholder="pick one" />,
    );
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('input[placeholder="pick one"]')).not.toBeNull();
  });

  it('fires onChange with the chosen value', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <SelectInput options={options} value="" onChange={handleChange} placeholder="pick one" />,
    );
    openDropdown(container);
    fireEvent.click(screen.getByText('Vue'));
    expect(handleChange).toHaveBeenCalledWith('vue');
  });

  it('falls back to deprecated onSelect when onChange is absent', () => {
    const legacy = vi.fn();
    const { container } = render(
      <SelectInput options={options} value="" onSelect={legacy} placeholder="pick one" />,
    );
    openDropdown(container);
    fireEvent.click(screen.getByText('React'));
    expect(legacy).toHaveBeenCalledWith('react');
  });

  it('supports multiple selection via onChange', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <SelectInput
        options={options}
        value={['react']}
        onChange={handleChange}
        placeholder="pick many"
        multiple
      />,
    );
    openDropdown(container);
    fireEvent.click(screen.getByText('Vue'));
    expect(handleChange).toHaveBeenCalledWith('vue');
  });

  it('does not open or fire onChange when disabled', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <SelectInput
        options={options}
        value=""
        onChange={handleChange}
        placeholder="pick one"
        disabled
      />,
    );
    openDropdown(container);
    expect(screen.queryByText('Vue')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('marks the root as aria-disabled when disabled', () => {
    const { container } = render(
      <SelectInput
        options={options}
        value=""
        onChange={() => {}}
        placeholder="pick one"
        disabled
      />,
    );
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders the hidden native <select> when register + name are provided (back-compat)', () => {
    const register = vi.fn(() => ({ onChange: () => {}, onBlur: () => {}, ref: () => {}, name: 'framework' }));
    const { container } = render(
      <SelectInput
        options={options}
        value=""
        onChange={() => {}}
        placeholder="pick one"
        register={register as never}
        name={'framework' as never}
      />,
    );
    const nativeSelect = container.querySelector('select.hidden');
    expect(nativeSelect).not.toBeNull();
    expect(register).toHaveBeenCalledWith('framework');
  });
});
