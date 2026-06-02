import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactNode } from 'react';
import { CodeBlock } from '@sagtech-infra/ui';

interface ExampleProps {
  /** Path under demos/ without extension, e.g. "Button/basic". */
  path: string;
  /** The rendered demo — a client component element. */
  preview: ReactNode;
}

/**
 * Single source of truth for an example: renders the live demo AND shows the
 * exact source of the same file. Server component — reads the demo file at build
 * time (pages are static), so preview and code can never drift apart.
 */
export function Example({ path, preview }: ExampleProps) {
  const file = join(process.cwd(), 'demos', `${path}.tsx`);
  let code: string;
  try {
    code = readFileSync(file, 'utf8').trimEnd();
  } catch {
    code = `// demo source not found: demos/${path}.tsx`;
  }

  return (
    <div className="rounded-16px border border-border-default overflow-hidden">
      <div className="flex items-center justify-center min-h-[180px] p-24px bg-bg-secondary">
        {preview}
      </div>
      <CodeBlock
        code={code}
        language="tsx"
        filename={`${path}.tsx`}
        copyable
        showLineNumbers
      />
    </div>
  );
}
