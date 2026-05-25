import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Scene3D from '../Scene3D';

describe('Scene3D', () => {
  it('mounts without throwing with no props', () => {
    expect(() => render(<Scene3D />)).not.toThrow();
  });

  it('renders the outer wrapper and r3f-canvas placeholder', () => {
    render(<Scene3D />);
    // Outer div carries the component CSS class
    expect(document.querySelector('.sagtech-scene3d')).not.toBeNull();
    // @react-three/fiber Canvas is mocked to render this testid
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('accepts lighting and controls variants without throwing', () => {
    expect(() =>
      render(<Scene3D lighting="studio" controls="none" width={800} height={600} />),
    ).not.toThrow();
    expect(() =>
      render(<Scene3D lighting="none" controls="orbit" />),
    ).not.toThrow();
  });
});
