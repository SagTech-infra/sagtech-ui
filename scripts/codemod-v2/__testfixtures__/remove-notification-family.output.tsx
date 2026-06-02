/*
 * codemod-v2: Notification family removed.
 * Manual migration needed — replace Notification, NotificationContext, NotificationContextProvider, NotificationWrapper with Toast:
 *   mount <Toaster /> once at the app root, then call toast.success(msg) /
 *   toast.error(msg) instead of the Notification provider + context.
 * See docs/MIGRATION.md (v1.9 → v2.0).
 */
import { NotificationCenter } from '@sagtech-infra/ui';
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
