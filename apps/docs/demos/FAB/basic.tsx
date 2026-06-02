'use client';
import { FAB } from '@sagtech-infra/ui';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Demo() {
  return (
    <div className="relative w-full h-[240px] rounded-16px bg-black_2 overflow-hidden">
      <FAB icon={<PlusIcon />} label="Create" extended position="bottom-right" onClick={() => {}} />
    </div>
  );
}
