import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FileDropzone, { type FileUploadItem } from './FileDropzone';

const meta = {
  title: 'Form Controls/FileDropzone',
  component: FileDropzone,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="w-max-130 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

function makeItem(
  name: string,
  type: string,
  size: number,
  extras: Partial<FileUploadItem> = {},
): FileUploadItem {
  return {
    id: name + '-' + Math.random().toString(36).slice(2, 7),
    file: new File(['x'.repeat(Math.min(size, 1024))], name, { type }),
    ...extras,
  };
}

export const Empty: Story = {
  render: function EmptyStory() {
    const [files, setFiles] = useState<FileUploadItem[]>([]);
    return (
      <FileDropzone
        files={files}
        accept=".pdf,.png,.jpg,.jpeg,.gif"
        hint="PDF, PNG, JPG, GIF up to 10 MB"
        maxSize={10 * 1024 * 1024}
        onFilesAdd={(incoming) => {
          setFiles((prev) => [
            ...prev,
            ...incoming.map<FileUploadItem>((f) => ({
              id: `${f.name}-${Date.now()}-${Math.random()}`,
              file: f,
              status: 'success',
              progress: 100,
            })),
          ]);
        }}
        onFileRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
      />
    );
  },
};

export const Uploading: Story = {
  args: {
    files: [
      makeItem('quarterly-report.pdf', 'application/pdf', 1.4 * 1024 * 1024, {
        status: 'uploading',
        progress: 35,
      }),
      makeItem('architecture-diagram.png', 'image/png', 820 * 1024, {
        status: 'uploading',
        progress: 72,
      }),
    ],
    onFilesAdd: () => {},
    onFileRemove: () => {},
  },
};

export const Mixed: Story = {
  name: 'Mixed states (uploading + success + error)',
  args: {
    files: [
      makeItem('presentation.pdf', 'application/pdf', 2 * 1024 * 1024, {
        status: 'success',
        progress: 100,
      }),
      makeItem('video.mp4', 'video/mp4', 48 * 1024 * 1024, {
        status: 'error',
        errorMessage: 'Network error. Check your connection and retry.',
      }),
      makeItem('notes.txt', 'text/plain', 3 * 1024, {
        status: 'uploading',
        progress: 55,
      }),
    ],
    onFilesAdd: () => {},
    onFileRemove: () => {},
    onFileRetry: () => {},
  },
};

export const WithMaxFiles: Story = {
  name: 'Max files = 2 (limit reached)',
  render: function LimitStory() {
    const [files, setFiles] = useState<FileUploadItem[]>([
      makeItem('invoice-feb.pdf', 'application/pdf', 400 * 1024, {
        status: 'success',
        progress: 100,
      }),
      makeItem('invoice-mar.pdf', 'application/pdf', 380 * 1024, {
        status: 'success',
        progress: 100,
      }),
    ]);
    return (
      <FileDropzone
        files={files}
        maxFiles={2}
        hint="Up to 2 files"
        onFilesAdd={(incoming) =>
          setFiles((prev) => [
            ...prev,
            ...incoming.map<FileUploadItem>((f) => ({
              id: `${f.name}-${Math.random()}`,
              file: f,
              status: 'success',
              progress: 100,
            })),
          ])
        }
        onFileRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    files: [],
    disabled: true,
    onFilesAdd: () => {},
  },
};

export const WithoutPreview: Story = {
  args: {
    showPreview: false,
    files: [
      makeItem('photo.jpg', 'image/jpeg', 1.2 * 1024 * 1024, {
        status: 'success',
        progress: 100,
      }),
    ],
    onFilesAdd: () => {},
    onFileRemove: () => {},
  },
};
