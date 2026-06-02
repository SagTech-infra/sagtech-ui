import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { getSchema } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { createLowlight, common } from 'lowlight';
import RichTextEditor from '../../RichTextEditor';
import {
  createSyntaxHighlightExtension,
  resolveLowlight,
} from '../../presets/syntaxHighlight';

// ---------------------------------------------------------------------------
// NOTE ON INTEGRATION LIMITS
// ---------------------------------------------------------------------------
// lowlight emits `.hljs-*` token spans only when ProseMirror actually renders a
// code-block node's decorations in a real layout engine. happy-dom has no such
// engine, so the visual highlight output (the `.hljs-keyword` spans, the themed
// colors) is verified in Storybook + manual QA, not here.
//
// Coverage strategy:
//   1. resolveLowlight — pure, fully unit-tested (bundle selection + identity).
//   2. Extension shape — name/options asserted directly.
//   3. Schema collision — the load-bearing gotcha (StarterKit also registers a
//      `codeBlock` node) is verified deterministically via getSchema().
//   4. Mount smoke — the documented `starterKitOptions={{ codeBlock: false }}`
//      pairing mounts without crashing.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. resolveLowlight — bundle selection + injectable instance
// ---------------------------------------------------------------------------

describe('resolveLowlight', () => {
  it("defaults to the 'common' bundle (~37 grammars incl. javascript)", () => {
    const lw = resolveLowlight();
    expect(lw.listLanguages().length).toBeGreaterThanOrEqual(30);
    expect(lw.registered('javascript')).toBe(true);
    expect(lw.registered('css')).toBe(true);
  });

  it("registers far more grammars for languages: 'all'", () => {
    const common37 = resolveLowlight({ languages: 'common' }).listLanguages().length;
    const all = resolveLowlight({ languages: 'all' }).listLanguages().length;
    expect(all).toBeGreaterThan(100);
    expect(all).toBeGreaterThan(common37);
  });

  it('returns the exact passed instance and ignores languages', () => {
    const custom = createLowlight(common);
    const resolved = resolveLowlight({ lowlight: custom, languages: 'all' });
    expect(resolved).toBe(custom);
  });

  it('produces a working highlighter (emits hast children)', () => {
    const lw = resolveLowlight();
    const tree = lw.highlight('javascript', 'const x = 1;');
    expect(tree.children.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 2. Extension shape
// ---------------------------------------------------------------------------

describe('createSyntaxHighlightExtension', () => {
  it("registers the 'codeBlock' node", () => {
    expect(createSyntaxHighlightExtension().name).toBe('codeBlock');
  });

  it('wires the resolved lowlight instance into options', () => {
    const ext = createSyntaxHighlightExtension();
    expect(ext.options.lowlight).toBeDefined();
    expect(typeof ext.options.lowlight.highlight).toBe('function');
  });

  it("defaults defaultLanguage to 'plaintext' and respects an override", () => {
    expect(createSyntaxHighlightExtension().options.defaultLanguage).toBe('plaintext');
    expect(
      createSyntaxHighlightExtension({ defaultLanguage: 'typescript' }).options
        .defaultLanguage,
    ).toBe('typescript');
  });

  it('applies the sagtech-code-block themed class', () => {
    const ext = createSyntaxHighlightExtension();
    expect(ext.options.HTMLAttributes.class).toBe('sagtech-code-block');
  });
});

// ---------------------------------------------------------------------------
// 3. Schema collision — why starterKitOptions={{ codeBlock: false }} is required
// ---------------------------------------------------------------------------
//
// tiptap v3 does NOT throw on a duplicate node name — it logs a
// "Duplicate extension names" warning and one extension silently wins (which is
// non-deterministic). Disabling StarterKit's codeBlock makes the lowlight node
// the unambiguous winner and removes the warning.

describe('StarterKit codeBlock collision', () => {
  it('builds a clean schema (no duplicate warning) when StarterKit codeBlock is disabled', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const ext = createSyntaxHighlightExtension();
    const schema = getSchema([StarterKit.configure({ codeBlock: false }), ext]);
    expect(schema.nodes.codeBlock).toBeDefined();
    expect(
      warn.mock.calls.some((c) => String(c[0]).includes('Duplicate extension names')),
    ).toBe(false);
    warn.mockRestore();
  });

  it('warns about a duplicate codeBlock when StarterKit codeBlock is left enabled', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const ext = createSyntaxHighlightExtension();
    getSchema([StarterKit, ext]);
    // Tolerant of tiptap's exact wording — match either term, case-insensitive.
    expect(
      warn.mock.calls.some((c) => /duplicate|codeblock/i.test(String(c[0]))),
    ).toBe(true);
    warn.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 4. Mount smoke — the documented pairing mounts without crashing
// ---------------------------------------------------------------------------

describe('createSyntaxHighlightExtension — mount', () => {
  it('mounts with the codeBlock:false pairing and renders the editor', () => {
    const ext = createSyntaxHighlightExtension();
    const { container } = render(
      <RichTextEditor
        value={'<pre><code class="language-js">const x = 1;</code></pre>'}
        onChange={vi.fn()}
        extensions={[ext]}
        starterKitOptions={{ codeBlock: false }}
      />,
    );
    expect(container.querySelector('.sagtech-rte')).toBeInTheDocument();
    expect(container.querySelector('[contenteditable]')).toBeInTheDocument();
  });

  it("mounts with languages: 'all' without crashing", () => {
    const ext = createSyntaxHighlightExtension({ languages: 'all' });
    const { container } = render(
      <RichTextEditor
        value=""
        onChange={vi.fn()}
        extensions={[ext]}
        starterKitOptions={{ codeBlock: false }}
      />,
    );
    expect(container.querySelector('.sagtech-rte')).toBeInTheDocument();
  });
});
