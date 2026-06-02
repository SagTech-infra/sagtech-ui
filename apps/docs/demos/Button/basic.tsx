'use client';

import { Button } from '@sagtech-infra/ui';

export function ButtonBasicDemo() {
  return (
    <div className="flex flex-wrap items-center gap-16px">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="primary" shape="pill">
        Pill
      </Button>
      <Button variant="primary" useIcon>
        With icon
      </Button>
      <Button variant="primary" loadingType>
        Loading
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  );
}
