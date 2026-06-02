'use client';
import { Mindmap3D, type MindmapNode } from '@sagtech-infra/ui/3d';

const tree: MindmapNode = {
  id: 'root',
  label: 'Product',
  children: [
    {
      id: 'design',
      label: 'Design',
      children: [
        { id: 'tokens', label: 'Tokens' },
        { id: 'comps', label: 'Components' },
      ],
    },
    {
      id: 'eng',
      label: 'Engineering',
      children: [
        { id: 'fe', label: 'Frontend' },
        { id: 'be', label: 'Backend' },
        { id: 'infra', label: 'Infra' },
      ],
    },
  ],
};

export default function Demo() {
  return (
    <div className="w-full max-w-[600px]">
      <Mindmap3D root={tree} width={600} height={500} />
    </div>
  );
}
