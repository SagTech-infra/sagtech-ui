import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState, createRef } from 'react';
import SegmentedControl from '../SegmentedControl';

describe('SegmentedControl', () => {
  const options = [
    { label: 'One', value: 'one' },
    { label: 'Two', value: 'two' },
    { label: 'Three', value: 'three' },
  ];

  it('renders all options as radio buttons', () => {
    render(<SegmentedControl value="one" onChange={() => {}} options={options} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('marks the active option aria-checked=true', () => {
    render(<SegmentedControl value="two" onChange={() => {}} options={options} />);
    const second = screen.getByRole('radio', { name: 'Two' });
    expect(second).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when an option is clicked', () => {
    const spy = vi.fn();
    render(<SegmentedControl value="one" onChange={spy} options={options} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Three' }));
    expect(spy).toHaveBeenCalledWith('three');
  });

  it('moves selection with ArrowRight', () => {
    function Wrapper() {
      const [v, setV] = useState('one');
      return <SegmentedControl value={v} onChange={setV} options={options} />;
    }
    render(<Wrapper />);
    const group = screen.getByRole('radiogroup');
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Two' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Three' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    // Wraps
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'One' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('moves selection with ArrowLeft and wraps to last', () => {
    function Wrapper() {
      const [v, setV] = useState('one');
      return <SegmentedControl value={v} onChange={setV} options={options} />;
    }
    render(<Wrapper />);
    const group = screen.getByRole('radiogroup');
    fireEvent.keyDown(group, { key: 'ArrowLeft' });
    expect(screen.getByRole('radio', { name: 'Three' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('skips disabled options on keyboard nav', () => {
    const optsWithDisabled = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b', disabled: true },
      { label: 'C', value: 'c' },
    ];
    function Wrapper() {
      const [v, setV] = useState('a');
      return <SegmentedControl value={v} onChange={setV} options={optsWithDisabled} />;
    }
    render(<Wrapper />);
    const group = screen.getByRole('radiogroup');
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'C' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('Home jumps to first enabled, End to last enabled', () => {
    function Wrapper() {
      const [v, setV] = useState('two');
      return <SegmentedControl value={v} onChange={setV} options={options} />;
    }
    render(<Wrapper />);
    const group = screen.getByRole('radiogroup');
    fireEvent.keyDown(group, { key: 'Home' });
    expect(screen.getByRole('radio', { name: 'One' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    fireEvent.keyDown(group, { key: 'End' });
    expect(screen.getByRole('radio', { name: 'Three' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('forwards ref to root div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SegmentedControl ref={ref} value="one" onChange={() => {}} options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'radiogroup');
  });

  it('disables clicks when disabled is true', () => {
    const spy = vi.fn();
    render(<SegmentedControl disabled value="one" onChange={spy} options={options} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Two' }));
    expect(spy).not.toHaveBeenCalled();
  });
});
