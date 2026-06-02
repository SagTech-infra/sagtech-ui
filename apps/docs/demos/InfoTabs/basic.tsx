'use client';
import { InfoTabs } from '@sagtech-infra/ui';

const tabs = [
  {
    title: 'Web Development',
    description:
      'We build modern, scalable web applications using the latest technologies and best practices.',
    buttonText: 'Get Started',
    role: 'web-dev',
  },
  {
    title: 'Mobile Development',
    description:
      'Native and cross-platform mobile apps for iOS and Android with exceptional user experience.',
    buttonText: 'Learn More',
    role: 'mobile-dev',
  },
  {
    title: 'Cloud Solutions',
    description:
      'Enterprise-grade cloud infrastructure and DevOps services for optimal performance and scalability.',
    role: 'cloud',
  },
];

export default function Demo() {
  return <InfoTabs title="Our Services" list={tabs} />;
}
