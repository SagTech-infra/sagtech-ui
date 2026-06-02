'use client';
import { useState } from 'react';
import { FileDropzone, type FileUploadItem } from '@sagtech-infra/ui';

export default function Demo() {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  return (
    <div className="w-full max-w-[520px]">
      <FileDropzone
        files={files}
        accept=".pdf,.png,.jpg,.jpeg,.gif"
        hint="PDF, PNG, JPG, GIF up to 10 MB"
        maxSize={10 * 1024 * 1024}
        onFilesAdd={(incoming) =>
          setFiles((prev) => [
            ...prev,
            ...incoming.map<FileUploadItem>((f) => ({
              id: `${f.name}-${Date.now()}-${Math.random()}`,
              file: f,
              status: 'success',
              progress: 100,
            })),
          ])
        }
        onFileRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
      />
    </div>
  );
}
