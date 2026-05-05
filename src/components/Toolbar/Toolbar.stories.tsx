import type { Meta, StoryObj } from '@storybook/react';
import Toolbar from './Toolbar';

const Btn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...props}
    className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-[6px] text-grey_4 hover:bg-black_3 hover:text-white_4 cursor-pointer transition-colors"
  >
    {children}
  </button>
);

const meta = {
  title: 'Layout/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ariaLabel: 'Text formatting',
    children: (
      <>
        <Btn aria-label="Bold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 4h6.5a4 4 0 0 1 0 8H6V4zm0 8h7.5a4 4 0 0 1 0 8H6v-8z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Btn>
        <Btn aria-label="Italic">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 4h-9M14 20H5M15 4l-6 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Btn>
        <Btn aria-label="Underline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 4v8a6 6 0 0 0 12 0V4M5 21h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Btn>
        <Toolbar.Separator />
        <Btn aria-label="Align left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h10M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Btn>
        <Btn aria-label="Align center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M7 12h10M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Btn>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    ariaLabel: 'Sidebar tools',
    orientation: 'vertical',
    children: (
      <>
        <Btn aria-label="Pencil">P</Btn>
        <Btn aria-label="Brush">B</Btn>
        <Toolbar.Separator />
        <Btn aria-label="Eraser">E</Btn>
        <Btn aria-label="Eyedropper">D</Btn>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    ariaLabel: 'Compact actions',
    size: 'sm',
    children: (
      <>
        <Btn aria-label="Up">↑</Btn>
        <Btn aria-label="Down">↓</Btn>
        <Toolbar.Separator />
        <Btn aria-label="Delete">×</Btn>
      </>
    ),
  },
};
