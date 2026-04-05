import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './Avatar';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline', 'away'],
    },
    src: { control: 'text' },
    name: { control: 'text' },
    alt: { control: 'text' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'User avatar',
    size: 'lg',
  },
};

export const WithInitials: Story = {
  args: {
    name: 'John Doe',
    size: 'lg',
  },
};

export const WithStatus: Story = {
  args: { size: 'lg' },
  render: () => (
    <div className="flex items-center gap-16px">
      <Avatar
        src="https://i.pravatar.cc/150?img=5"
        size="lg"
        status="online"
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=12"
        size="lg"
        status="offline"
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=8"
        size="lg"
        status="away"
      />
    </div>
  ),
};

export const Sizes: Story = {
  args: { name: 'AB' },
  render: () => (
    <div className="flex items-end gap-16px">
      <Avatar src="https://i.pravatar.cc/150?img=3" size="xs" />
      <Avatar src="https://i.pravatar.cc/150?img=3" size="sm" />
      <Avatar src="https://i.pravatar.cc/150?img=3" size="md" />
      <Avatar src="https://i.pravatar.cc/150?img=3" size="lg" />
      <Avatar src="https://i.pravatar.cc/150?img=3" size="xl" />
    </div>
  ),
};

export const AvatarGroup: Story = {
  args: { size: 'lg' },
  render: () => (
    <div className="flex items-center">
      <Avatar
        src="https://i.pravatar.cc/150?img=1"
        size="lg"
        className="z-40"
      />
      <div style={{ marginLeft: -8 }}>
        <Avatar
          src="https://i.pravatar.cc/150?img=2"
          size="lg"
          className="z-30"
        />
      </div>
      <div style={{ marginLeft: -8 }}>
        <Avatar
          name="Jane Smith"
          size="lg"
          className="z-20"
        />
      </div>
      <div style={{ marginLeft: -8 }}>
        <Avatar
          size="lg"
          className="z-10"
        />
      </div>
    </div>
  ),
};
