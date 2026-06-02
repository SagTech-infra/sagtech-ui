export { createMentionExtension } from './mention';
export { createSlashCommandExtension, defaultSlashCommands } from './slashCommand';
export { createImageUploadExtension, validateImageFile } from './imageUpload';
// resolveLowlight stays module-local (used internally + in unit tests); it is
// intentionally NOT part of the public API surface.
export { createSyntaxHighlightExtension } from './syntaxHighlight';
export { SuggestionMenu, SuggestionPortal, createSuggestionRenderer } from './SuggestionMenu';
export type {
  SuggestionMenuProps,
  SuggestionPortalProps,
  SuggestionPortalHandle,
  SuggestionMenuHandle,
} from './SuggestionMenu';
export type {
  MentionItem,
  SlashCommand,
  CreateMentionOptions,
  CreateSlashCommandOptions,
  CreateImageUploadOptions,
  CreateSyntaxHighlightOptions,
  LowlightInstance,
} from './types';
