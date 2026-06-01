import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { createMentionExtension } from './presets/mention';
import { createSlashCommandExtension, defaultSlashCommands } from './presets/slashCommand';
import { createImageUploadExtension } from './presets/imageUpload';

const meta = {
  title: 'Form Controls/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultStory() {
    const [html, setHtml] = useState(
      '<h2>Project brief</h2><p>Write a <strong>concise</strong> description and key <em>deliverables</em>.</p><ul><li>Goal 1</li><li>Goal 2</li></ul>',
    );
    return <RichTextEditor value={html} onChange={setHtml} placeholder="Describe the project…" />;
  },
};

export const Empty: Story = {
  render: function EmptyStory() {
    const [html, setHtml] = useState('');
    return <RichTextEditor value={html} onChange={setHtml} placeholder="Start typing…" />;
  },
};

export const WithoutToolbar: Story = {
  render: function NoToolbarStory() {
    const [html, setHtml] = useState('<p>Toolbar is hidden — use Cmd+B / Cmd+I for formatting.</p>');
    return <RichTextEditor value={html} onChange={setHtml} showToolbar={false} />;
  },
};

export const Disabled: Story = {
  render: () => (
    <RichTextEditor
      value="<p>Cannot edit this content</p>"
      onChange={() => {}}
      disabled
    />
  ),
};

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

const USERS = [
  { id: 'u1', label: 'Alice Nakamura' },
  { id: 'u2', label: 'Bob Okafor' },
  { id: 'u3', label: 'Charlie Dupont' },
  { id: 'u4', label: 'Diana Chen' },
  { id: 'u5', label: 'Ethan Rossi' },
];

export const Mentions: Story = {
  name: 'Preset — Mentions (@)',
  render: function MentionsStory() {
    const [html, setHtml] = useState('<p>Type <strong>@</strong> to mention a team member.</p>');
    const ext = createMentionExtension({
      items: (query) =>
        query
          ? USERS.filter((u) => u.label.toLowerCase().includes(query.toLowerCase()))
          : USERS,
    });
    return (
      <RichTextEditor
        value={html}
        onChange={setHtml}
        extensions={[ext]}
        placeholder="Type @ to mention someone…"
      />
    );
  },
};

export const SlashCommand: Story = {
  name: 'Preset — Slash Commands (/)',
  render: function SlashCommandStory() {
    const [html, setHtml] = useState('<p>Type <strong>/</strong> to open the command menu.</p>');
    const ext = createSlashCommandExtension({ commands: defaultSlashCommands });
    return (
      <RichTextEditor
        value={html}
        onChange={setHtml}
        extensions={[ext]}
        placeholder="Type / for commands…"
      />
    );
  },
};

export const ImageUpload: Story = {
  name: 'Preset — Image Upload (paste/drop)',
  render: function ImageUploadStory() {
    const [html, setHtml] = useState('<p>Paste or drop an image here.</p>');
    const [error, setError] = useState<string | null>(null);

    const ext = createImageUploadExtension({
      accept: 'image/*',
      maxSize: 5 * 1024 * 1024, // 5 MB
      upload: async (file) => {
        // Fake upload — use an object URL for demo purposes
        return URL.createObjectURL(file);
      },
      onError: (err) => setError(err.message),
    });

    return (
      <div className="flex flex-col gap-8px">
        <RichTextEditor
          value={html}
          onChange={setHtml}
          extensions={[ext]}
          placeholder="Paste or drop an image…"
        />
        {error && (
          <p className="text-error text-14 font-manrope">{error}</p>
        )}
      </div>
    );
  },
};

export const ImageUploadBase64: Story = {
  name: 'Preset — Image Upload (base64 fallback)',
  render: function ImageUploadBase64Story() {
    const [html, setHtml] = useState('<p>No upload handler — images are inserted as base64.</p>');

    const ext = createImageUploadExtension({
      accept: 'image/*',
      maxSize: 2 * 1024 * 1024, // 2 MB
    });

    return (
      <RichTextEditor
        value={html}
        onChange={setHtml}
        extensions={[ext]}
        placeholder="Paste an image to embed as base64…"
      />
    );
  },
};
