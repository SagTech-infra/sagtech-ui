import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The UI library is consumed via `link:../..` (its published `exports` map).
  // dist ships ESM with 'use client' directives preserved, so Next consumes it
  // directly; transpilePackages is a safety net for any untranspiled syntax.
  transpilePackages: ['@sagtech-infra/ui'],
  // Self-contained server bundle for the Docker image (CMD `node server.js`).
  output: 'standalone',
  // The library lives at the monorepo root and is linked via `link:../..`, so
  // file-tracing must root at the repo root (two levels up) for Next to bundle
  // the linked `dist` into `.next/standalone`. `next build` always runs from
  // this package dir (pnpm --filter sets cwd here), so cwd === apps/docs.
  outputFileTracingRoot: path.join(process.cwd(), '..', '..'),
};

export default nextConfig;
