'use client';

import { useEditor, EditorContent, type Extensions, type Editor } from '@tiptap/react';
import StarterKit, { type StarterKitOptions } from '@tiptap/starter-kit';
import classNames from 'classnames';
import { useEffect } from 'react';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Extra TipTap extensions appended to StarterKit. */
  extensions?: Extensions;
  /**
   * Options passed to `StarterKit.configure(...)`. Use this to disable a
   * built-in node when replacing it via `extensions` — e.g. pair the
   * `createSyntaxHighlightExtension()` preset with `{ codeBlock: false }` to
   * avoid a duplicate `codeBlock` node. Defaults to `{}` (full StarterKit).
   */
  starterKitOptions?: Partial<StarterKitOptions>;
  /** Show the minimal formatting toolbar. Defaults to true. */
  showToolbar?: boolean;
  className?: string;
  minHeight?: number | string;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  label,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'w-[28px] h-[28px] flex items-center justify-center rounded-8px font-manrope text-14 transition-colors cursor-pointer',
        {
          'bg-pr_purple text-white': isActive,
          'text-grey_4 hover:text-white_4 hover:bg-black_3': !isActive && !disabled,
          'opacity-40 cursor-not-allowed': disabled,
        },
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;
  const can = editor.can();
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex items-center gap-4px border-b border-solid border-black_3 px-8px py-6px"
    >
      <ToolbarButton
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        disabled={!can.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        disabled={!can.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        label="Strike"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
      >
        <s>S</s>
      </ToolbarButton>
      <div aria-hidden="true" className="mx-4px h-[18px] w-px bg-black_3" />
      <ToolbarButton
        label="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        •
      </ToolbarButton>
      <ToolbarButton
        label="Ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        ❝
      </ToolbarButton>
      <ToolbarButton
        label="Code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
      >
        {'<>'}
      </ToolbarButton>
      <div aria-hidden="true" className="mx-4px h-[18px] w-px bg-black_3" />
      <ToolbarButton
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!can.chain().focus().undo().run()}
      >
        ↶
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!can.chain().focus().redo().run()}
      >
        ↷
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled,
  extensions = [],
  starterKitOptions = {},
  showToolbar = true,
  className,
  minHeight = 160,
}: RichTextEditorProps) {
  const editor = useEditor({
    // Tiptap v3 throws an SSR warning when it renders synchronously during
    // server-side rendering. Defer the first render to the client.
    immediatelyRender: false,
    extensions: [StarterKit.configure(starterKitOptions), ...extensions],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'sagtech-rte-content prose prose-invert max-w-none focus:outline-none p-12px font-manrope text-14 text-white_4',
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  return (
    <div
      className={classNames(
        'sagtech-rte bg-black_1 border border-solid border-pr_purple rounded-16px overflow-hidden',
        disabled && 'opacity-60',
        className,
      )}
    >
      <style>{`
        .sagtech-rte-content { min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight}; }
        .sagtech-rte-content p { margin: 0 0 8px 0; }
        .sagtech-rte-content p:empty::before { content: '${placeholder ?? ''}'; color: #83838A; pointer-events: none; }
        .sagtech-rte-content h2 { font-size: 20px; font-weight: 700; margin: 12px 0 8px; color: #F8F8F8; }
        .sagtech-rte-content h3 { font-size: 16px; font-weight: 700; margin: 10px 0 6px; color: #F8F8F8; }
        .sagtech-rte-content ul, .sagtech-rte-content ol { padding-left: 20px; margin: 4px 0; }
        .sagtech-rte-content ul { list-style: disc; }
        .sagtech-rte-content ol { list-style: decimal; }
        .sagtech-rte-content blockquote { border-left: 3px solid #6D3EF1; padding-left: 12px; color: #B5B5B9; margin: 8px 0; }
        .sagtech-rte-content code { background: #20202D; padding: 1px 6px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 13px; color: #B69FF8; }
        .sagtech-rte-content strong { font-weight: 700; }
      `}</style>
      {showToolbar && editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
