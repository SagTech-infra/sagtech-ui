import type { Meta, StoryObj } from '@storybook/react';
import Steps from './Steps';
import { SagtechUIProvider, type UIImageComponent } from '@/providers';

const meta = {
  title: 'Data Display/Steps',
  component: Steps,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full min-h-[420px] py-32px">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stepsList: [
      { title: 'Discovery', description: 'We analyze your requirements and define the scope.' },
      { title: 'Design', description: 'Creating wireframes, prototypes, and visual designs.' },
      { title: 'Development', description: 'Building the solution with agile methodology.' },
      { title: 'Testing', description: 'Quality assurance and user acceptance testing.' },
      { title: 'Launch', description: 'Deployment, monitoring, and post-launch support.' },
    ],
  },
};

export const ThreeSteps: Story = {
  args: {
    stepsList: [
      { title: 'Step 1', description: 'First step description' },
      { title: 'Step 2', description: 'Second step description' },
      { title: 'Step 3', description: 'Third step description' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    stepsList: [
      { title: 'Team Setup', description: 'Assemble the right team for your project.', icon: 'users' },
      { title: 'Timeline', description: 'Define milestones and delivery dates.', icon: 'calendar' },
      { title: 'Execution', description: 'Build and iterate on the solution.', icon: 'job' },
    ],
  },
};

export const Phases: Story = {
  args: {
    isPhases: true,
    stepsList: [
      { title: 'Phase 1: Research', description: 'Market analysis and user research.' },
      { title: 'Phase 2: MVP', description: 'Minimum viable product development.' },
      { title: 'Phase 3: Scale', description: 'Scaling infrastructure and features.' },
      { title: 'Phase 4: Optimize', description: 'Performance optimization and refinement.' },
    ],
  },
};

const OutlinedImage: UIImageComponent = ({ src, alt, width, height }) => (
  <img
    src={typeof src === 'string' ? src : ''}
    alt={alt}
    width={width as number | undefined}
    height={height as number | undefined}
    style={{ outline: '2px dashed #6D3EF1', padding: 2 }}
  />
);

export const WithCustomProvider: Story = {
  name: 'With SagtechUIProvider override',
  render: () => (
    <SagtechUIProvider imageComponent={OutlinedImage}>
      <Steps
        stepsList={[
          { title: 'Team Setup', description: 'Custom imageComponent applied.', icon: 'users' },
          { title: 'Timeline', description: 'Icons use the provider slot.', icon: 'calendar' },
        ]}
      />
    </SagtechUIProvider>
  ),
};
