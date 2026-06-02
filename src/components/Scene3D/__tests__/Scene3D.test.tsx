import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Scene3D from '../Scene3D';

// The heavy core (@react-three/fiber) is lazy-loaded behind <Suspense>, so the
// mocked `r3f-canvas` placeholder appears asynchronously — assertions on it use
// findBy*. The outer wrapper div renders synchronously.

describe('Scene3D', () => {
  it('mounts with no props and resolves the core', async () => {
    render(<Scene3D />);
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('renders the outer wrapper synchronously and the canvas after load', async () => {
    render(<Scene3D />);
    // Outer div carries the component CSS class and renders before the chunk.
    expect(document.querySelector('.sagtech-scene3d')).not.toBeNull();
    // @react-three/fiber Canvas is mocked to render this testid once loaded.
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('accepts loadingFallback and still resolves the core', async () => {
    render(<Scene3D loadingFallback={<div data-testid="scene-fallback" />} />);
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('accepts lighting and controls variants without throwing', async () => {
    const { unmount } = render(
      <Scene3D lighting="studio" controls="none" width={800} height={600} />,
    );
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
    unmount();
    render(<Scene3D lighting="none" controls="orbit" />);
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });
});
