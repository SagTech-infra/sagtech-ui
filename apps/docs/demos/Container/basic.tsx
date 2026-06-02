'use client';
import { Container } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <Container size="md" as="section">
      <div className="rounded-8px border border-dashed border-pr_purple p-24px text-center font-manrope text-14 text-sec_purple">
        size=&quot;md&quot; centred wrapper (max-width 960px)
      </div>
    </Container>
  );
}
