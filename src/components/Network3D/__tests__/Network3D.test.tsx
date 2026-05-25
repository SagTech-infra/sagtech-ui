import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Network3D from '../Network3D';

const nodes = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
];
const links = [{ source: 'a', target: 'b' }];

describe('Network3D', () => {
  it('mounts without throwing', () => {
    expect(() => render(<Network3D nodes={nodes} links={links} />)).not.toThrow();
  });

  it('renders the outer wrapper and force-graph-3d placeholder', () => {
    render(<Network3D nodes={nodes} links={links} />);
    // Outer div carries the component CSS class
    expect(document.querySelector('.sagtech-network3d')).not.toBeNull();
    // react-force-graph-3d is mocked to render this testid
    expect(screen.getByTestId('force-graph-3d')).toBeInTheDocument();
  });

  it('accepts optional callbacks without throwing', () => {
    const onNodeClick = vi.fn();
    expect(() =>
      render(
        <Network3D
          nodes={nodes}
          links={links}
          onNodeClick={onNodeClick}
          enableNodeDrag={false}
          width={300}
          height={200}
        />,
      ),
    ).not.toThrow();
  });
});
