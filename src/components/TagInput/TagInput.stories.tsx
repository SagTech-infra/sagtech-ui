import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TagInput from './TagInput';

const meta = {
  title: 'Form Controls/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-[400px] p-32px">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: [],
    onChange: () => {},
    placeholder: 'Add a tag...',
  },
};

export const WithTags: Story = {
  args: {
    value: ['React', 'TypeScript', 'Next.js'],
    onChange: () => {},
  },
};

export const MaxTags: Story = {
  args: {
    value: ['React', 'TypeScript', 'Next.js'],
    onChange: () => {},
    maxTags: 3,
  },
};

export const WithError: Story = {
  args: {
    value: [],
    onChange: () => {},
    error: 'At least one tag required',
  },
};

export const Disabled: Story = {
  args: {
    value: ['React', 'TypeScript'],
    onChange: () => {},
    disabled: true,
  },
};

const InteractiveTagInput = () => {
  const [tags, setTags] = useState<string[]>(['React']);

  return (
    <div className="flex flex-col gap-16px">
      <TagInput
        value={tags}
        onChange={setTags}
        placeholder="Type and press Enter..."
      />
      <p className="text-grey_4 text-12 font-manrope">
        Tags: {tags.length > 0 ? tags.join(', ') : 'none'}
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveTagInput />,
  args: {
    value: [],
    onChange: () => {},
  },
};
