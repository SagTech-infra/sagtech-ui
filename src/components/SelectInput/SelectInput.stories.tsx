import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SelectInput from './SelectInput';
import type { SelectOption } from './types';

const sampleOptions: SelectOption[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Next.js', value: 'nextjs' },
];

const meta = {
  title: 'Form Controls/SelectInput',
  component: SelectInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="min-h-75 max-w-100 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Controlled (value / onChange)',
  render: function DefaultSelect() {
    const [value, setValue] = useState('');
    return (
      <SelectInput
        options={sampleOptions}
        value={value}
        onChange={setValue}
        placeholder="Select a framework"
      />
    );
  },
};

export const WithSelectedValue: Story = {
  render: function SelectedSelect() {
    const [value, setValue] = useState('react');
    return (
      <SelectInput
        options={sampleOptions}
        value={value}
        onChange={setValue}
        placeholder="Select a framework"
      />
    );
  },
};

export const Multiple: Story = {
  render: function MultipleSelect() {
    const [values, setValues] = useState<string[]>([]);
    const toggle = (val: string) =>
      setValues((prev) =>
        prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
      );
    return (
      <SelectInput
        options={sampleOptions}
        value={values}
        onChange={toggle}
        placeholder="Select frameworks"
        multiple
      />
    );
  },
};

export const ValueAsPlaceholder: Story = {
  render: function PlaceholderSelect() {
    const [value, setValue] = useState('react');
    return (
      <SelectInput
        options={sampleOptions}
        value={value}
        onChange={setValue}
        placeholder="Select a framework"
        valueAsPlaceholder
      />
    );
  },
};

export const Disabled: Story = {
  render: function DisabledSelect() {
    const [value] = useState('react');
    return (
      <SelectInput
        options={sampleOptions}
        value={value}
        onChange={() => {}}
        placeholder="Select a framework"
        disabled
      />
    );
  },
};
