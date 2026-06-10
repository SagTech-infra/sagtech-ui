'use client';
import { PanelGroup, Panel, PanelResizeHandle } from '@sagtech-infra/ui';

const paneClass =
  'h-full w-full flex items-center justify-center bg-bg-tertiary text-fg-primary font-manrope text-14';

export default function Demo() {
  return (
    <div className="h-[320px] w-full max-w-[640px] bg-bg-secondary p-24px">
      <PanelGroup
        direction="horizontal"
        className="h-full rounded-8px border border-solid border-border-default overflow-hidden"
      >
        <Panel defaultSize={30} minSize={15}>
          <div className={paneClass}>Sidebar</div>
        </Panel>
        <PanelResizeHandle direction="horizontal" />
        <Panel minSize={20}>
          <div className={paneClass}>Main content</div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
