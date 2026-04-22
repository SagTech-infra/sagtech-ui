import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import Combobox from './Combobox';
import type { ComboboxOption } from './types';

const frameworks: ComboboxOption[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Remix', value: 'remix' },
  { label: 'SolidJS', value: 'solid' },
  { label: 'Qwik', value: 'qwik' },
  { label: 'Astro', value: 'astro' },
];

const meta = {
  title: 'Form Controls/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-[420px] w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: function SingleStory() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <Combobox
        label="Framework"
        options={frameworks}
        value={value}
        onChange={setValue}
        placeholder="Pick a framework"
      />
    );
  },
};

export const Multiple: Story = {
  render: function MultipleStory() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Combobox
        label="Frameworks"
        multiple
        options={frameworks}
        value={value}
        onChange={setValue}
        placeholder="Pick one or more"
      />
    );
  },
};

export const WithError: Story = {
  render: function ErrorStory() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <Combobox
        label="Framework"
        options={frameworks}
        value={value}
        onChange={setValue}
        placeholder="Pick a framework"
        error="Required field"
      />
    );
  },
};

export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <Combobox
        label="Framework"
        options={frameworks}
        value="react"
        onChange={() => {}}
        disabled
      />
    );
  },
};

export const NotSearchable: Story = {
  render: function NotSearchableStory() {
    const [value, setValue] = useState<string | null>('react');
    return (
      <Combobox
        options={frameworks.slice(0, 4)}
        value={value}
        onChange={setValue}
        searchable={false}
        placeholder="No search box"
      />
    );
  },
};

export const AsyncLoading: Story = {
  name: 'Async loading (server-side search)',
  render: function AsyncStory() {
    const [value, setValue] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ComboboxOption[]>(frameworks);

    useEffect(() => {
      let cancelled = false;
      setLoading(true);
      const handle = setTimeout(() => {
        if (cancelled) return;
        setResults(
          frameworks.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
        );
        setLoading(false);
      }, 300);
      return () => {
        cancelled = true;
        clearTimeout(handle);
      };
    }, [query]);

    return (
      <Combobox
        label="Framework (async)"
        options={results}
        value={value}
        onChange={setValue}
        searchable
        searchValue={query}
        onSearch={setQuery}
        loading={loading}
        placeholder="Type to search"
      />
    );
  },
};

export const CustomRendering: Story = {
  render: function CustomStory() {
    const [value, setValue] = useState<string[]>(['react', 'nextjs']);
    return (
      <Combobox
        label="Stack"
        multiple
        options={frameworks}
        value={value}
        onChange={setValue}
        renderOption={(option, { selected }) => (
          <div className="flex items-center gap-8px w-full">
            <span
              className="w-[8px] h-[8px] rounded-full flex-shrink-0"
              style={{ background: selected ? '#6D3EF1' : '#6A6A73' }}
            />
            <span className="truncate flex-1">{option.label}</span>
            <span className="text-10 text-grey_1 font-mono">{option.value}</span>
          </div>
        )}
        renderValue={(selected) =>
          selected.length === 0 ? null : (
            <div className="flex flex-wrap gap-4px">
              {selected.map((s) => (
                <span
                  key={s.value}
                  className="bg-pr_purple/20 text-pr_purple px-8px py-2px rounded-circle text-12"
                >
                  {s.label}
                </span>
              ))}
            </div>
          )
        }
      />
    );
  },
};

export const InlineDropdown: Story = {
  name: 'Inline dropdown (portal=false)',
  render: function InlineStory() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <Combobox
        options={frameworks}
        value={value}
        onChange={setValue}
        portal={false}
        placeholder="Dropdown rendered inline"
      />
    );
  },
};
