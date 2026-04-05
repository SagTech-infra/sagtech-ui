import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePicker from './DatePicker';

const meta = {
  title: 'Form Controls/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    error: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '340px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Select date',
  },
};

export const WithValue: Story = {
  args: {
    value: new Date(),
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Start date',
    placeholder: 'Pick a start date',
  },
};

export const WithMinMax: Story = {
  args: {
    label: 'Date (current month only)',
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
};

export const Interactive: Story = {
  args: {
    placeholder: 'Choose a date',
    label: 'Appointment date',
  },
  render: function InteractiveDatePicker(args) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Not available',
    label: 'Disabled date picker',
  },
};
