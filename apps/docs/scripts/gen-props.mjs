// Extracts component prop metadata from the library's TS source via
// react-docgen-typescript and writes content/props.generated.json keyed by
// component display name. Resilient: parse failures are logged, not fatal.
//
// Usage:
//   node scripts/gen-props.mjs            # all components
//   node scripts/gen-props.mjs Button     # only the named component(s)

import {
  readdirSync,
  existsSync,
  writeFileSync,
  mkdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import docgen from 'react-docgen-typescript';

const here = dirname(fileURLToPath(import.meta.url)); // apps/docs/scripts
const appRoot = join(here, '..'); // apps/docs
const repoRoot = join(appRoot, '..', '..'); // repo root
const componentsDir = join(repoRoot, 'src', 'components');
const outFile = join(appRoot, 'content', 'props.generated.json');

const only = process.argv.slice(2);

const files = readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((n) => only.length === 0 || only.includes(n))
  .map((n) => join(componentsDir, n, `${n}.tsx`))
  .filter((f) => existsSync(f));

const parser = docgen.withCustomConfig(join(repoRoot, 'tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) =>
    prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
});

const out = {};
let parsed = [];
try {
  parsed = parser.parse(files);
} catch (err) {
  console.warn('docgen parse failed:', err.message);
}

for (const doc of parsed) {
  out[doc.displayName] = Object.values(doc.props).map((p) => ({
    name: p.name,
    type: p.type?.name ?? '',
    required: Boolean(p.required),
    defaultValue: p.defaultValue ? p.defaultValue.value : null,
    description: p.description ?? '',
  }));
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  `props.generated.json: ${Object.keys(out).length} component(s) from ${files.length} file(s)`,
);
