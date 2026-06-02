'use client';
import { Icon } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-24px">
      <Icon icon="arrow" size={32} color="#F8F8F8" />
      <Icon icon="chevrondown" size={16} color="#F8F8F8" />
      <Icon icon="call" size={48} color="#6D3EF1" />
      <Icon icon="attach" size={24} color="#B5B5B9" text="Attach file" />
    </div>
  );
}
