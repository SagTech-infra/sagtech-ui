import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';

const sampleData = [
  {
    title: 'Discovery',
    text: 'We analyze your business requirements and define the project scope to ensure alignment with your goals.',
  },
  {
    title: 'Design',
    text: 'Our team creates wireframes and visual designs that bring your vision to life with user-centered approach.',
  },
  {
    title: 'Development',
    text: 'We build your solution using modern technologies and agile methodology for rapid delivery.',
  },
  {
    title: 'Testing',
    text: 'Rigorous QA testing ensures your product meets the highest quality standards before launch.',
  },
  {
    title: 'Launch',
    text: 'We deploy your solution and provide ongoing support to ensure smooth operation.',
  },
];

const meta = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    visibleSlides: {
      control: { type: 'number', min: 1, max: 6 },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: sampleData,
    isInView: true,
  },
};

export const TwoPerScreen: Story = {
  args: {
    data: sampleData,
    visibleSlides: 2,
  },
};

export const ThreePerScreen: Story = {
  args: {
    data: sampleData,
    visibleSlides: 3,
  },
};

export const FourPerScreen: Story = {
  args: {
    data: sampleData.slice(0, 4),
    visibleSlides: 4,
  },
};
