import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import Dropzone from './Dropzone';

const meta = {
  title: 'Form Controls/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  argTypes: {
    accept: { control: 'text' },
    maxFiles: { control: 'number' },
    maxSize: { control: 'number' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onDrop: (files) => console.log('Dropped:', files),
  },
};

export const WithAccept: Story = {
  args: {
    onDrop: (files) => console.log('Dropped:', files),
    accept: 'image/*',
  },
};

export const WithFiles: Story = {
  args: {
    onDrop: () => {},
    accept: '.pdf,.docx',
    maxFiles: 5,
  },
  render: function WithFilesDropzone(args) {
    const [allFiles, setAllFiles] = useState<File[]>([]);

    const handleDrop = useCallback((files: File[]) => {
      setAllFiles((prev) => [...prev, ...files]);
    }, []);

    return (
      <div className="flex flex-col gap-8px">
        <Dropzone {...args} onDrop={handleDrop} />
        {allFiles.length > 0 && (
          <p className="text-12 text-grey_2 font-manrope">
            Total files uploaded: {allFiles.length}
          </p>
        )}
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    onDrop: (files) => console.log('Dropped:', files),
    disabled: true,
  },
};
