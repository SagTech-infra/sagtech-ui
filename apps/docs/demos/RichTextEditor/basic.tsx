'use client';
import { useState } from 'react';
import { RichTextEditor } from '@sagtech-infra/ui';

export default function Demo() {
  const [html, setHtml] = useState(
    '<h2>Project brief</h2><p>Write a <strong>concise</strong> description and key <em>deliverables</em>.</p><ul><li>Goal 1</li><li>Goal 2</li></ul>',
  );
  return (
    <div className="w-full max-w-[560px]">
      <RichTextEditor value={html} onChange={setHtml} placeholder="Describe the project…" />
    </div>
  );
}
