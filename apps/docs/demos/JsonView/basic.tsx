'use client';
import { JsonView } from '@sagtech-infra/ui';

export default function Demo() {
  const data = {
    id: 42,
    name: 'SagTech UI',
    active: true,
    tags: ['ui', 'library', 'react'],
    author: { name: 'Andrew', email: 'andrew@sagtech.io' },
  };

  return (
    <div className="w-full max-w-[480px]">
      <JsonView data={data} collapsed={2} copy />
    </div>
  );
}
