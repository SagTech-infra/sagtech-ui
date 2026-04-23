import type { Meta, StoryObj } from '@storybook/react';
import CodeBlock from './CodeBlock';

const meta = {
  title: 'Data Display/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[640px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScript: Story = {
  args: {
    language: 'ts',
    filename: 'example.ts',
    showLineNumbers: true,
    code: `import { useCallback } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  // delays the propagation of \`value\` by \`delay\` ms
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}`,
  },
};

export const JSON: Story = {
  args: {
    language: 'json',
    filename: 'package.json',
    code: `{
  "name": "@sagtech-infra/ui",
  "version": "0.2.0",
  "peerDependencies": {
    "react": "^19.0.0"
  }
}`,
  },
};

export const Bash: Story = {
  args: {
    language: 'bash',
    filename: 'install.sh',
    code: `# Install and build the library
pnpm install
pnpm build
pnpm test --run`,
  },
};

export const HTML: Story = {
  args: {
    language: 'html',
    code: `<div class="card">
  <h3 class="title">Welcome</h3>
  <p class="body">Inline description here.</p>
</div>`,
  },
};

export const Constrained: Story = {
  args: {
    language: 'ts',
    maxHeight: 160,
    code: Array.from({ length: 40 }, (_, i) => `const line${i} = 'value ${i}';`).join('\n'),
  },
};
