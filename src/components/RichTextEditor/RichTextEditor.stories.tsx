import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

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
