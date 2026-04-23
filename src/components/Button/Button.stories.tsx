import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Form Controls/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'tabButton', 'tabButtonWhite'],
    },
    buttonSize: {
      control: 'select',
      options: ['small', 'large', 'tabSize'],
    },
    stateOfButton: {
      control: 'select',
      options: ['default', 'active'],
    },
    text: { control: 'text' },
    disabled: { control: 'boolean' },
    loadingType: { control: 'boolean' },
    useIcon: { control: 'boolean' },
    hoverOff: { control: 'boolean' },
    changeColor: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { text: 'Get Started', variant: 'primary', buttonSize: 'large' },
};

export const Secondary: Story = {
  args: { text: 'Learn More', variant: 'secondary', buttonSize: 'large' },
};

export const Danger: Story = {
  args: { text: 'Delete', variant: 'danger', buttonSize: 'large' },
};

export const DangerSmall: Story = {
  args: { text: 'Remove', variant: 'danger', buttonSize: 'small' },
};

export const PrimarySmall: Story = {
  args: { text: 'Got it', variant: 'primary', buttonSize: 'small' },
};

export const WithIcon: Story = {
  args: { text: 'Projects', variant: 'primary', buttonSize: 'large', useIcon: true },
};

export const Disabled: Story = {
  args: { text: 'Submit', variant: 'primary', buttonSize: 'large', disabled: true },
};

export const Loading: Story = {
  args: { text: 'Sending...', variant: 'primary', buttonSize: 'large', loadingType: true },
};

export const TabButton: Story = {
  args: { text: 'Web Development', variant: 'tabButton', buttonSize: 'tabSize' },
};

export const TabButtonActive: Story = {
  args: { text: 'Mobile', variant: 'tabButton', buttonSize: 'tabSize', stateOfButton: 'active' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button text="Primary Large" variant="primary" buttonSize="large" />
        <Button text="Primary Small" variant="primary" buttonSize="small" />
        <Button text="Primary Disabled" variant="primary" buttonSize="large" disabled />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button text="Secondary Large" variant="secondary" buttonSize="large" />
        <Button text="Secondary Small" variant="secondary" buttonSize="small" />
        <Button text="Secondary Disabled" variant="secondary" buttonSize="large" disabled />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button text="Danger Large" variant="danger" buttonSize="large" />
        <Button text="Danger Small" variant="danger" buttonSize="small" />
        <Button text="Danger Disabled" variant="danger" buttonSize="large" disabled />
        <Button text="Danger Loading" variant="danger" buttonSize="large" loadingType />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button text="Tab Default" variant="tabButton" buttonSize="tabSize" />
        <Button text="Tab Active" variant="tabButton" buttonSize="tabSize" stateOfButton="active" />
        <Button text="Tab Disabled" variant="tabButton" buttonSize="tabSize" disabled />
      </div>
    </div>
  ),
};
