import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DateRangePicker, { type DateRange } from './DateRangePicker';

const meta = {
  title: 'Form Controls/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-[500px] w-[360px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultStory() {
    const [range, setRange] = useState<DateRange>({ from: null, to: null });
    return (
      <DateRangePicker
        label="Pick a range"
        value={range}
        onChange={setRange}
      />
    );
  },
};

export const WithInitialValue: Story = {
  render: function WithInitialStory() {
    const today = new Date();
    const [range, setRange] = useState<DateRange>({
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: new Date(today.getFullYear(), today.getMonth(), 14),
    });
    return <DateRangePicker value={range} onChange={setRange} label="This period" />;
  },
};

export const Bounded: Story = {
  render: function BoundedStory() {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const max = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const [range, setRange] = useState<DateRange>({ from: null, to: null });
    return (
      <DateRangePicker
        label="Within ±1 month"
        value={range}
        onChange={setRange}
        minDate={min}
        maxDate={max}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <DateRangePicker value={{ from: null, to: null }} onChange={() => {}} disabled label="Disabled" />
  ),
};

export const WithError: Story = {
  render: function ErrorStory() {
    const [range, setRange] = useState<DateRange>({ from: null, to: null });
    return (
      <DateRangePicker
        label="Pick a range"
        value={range}
        onChange={setRange}
        error="Both start and end dates are required"
      />
    );
  },
};
