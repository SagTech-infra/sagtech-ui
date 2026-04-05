import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SearchBar from './SearchBar';

const meta = {
  title: 'Form Controls/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithValue: Story = {
  args: { value: 'React development' },
};

export const Interactive: Story = {
  render: function InteractiveSearchBar() {
    const [value, setValue] = useState('');
    return (
      <SearchBar
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};
