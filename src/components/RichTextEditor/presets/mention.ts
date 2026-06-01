import Mention from '@tiptap/extension-mention';
import type { MentionOptions } from '@tiptap/extension-mention';
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';
import { createSuggestionRenderer } from './SuggestionMenu';
import type { CreateMentionOptions, MentionItem } from './types';

/**
 * createMentionExtension — factory that returns a configured TipTap Mention
 * extension ready to be passed to <RichTextEditor extensions={[...]} />.
 *
 * @example
 * const ext = createMentionExtension({
 *   items: [{ id: '1', label: 'Alice' }, { id: '2', label: 'Bob' }],
 * });
 * <RichTextEditor extensions={[ext]} ... />
 */
export function createMentionExtension(opts: CreateMentionOptions) {
  const { items, char = '@', maxItems = 8 } = opts;

  const resolveItems = async (query: string): Promise<MentionItem[]> => {
    const raw = typeof items === 'function' ? await items(query) : items;
    const q = query.toLowerCase();
    const filtered = query
      ? raw.filter((i) => i.label.toLowerCase().includes(q))
      : raw;
    return filtered.slice(0, maxItems);
  };

  const renderer = createSuggestionRenderer({
    onSelectItem(index, allItems) {
      // The actual command dispatch is handled inside the suggestion `command`
      // callback; here the menu is simply closed via renderer.destroy() already
      // called in createSuggestionRenderer. Nothing else to do at this layer.
      void index;
      void allItems;
    },
  });

  return Mention.configure({
    HTMLAttributes: { class: 'sagtech-mention' },
    suggestion: {
      char,
      items: async ({ query }: { query: string }) => resolveItems(query),
      command({ editor, range, props }: {
        editor: Parameters<NonNullable<MentionOptions['suggestion']['command']>>[0]['editor'];
        range: Parameters<NonNullable<MentionOptions['suggestion']['command']>>[0]['range'];
        props: MentionItem;
      }) {
        editor
          .chain()
          .focus()
          .insertContentAt(range, [
            {
              type: 'mention',
              attrs: { id: props.id, label: props.label },
            },
            { type: 'text', text: ' ' },
          ])
          .run();
      },
      render() {
        const inner = renderer();

        return {
          onStart(props: SuggestionProps<MentionItem>) {
            inner.onStart({
              items: props.items,
              clientRect: props.clientRect,
              editor: props.editor,
            });
          },
          onUpdate(props: SuggestionProps<MentionItem>) {
            inner.onUpdate({
              items: props.items,
              clientRect: props.clientRect,
            });
          },
          onKeyDown(props: SuggestionKeyDownProps): boolean {
            return inner.onKeyDown({ event: props.event });
          },
          onExit() {
            inner.onExit();
          },
        };
      },
    },
  } as Parameters<typeof Mention.configure>[0]);
}
