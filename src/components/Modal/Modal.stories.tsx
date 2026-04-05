import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from './Modal';

const meta = {
  title: 'Layout/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    isPartnershipForm: { control: 'boolean' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    children: (
      <div style={{ color: 'white', textAlign: 'center', padding: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>Modal Title</h2>
        <p>This is modal content. Press Escape or click the backdrop to close.</p>
      </div>
    ),
  },
};

export const PartnershipForm: Story = {
  args: {
    isOpen: true,
    isPartnershipForm: true,
    children: (
      <div style={{ color: 'white', padding: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>Partnership Form</h2>
        <p>This is a wider modal variant for partnership forms.</p>
      </div>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '12px 24px',
            background: '#6D3EF1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Open Modal
        </button>
        <Modal isOpen={isOpen} toggle={() => setIsOpen(false)}>
          <div style={{ color: 'white', textAlign: 'center', padding: '24px' }}>
            <h2 style={{ marginBottom: '16px' }}>Interactive Modal</h2>
            <p>Click the backdrop or press Escape to close.</p>
          </div>
        </Modal>
      </div>
    );
  },
};
