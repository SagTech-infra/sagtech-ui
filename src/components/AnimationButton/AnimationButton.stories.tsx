import type { Meta, StoryObj } from '@storybook/react';
import AnimationButton from './AnimationButton';

const meta = {
  title: 'Feedback/AnimationButton',
  component: AnimationButton,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="project-card" style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AnimationButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: 'View Project' },
};

export const ShortText: Story = {
  args: { text: 'Go' },
};

export const LongText: Story = {
  args: { text: 'Explore this case study' },
};
