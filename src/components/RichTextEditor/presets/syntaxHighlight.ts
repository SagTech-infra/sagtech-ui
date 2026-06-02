import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, common, createLowlight } from 'lowlight';
import type { CreateSyntaxHighlightOptions, LowlightInstance } from './types';

// ---------------------------------------------------------------------------
// lowlight resolution helper (exported for unit-testing)
// ---------------------------------------------------------------------------

/**
 * resolveLowlight — return the lowlight instance the extension should use.
 *
 * When `opts.lowlight` is provided it is returned as-is (the consumer owns the
 * grammar set and therefore the bundle cost). Otherwise a fresh instance is
 * created from the `'common'` (~37 grammars) or `'all'` (190+) bundle.
 */
export function resolveLowlight(
  opts: CreateSyntaxHighlightOptions = {},
): LowlightInstance {
  if (opts.lowlight) return opts.lowlight;
  return createLowlight(opts.languages === 'all' ? all : common);
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * createSyntaxHighlightExtension — a configured `CodeBlockLowlight` node that
 * renders syntax-highlighted code blocks via lowlight (highlight.js).
 *
 * **Required pairing:** `CodeBlockLowlight` registers a `codeBlock` node, and
 * so does `StarterKit`. Leaving both enabled triggers a tiptap "Duplicate
 * extension names" warning and lets one node win non-deterministically, so you
 * MUST disable StarterKit's built-in code block when using this preset:
 *
 * @example
 * const ext = createSyntaxHighlightExtension({ languages: 'common' });
 * <RichTextEditor
 *   extensions={[ext]}
 *   starterKitOptions={{ codeBlock: false }}
 *   value={value}
 *   onChange={setValue}
 * />
 *
 * The `.hljs-*` token classes are themed via `@sagtech-infra/ui/tokens`
 * (`src/tokens/hljs.css`), scoped under `.sagtech-code-block`.
 */
export function createSyntaxHighlightExtension(
  opts: CreateSyntaxHighlightOptions = {},
) {
  const { defaultLanguage = 'plaintext' } = opts;

  return CodeBlockLowlight.configure({
    lowlight: resolveLowlight(opts),
    defaultLanguage,
    HTMLAttributes: { class: 'sagtech-code-block' },
  });
}
