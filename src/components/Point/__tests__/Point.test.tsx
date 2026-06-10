import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Point from '../Point';

describe('Point', () => {
  it('renders a self-contained svg icon (not a hosted <img>) when icon is true', () => {
    const { container } = render(
      <Point text="10+ members" type="BodyM" textColor="text-grey_4" iconName="users" />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('10+ members')).toBeInTheDocument();
  });

  it('renders a circle (no icon) when icon is false', () => {
    const { container } = render(
      <Point text="item" type="BodyS" textColor="text-white_4" icon={false} />,
    );
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[data-tid="circle"]')).not.toBeNull();
  });
});
