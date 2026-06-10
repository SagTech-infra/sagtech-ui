'use client';
import { Point } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-12px">
      <Point
        text="10+ Team Members"
        type="BodyM"
        textColor="text-white"
        icon={false}
        circleColor="bg-pr_purple"
      />
      <Point
        text="Jan 2024 - Present"
        type="BodyM"
        textColor="text-white"
        icon={false}
        circleColor="bg-sec_purple"
      />
      <Point
        text="React, TypeScript, Node.js"
        type="BodyS"
        textColor="text-white"
        icon={false}
        circleColor="bg-success"
      />
    </div>
  );
}
