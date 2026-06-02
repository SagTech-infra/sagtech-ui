'use client';
import { Tabs } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="w-full max-w-[480px]">
      <Tabs
        items={[
          {
            label: 'Overview',
            content: (
              <p className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
                A high-level summary of the project scope, timeline, and deliverables.
              </p>
            ),
          },
          {
            label: 'Details',
            content: (
              <p className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
                Technical stack, architecture decisions, and integration points.
              </p>
            ),
          },
          {
            label: 'Activity',
            content: (
              <p className="text-grey_4 font-manrope text-14 leading-28 mt-24px">
                Recent changes and a log of who did what and when.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}
