'use client';
import { KBD } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <KBD keys={['Cmd', 'K']} separator="+" size="sm" />
      <KBD keys={['Ctrl', 'Alt', 'Del']} separator="-" />
      <KBD keys={['Esc']} />
      <KBD keys={['Ctrl', 'C']} size="md" />
    </div>
  );
}
