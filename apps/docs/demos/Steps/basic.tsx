'use client';
import { Steps } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="w-full max-w-[480px] py-32px">
      <Steps
        stepsList={[
          { title: 'Discovery', description: 'We analyze your requirements and define the scope.' },
          { title: 'Design', description: 'Creating wireframes, prototypes, and visual designs.' },
          { title: 'Development', description: 'Building the solution with agile methodology.' },
          { title: 'Launch', description: 'Deployment, monitoring, and post-launch support.' },
        ]}
      />
    </div>
  );
}
