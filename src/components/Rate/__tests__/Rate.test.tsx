import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Rate from '../Rate';

describe('Rate', () => {
  it('renders aria-label with value', () => {
    render(<Rate value={3.5} label="Quality" />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Quality: 3.5 out of 5',
    );
  });

  it('clamps values outside range', () => {
    render(<Rate value={8} max={5} label="Big" />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Big: 5 out of 5',
    );
  });

  it('supports custom max', () => {
    render(<Rate value={7} max={10} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Rating: 7 out of 10',
    );
  });
});
