'use client';

import { Button, useTheme } from '@sagtech-infra/ui';

/** Dark/light switch — exercises the library's ThemeProvider (and the otherwise
    rarely-used light theme) right in the docs chrome. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      variant="secondary"
      buttonSize="small"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
    >
      {resolvedTheme === 'dark' ? '☀ Light' : '☾ Dark'}
    </Button>
  );
}
