'use client';
import { Icon } from '@sagtech-infra/ui';

// A small gallery of the library's icon set. Names map to IAvailableIcons.
const ICONS = [
  'search',
  'mail',
  'call',
  'calendar',
  'settings',
  'users',
  'folder',
  'document',
  'lock',
  'eye',
  'edit',
  'location',
] as const;

export default function Demo() {
  // Icons paint with currentColor, so the gallery inherits the active theme's
  // foreground (white on dark, near-black on light) — no hard-coded colors.
  return (
    <div className="grid w-full grid-cols-3 gap-12px text-fg-primary sm:grid-cols-4 md:grid-cols-6">
      {ICONS.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-8px rounded-12px border border-border-default bg-bg-secondary p-16px transition-colors hover:border-border-strong"
        >
          <Icon icon={name} size={24} color="currentColor" />
          <span className="text-12 text-fg-muted">{name}</span>
        </div>
      ))}
    </div>
  );
}
