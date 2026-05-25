import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './ThemeContext';
import type { Theme } from './ThemeContext';

const meta = {
  title: 'Providers/ThemeProvider',
  component: ThemeProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`ThemeProvider` manages a `dark | light | system` theme, writes `data-theme` to the target element, and persists the choice to localStorage. ' +
          'Consume it via `useTheme()` → `{ theme, resolvedTheme, setTheme }`. ' +
          'The Storybook toolbar also sets `data-theme` globally; this story demos the provider API in isolation using its own scoped surface.',
      },
    },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── helpers ──────────────────────────────────────────────────────────────────

const THEMES: Theme[] = ['dark', 'light', 'system'];

const pill = (label: string, active: boolean, onClick: () => void) => (
  <button
    key={label}
    onClick={onClick}
    style={{
      padding: '6px 14px',
      borderRadius: 20,
      border: '1px solid',
      borderColor: active ? '#6D3EF1' : '#444',
      background: active ? '#6D3EF1' : 'transparent',
      color: active ? '#fff' : '#aaa',
      cursor: 'pointer',
      fontSize: 13,
      fontFamily: 'monospace',
    }}
  >
    {label}
  </button>
);

// A consumer that reads from ThemeContext and renders a themed surface.
function ThemeConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const surfaceBg = resolvedTheme === 'dark' ? '#0d0d24' : '#f0f0f8';
  const textColor = resolvedTheme === 'dark' ? '#e0e0ff' : '#111';
  const borderColor = resolvedTheme === 'dark' ? '#2a2a50' : '#ccc';

  return (
    <div
      style={{
        background: surfaceBg,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        color: textColor,
        fontFamily: 'monospace',
        fontSize: 13,
        minWidth: 320,
        transition: 'background 0.25s, color 0.25s',
      }}
    >
      <div>
        <strong>theme:</strong> <code>{theme}</code>
      </div>
      <div>
        <strong>resolvedTheme:</strong> <code>{resolvedTheme}</code>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {THEMES.map((t) => pill(t, theme === t, () => setTheme(t)))}
      </div>
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: resolvedTheme === 'dark' ? '#1a1a3a' : '#ffffff',
          border: `1px solid ${borderColor}`,
        }}
      >
        Themed surface — resolves to <strong>{resolvedTheme}</strong>
      </div>
    </div>
  );
}

// ─── stories ──────────────────────────────────────────────────────────────────

export const Uncontrolled: Story = {
  name: 'Uncontrolled (localStorage persisted)',
  render: () => (
    <ThemeProvider defaultTheme="dark" storageKey="story-theme-uncontrolled">
      <ThemeConsumer />
    </ThemeProvider>
  ),
};

export const Controlled: Story = {
  name: 'Controlled (external state)',
  render: () => {
    function Demo() {
      const [theme, setTheme] = useState<Theme>('dark');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}>
            External state: <strong>{theme}</strong> — changes here drive the provider.
          </div>
          <ThemeProvider theme={theme} onThemeChange={setTheme}>
            <ThemeConsumer />
          </ThemeProvider>
        </div>
      );
    }
    return <Demo />;
  },
};

export const SystemDisabled: Story = {
  name: 'enableSystem=false',
  render: () => (
    <ThemeProvider
      defaultTheme="dark"
      enableSystem={false}
      storageKey="story-theme-nosystem"
    >
      <ThemeConsumer />
    </ThemeProvider>
  ),
};
