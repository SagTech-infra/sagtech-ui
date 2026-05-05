import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Stepper from '../Stepper';
import type { StepperStep } from '../types';

const steps: StepperStep[] = [
  { label: 'Step 1', status: 'complete' },
  { label: 'Step 2', description: 'Now', status: 'active' },
  { label: 'Step 3', status: 'pending' },
];

describe('Stepper', () => {
  it('renders all step labels', () => {
    render(<Stepper steps={steps} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('renders descriptions when provided', () => {
    render(<Stepper steps={steps} />);
    expect(screen.getByText('Now')).toBeInTheDocument();
  });

  it('marks the active step with aria-current="step"', () => {
    render(<Stepper steps={steps} />);
    const activeNode = screen.getByText('2').closest('[aria-current="step"]');
    expect(activeNode).not.toBeNull();
  });

  it('renders error indicator for status="error"', () => {
    const errSteps: StepperStep[] = [
      { label: 'A', status: 'complete' },
      { label: 'B', status: 'error' },
    ];
    render(<Stepper steps={errSteps} />);
    // Error step shows the error icon (no number)
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('makes completed steps clickable when clickableSteps="completed"', () => {
    const spy = vi.fn();
    render(<Stepper steps={steps} clickableSteps="completed" onStepClick={spy} />);
    const button = screen.getByRole('button', { name: /Step 1/ });
    fireEvent.click(button);
    expect(spy).toHaveBeenCalledWith(0);
  });

  it('does not render buttons for non-completed steps when clickableSteps="completed"', () => {
    const spy = vi.fn();
    render(<Stepper steps={steps} clickableSteps="completed" onStepClick={spy} />);
    expect(screen.queryByRole('button', { name: /Step 3/ })).not.toBeInTheDocument();
  });

  it('makes all steps clickable when clickableSteps="all"', () => {
    const spy = vi.fn();
    render(<Stepper steps={steps} clickableSteps="all" onStepClick={spy} />);
    fireEvent.click(screen.getByRole('button', { name: /Step 3/ }));
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('makes no steps clickable when clickableSteps="none"', () => {
    render(
      <Stepper steps={steps} clickableSteps="none" onStepClick={() => {}} />,
    );
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('respects orientation prop on root', () => {
    const { container } = render(<Stepper steps={steps} orientation="vertical" />);
    expect(container.querySelector('[aria-orientation="vertical"]')).not.toBeNull();
  });
});
