import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FileDropzone, { type FileUploadItem } from '../FileDropzone';

function makeItem(name: string, extras: Partial<FileUploadItem> = {}): FileUploadItem {
  return { id: name, file: new File(['x'], name, { type: 'text/plain' }), ...extras };
}

describe('FileDropzone', () => {
  it('renders the drop hint', () => {
    render(<FileDropzone files={[]} onFilesAdd={() => {}} />);
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
  });

  it('renders uploading item with progress', () => {
    render(
      <FileDropzone
        files={[makeItem('a.txt', { status: 'uploading', progress: 60 })]}
        onFilesAdd={() => {}}
      />,
    );
    expect(screen.getByText('a.txt')).toBeInTheDocument();
  });

  it('renders error state + retry', () => {
    const retry = vi.fn();
    render(
      <FileDropzone
        files={[makeItem('bad.txt', { status: 'error', errorMessage: 'Oops' })]}
        onFilesAdd={() => {}}
        onFileRetry={retry}
      />,
    );
    expect(screen.getByText('Oops')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Retry upload of bad\.txt/i));
    expect(retry).toHaveBeenCalledWith('bad.txt');
  });

  it('removes file via onFileRemove', () => {
    const remove = vi.fn();
    render(
      <FileDropzone
        files={[makeItem('gone.txt', { status: 'success' })]}
        onFilesAdd={() => {}}
        onFileRemove={remove}
      />,
    );
    fireEvent.click(screen.getByLabelText(/Remove gone\.txt/i));
    expect(remove).toHaveBeenCalledWith('gone.txt');
  });

  it('blocks drop when maxFiles limit reached', () => {
    const existing = makeItem('a', { status: 'success' });
    render(
      <FileDropzone files={[existing]} onFilesAdd={() => {}} maxFiles={1} />,
    );
    expect(screen.getByText(/file limit reached/i)).toBeInTheDocument();
  });
});
