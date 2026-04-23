'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import CommandPalette, { type CommandItem } from './CommandPalette';

interface CommandPaletteContextValue {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
  register: (commands: CommandItem[]) => () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export interface CommandPaletteProviderProps {
  children: ReactNode;
  /** Additional commands always available (outside of `useRegisterCommand`). */
  baseCommands?: CommandItem[];
  /**
   * Hotkey combination. Default: `cmd+k` on mac / `ctrl+k` elsewhere.
   * Set to `null` to disable the global shortcut.
   */
  hotkey?: string | null;
  placeholder?: string;
}

function isMac() {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
}

function matchesHotkey(event: KeyboardEvent, hotkey: string): boolean {
  const parts = hotkey.toLowerCase().split('+').map((p) => p.trim());
  const needCtrl = parts.includes('ctrl');
  const needMeta = parts.includes('cmd') || parts.includes('meta');
  const needShift = parts.includes('shift');
  const needAlt = parts.includes('alt');
  const key = parts.filter(
    (p) => !['ctrl', 'cmd', 'meta', 'shift', 'alt'].includes(p),
  )[0];
  if (!key) return false;
  if (needCtrl && !event.ctrlKey) return false;
  if (needMeta && !event.metaKey) return false;
  if (needShift && !event.shiftKey) return false;
  if (needAlt && !event.altKey) return false;
  return event.key.toLowerCase() === key;
}

export function CommandPaletteProvider({
  children,
  baseCommands = [],
  hotkey: hotkeyProp,
  placeholder,
}: CommandPaletteProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const registryRef = useRef<Map<number, CommandItem[]>>(new Map());
  const nextIdRef = useRef(0);
  const [registryTick, setRegistryTick] = useState(0);

  const hotkey =
    hotkeyProp === null
      ? null
      : (hotkeyProp ?? (isMac() ? 'cmd+k' : 'ctrl+k'));

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const register = useCallback((commands: CommandItem[]) => {
    const id = nextIdRef.current++;
    registryRef.current.set(id, commands);
    setRegistryTick((t) => t + 1);
    return () => {
      registryRef.current.delete(id);
      setRegistryTick((t) => t + 1);
    };
  }, []);

  useEffect(() => {
    if (!hotkey) return;
    const handler = (event: KeyboardEvent) => {
      if (matchesHotkey(event, hotkey)) {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [hotkey, toggle]);

  const allCommands = useMemo(() => {
    void registryTick; // re-compute when registry changes
    const registered: CommandItem[] = [];
    registryRef.current.forEach((list) => registered.push(...list));
    return [...baseCommands, ...registered];
  }, [baseCommands, registryTick]);

  const value = useMemo<CommandPaletteContextValue>(
    () => ({ open, close, toggle, isOpen, register }),
    [open, close, toggle, isOpen, register],
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette
        isOpen={isOpen}
        onClose={close}
        items={allCommands}
        placeholder={placeholder}
      />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      'useCommandPalette() must be used inside <CommandPaletteProvider>.',
    );
  }
  return ctx;
}

/**
 * Register a list of commands from within a component tree. Commands are
 * automatically unregistered when the component unmounts.
 *
 * The `commands` array is stable by reference inside React — wrap in useMemo
 * upstream if values change across renders.
 */
export function useRegisterCommand(commands: CommandItem[] | null | undefined) {
  const ctx = useContext(CommandPaletteContext);
  useEffect(() => {
    if (!ctx || !commands || commands.length === 0) return;
    const unregister = ctx.register(commands);
    return unregister;
  }, [ctx, commands]);
}
