'use client';
import { useState } from 'react';
import { Attachment } from '@sagtech-infra/ui';

export default function Demo() {
  const [files, setFiles] = useState<Array<File> | undefined>();
  return (
    <div className="flex flex-col gap-8px w-full max-w-[480px]">
      <Attachment title="Attach file" multiple onChange={setFiles} />
      {files?.length ? (
        <span className="text-fg-secondary">{files.length} file(s) selected</span>
      ) : null}
    </div>
  );
}
