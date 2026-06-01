// Post-build step (tsup `onSuccess`): stamp a "use client" directive onto the
// entry files that expose interactive client components.
//
// Why a post-build script instead of an esbuild plugin: esbuild strips
// module-level directives when bundling, and tsup's pipeline re-strips anything
// a preserve-directives plugin re-injects. Stamping the built entry files is the
// reliable approach. A directive on the entry makes its whole imported graph a
// client boundary in React Server Components, so the shared chunks do not each
// need one. The `icons` entry is pure data and is deliberately left untouched so
// it stays usable from Server Components. See ADR-0005.
//
// Idempotent: skips a file that already starts with the directive (safe under
// tsup watch mode). See scripts/check-directives.mjs for the verification guard.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIRECTIVE = "'use client';";

const CLIENT_ENTRIES = [
  'dist/index.js',
  'dist/index.cjs',
  'dist/3d/index.js',
  'dist/3d/index.cjs',
  'dist/charts/index.js',
  'dist/charts/index.cjs',
];

const hasDirective = (code) => {
  const head = code.trimStart();
  return head.startsWith("'use client'") || head.startsWith('"use client"');
};

let stamped = 0;
for (const rel of CLIENT_ENTRIES) {
  const file = path.resolve(rel);
  let code;
  try {
    code = await readFile(file, 'utf8');
  } catch {
    continue; // a format/entry that wasn't emitted — nothing to stamp
  }
  if (hasDirective(code)) continue;
  await writeFile(file, `${DIRECTIVE}\n${code}`);
  stamped += 1;
}

console.log(`[add-use-client] stamped "use client" onto ${stamped} client entr${stamped === 1 ? 'y' : 'ies'}`);
