import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';
import { createSuggestionRenderer } from './SuggestionMenu';
import type { CreateSlashCommandOptions, SlashCommand } from './types';

// ---------------------------------------------------------------------------
// Default slash commands — mirrors the existing Toolbar buttons
// ---------------------------------------------------------------------------

export const defaultSlashCommands: SlashCommand[] = [
  {
    title: 'Heading 2',
    icon: 'H2',
    keywords: ['h2', 'heading', 'title'],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    icon: 'H3',
    keywords: ['h3', 'heading', 'subtitle'],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    icon: '•',
    keywords: ['ul', 'bullet', 'list', 'unordered'],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: 'Ordered List',
    icon: '1.',
    keywords: ['ol', 'numbered', 'list', 'ordered'],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: 'Quote',
    icon: '❝',
    keywords: ['blockquote', 'quote', 'citation'],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: 'Code',
    icon: '<>',
    keywords: ['code', 'inline', 'monospace'],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleCode().run(),
  },
];

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * createSlashCommandExtension — factory that returns a configured TipTap
 * Extension wiring the "/" trigger to a command palette menu.
 *
 * @example
 * const ext = createSlashCommandExtension({ commands: defaultSlashCommands });
 * <RichTextEditor extensions={[ext]} ... />
 */
export function createSlashCommandExtension(opts: CreateSlashCommandOptions = {}) {
  const {
    commands = defaultSlashCommands,
    char = '/',
    maxItems = 10,
  } = opts;

  const resolveCommands = (query: string): SlashCommand[] => {
    if (!query) return commands.slice(0, maxItems);
    const q = query.toLowerCase();
    return commands
      .filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.toLowerCase().includes(q)),
      )
      .slice(0, maxItems);
  };

  // We store the current range so the onSelectItem callback can access it.
  // Each render() call creates a fresh closure so there's no cross-instance leak.

  const renderer = createSuggestionRenderer({
    onSelectItem(index, items) {
      // Handled via the command() callback below; this layer is unreachable
      // in production because SuggestionPortal calls `onSelect` which in turn
      // delegates to the TipTap suggestion `command`. Left as no-op guard.
      void index;
      void items;
    },
  });

  return Extension.create({
    name: 'slashCommand',

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          char,
          items: ({ query }: { query: string }) => resolveCommands(query),
          command({
            editor,
            range,
            props,
          }: {
            editor: Parameters<typeof defaultSlashCommands[0]['run']>[0];
            range: Parameters<typeof defaultSlashCommands[0]['run']>[1];
            props: SlashCommand;
          }) {
            props.run(editor, range);
          },
          render() {
            const inner = renderer();

            return {
              onStart(props: SuggestionProps<SlashCommand>) {
                inner.onStart({
                  items: props.items,
                  clientRect: props.clientRect,
                  editor: props.editor,
                  command: (item) => props.command(item as SlashCommand),
                });
              },
              onUpdate(props: SuggestionProps<SlashCommand>) {
                inner.onUpdate({
                  items: props.items,
                  clientRect: props.clientRect,
                  command: (item) => props.command(item as SlashCommand),
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
        }),
      ];
    },
  });
}
