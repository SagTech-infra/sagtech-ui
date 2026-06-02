'use client';
import { useState } from 'react';
import { TagInput } from '@sagtech-infra/ui';

export default function Demo() {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript']);

  return (
    <div className="w-full max-w-[400px]">
      <TagInput value={tags} onChange={setTags} placeholder="Type and press Enter..." />
    </div>
  );
}
