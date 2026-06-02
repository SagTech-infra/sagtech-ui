'use client';
import { Skeleton } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-16px p-24px bg-black_1 rounded-16px w-full max-w-[320px]">
      <div className="flex items-center gap-12px">
        <Skeleton width={40} height={40} rounded="circle" />
        <div className="flex flex-col gap-4px flex-1">
          <Skeleton width={120} height={12} rounded="pill" />
          <Skeleton width={80} height={10} rounded="pill" />
        </div>
      </div>
      <Skeleton height={12} count={3} />
    </div>
  );
}
