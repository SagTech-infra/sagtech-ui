import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LocaleProvider } from './LocaleProvider';
import { useLocale } from './LocaleContext';
import type { Direction } from './LocaleContext';

const meta = {
  title: 'Providers/LocaleProvider',
  component: LocaleProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`LocaleProvider` supplies `locale` (BCP-47) and `dir` (`ltr | rtl`) to the subtree via context. ' +
          'Consume with `useLocale()` → `{ locale, dir }`. ' +
          'Components like DatePicker / DateRangePicker read this context to format dates and flip layout direction.',
      },
    },
  },
} satisfies Meta<typeof LocaleProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── helpers ──────────────────────────────────────────────────────────────────

const LOCALES: { locale: string; dir: Direction; label: string }[] = [
  { locale: 'en-US', dir: 'ltr', label: 'en-US (LTR)' },
  { locale: 'de-DE', dir: 'ltr', label: 'de-DE (LTR)' },
  { locale: 'ar-EG', dir: 'rtl', label: 'ar-EG (RTL)' },
];

function pill(label: string, active: boolean, onClick: () => void) {
  return (
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
}

// Consumer that reads context and shows current locale/dir + a sample date.
function LocaleConsumer() {
  const { locale, dir } = useLocale();

  const sampleDate = new Date(2025, 0, 15); // Jan 15 2025
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(sampleDate);

  return (
    <div
      dir={dir}
      style={{
        background: '#0d0d24',
        border: '1px solid #2a2a50',
        borderRadius: 12,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        color: '#e0e0ff',
        fontFamily: 'monospace',
        fontSize: 13,
        minWidth: 320,
        transition: 'all 0.2s',
      }}
    >
      <div><strong>locale:</strong> <code>{locale}</code></div>
      <div><strong>dir:</strong> <code>{dir}</code></div>
      <div
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          background: '#1a1a3a',
          border: '1px solid #2a2a50',
        }}
      >
        <strong>Intl.DateTimeFormat result:</strong>
        <br />
        {formatted}
      </div>
    </div>
  );
}

// ─── stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default (en-US / ltr)',
  render: () => (
    <LocaleProvider locale="en-US" dir="ltr">
      <LocaleConsumer />
    </LocaleProvider>
  ),
};

export const Arabic: Story = {
  name: 'ar-EG / rtl',
  render: () => (
    <LocaleProvider locale="ar-EG" dir="rtl">
      <LocaleConsumer />
    </LocaleProvider>
  ),
};

export const German: Story = {
  name: 'de-DE / ltr',
  render: () => (
    <LocaleProvider locale="de-DE" dir="ltr">
      <LocaleConsumer />
    </LocaleProvider>
  ),
};

export const Interactive: Story = {
  name: 'Interactive locale switcher',
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState(LOCALES[0]);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LOCALES.map((opt) =>
              pill(opt.label, opt.locale === selected.locale, () => setSelected(opt)),
            )}
          </div>
          <LocaleProvider locale={selected.locale} dir={selected.dir}>
            <LocaleConsumer />
          </LocaleProvider>
        </div>
      );
    }
    return <Demo />;
  },
};
