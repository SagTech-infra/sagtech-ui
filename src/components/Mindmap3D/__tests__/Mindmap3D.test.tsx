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

// The heavy core (@react-three/fiber) is lazy-loaded behind <Suspense>, so the
// mocked `r3f-canvas` placeholder appears asynchronously — assertions on it use
// findBy*. The outer wrapper div renders synchronously.

describe('Mindmap3D', () => {
  it('mounts and resolves the core without throwing', async () => {
    render(<Mindmap3D root={root} />);
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('renders the outer wrapper synchronously and the canvas after load', async () => {
    render(<Mindmap3D root={root} />);
    // Outer div carries the component CSS class and renders before the chunk.
    expect(document.querySelector('.sagtech-mindmap3d')).not.toBeNull();
    // @react-three/fiber Canvas is mocked to render this testid once loaded.
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('accepts loadingFallback and still resolves the core', async () => {
    render(<Mindmap3D root={root} loadingFallback={<div data-testid="mm-fallback" />} />);
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('accepts optional callbacks without throwing', async () => {
    const onNodeClick = vi.fn();
    render(
      <Mindmap3D
        root={root}
        onNodeClick={onNodeClick}
        width={800}
        height={600}
        edgeColor="#ff00ff"
      />,
    );
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });
});
