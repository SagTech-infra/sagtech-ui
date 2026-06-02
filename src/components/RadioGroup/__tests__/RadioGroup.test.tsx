import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import RadioGroup, { type RadioOption } from '../RadioGroup';

const options: RadioOption[] = [
  { label: 'Option one', value: 'one' },
  { label: 'Option two', value: 'two' },
  { label: 'Option three', value: 'three' },
];

describe('RadioGroup', () => {
  it('renders a radiogroup with one radio per option', () => {
    render(<RadioGroup name="r" options={options} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(options.length);
    expect(screen.getByLabelText('Option one')).toBeInTheDocument();
    expect(screen.getByLabelText('Option two')).toBeInTheDocument();
    expect(screen.getByLabelText('Option three')).toBeInTheDocument();
  });

  it('reflects the controlled value via the checked radio', () => {
    render(<RadioGroup name="r" options={options} value="two" />);
    expect(screen.getByLabelText('Option one')).not.toBeChecked();
    expect(screen.getByLabelText('Option two')).toBeChecked();
    expect(screen.getByLabelText('Option three')).not.toBeChecked();
  });

  it('forwards name to every radio input', () => {
    render(<RadioGroup name="plan" options={options} />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('name', 'plan');
    }
  });

  it('calls onChange with the option value when a radio is selected', () => {
    const onChange = vi.fn();
    render(
      <RadioGroup name="r" options={options} value="one" onChange={onChange} />,
    );
    fireEvent.click(screen.getByLabelText('Option three'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('three');
  });

  it('does not call onChange for a disabled option', () => {
    const onChange = vi.fn();
    const withDisabled: RadioOption[] = [
      { label: 'Available', value: 'available' },
      { label: 'Unavailable', value: 'unavailable', disabled: true },
    ];
    render(
      <RadioGroup
        name="r"
        options={withDisabled}
        value="available"
        onChange={onChange}
      />,
    );
    const disabledRadio = screen.getByLabelText('Unavailable');
    expect(disabledRadio).toBeDisabled();
    fireEvent.click(disabledRadio);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders an option description as text', () => {
    const withDesc: RadioOption[] = [
      { label: 'Pro', value: 'pro', description: 'For growing teams' },
    ];
    render(<RadioGroup name="r" options={withDesc} value="pro" />);
    expect(screen.getByText('For growing teams')).toBeInTheDocument();
  });

  it('renders the group error message when provided', () => {
    render(
      <RadioGroup name="r" options={options} error="Please select an option" />,
    );
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('does not render an error paragraph when error is absent', () => {
    render(<RadioGroup name="r" options={options} />);
    expect(screen.queryByText('Please select an option')).not.toBeInTheDocument();
  });

  it('forwards ref to the underlying wrapper div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<RadioGroup name="r" options={options} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.querySelector('[role="radiogroup"]')).not.toBeNull();
  });
});
