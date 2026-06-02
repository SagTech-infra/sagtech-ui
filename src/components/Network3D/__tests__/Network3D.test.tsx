import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Network3D from '../Network3D';

const nodes = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
];
const links = [{ source: 'a', target: 'b' }];

// The heavy core (react-force-graph-3d) is lazy-loaded behind <Suspense>, so
// the mocked `force-graph-3d` placeholder appears asynchronously — assertions
// on it use findBy*. The outer wrapper div renders synchronously.

describe('Network3D', () => {
  it('mounts and resolves the lazy core without throwing', async () => {
    render(<Network3D nodes={nodes} links={links} />);
    expect(await screen.findByTestId('force-graph-3d')).toBeInTheDocument();
  });

  it('renders the outer wrapper synchronously and the graph after load', async () => {
    render(<Network3D nodes={nodes} links={links} />);
    // Outer div carries the component CSS class and renders before the chunk.
    expect(document.querySelector('.sagtech-network3d')).not.toBeNull();
    // react-force-graph-3d is mocked to render this testid once the core loads.
    expect(await screen.findByTestId('force-graph-3d')).toBeInTheDocument();
  });

  it('accepts loadingFallback and still resolves the core', async () => {
    // The fallback is only visible during the suspended tick (RTL's act() flushes
    // the lazy import before render() returns), so its visual is covered by
    // Storybook/manual QA. Here we assert the prop is accepted and does not break
    // the lazy resolution.
    render(
      <Network3D
        nodes={nodes}
        links={links}
        loadingFallback={<div data-testid="net-fallback" />}
      />,
    );
    expect(await screen.findByTestId('force-graph-3d')).toBeInTheDocument();
  });

  it('accepts optional callbacks without throwing', async () => {
    const onNodeClick = vi.fn();
    render(
      <Network3D
        nodes={nodes}
        links={links}
        onNodeClick={onNodeClick}
        enableNodeDrag={false}
        width={300}
        height={200}
      />,
    );
    expect(await screen.findByTestId('force-graph-3d')).toBeInTheDocument();
  });
});
