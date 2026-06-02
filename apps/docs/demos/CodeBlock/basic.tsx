'use client';
import { CodeBlock } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="w-full max-w-[640px]">
      <CodeBlock
        language="ts"
        filename="example.ts"
        showLineNumbers
        code={`import { useState } from 'react';

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle] as const;
}`}
      />
    </div>
  );
}
