'use client';
import { FAB } from '@sagtech-infra/ui';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Demo() {
  return (
    // A `transform` makes this element the containing block for the FAB's
    // `position: fixed`, so it stays inside the example frame.
    <div
      style={{ transform: 'translateZ(0)' }}
      className="relative w-full h-[260px] rounded-16px bg-black_2 overflow-hidden p-20px"
    >
      <div className="h-16px w-1/3 rounded-8px bg-black_3" />
      <div className="mt-12px h-12px w-2/3 rounded-8px bg-black_3" />
      <div className="mt-8px h-12px w-1/2 rounded-8px bg-black_3" />
      <FAB icon={<PlusIcon />} label="Create" extended position="bottom-right" onClick={() => {}} />
    </div>
  );
}
