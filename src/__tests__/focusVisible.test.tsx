/**
 * Regression guard: focus-visible rings on base form controls (Task C — a11y)
 *
 * Asserts that the focusable element in each control carries the Tailwind
 * focus-visible ring utility classes that replace the native outline.
 * These are literal class strings — Tailwind utilities are not processed at
 * test time, but the class names must be present for the browser to apply
 * the styles.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import SelectFakeInput from '@/components/SelectInput/SelectFakeInput';

const RING_WIDTH = 'focus-visible:ring-2';
const RING_COLOR = 'focus-visible:ring-pr_purple';

describe('focus-visible rings — a11y regression guard', () => {
  it('Input: the <input> element carries focus-visible ring classes', () => {
    const { getByRole } = render(<Input placeholder="test" />);
    const input = getByRole('textbox');
    expect(input).toHaveClass(RING_WIDTH);
    expect(input).toHaveClass(RING_COLOR);
  });

  it('Button: the <button> element carries focus-visible ring classes (primary variant)', () => {
    const { getByRole } = render(<Button variant="primary" text="Click me" />);
    const btn = getByRole('button');
    expect(btn).toHaveClass(RING_WIDTH);
    expect(btn).toHaveClass(RING_COLOR);
  });

  it('Button: the <button> element carries focus-visible ring classes (secondary variant)', () => {
    const { getByRole } = render(<Button variant="secondary" text="Click me" />);
    const btn = getByRole('button');
    expect(btn).toHaveClass(RING_WIDTH);
    expect(btn).toHaveClass(RING_COLOR);
  });

  it('Button: the <button> element carries focus-visible ring classes (danger variant)', () => {
    const { getByRole } = render(<Button variant="danger" text="Click me" />);
    const btn = getByRole('button');
    expect(btn).toHaveClass(RING_WIDTH);
    expect(btn).toHaveClass(RING_COLOR);
  });

  it('SelectFakeInput: the focusable <input> carries focus-visible ring classes', () => {
    const { getByRole } = render(
      <SelectFakeInput
        onClick={() => {}}
        displayValue=""
        placeholder="Select…"
        isOpen={false}
      />,
    );
    const input = getByRole('combobox');
    expect(input).toHaveClass(RING_WIDTH);
    expect(input).toHaveClass(RING_COLOR);
  });
});
