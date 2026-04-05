import type { Meta, StoryObj } from '@storybook/react';
import Typography from './Typography';

const meta = {
  title: 'Foundations/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    tag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'p', 'span'],
    },
    type: {
      control: 'select',
      options: [
        'BodyXL', 'BodyL', 'BodyM', 'BodyS', 'BodyXS',
        'Labels', 'LabelsS', 'Info', 'InfoBold',
        'Buttons', 'ButtonsSemibold', 'ButtonsS', 'ButtonsSBold', 'ButtonsBold',
        'M3HeadlineSmall', 'MetricsTitle', 'MetricsXL', 'TabInfoTitle', 'HeroSubtitle',
      ],
    },
    color: {
      control: 'select',
      options: [
        'text-white_4', 'text-white_3', 'text-white_2', 'text-white_1', 'text-white',
        'text-grey_4', 'text-grey_3', 'text-grey_2', 'text-grey_1',
        'text-pr_purple', 'text-sec_purple', 'text-pr_blue', 'text-sec_blue',
        'text-error', 'text-warning', 'text-success',
      ],
    },
    text: { control: 'text' },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: { tag: 'h1', text: 'Heading 1', color: 'text-white_4' },
};

export const Heading2: Story = {
  args: { tag: 'h2', text: 'Heading 2', color: 'text-white_4' },
};

export const Heading3: Story = {
  args: { tag: 'h3', text: 'Heading 3', color: 'text-white_4' },
};

export const BodyLarge: Story = {
  args: { type: 'BodyL', text: 'Body Large text example', color: 'text-white_1' },
};

export const BodyMedium: Story = {
  args: { type: 'BodyM', text: 'Body Medium text example', color: 'text-grey_4' },
};

export const Label: Story = {
  args: { type: 'Labels', text: 'Label text', color: 'text-white_4' },
};

export const Info: Story = {
  args: { type: 'Info', text: 'Info caption text', color: 'text-grey_2' },
};

export const MetricsXL: Story = {
  args: { type: 'MetricsXL', text: '150+', color: 'text-pr_purple' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography tag="h1" color="text-white_4">H1 — Orbitron Bold</Typography>
      <Typography tag="h2" color="text-white_4">H2 — Orbitron Bold</Typography>
      <Typography tag="h3" color="text-white_4">H3 — Manrope Bold</Typography>
      <Typography tag="h4" color="text-white_4">H4 — Manrope Semibold</Typography>
      <Typography type="BodyXL" color="text-white_4">BodyXL — Orbitron Bold</Typography>
      <Typography type="BodyL" color="text-white_1">BodyL — Manrope Medium</Typography>
      <Typography type="BodyM" color="text-grey_4">BodyM — Manrope Medium</Typography>
      <Typography type="Labels" color="text-white_4">Labels — Manrope Semibold</Typography>
      <Typography type="Buttons" color="text-pr_purple">Buttons — Manrope Bold</Typography>
      <Typography type="Info" color="text-grey_2">Info — Manrope Medium 12px</Typography>
    </div>
  ),
};
