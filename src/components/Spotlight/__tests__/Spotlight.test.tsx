import { describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Spotlight } from '../Spotlight';

function SpotlightFixture({
  open,
  onOpenChange,
  onSkip,
  onNext,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSkip?: () => void;
  onNext?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={ref}>Target element</button>
      <Spotlight
        targetRef={ref}
        open={open}
        onOpenChange={onOpenChange}
        title="Tour step"
        description="This is the description"
        onSkip={onSkip}
        onNext={onNext}
      />
    </>
  );
}

describe('Spotlight — smoke tests', () => {
  it('renders the dialog when open=true', () => {
    render(
      <SpotlightFixture open onOpenChange={vi.fn()} />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(
      <SpotlightFixture open onOpenChange={vi.fn()} />,
    );
    expect(screen.getByText('Tour step')).toBeInTheDocument();
    expect(screen.getByText('This is the description')).toBeInTheDocument();
  });

  it('calls onSkip when Skip button is clicked', () => {
    const onSkip = vi.fn();
    render(
      <SpotlightFixture open onOpenChange={vi.fn()} onSkip={onSkip} />,
    );
    fireEvent.click(screen.getByText('Skip'));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenChange(false) via skip when onSkip is not provided', () => {
    const onOpenChange = vi.fn();
    render(
      <SpotlightFixture open onOpenChange={onOpenChange} />,
    );
    fireEvent.click(screen.getByText('Skip'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders Next button when onNext is provided and calls it on click', () => {
    const onNext = vi.fn();
    render(
      <SpotlightFixture open onOpenChange={vi.fn()} onNext={onNext} />,
    );
    fireEvent.click(screen.getByText('Next'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('does not render dialog when open=false', () => {
    render(
      <SpotlightFixture open={false} onOpenChange={vi.fn()} />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onSkip on Escape keydown', () => {
    const onSkip = vi.fn();
    render(
      <SpotlightFixture open onOpenChange={vi.fn()} onSkip={onSkip} />,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
