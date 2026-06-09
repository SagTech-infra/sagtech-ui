'use client';

import classNames from 'classnames';
import { useMemo, useState } from 'react';

export type CodeLanguage = 'ts' | 'tsx' | 'js' | 'jsx' | 'json' | 'bash' | 'shell' | 'css' | 'html' | 'plaintext';

export interface CodeBlockProps {
  code: string;
  language?: CodeLanguage;
  filename?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  /**
   * Optional custom highlighter. Receives code + language and returns HTML.
   * When omitted, a built-in regex-based highlighter covers js/ts/json/bash.
   */
  highlight?: (code: string, language: CodeLanguage) => string;
  className?: string;
  maxHeight?: string | number;
}

// Single-pass tokenizer for js/ts/json/bash/css/html — no peer-dep. For richer
// languages, consumers can pass a custom `highlight` (Prism/Shiki) via the prop.
type HlRule = { re: RegExp; cls: string };

// Each rule's regex MUST have ZERO capturing groups (use (?:…) and look-arounds)
// so the rules merge into one alternation — one capture group per rule. They run
// as a SINGLE String.replace pass: the engine resumes *after* each match, so an
// emitted <span> is never re-scanned by a later rule. (The previous multi-pass
// version corrupted output — e.g. the string rule wrapped the `class="…"` of a
// comment span emitted earlier, surfacing literal `tok-string` text.)
function tokenize(escaped: string, rules: HlRule[]): string {
  const combined = new RegExp(rules.map((r) => `(${r.re.source})`).join('|'), 'g');
  return escaped.replace(combined, (match: string, ...rest: unknown[]) => {
    for (let i = 0; i < rules.length; i++) {
      if (typeof rest[i] === 'string') return `<span class="${rules[i].cls}">${rest[i]}</span>`;
    }
    return match;
  });
}

const JS_RULES: HlRule[] = [
  { re: /\/\/[^\n]*/, cls: 'tok-comment' },
  { re: /\/\*[\s\S]*?\*\//, cls: 'tok-comment' },
  { re: /`(?:\\.|[^\\`])*`/, cls: 'tok-string' },
  { re: /"(?:\\.|[^\\"])*"/, cls: 'tok-string' },
  { re: /'(?:\\.|[^\\'])*'/, cls: 'tok-string' },
  {
    re: /\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|implements|interface|type|enum|export|import|from|as|async|await|yield|typeof|instanceof|in|of|try|catch|finally|throw)\b/,
    cls: 'tok-kw',
  },
  { re: /\b(?:true|false|null|undefined|this|super)\b/, cls: 'tok-const' },
  { re: /\b\d+(?:\.\d+)?\b/, cls: 'tok-num' },
];

const BASH_RULES: HlRule[] = [
  { re: /#[^\n]*/, cls: 'tok-comment' },
  { re: /"(?:\\.|[^\\"])*"/, cls: 'tok-string' },
  { re: /'[^']*'/, cls: 'tok-string' },
  { re: /\b(?:cd|ls|rm|cp|mv|mkdir|git|pnpm|npm|yarn|node|echo|export)\b/, cls: 'tok-kw' },
  { re: /(?:^|\s)-{1,2}[A-Za-z][\w-]*/, cls: 'tok-flag' },
];

const HL_RULES: Partial<Record<CodeLanguage, HlRule[]>> = {
  ts: JS_RULES,
  tsx: JS_RULES,
  js: JS_RULES,
  jsx: JS_RULES,
  bash: BASH_RULES,
  shell: BASH_RULES,
  json: [
    { re: /"(?:\\.|[^\\"])*"(?=\s*:)/, cls: 'tok-key' },
    { re: /"(?:\\.|[^\\"])*"/, cls: 'tok-string' },
    { re: /\b(?:true|false|null)\b/, cls: 'tok-const' },
    { re: /-?\b\d+(?:\.\d+)?\b/, cls: 'tok-num' },
  ],
  css: [
    { re: /\/\*[\s\S]*?\*\//, cls: 'tok-comment' },
    { re: /"(?:\\.|[^\\"])*"/, cls: 'tok-string' },
    { re: /'[^']*'/, cls: 'tok-string' },
    { re: /[.#][A-Za-z_][\w-]*/, cls: 'tok-key' },
    { re: /@[a-z-]+/, cls: 'tok-kw' },
    { re: /\b[a-z-]+(?=\s*:)/, cls: 'tok-prop' },
  ],
  html: [
    { re: /&lt;\/?[\w-]+/, cls: 'tok-tag' },
    { re: /"(?:\\.|[^\\"])*"/, cls: 'tok-string' },
  ],
};

function builtInHighlight(code: string, language: CodeLanguage): string {
  const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rules = HL_RULES[language];
  return rules ? tokenize(escaped, rules) : escaped;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const codeBlockStyles = `
  .sagtech-code-block pre { tab-size: 2; }
  .sagtech-code-block .tok-kw { color: #B69FF8; }
  .sagtech-code-block .tok-string { color: #58A61B; }
  .sagtech-code-block .tok-num { color: #C6A328; }
  .sagtech-code-block .tok-const { color: #9494C9; }
  .sagtech-code-block .tok-comment { color: #6A6A73; font-style: italic; }
  .sagtech-code-block .tok-key, .sagtech-code-block .tok-prop { color: #9494C9; }
  .sagtech-code-block .tok-prompt { color: #B69FF8; }
  .sagtech-code-block .tok-flag { color: #C6A328; }
  .sagtech-code-block .tok-tag { color: #B69FF8; }
  .sagtech-code-block .tok-attr { color: #9494C9; }
`;

export default function CodeBlock({
  code,
  language = 'plaintext',
  filename,
  showLineNumbers = false,
  copyable = true,
  highlight,
  className,
  maxHeight,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    const fn = highlight ?? builtInHighlight;
    return fn(code, language);
  }, [code, language, highlight]);

  const lines = useMemo(() => highlighted.split('\n'), [highlighted]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={classNames(
        'sagtech-code-block bg-black_1 border border-solid border-black_3 rounded-8px overflow-hidden font-mono text-12',
        className,
      )}
    >
      <style>{codeBlockStyles}</style>
      {(filename || copyable) && (
        <div className="flex items-center justify-between px-16px py-8px border-b border-solid border-black_3 bg-black_2">
          <span className="text-12 text-grey_4 font-manrope">{filename ?? language}</span>
          {copyable && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy code'}
              className="flex items-center gap-6px text-12 text-grey_4 hover:text-white_4 font-manrope cursor-pointer"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <pre
        className="overflow-auto custom-scrollbar"
        style={{ maxHeight, margin: 0, padding: '12px 16px' }}
      >
        <code className="text-white_4 leading-[1.6]">
          {showLineNumbers ? (
            <table className="border-collapse">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="text-grey_1 pr-12px select-none text-right align-top">
                      {i + 1}
                    </td>
                    <td
                      className="whitespace-pre"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: line || ' ' }}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // eslint-disable-next-line react/no-danger
            <span dangerouslySetInnerHTML={{ __html: highlighted }} />
          )}
        </code>
      </pre>
    </div>
  );
}
