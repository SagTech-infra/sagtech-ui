import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Point from '../Point';
import { SagtechUIProvider } from '@/providers';
import type { UIImageComponent } from '@/providers';

describe('Point', () => {
  it('renders an icon image by default when icon is true', () => {
    render(<Point text="10+ members" type="BodyM" textColor="text-grey_4" iconName="users" />);
    const img = screen.getByAltText('users');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/svg/icons/users.svg');
    expect(screen.getByText('10+ members')).toBeInTheDocument();
  });

  it('renders a circle (no image) when icon is false', () => {
    const { container } = render(
      <Point text="item" type="BodyS" textColor="text-white_4" icon={false} />,
    );
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[data-tid="circle"]')).not.toBeNull();
  });

  it('uses a custom imageComponent through provider', () => {
    const Custom: UIImageComponent = ({ alt, src }) => (
      <svg data-testid="custom-icon" aria-label={alt} data-src={String(src)} />
    );
    render(
      <SagtechUIProvider imageComponent={Custom}>
        <Point text="label" type="BodyM" textColor="text-grey_4" iconName="calendar" />
      </SagtechUIProvider>,
    );
    const custom = screen.getByTestId('custom-icon');
    expect(custom).toHaveAttribute('data-src', '/svg/icons/calendar.svg');
    expect(custom).toHaveAttribute('aria-label', 'calendar');
  });
});
