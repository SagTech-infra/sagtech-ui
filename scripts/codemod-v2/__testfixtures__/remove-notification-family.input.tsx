import {
  Notification,
  NotificationContext,
  NotificationContextProvider,
  NotificationWrapper,
  NotificationCenter,
} from '@sagtech-infra/ui';
import { useContext } from 'react';

export function App() {
  // Removed: reads the deprecated context
  const ctx = useContext(NotificationContext);

  return (
    <NotificationContextProvider>
      {/* Kept: NotificationCenter is a separate, non-deprecated component */}
      <NotificationCenter items={[]} />
      <NotificationWrapper>
        <Notification message={ctx?.message ?? 'hi'} />
      </NotificationWrapper>
    </NotificationContextProvider>
  );
}
