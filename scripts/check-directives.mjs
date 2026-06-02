// Verification guard (run in the build gate via `pnpm check:directives`):
// assert the client entry files carry a leading "use client" directive and that
// the server-safe `icons` entry does NOT. Catches a regression if the post-build
// stamping (scripts/add-use-client.mjs / tsup `onSuccess`) is removed or broken.
// See ADR-0005.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const CLIENT_ENTRIES = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/3d/index.js',
  'dist/3d/index.cjs',
  'dist/charts/index.js',
  'dist/charts/index.cjs',
];

// Exposed via the package `exports` map and meant to be importable from Server
// Components — must stay free of a client boundary.
const SERVER_SAFE_ENTRIES = ['dist/icons/index.js'];

const hasDirective = (code) => {
  const head = code.trimStart();
  return head.startsWith("'use client'") || head.startsWith('"use client"');
};

const read = async (rel) => {
  try {
    return await readFile(path.resolve(rel), 'utf8');
  } catch {
    return null;
  }
};

const failures = [];

for (const rel of CLIENT_ENTRIES) {
  const code = await read(rel);
  if (code === null) {
    failures.push(`${rel}: file missing (did the build run?)`);
  } else if (!hasDirective(code)) {
    failures.push(`${rel}: missing leading "use client" directive`);
  }
}

for (const rel of SERVER_SAFE_ENTRIES) {
  const code = await read(rel);
  if (code !== null && hasDirective(code)) {
    failures.push(`${rel}: must NOT carry "use client" (server-safe entry)`);
  }
}

if (failures.length > 0) {
  console.error('[check:directives] FAIL:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('[check:directives] OK — client entries carry "use client"; icons stays server-safe');
