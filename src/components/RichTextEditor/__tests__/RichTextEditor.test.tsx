import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Extension } from '@tiptap/core';
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

describe('RichTextEditor — controlled value & state', () => {
  it('does not loop on mount (onChange fires at most once)', () => {
    const onChange = vi.fn();
    render(<RichTextEditor value="<p>seed</p>" onChange={onChange} />);
    // A controlled editor with immediatelyRender:false echoes its initial
    // content via onChange at most once after the deferred mount. The guard
    // here is the absence of an onChange→setState→onChange feedback loop.
    expect(onChange.mock.calls.length).toBeLessThanOrEqual(1);
  });

  it('reflects an external value update in the contenteditable', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <RichTextEditor value="<p>alpha</p>" onChange={onChange} />,
    );
    expect(container.querySelector('[contenteditable]')?.textContent).toContain('alpha');
    rerender(<RichTextEditor value="<p>bravo</p>" onChange={onChange} />);
    expect(container.querySelector('[contenteditable]')?.textContent).toContain('bravo');
  });

  it('renders the provided initial value into the contenteditable', () => {
    const { container } = render(
      <RichTextEditor value="<p>Hello world</p>" onChange={vi.fn()} />,
    );
    expect(container.querySelector('[contenteditable]')?.textContent).toContain('Hello world');
  });

  it('marks the contenteditable non-editable when disabled', () => {
    const { container } = render(
      <RichTextEditor value="<p>x</p>" onChange={vi.fn()} disabled />,
    );
    expect(container.querySelector('[contenteditable="false"]')).toBeInTheDocument();
  });

  it('toggles editability when the disabled prop changes', () => {
    const { container, rerender } = render(
      <RichTextEditor value="<p>x</p>" onChange={vi.fn()} disabled />,
    );
    expect(container.querySelector('[contenteditable="false"]')).toBeInTheDocument();
    rerender(<RichTextEditor value="<p>x</p>" onChange={vi.fn()} />);
    expect(container.querySelector('[contenteditable="true"]')).toBeInTheDocument();
  });

  it('appends custom extensions to StarterKit without crashing', () => {
    const custom = Extension.create({ name: 'sagtech-test-ext' });
    const { container } = render(
      <RichTextEditor value="" onChange={vi.fn()} extensions={[custom]} />,
    );
    expect(container.querySelector('.sagtech-rte')).toBeInTheDocument();
    expect(container.querySelector('[contenteditable]')).toBeInTheDocument();
  });

  it('emits onChange when a doc-changing toolbar command runs', () => {
    const onChange = vi.fn();
    render(<RichTextEditor value="<p>text</p>" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Heading 2' }));
    // Converting the paragraph to a heading changes the document → onUpdate → onChange.
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0]).toContain('<h2');
  });

  it('injects the placeholder text into the content style block', () => {
    const { container } = render(
      <RichTextEditor value="" onChange={vi.fn()} placeholder="Type here" />,
    );
    // happy-dom cannot evaluate ::before content, so we assert the injected CSS.
    expect(container.querySelector('style')?.textContent).toContain("content: 'Type here'");
  });

  it('applies a numeric and string minHeight to the content style block', () => {
    const { container: c1 } = render(
      <RichTextEditor value="" onChange={vi.fn()} minHeight={240} />,
    );
    expect(c1.querySelector('style')?.textContent).toContain('min-height: 240px');

    const { container: c2 } = render(
      <RichTextEditor value="" onChange={vi.fn()} minHeight="50vh" />,
    );
    expect(c2.querySelector('style')?.textContent).toContain('min-height: 50vh');
  });
});
