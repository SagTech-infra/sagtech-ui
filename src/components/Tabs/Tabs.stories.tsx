import type { Meta, StoryObj } from '@storybook/react';
import Tabs from './Tabs';

const meta = {
  title: 'Data Display/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    defaultIndex: { control: 'number' },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        label: 'Overview',
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>This is the overview panel content. It provides a high-level summary of the project scope, timeline, and deliverables.</p>
          </div>
        ),
      },
      {
        label: 'Details',
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>Detailed information about the implementation, including technical stack, architecture decisions, and integration points.</p>
          </div>
        ),
      },
    ],
  },
};

export const ThreeTabs: Story = {
  args: {
    items: [
      {
        label: 'Web Development',
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>Modern web applications built with React, Next.js, and TypeScript for scalable, maintainable solutions.</p>
          </div>
        ),
      },
      {
        label: 'Mobile',
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>Cross-platform mobile apps for iOS and Android using React Native and Flutter.</p>
          </div>
        ),
      },
      {
        label: 'Cloud & DevOps',
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>Scalable cloud infrastructure with AWS, Docker, and Kubernetes for reliable deployments.</p>
          </div>
        ),
      },
    ],
  },
};

export const Interactive: Story = {
  args: {
    onChange: (index: number) => console.log('Tab changed to:', index),
    items: [
      {
        label: 'First Tab',
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>Content for the first tab. Switch tabs and check the console for onChange events.</p>
          </div>
        ),
      },
      {
        label: 'Second Tab',
        content: (
          <div className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
            <p>Content for the second tab. The onChange callback fires on each switch.</p>
          </div>
        ),
      },
    ],
  },
};
