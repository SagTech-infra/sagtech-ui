'use client';
import { Point } from '@sagtech-infra/ui';

export default function Demo() {
  return (
    <div className="flex flex-col gap-12px">
      <Point text="10+ Team Members" type="BodyM" textColor="text-grey_4" iconName="users" />
      <Point text="Jan 2024 - Present" type="BodyM" textColor="text-grey_4" iconName="calendar" />
      <Point
        text="React, TypeScript, Node.js"
        type="BodyS"
        textColor="text-white_4"
        icon={false}
        circleColor="bg-pr_purple"
      />
    </div>
  );
}
