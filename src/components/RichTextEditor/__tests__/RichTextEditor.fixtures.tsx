import { useMemo, useState } from 'react';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import {
  createImageUploadExtension,
  createMentionExtension,
  createSlashCommandExtension,
  createSyntaxHighlightExtension,
  defaultSlashCommands,
} from '@/components/RichTextEditor/presets';

// Test harnesses for the RichTextEditor CT specs. They live outside the
// `.ct.tsx` file (extensions/callbacks must run in the browser) and own the
// controlled `value`/`onChange` state so inserted content sticks.

const USERS = [
  { id: 'u1', label: 'Alice' },
  { id: 'u2', label: 'Bob' },
  { id: 'u3', label: 'Charlie' },
];

export function RichTextImageFixture() {
  const [html, setHtml] = useState('<p>start</p>');
  // Fixed-URL uploader keeps the assertion deterministic (no base64/object URL).
  const ext = useMemo(
    () => createImageUploadExtension({ upload: async () => 'https://example.test/uploaded.png' }),
    [],
  );
  return <RichTextEditor value={html} onChange={setHtml} extensions={[ext]} />;
}

export function RichTextMentionFixture() {
  const [html, setHtml] = useState('<p></p>');
  const ext = useMemo(() => createMentionExtension({ items: USERS }), []);
  return <RichTextEditor value={html} onChange={setHtml} extensions={[ext]} />;
}

export function RichTextSlashFixture() {
  const [html, setHtml] = useState('<p></p>');
  const ext = useMemo(() => createSlashCommandExtension({ commands: defaultSlashCommands }), []);
  return <RichTextEditor value={html} onChange={setHtml} extensions={[ext]} />;
}

const CODE_SAMPLE =
  '<pre><code class="language-javascript">function greet(name) {\n' +
  '  const msg = "hello";\n' +
  '  return msg.toUpperCase();\n' +
  '}</code></pre>';

export function RichTextSyntaxFixture() {
  const [html, setHtml] = useState(CODE_SAMPLE);
  // Pair with codeBlock:false — CodeBlockLowlight and StarterKit both register a
  // `codeBlock` node and would otherwise collide (see createSyntaxHighlightExtension).
  const ext = useMemo(() => createSyntaxHighlightExtension({ languages: 'common' }), []);
  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      extensions={[ext]}
      starterKitOptions={{ codeBlock: false }}
    />
  );
}
