import { createContext } from 'react';

/**
 * @deprecated Use Toast instead — see docs/COMPONENT_PICKER.md.
 *
 * Scheduled for removal in v2.0.
 */
export interface NotificationContextProps {
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

/**
 * @deprecated Use Toast instead — see docs/COMPONENT_PICKER.md.
 *
 * Scheduled for removal in v2.0.
 */
export const NotificationContext = createContext<NotificationContextProps>({
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

export { NotificationContextProvider } from './NotificationContextProvider';
