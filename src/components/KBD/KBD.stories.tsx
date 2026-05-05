import type { Meta, StoryObj } from '@storybook/react';
import KBD from './KBD';

const meta = {
  title: 'Foundations/KBD',
  component: KBD,
  tags: ['autodocs'],
  argTypes: {
    keys: { control: 'object' },
    separator: { control: 'radio', options: ['+', '-', ' '] },
    size: { control: 'radio', options: ['xs', 'sm', 'md'] },
  },
} satisfies Meta<typeof KBD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    keys: ['Cmd', 'K'],
    separator: '+',
    size: 'sm',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-16px">
      <KBD keys={['Ctrl', 'C']} size="xs" />
      <KBD keys={['Ctrl', 'C']} size="sm" />
      <KBD keys={['Ctrl', 'C']} size="md" />
    </div>
  ),
};

export const Separators: Story = {
  render: () => (
    <div className="flex items-center gap-16px">
      <KBD keys={['Cmd', 'Shift', 'P']} separator="+" />
      <KBD keys={['Ctrl', 'Alt', 'Del']} separator="-" />
      <KBD keys={['G', 'I']} separator=" " />
    </div>
  ),
};

export const SingleKey: Story = {
  args: {
    keys: ['Esc'],
    size: 'sm',
  },
};

export const Inline: Story = {
  render: () => (
    <p className="font-manrope text-14 text-grey_4 max-w-[420px] leading-24">
      Press <KBD keys={['Cmd', 'K']} /> to open the command palette, then press{' '}
      <KBD keys={['Esc']} /> to close it.
    </p>
  ),
};
