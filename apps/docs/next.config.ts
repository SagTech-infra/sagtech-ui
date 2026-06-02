import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The UI library is consumed via `link:../..` (its published `exports` map).
  // dist ships ESM with 'use client' directives preserved, so Next consumes it
  // directly; transpilePackages is a safety net for any untranspiled syntax.
  transpilePackages: ['@sagtech-infra/ui'],
};

export default nextConfig;
