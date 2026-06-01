import type { Editor, Range } from '@tiptap/core';
import type { createLowlight } from 'lowlight';

// ---------------------------------------------------------------------------
// Shared primitive types
// ---------------------------------------------------------------------------

export interface MentionItem {
  id: string;
  label: string;
}

export interface SlashCommand {
  title: string;
  /** Optional icon label (text, emoji, or short symbol) shown next to the title. */
  icon?: string;
  /** Extra keywords for search matching beyond the title. */
  keywords?: string[];
  /** Called with the editor instance and the "/" trigger range to apply the command. */
  run: (editor: Editor, range: Range) => void;
}

// ---------------------------------------------------------------------------
// Factory option types
// ---------------------------------------------------------------------------

export interface CreateMentionOptions {
  /**
   * Sync array or async fetcher. Called with the current search query each
   * time the user types after "@". Return the items to display in the menu.
   */
  items: MentionItem[] | ((query: string) => MentionItem[] | Promise<MentionItem[]>);
  /** Trigger character. Defaults to "@". */
  char?: string;
  /**
   * Maximum items shown in the suggestion menu at once.
   * @default 8
   */
  maxItems?: number;
}

export interface CreateSlashCommandOptions {
  /**
   * Commands to expose. If omitted the exported `defaultSlashCommands` are used.
   */
  commands?: SlashCommand[];
  /** Trigger character. Defaults to "/". */
  char?: string;
  /**
   * Maximum items shown in the suggestion menu at once.
   * @default 10
   */
  maxItems?: number;
}

export interface CreateImageUploadOptions {
  /**
   * Upload handler. Receives the validated File and must return the final URL
   * string to insert as the image src. When omitted, a base64 data URL is
   * used instead (inline fallback via FileReader).
   */
  upload?: (file: File) => Promise<string>;
  /**
   * MIME-type accept pattern, same format as the HTML <input accept="…"> attr.
   * @default 'image/*'
   */
  accept?: string;
  /**
   * Maximum allowed file size in bytes. Files larger than this are rejected
   * before uploading. If omitted, no size limit is enforced.
   */
  maxSize?: number;
  /**
   * Called when validation or upload fails. If omitted, errors are logged to
   * console.error but never silently swallowed.
   */
  onError?: (err: Error) => void;
}

/** A lowlight instance as returned by `createLowlight(...)`. */
export type LowlightInstance = ReturnType<typeof createLowlight>;

export interface CreateSyntaxHighlightOptions {
  /**
   * Pre-built lowlight instance. When provided, `languages` is ignored. Lets
   * the consumer control bundle size (e.g. `createLowlight(common)` vs `all`,
   * or a hand-picked set of grammars registered individually).
   */
  lowlight?: LowlightInstance;
  /**
   * Language bundle to auto-create when `lowlight` is not supplied:
   * `'common'` (~37 grammars) or `'all'` (190+).
   * @default 'common'
   */
  languages?: 'common' | 'all';
  /**
   * Default language applied to code blocks that have no language set.
   * @default 'plaintext'
   */
  defaultLanguage?: string;
}
