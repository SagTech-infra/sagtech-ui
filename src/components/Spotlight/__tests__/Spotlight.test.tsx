import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Spotlight } from '../Spotlight';

describe('Spotlight', () => {
  it('renders nothing when closed', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <div ref={ref}>
        <Spotlight
          targetRef={ref}
          open={false}
          onOpenChange={() => {}}
          title="Tour step"
        />
      </div>,
    );
    expect(screen.queryByText('Tour step')).not.toBeInTheDocument();
    expect(container).toBeTruthy();
  });

  it('calls onOpenChange/onSkip on Escape key when open', () => {
    const ref = createRef<HTMLDivElement>();
    const onSkip = vi.fn();
    render(
      <div ref={ref}>
        <Spotlight
          targetRef={ref}
          open
          onOpenChange={() => {}}
          onSkip={onSkip}
          title="Step 1"
        />
      </div>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
