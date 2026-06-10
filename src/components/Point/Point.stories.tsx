import type { Meta, StoryObj } from '@storybook/react';
import Point from './Point';

const meta = {
  title: 'Data Display/Point',
  component: Point,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['BodyL', 'BodyM', 'BodyS', 'Labels', 'LabelsS', 'Info'],
    },
    textColor: {
      control: 'select',
      options: ['text-white_4', 'text-grey_4', 'text-pr_purple', 'text-white_1'],
    },
    circleColor: {
      control: 'select',
      options: ['bg-pr_purple', 'bg-sec_purple', 'bg-white_4', 'bg-grey_4'],
    },
    icon: { control: 'boolean' },
    isWrapText: { control: 'boolean' },
    iconName: {
      control: 'select',
      options: ['users', 'calendar', 'job', 'salary', 'location'],
    },
  },
} satisfies Meta<typeof Point>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {
  args: {
    text: '10+ Team Members',
    type: 'BodyM',
    textColor: 'text-grey_4',
    icon: true,
    iconName: 'users',
  },
};

export const WithCircle: Story = {
  args: {
    text: 'React, TypeScript, Node.js',
    type: 'BodyS',
    textColor: 'text-white_4',
    icon: false,
    circleColor: 'bg-pr_purple',
  },
};

export const NoWrap: Story = {
  args: {
    text: 'Full width text without wrapping constraint',
    type: 'BodyM',
    textColor: 'text-grey_4',
    icon: false,
    isWrapText: false,
  },
};

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Point text="10+ Team Members" type="BodyM" textColor="text-grey_4" iconName="users" />
      <Point text="Jan 2024 - Present" type="BodyM" textColor="text-grey_4" iconName="calendar" />
      <Point text="Senior Developer" type="BodyM" textColor="text-grey_4" iconName="job" />
      <Point text="$120k - $150k" type="BodyM" textColor="text-grey_4" iconName="salary" />
      <Point text="New York, USA" type="BodyM" textColor="text-grey_4" iconName="location" />
    </div>
  ),
};

export const CircleVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Point text="Purple circle" type="BodyS" textColor="text-white_4" icon={false} circleColor="bg-pr_purple" />
      <Point text="White circle" type="BodyS" textColor="text-white_4" icon={false} circleColor="bg-white_4" />
      <Point text="Grey circle" type="BodyS" textColor="text-grey_4" icon={false} circleColor="bg-grey_4" />
    </div>
  ),
};

