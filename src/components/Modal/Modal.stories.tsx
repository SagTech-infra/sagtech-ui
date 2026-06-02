import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from './Modal';
import Button from '@/components/Button/Button';

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md'] },
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

export const Medium: Story = {
  args: {
    isOpen: true,
    size: 'md',
    children: (
      <div style={{ color: 'white', padding: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>Medium Modal</h2>
        <p>Wider variant (670px) for multi-column forms or richer content.</p>
      </div>
    ),
  },
};

export const WithTitleAndFooter: Story = {
  name: 'With title + footer slots',
  args: {
    isOpen: true,
    title: 'Delete campaign',
    children: (
      <p className="font-manrope text-14 text-grey_4">
        This action is irreversible. The campaign and all associated leads will be removed.
      </p>
    ),
    footer: (
      <>
        <Button text="Cancel" variant="secondary" buttonSize="small" />
        <Button text="Delete" variant="danger" buttonSize="small" />
      </>
    ),
  },
};

export const Stacked: Story = {
  name: 'Stacked (nested modal)',
  render: () => {
    function StackedDemo() {
      const [isFirst, setFirst] = useState(false);
      const [isSecond, setSecond] = useState(false);
      return (
        <>
          <Button text="Open outer" variant="primary" buttonSize="small" onClick={() => setFirst(true)} />
          <Modal
            isOpen={isFirst}
            toggle={() => setFirst(false)}
            size="md"
            title="Edit profile"
            footer={
              <>
                <Button text="Cancel" variant="secondary" buttonSize="small" onClick={() => setFirst(false)} />
                <Button text="Save" variant="primary" buttonSize="small" onClick={() => setSecond(true)} />
              </>
            }
          >
            <p className="font-manrope text-14 text-grey_4 mb-16px">
              Clicking Save opens a confirm dialog on top of this one. Escape should close only the topmost.
            </p>
          </Modal>
          <Modal
            isOpen={isSecond}
            toggle={() => setSecond(false)}
            title="Confirm changes"
            footer={
              <>
                <Button text="No" variant="secondary" buttonSize="small" onClick={() => setSecond(false)} />
                <Button text="Yes" variant="danger" buttonSize="small" onClick={() => { setSecond(false); setFirst(false); }} />
              </>
            }
          >
            <p className="font-manrope text-14 text-grey_4">Apply the changes to this profile?</p>
          </Modal>
        </>
      );
    }
    return <StackedDemo />;
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
