import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SegmentedControl from './SegmentedControl';

const meta = {
  title: 'Form Controls/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState('day');
    return (
      <SegmentedControl
        value={value}
        onChange={setValue}
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
          { label: 'Year', value: 'year' },
        ]}
      />
    );
  },
};

export const Sizes: Story = {
  render: function SizesStory() {
    const [a, setA] = useState('one');
    const [b, setB] = useState('one');
    const [c, setC] = useState('one');
    const opts = [
      { label: 'One', value: 'one' },
      { label: 'Two', value: 'two' },
      { label: 'Three', value: 'three' },
    ];
    return (
      <div className="flex flex-col items-start gap-12px">
        <SegmentedControl size="sm" value={a} onChange={setA} options={opts} />
        <SegmentedControl size="md" value={b} onChange={setB} options={opts} />
        <SegmentedControl size="lg" value={c} onChange={setC} options={opts} />
      </div>
    );
  },
};

export const FullWidth: Story = {
  render: function FullWidthStory() {
    const [value, setValue] = useState('list');
    return (
      <div className="w-full">
        <SegmentedControl
          fullWidth
          value={value}
          onChange={setValue}
          options={[
            { label: 'List', value: 'list' },
            { label: 'Grid', value: 'grid' },
            { label: 'Table', value: 'table' },
          ]}
        />
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: function WithIconsStory() {
    const [value, setValue] = useState('list');
    return (
      <SegmentedControl
        value={value}
        onChange={setValue}
        options={[
          {
            label: 'List',
            value: 'list',
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ),
          },
          {
            label: 'Grid',
            value: 'grid',
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
              </svg>
            ),
          },
        ]}
      />
    );
  },
};

export const WithDisabledOption: Story = {
  render: function DisabledOptionStory() {
    const [value, setValue] = useState('a');
    return (
      <SegmentedControl
        value={value}
        onChange={setValue}
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
          { label: 'C', value: 'c' },
        ]}
      />
    );
  },
};
