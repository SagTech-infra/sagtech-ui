import type { Meta, StoryObj } from '@storybook/react';
import FaqDropdown from './FaqDropdown';

const sampleFaqList = [
  {
    title: 'What services do you offer?',
    description:
      'We offer a wide range of software development services including web applications, mobile apps, and cloud solutions.',
  },
  {
    title: 'How long does a typical project take?',
    description:
      'Project timelines vary depending on scope and complexity. A typical project takes between 3-6 months from kickoff to launch.',
  },
  {
    title: 'What is your pricing model?',
    description:
      'We offer flexible pricing models including fixed price, time & materials, and dedicated team arrangements.',
  },
  {
    title: 'Do you provide ongoing support?',
    description:
      'Yes, we provide ongoing maintenance and support packages to ensure your application runs smoothly after launch.',
  },
];

const meta = {
  title: 'Data Display/FaqDropdown',
  component: FaqDropdown,
  tags: ['autodocs'],
  argTypes: {
    isVisibleTitle: { control: 'boolean' },
    isCareersPage: { control: 'boolean' },
  },
} satisfies Meta<typeof FaqDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    faqList: sampleFaqList,
  },
};

export const WithoutTitle: Story = {
  args: {
    faqList: sampleFaqList,
    isVisibleTitle: false,
  },
};

export const WithCustomDescription: Story = {
  args: {
    faqList: sampleFaqList,
    renderDescription: (description: string) => (
      <span>
        {description}{' '}
        <a href="#" className="text-pr_purple underline">
          Learn more
        </a>
      </span>
    ),
  },
};

export const CareersVariant: Story = {
  args: {
    faqList: sampleFaqList,
    isCareersPage: true,
  },
};
