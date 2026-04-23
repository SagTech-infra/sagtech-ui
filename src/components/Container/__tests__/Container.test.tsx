import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Container from '../Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>child</Container>);
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<Container size="lg">x</Container>);
    expect(container.firstChild).toHaveClass('max-w-[1200px]');
  });

  it('renders as alternative tag', () => {
    const { container } = render(<Container as="section">x</Container>);
    expect((container.firstChild as HTMLElement).tagName).toBe('SECTION');
  });
});
