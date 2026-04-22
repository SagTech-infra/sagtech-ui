import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SagtechUIProvider, useImageComponent, useLinkComponent } from '../index';
import type { UIImageComponent, UILinkComponent } from '../index';

function ImageProbe() {
  const Image = useImageComponent();
  return <Image src="/test.svg" alt="probe" width={16} height={16} />;
}

function LinkProbe() {
  const Link = useLinkComponent();
  return (
    <Link href="/target" className="my-link">
      follow
    </Link>
  );
}

describe('UIComponents context', () => {
  it('falls back to <img> shim without a provider', () => {
    render(<ImageProbe />);
    const img = screen.getByAltText('probe');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/test.svg');
  });

  it('falls back to <a> shim without a provider', () => {
    render(<LinkProbe />);
    const link = screen.getByText('follow');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/target');
    expect(link).toHaveClass('my-link');
  });

  it('uses a custom imageComponent when provided', () => {
    const CustomImage: UIImageComponent = ({ alt, src }) => (
      <span data-testid="custom-image" data-src={String(src)}>
        {alt}
      </span>
    );
    render(
      <SagtechUIProvider imageComponent={CustomImage}>
        <ImageProbe />
      </SagtechUIProvider>,
    );
    const custom = screen.getByTestId('custom-image');
    expect(custom).toHaveAttribute('data-src', '/test.svg');
    expect(custom.textContent).toBe('probe');
  });

  it('uses a custom linkComponent when provided', () => {
    const CustomLink: UILinkComponent = ({ href, children }) => (
      <button type="button" data-testid="custom-link" data-href={href}>
        {children}
      </button>
    );
    render(
      <SagtechUIProvider linkComponent={CustomLink}>
        <LinkProbe />
      </SagtechUIProvider>,
    );
    const custom = screen.getByTestId('custom-link');
    expect(custom.tagName).toBe('BUTTON');
    expect(custom).toHaveAttribute('data-href', '/target');
  });

  it('nested provider takes the nearest value', () => {
    const Outer: UIImageComponent = ({ alt }) => <span data-testid="outer">{alt}</span>;
    const Inner: UIImageComponent = ({ alt }) => <span data-testid="inner">{alt}</span>;
    render(
      <SagtechUIProvider imageComponent={Outer}>
        <SagtechUIProvider imageComponent={Inner}>
          <ImageProbe />
        </SagtechUIProvider>
      </SagtechUIProvider>,
    );
    expect(screen.getByTestId('inner')).toBeInTheDocument();
    expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
  });
});
