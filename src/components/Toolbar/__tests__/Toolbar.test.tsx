import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import Toolbar from '../Toolbar';

describe('Toolbar', () => {
  it('renders role="toolbar" and aria-label', () => {
    render(
      <Toolbar ariaLabel="Editor tools">
        <button type="button">A</button>
      </Toolbar>,
    );
    const toolbar = screen.getByRole('toolbar', { name: 'Editor tools' });
    expect(toolbar).toBeInTheDocument();
  });

  it('reflects orientation in aria-orientation', () => {
    render(
      <Toolbar ariaLabel="x" orientation="vertical">
        <button type="button">A</button>
      </Toolbar>,
    );
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('forwards ref to the root container', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Toolbar ref={ref} ariaLabel="x">
        <button type="button">A</button>
      </Toolbar>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'toolbar');
  });

  it('renders Toolbar.Separator with role="separator"', () => {
    render(
      <Toolbar ariaLabel="x">
        <button type="button">A</button>
        <Toolbar.Separator />
        <button type="button">B</button>
      </Toolbar>,
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('moves focus with ArrowRight in horizontal orientation', () => {
    render(
      <Toolbar ariaLabel="x">
        <button type="button">A</button>
        <button type="button">B</button>
        <button type="button">C</button>
      </Toolbar>,
    );
    const a = screen.getByText('A');
    const b = screen.getByText('B');
    a.focus();
    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(b);
  });

  it('wraps focus on ArrowRight at end', () => {
    render(
      <Toolbar ariaLabel="x">
        <button type="button">A</button>
        <button type="button">B</button>
      </Toolbar>,
    );
    const a = screen.getByText('A');
    const b = screen.getByText('B');
    b.focus();
    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(a);
  });

  it('moves focus with ArrowLeft', () => {
    render(
      <Toolbar ariaLabel="x">
        <button type="button">A</button>
        <button type="button">B</button>
      </Toolbar>,
    );
    const a = screen.getByText('A');
    const b = screen.getByText('B');
    b.focus();
    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(a);
  });

  it('uses ArrowDown/ArrowUp in vertical orientation', () => {
    render(
      <Toolbar ariaLabel="x" orientation="vertical">
        <button type="button">A</button>
        <button type="button">B</button>
      </Toolbar>,
    );
    const a = screen.getByText('A');
    const b = screen.getByText('B');
    a.focus();
    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(b);
  });

  it('Home jumps to first, End jumps to last', () => {
    render(
      <Toolbar ariaLabel="x">
        <button type="button">A</button>
        <button type="button">B</button>
        <button type="button">C</button>
      </Toolbar>,
    );
    const a = screen.getByText('A');
    const c = screen.getByText('C');
    a.focus();
    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'End' });
    expect(document.activeElement).toBe(c);
    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'Home' });
    expect(document.activeElement).toBe(a);
  });

  it('skips disabled buttons in keyboard nav', () => {
    render(
      <Toolbar ariaLabel="x">
        <button type="button">A</button>
        <button type="button" disabled>
          B
        </button>
        <button type="button">C</button>
      </Toolbar>,
    );
    const a = screen.getByText('A');
    const c = screen.getByText('C');
    a.focus();
    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(c);
  });
});
