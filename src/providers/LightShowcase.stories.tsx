import type { Meta, StoryObj } from '@storybook/react';
import Button from '@/components/Button/Button';

/**
 * Demonstrates that components and semantic tokens adapt to the active theme.
 * Light mode is a supported theme (set `data-theme="light"` via ThemeProvider);
 * accents are tuned for AA contrast on light surfaces. Also exercises the v2.1
 * brand tokens: font-display/font-body, bg-surface-wash, bg-gradient-hero.
 */
const meta = {
  title: 'Theming/Light Showcase',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Panel({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <div data-theme={theme} className="min-h-[440px] bg-bg-primary p-32px text-fg-primary">
      <p className="font-display text-12 uppercase tracking-wider text-pr_purple">{theme} theme</p>
      <h2 className="mt-8px font-display text-32">Components adapt to the theme</h2>

      <div className="mt-24px flex flex-wrap gap-12px">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </div>

      <div className="mt-24px grid max-w-[640px] grid-cols-2 gap-16px">
        <div className="rounded-16px border border-border-default bg-bg-secondary p-16px">
          <p className="font-body text-fg-primary">Surface (bg-secondary)</p>
          <p className="mt-4px font-body text-14 text-fg-muted">Muted foreground on a surface.</p>
        </div>
        <div className="rounded-16px border border-border-default bg-surface-wash p-16px">
          <p className="font-body text-fg-primary">Purple wash</p>
          <p className="mt-4px font-body text-14 text-fg-muted">Subtle brand tint (surface-wash).</p>
        </div>
      </div>

      <div className="mt-24px flex h-[100px] items-end rounded-16px bg-gradient-hero p-16px font-display text-white">
        gradient-hero
      </div>
    </div>
  );
}

export const Light: Story = { render: () => <Panel theme="light" /> };

export const SideBySide: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <Panel theme="dark" />
      <Panel theme="light" />
    </div>
  ),
};
