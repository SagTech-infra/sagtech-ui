'use client';
import { Badge } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-8px">
      <Badge variant="filled" color="purple">Filled</Badge>
      <Badge variant="outlined" color="blue">Outlined</Badge>
      <Badge variant="subtle" color="success">Subtle</Badge>
      <Badge color="warning" dot>With dot</Badge>
      <Badge color="error" size="sm">Small</Badge>
    </div>
  );
}
