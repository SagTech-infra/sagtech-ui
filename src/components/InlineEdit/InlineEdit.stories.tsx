import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import InlineEdit from './InlineEdit';

const meta = {
  title: 'Form Controls/InlineEdit',
  component: InlineEdit,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: function BasicStory() {
    const [name, setName] = useState('Ada Lovelace');
    return (
      <InlineEdit
        value={name}
        onSave={(next) => setName(next)}
        placeholder="Enter your name"
      />
    );
  },
};

export const Multiline: Story = {
  render: function MultilineStory() {
    const [bio, setBio] = useState('Analyst, first programmer.');
    return (
      <div className="w-[320px]">
        <InlineEdit
          value={bio}
          onSave={setBio}
          multiline
          placeholder="Bio"
        />
        <p className="text-12 text-grey_2 mt-8px">Cmd/Ctrl+Enter to save, Esc to cancel.</p>
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: function ValidationStory() {
    const [email, setEmail] = useState('user@example.com');
    return (
      <InlineEdit
        value={email}
        onSave={setEmail}
        validate={(next) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next) ? null : 'Invalid email'
        }
      />
    );
  },
};

export const AsyncSave: Story = {
  render: function AsyncStory() {
    const [title, setTitle] = useState('Draft: project kickoff');
    return (
      <InlineEdit
        value={title}
        onSave={async (next) => {
          await new Promise((r) => setTimeout(r, 800));
          setTitle(next);
        }}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    value: 'Read only',
    onSave: () => {},
    disabled: true,
  },
};
