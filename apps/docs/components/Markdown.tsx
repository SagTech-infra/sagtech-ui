'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@sagtech-infra/ui';

type Lang =
  | 'ts' | 'tsx' | 'js' | 'jsx' | 'json' | 'bash' | 'shell' | 'css' | 'html' | 'plaintext';

const LANG_MAP: Record<string, Lang> = {
  ts: 'ts', typescript: 'ts', tsx: 'tsx', js: 'js', javascript: 'js', jsx: 'jsx',
  json: 'json', bash: 'bash', sh: 'bash', shell: 'shell', css: 'css', html: 'html',
};

/** Renders a library /docs markdown file using the real CodeBlock for fenced
    code, so guides share the exact look of component examples. */
export function Markdown({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className ?? '');
          const text = String(children).replace(/\n$/, '');
          if (match) {
            return <CodeBlock code={text} language={LANG_MAP[match[1]] ?? 'plaintext'} copyable />;
          }
          return (
            <code className="rounded-6px bg-bg-secondary px-4px text-sec_purple">{children}</code>
          );
        },
        h1: (p) => <h1 className="mb-16px mt-32px font-orbitron text-40" {...p} />,
        h2: (p) => <h2 className="mb-12px mt-32px font-orbitron text-28" {...p} />,
        h3: (p) => <h3 className="mb-8px mt-24px font-orbitron text-18" {...p} />,
        p: (p) => <p className="my-12px text-16 leading-28 text-white_1" {...p} />,
        ul: (p) => <ul className="my-12px list-disc pl-24px text-white_1" {...p} />,
        ol: (p) => <ol className="my-12px list-decimal pl-24px text-white_1" {...p} />,
        li: (p) => <li className="my-4px" {...p} />,
        a: ({ href, children }) => (
          <a href={href} className="text-sec_purple underline underline-offset-2">{children}</a>
        ),
        blockquote: (p) => (
          <blockquote className="my-16px border-l-2 border-pr_purple pl-16px text-grey_3" {...p} />
        ),
        table: (p) => <table className="my-16px w-full border-collapse text-14" {...p} />,
        th: (p) => <th className="border border-border-default px-12px py-6px text-left" {...p} />,
        td: (p) => <td className="border border-border-default px-12px py-6px" {...p} />,
      }}
    >
      {source}
    </ReactMarkdown>
  );
}
