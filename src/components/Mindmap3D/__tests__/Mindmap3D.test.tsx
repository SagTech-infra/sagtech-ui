import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Mindmap3D from '../Mindmap3D';
import type { MindmapNode } from '../types';

const root: MindmapNode = {
  id: 'root',
  label: 'Root',
  children: [
    { id: 'child-1', label: 'Child 1' },
    {
      id: 'child-2',
      label: 'Child 2',
      children: [{ id: 'grandchild-1', label: 'Grandchild 1' }],
    },
  ],
};

describe('Mindmap3D', () => {
  it('mounts without throwing', () => {
    expect(() => render(<Mindmap3D root={root} />)).not.toThrow();
  });

  it('renders the outer wrapper and r3f-canvas placeholder', () => {
    render(<Mindmap3D root={root} />);
    // Outer div carries the component CSS class
    expect(document.querySelector('.sagtech-mindmap3d')).not.toBeNull();
    // @react-three/fiber Canvas is mocked to render this testid
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('accepts optional callbacks without throwing', () => {
    const onNodeClick = vi.fn();
    expect(() =>
      render(
        <Mindmap3D
          root={root}
          onNodeClick={onNodeClick}
          width={800}
          height={600}
          edgeColor="#ff00ff"
        />,
      ),
    ).not.toThrow();
  });
});
