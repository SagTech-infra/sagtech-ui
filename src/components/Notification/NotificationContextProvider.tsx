'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { NotificationContext } from './NotificationContext';

interface ProviderProps {
  children: ReactNode;
}

export function NotificationContextProvider({ children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState('');
  const [state, setState] = useState<'success' | 'error'>('success');

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
