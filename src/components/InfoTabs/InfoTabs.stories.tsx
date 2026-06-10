import type { Meta, StoryObj } from '@storybook/react';
import InfoTabs from './InfoTabs';
import type { InfoTab } from './types';

const sampleTabs: InfoTab[] = [
  {
    title: 'Web Development',
    description:
      'We build modern, scalable web applications using the latest technologies and best practices.',
    buttonText: 'Get Started',
    role: 'web-dev',
  },
  {
    title: 'Mobile Development',
    description:
      'Native and cross-platform mobile apps for iOS and Android with exceptional user experience.',
    buttonText: 'Learn More',
    role: 'mobile-dev',
  },
  {
    title: 'Cloud Solutions',
    description:
      'Enterprise-grade cloud infrastructure and DevOps services for optimal performance and scalability.',
    role: 'cloud',
  },
  {
    title: 'UI/UX Design',
    description:
      'User-centered design approach that creates intuitive and visually appealing interfaces.',
    buttonText: 'View Portfolio',
    role: 'design',
  },
];

const meta = {
  title: 'Data Display/InfoTabs',
  component: InfoTabs,
  tags: ['autodocs'],
} satisfies Meta<typeof InfoTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Our Services',
    list: sampleTabs,
  },
};

export const WithModal: Story = {
  args: {
    title: 'Partnership Opportunities',
    list: sampleTabs,
    renderModal: ({ isOpen, toggle, role }) =>
      isOpen ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black_1 p-24px rounded-16px border border-pr_purple">
            <p className="text-white mb-16px">Modal for role: {role}</p>
            <button
              type="button"
              onClick={toggle}
              className="px-16px py-8px bg-pr_purple text-white rounded-8px"
            >
              Close
            </button>
          </div>
        </div>
      ) : null,
  },
};

export const WithoutButtons: Story = {
  args: {
    title: 'Information',
    list: sampleTabs.map(({ buttonText, ...rest }) => rest),
  },
};
