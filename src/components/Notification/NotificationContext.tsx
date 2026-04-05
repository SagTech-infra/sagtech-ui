'use client';

import { createContext, useState, useMemo, type ReactNode } from 'react';

interface ContextProps {
  isOpen: boolean;
  toggle: (value: boolean) => void;
  title: string;
  getTitle: (value: string) => void;
  text: string;
  getText: (value: string) => void;
  color: string;
  getColor: (value: string) => void;
  state: 'success' | 'error';
  getState: (value: string) => void;
}

interface ProviderProps {
  children: ReactNode;
}

export const NotificationContext = createContext<ContextProps>({
  isOpen: false,
  toggle: () => {},
  title: '',
  getTitle: () => {},
  text: '',
  getText: () => {},
  color: '',
  getColor: () => {},
  state: 'success',
  getState: () => {},
});

export function NotificationContextProvider({ children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState('');
  const [state, setState] = useState('success' as 'success' | 'error');

  const contextValue = useMemo(
    () => ({
      isOpen,
      toggle: (value: boolean) => setIsOpen(value),
      title,
      getTitle: (value: string) => setTitle(value),
      text,
      getText: (value: string) => setText(value),
      color,
      getColor: (value: string) => setColor(value),
      state,
      getState: (value: string) => setState(value as 'success' | 'error'),
    }),
    [color, isOpen, state, text, title],
  );

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
}
