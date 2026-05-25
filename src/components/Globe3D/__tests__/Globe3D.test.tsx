import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Globe3D from '../Globe3D';

const markers = [
  { lat: 51.5, lng: -0.1, label: 'London' },
  { lat: 40.7, lng: -74.0 },
];

describe('Globe3D', () => {
  it('mounts without throwing with an empty marker array', () => {
    expect(() => render(<Globe3D markers={[]} />)).not.toThrow();
  });

  it('renders the outer wrapper and r3f-canvas placeholder', () => {
    render(<Globe3D markers={markers} />);
    // Outer div carries the component CSS class
    expect(document.querySelector('.sagtech-globe3d')).not.toBeNull();
    // @react-three/fiber Canvas is mocked to render this testid
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('accepts optional props without throwing', () => {
    const onMarkerClick = vi.fn();
    expect(() =>
      render(
        <Globe3D
          markers={markers}
          onMarkerClick={onMarkerClick}
          autoRotate={false}
          radius={2}
          width={400}
          height={400}
        />,
      ),
    ).not.toThrow();
  });
});
