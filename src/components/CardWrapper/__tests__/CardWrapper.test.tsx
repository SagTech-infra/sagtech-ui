import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import CardWrapper from '../CardWrapper';
import { SagtechUIProvider } from '@/providers';
import type { UILinkComponent } from '@/providers';

describe('CardWrapper', () => {
  it('renders a <div> when no href is provided', () => {
    const { container } = render(
      <CardWrapper>
        <span>card body</span>
      </CardWrapper>,
    );
    const div = container.querySelector('[data-tid="card-wrapper"]');
    expect(div).not.toBeNull();
    expect(div?.tagName).toBe('DIV');
    expect(screen.getByText('card body')).toBeInTheDocument();
  });

  it('renders a link (default <a> shim) when href is provided', () => {
    render(
      <CardWrapper href="/detail">
        <span>go</span>
      </CardWrapper>,
    );
    const link = screen.getByText('go').closest('a');
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute('href', '/detail');
  });

  it('fires hrefClickEvent when the link is clicked', () => {
    const onClick = vi.fn();
    render(
      <CardWrapper href="/detail" hrefClickEvent={onClick}>
        <span>go</span>
      </CardWrapper>,
    );
    const link = screen.getByText('go').closest('a');
    expect(link).not.toBeNull();
    fireEvent.click(link!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('uses a custom linkComponent through provider', () => {
    const CustomLink: UILinkComponent = ({ href, children }) => (
      <button type="button" data-testid="custom-link" data-href={href}>
        {children}
      </button>
    );
    render(
      <SagtechUIProvider linkComponent={CustomLink}>
        <CardWrapper href="/x">
          <span>content</span>
        </CardWrapper>
      </SagtechUIProvider>,
    );
    const custom = screen.getByTestId('custom-link');
    expect(custom.tagName).toBe('BUTTON');
    expect(custom).toHaveAttribute('data-href', '/x');
  });
});
