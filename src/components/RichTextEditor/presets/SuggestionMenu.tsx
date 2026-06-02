'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle, useReducer } from 'react';
import { createPortal } from 'react-dom';
import { ReactRenderer } from '@tiptap/react';
import classNames from 'classnames';
import type { MentionItem, SlashCommand } from './types';

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

export interface SuggestionMenuProps {
  items: (MentionItem | SlashCommand)[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  dir?: 'ltr' | 'rtl';
}

// ---------------------------------------------------------------------------
// SuggestionMenu — the visual list rendered inside a portal
// ---------------------------------------------------------------------------

export const SuggestionMenu = forwardRef<HTMLDivElement, SuggestionMenuProps>(
  function SuggestionMenu({ items, selectedIndex, onSelect, dir = 'ltr' }, ref) {
    if (items.length === 0) return null;

    return (
      <div
        ref={ref}
        dir={dir}
        role="listbox"
        aria-label="Suggestions"
        className={classNames(
          'fixed z-[2000] min-w-[180px] max-w-[260px] overflow-hidden',
          'rounded-8px border border-solid border-border-default',
          'bg-bg-secondary shadow-lg py-4px',
        )}
      >
        {items.map((item, index) => {
          const label = 'label' in item ? item.label : item.title;
          const icon = 'icon' in item ? item.icon : undefined;
          const isSelected = index === selectedIndex;
          return (
            <div
              key={'id' in item ? item.id : item.title}
              role="option"
              aria-selected={isSelected}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(index);
              }}
              className={classNames(
                'flex items-center gap-8px px-12px py-6px cursor-pointer select-none',
                'font-manrope text-14 transition-colors',
                isSelected
                  ? 'bg-pr_purple text-white'
                  : 'text-fg-primary hover:bg-black_3',
              )}
            >
              {icon && (
                <span
                  aria-hidden="true"
                  className={classNames(
                    'shrink-0 w-[20px] text-center',
                    isSelected ? 'text-white' : 'text-fg-muted',
                  )}
                >
                  {icon}
                </span>
              )}
              <span className="truncate">{label}</span>
            </div>
          );
        })}
      </div>
    );
  },
);

// ---------------------------------------------------------------------------
// Imperative handle exposed to the suggestion renderer
// ---------------------------------------------------------------------------

export interface SuggestionMenuHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

// ---------------------------------------------------------------------------
// Portal wrapper: positions the menu relative to a caret rect and wires
// keyboard control entirely from within (selectedIndex state lives here).
// ---------------------------------------------------------------------------

export interface SuggestionPortalProps {
  items: (MentionItem | SlashCommand)[];
  onSelect: (index: number) => void;
  /** getBoundingClientRect of the trigger character returned by TipTap suggestion. */
  clientRect: (() => DOMRect | null) | null;
  dir?: 'ltr' | 'rtl';
}

export interface SuggestionPortalHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const SuggestionPortal = forwardRef<SuggestionPortalHandle, SuggestionPortalProps>(
  function SuggestionPortal({ items, onSelect, clientRect, dir = 'ltr' }, ref) {
    const menuRef = useRef<HTMLDivElement>(null);
    // selectedIndex lives in a ref so onKeyDown reads it synchronously without a
    // stale closure; forceUpdate (a real useReducer dispatch) re-renders so the
    // SuggestionMenu reflects the new selection. The previous renderRef/countRef
    // trick never wired up a setState, so the highlight stayed frozen on item 0.
    const selectedRef = useRef(0);
    const [, forceUpdate] = useReducer((n: number) => n + 1, 0);

    // Keep a stable ref to items for keyboard handler
    const itemsRef = useRef(items);
    itemsRef.current = items;

    // Reset selectedIndex when items change
    useEffect(() => {
      selectedRef.current = 0;
    }, [items]);

    // Position the menu div relative to the caret
    useEffect(() => {
      const el = menuRef.current;
      if (!el || !clientRect) return;
      const rect = clientRect();
      if (!rect) return;

      const GAP = 4;
      const MENU_HEIGHT = el.offsetHeight || 240;
      const viewportH = window.innerHeight;

      const top =
        rect.bottom + GAP + MENU_HEIGHT > viewportH
          ? rect.top - MENU_HEIGHT - GAP
          : rect.bottom + GAP;

      el.style.top = `${top}px`;
      el.style.left = `${rect.left}px`;
    }, [clientRect, items]);

    useImperativeHandle(ref, () => ({
      onKeyDown(event: KeyboardEvent): boolean {
        const len = itemsRef.current.length;
        if (len === 0) return false;

        if (event.key === 'ArrowDown') {
          selectedRef.current = (selectedRef.current + 1) % len;
          forceUpdate();
          return true;
        }
        if (event.key === 'ArrowUp') {
          selectedRef.current = (selectedRef.current - 1 + len) % len;
          forceUpdate();
          return true;
        }
        if (event.key === 'Enter') {
          onSelect(selectedRef.current);
          return true;
        }
        if (event.key === 'Escape') {
          return false; // let TipTap close the suggestion
        }
        return false;
      },
    }));

    if (items.length === 0) return null;

    return createPortal(
      <SuggestionMenu
        ref={menuRef}
        items={items}
        selectedIndex={selectedRef.current}
        onSelect={onSelect}
        dir={dir}
      />,
      document.body,
    );
  },
);

// ---------------------------------------------------------------------------
// createSuggestionRenderer — bridges TipTap's suggestion render() lifecycle
// to a ReactRenderer-mounted SuggestionPortal.
// ---------------------------------------------------------------------------

export interface SuggestionRendererCallbacks {
  onSelectItem: (index: number, items: (MentionItem | SlashCommand)[]) => void;
  dir?: 'ltr' | 'rtl';
  maxItems?: number;
}

/**
 * Returns a TipTap-compatible `render()` function (as used in Suggestion({ render })).
 * Handles onStart / onUpdate / onKeyDown / onExit lifecycle.
 */
export function createSuggestionRenderer(callbacks: SuggestionRendererCallbacks) {
  return () => {
    // ReactRenderer instance for the mounted SuggestionPortal (typed loosely —
    // its generic signature varies across TipTap versions).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rendererInstance: any = null;
    let portalHandle: SuggestionPortalHandle | null = null;
    // The TipTap suggestion `command` (range-aware item dispatch) and the live
    // item list are held in the closure so the portal's onSelect can actually
    // commit the chosen item. Selecting MUST call `command(item)` — without it
    // the trigger text stays a "suggestion" decoration and nothing is inserted.
    let currentItems: (MentionItem | SlashCommand)[] = [];
    let currentCommand: ((item: MentionItem | SlashCommand) => void) | null = null;

    const handleSelect = (index: number) => {
      const item = currentItems[index];
      if (item) currentCommand?.(item);
      callbacks.onSelectItem(index, currentItems);
      rendererInstance?.destroy();
      rendererInstance = null;
      portalHandle = null;
    };

    return {
      onStart(props: {
        items: (MentionItem | SlashCommand)[];
        clientRect?: (() => DOMRect | null) | null;
        editor: unknown;
        command?: (item: MentionItem | SlashCommand) => void;
      }) {
        currentItems = props.items;
        currentCommand = props.command ?? null;

        // Mount synchronously. @tiptap/react is a required peer that is already
        // statically imported by RichTextEditor itself, so a dynamic import here
        // bought nothing (same chunk) and opened a race: a keypress arriving
        // before the promise resolved found portalHandle === null and fell
        // through to TipTap's default Enter handling instead of selecting.
        rendererInstance = new ReactRenderer(SuggestionPortal, {
          // @ts-expect-error — editor type varies across TipTap versions
          editor: props.editor,
          props: {
            items: props.items,
            clientRect: props.clientRect ?? null,
            dir: callbacks.dir ?? 'ltr',
            ref: (h: SuggestionPortalHandle | null) => {
              portalHandle = h;
            },
            onSelect: handleSelect,
          },
        });
      },

      onUpdate(props: {
        items: (MentionItem | SlashCommand)[];
        clientRect?: (() => DOMRect | null) | null;
        command?: (item: MentionItem | SlashCommand) => void;
      }) {
        currentItems = props.items;
        if (props.command) currentCommand = props.command;
        if (!rendererInstance) return;
        rendererInstance.updateProps({
          items: props.items,
          clientRect: props.clientRect ?? null,
        });
      },

      onKeyDown({ event }: { event: KeyboardEvent }): boolean {
        if (!portalHandle) return false;
        return portalHandle.onKeyDown(event);
      },

      onExit() {
        rendererInstance?.destroy();
        rendererInstance = null;
        portalHandle = null;
      },
    };
  };
}
