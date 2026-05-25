import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RichTextEditor from '../RichTextEditor';

// TipTap mounts correctly in happy-dom because:
//   • immediatelyRender: false is already set in the component (avoids SSR
//     mismatch warnings).
//   • StarterKit does not rely on canvas or WebGL.
// No extra vi.mock is needed for TipTap.

describe('RichTextEditor', () => {
  it('mounts without crashing and renders the root wrapper', () => {
    const { container } = render(
      <RichTextEditor value="" onChange={vi.fn()} />,
    );
    // The outer div always carries the sagtech-rte class.
    expect(container.querySelector('.sagtech-rte')).toBeInTheDocument();
  });

  it('renders the formatting toolbar by default', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    // Toolbar has role="toolbar" and aria-label="Formatting".
    expect(screen.getByRole('toolbar', { name: 'Formatting' })).toBeInTheDocument();
  });

  it('renders Bold and Italic toolbar buttons', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
  });

  it('hides the toolbar when showToolbar={false}', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} showToolbar={false} />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('renders the ProseMirror contenteditable region', () => {
    const { container } = render(
      <RichTextEditor value="<p>Hello world</p>" onChange={vi.fn()} />,
    );
    // TipTap always renders a [contenteditable] div via EditorContent.
    const editable = container.querySelector('[contenteditable]');
    expect(editable).toBeInTheDocument();
  });

  it('applies disabled styling when disabled prop is set', () => {
    const { container } = render(
      <RichTextEditor value="" onChange={vi.fn()} disabled />,
    );
    // When disabled the wrapper gets an opacity-60 Tailwind class.
    expect(container.querySelector('.sagtech-rte')).toHaveClass('opacity-60');
  });
});
