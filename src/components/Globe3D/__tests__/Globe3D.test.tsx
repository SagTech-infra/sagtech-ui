import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Globe3D from '../Globe3D';

const markers = [
  { lat: 51.5, lng: -0.1, label: 'London' },
  { lat: 40.7, lng: -74.0 },
];

// The heavy core (@react-three/fiber) is lazy-loaded behind <Suspense>, so the
// mocked `r3f-canvas` placeholder appears asynchronously — assertions on it use
// findBy*. The outer wrapper div renders synchronously.

describe('Globe3D', () => {
  it('mounts with an empty marker array and resolves the core', async () => {
    render(<Globe3D markers={[]} />);
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('renders the outer wrapper synchronously and the canvas after load', async () => {
    render(<Globe3D markers={markers} />);
    // Outer div carries the component CSS class and renders before the chunk.
    expect(document.querySelector('.sagtech-globe3d')).not.toBeNull();
    // @react-three/fiber Canvas is mocked to render this testid once loaded.
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('accepts loadingFallback and still resolves the core', async () => {
    render(<Globe3D markers={markers} loadingFallback={<div data-testid="globe-fallback" />} />);
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('accepts optional props without throwing', async () => {
    const onMarkerClick = vi.fn();
    render(
      <Globe3D
        markers={markers}
        onMarkerClick={onMarkerClick}
        autoRotate={false}
        radius={2}
        width={400}
        height={400}
      />,
    );
    expect(await screen.findByTestId('r3f-canvas')).toBeInTheDocument();
  });
});
