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

// Minimal tokenizer for js/ts/json/bash — no peer-dep. For richer languages,
// consumers can pass a custom `highlight` (Prism/Shiki) through the prop.
function builtInHighlight(code: string, language: CodeLanguage): string {
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (language === 'json') {
    return escape(code)
      .replace(/("[^"\\]*(?:\\.[^"\\]*)*")(\s*:)/g, '<span class="tok-key">$1</span>$2')
      .replace(/:\s*("[^"\\]*(?:\\.[^"\\]*)*")/g, ': <span class="tok-string">$1</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="tok-const">$1</span>')
      .replace(/(-?\b\d+(?:\.\d+)?\b)/g, '<span class="tok-num">$1</span>');
  }

  if (language === 'bash' || language === 'shell') {
    return escape(code)
      .replace(/(^|\n)(\$|#)\s/g, '$1<span class="tok-prompt">$2</span> ')
      .replace(/(".*?")/g, '<span class="tok-string">$1</span>')
      .replace(/('.*?')/g, '<span class="tok-string">$1</span>')
      .replace(/\b(cd|ls|rm|cp|mv|mkdir|git|pnpm|npm|yarn|node|echo|export)\b/g, '<span class="tok-kw">$1</span>')
      .replace(/(\s-{1,2}[A-Za-z][\w-]*)/g, '<span class="tok-flag">$1</span>');
  }

  if (language === 'css') {
    return escape(code)
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>')
      .replace(/([.#][A-Za-z_][\w-]*)/g, '<span class="tok-key">$1</span>')
      .replace(/(\b[a-z-]+)(\s*:)/g, '<span class="tok-prop">$1</span>$2');
  }

  if (language === 'html') {
    return escape(code)
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tok-tag">$2</span>')
      .replace(/([\w-]+)(=)(".*?")/g, '<span class="tok-attr">$1</span>$2<span class="tok-string">$3</span>');
  }

  if (['ts', 'tsx', 'js', 'jsx'].includes(language)) {
    return escape(code)
      .replace(/(\/\/[^\n]*)/g, '<span class="tok-comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>')
      .replace(/(`(?:\\.|[^\\`])*`)/g, '<span class="tok-string">$1</span>')
      .replace(/("(?:\\.|[^\\"])*")/g, '<span class="tok-string">$1</span>')
      .replace(/('(?:\\.|[^\\'])*')/g, '<span class="tok-string">$1</span>')
      .replace(
        /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|implements|interface|type|enum|export|import|from|as|async|await|yield|typeof|instanceof|in|of|try|catch|finally|throw)\b/g,
        '<span class="tok-kw">$1</span>',
      )
      .replace(/\b(true|false|null|undefined|this|super)\b/g, '<span class="tok-const">$1</span>')
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');
  }

  return escape(code);
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
