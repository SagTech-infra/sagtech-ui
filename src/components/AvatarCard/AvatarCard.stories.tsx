import type { Meta, StoryObj } from '@storybook/react';
import AvatarCard from './AvatarCard';

const meta = {
  title: 'Data Display/AvatarCard',
  component: AvatarCard,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    info: { control: 'text' },
  },
} satisfies Meta<typeof AvatarCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Doe',
    info: 'Senior Developer',
    children: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #6D3EF1, #292A94)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '48px',
          fontWeight: 'bold',
        }}
      >
        JD
      </div>
    ),
  },
};

export const WithImage: Story = {
  args: {
    name: 'Jane Smith',
    info: 'Product Designer',
    children: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#3a3a5c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '48px',
        }}
      >
        JS
      </div>
    ),
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <AvatarCard name="Alice" info="CTO">
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#6D3EF1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
          }}
        >
          A
        </div>
      </AvatarCard>
      <AvatarCard name="Bob" info="Lead Engineer">
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#292A94',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
          }}
        >
          B
        </div>
      </AvatarCard>
    </div>
  ),
};
