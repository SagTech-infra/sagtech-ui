'use client';
import { useState, useCallback } from 'react';
import { Dropzone } from '@sagtech-infra/ui';

export default function Demo() {
  const [count, setCount] = useState(0);
  const handleDrop = useCallback((files: File[]) => {
    setCount((prev) => prev + files.length);
  }, []);
  return (
    <div className="flex w-full max-w-[480px] flex-col gap-8px">
      <Dropzone onDrop={handleDrop} accept=".pdf,.docx" maxFiles={5} />
      {count > 0 && (
        <p className="text-12 text-grey_2 font-manrope">Total files dropped: {count}</p>
      )}
    </div>
  );
}
