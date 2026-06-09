'use client';
import { TreeView } from '@sagtech-infra/ui';
import type { TreeNode } from '@sagtech-infra/ui';

const nodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'input', label: 'Input.tsx' },
        ],
      },
      { id: 'index', label: 'index.ts' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [{ id: 'favicon', label: 'favicon.ico' }],
  },
  { id: 'readme', label: 'README.md' },
];

export default function Demo() {
  return (
    <div className="w-full max-w-[360px] bg-black_2 rounded-16px p-16px">
      <TreeView
        nodes={nodes}
        aria-label="Project files"
        defaultExpandedIds={['src', 'components']}
      />
    </div>
  );
}
