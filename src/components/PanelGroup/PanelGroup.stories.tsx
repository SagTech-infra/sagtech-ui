import type { Meta, StoryObj } from '@storybook/react';
import { PanelGroup, Panel, PanelResizeHandle } from './PanelGroup';

const meta = {
  title: 'Layout/PanelGroup',
  component: PanelGroup,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-[480px] w-full bg-black_1 p-24px">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const paneClass =
  'h-full w-full flex items-center justify-center bg-black_2 text-grey_4 font-manrope text-14';

export const HorizontalSplit: Story = {
  render: () => (
    <PanelGroup
      direction="horizontal"
      className="h-full rounded-8px border border-solid border-black_3 overflow-hidden"
    >
      <Panel defaultSize={30} minSize={15}>
        <div className={paneClass}>Sidebar</div>
      </Panel>
      <PanelResizeHandle direction="horizontal" />
      <Panel minSize={20}>
        <div className={paneClass}>Main content</div>
      </Panel>
    </PanelGroup>
  ),
};

export const VerticalSplit: Story = {
  render: () => (
    <PanelGroup
      direction="vertical"
      className="h-full rounded-8px border border-solid border-black_3 overflow-hidden"
    >
      <Panel defaultSize={60} minSize={20}>
        <div className={paneClass}>Editor</div>
      </Panel>
      <PanelResizeHandle direction="vertical" />
      <Panel minSize={15} collapsible>
        <div className={paneClass}>Terminal</div>
      </Panel>
    </PanelGroup>
  ),
};
