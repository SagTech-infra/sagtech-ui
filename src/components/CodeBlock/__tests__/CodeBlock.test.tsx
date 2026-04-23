import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CodeBlock from '../CodeBlock';

describe('CodeBlock', () => {
  it('renders code content', () => {
    render(<CodeBlock code="const x = 1" language="ts" copyable={false} />);
    expect(screen.getByText(/const/)).toBeInTheDocument();
  });

  it('shows filename when provided', () => {
    render(<CodeBlock code="x" filename="app.ts" copyable={false} />);
    expect(screen.getByText('app.ts')).toBeInTheDocument();
  });

  it('uses custom highlight function', () => {
    const highlight = vi.fn(() => '<span>xx</span>');
    render(<CodeBlock code="abc" language="ts" highlight={highlight} copyable={false} />);
    expect(highlight).toHaveBeenCalledWith('abc', 'ts');
  });

  it('highlights json keys', () => {
    const { container } = render(
      <CodeBlock code='{"a": 1}' language="json" copyable={false} />,
    );
    expect(container.querySelector('.tok-key')).toBeTruthy();
  });
});
