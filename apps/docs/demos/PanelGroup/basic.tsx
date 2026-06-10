'use client';
import { PanelGroup, Panel, PanelResizeHandle } from '@sagtech-infra/ui';

const paneClass =
  'h-full w-full flex items-center justify-center bg-black_2 text-white font-manrope text-14';

export default function Demo() {
  return (
    <div className="h-[320px] w-full max-w-[640px] bg-black_1 p-24px">
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
    </div>
  );
}
