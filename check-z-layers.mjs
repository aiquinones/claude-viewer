import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

// Where a z-index is allowed to be a number.
const SCALE = 'src/webview/z-layers.ts';

const ROOTS = ['src/webview', 'stories'];
const EXTENSIONS = ['.ts', '.tsx', '.css'];

// A Tailwind `z-*` utility, a literal `zIndex`, or a raw CSS `z-index`. The utility pattern needs
// the digit or bracket: `z-layers` and `.bot-z--2` are not z-index utilities.
const PATTERNS = [
  { test: /\bz-(?:\[|\d)/, name: 'a z-* utility' },
  { test: /zIndex\s*:\s*\d/, name: 'a literal zIndex' },
  { test: /z-index\s*:\s*[^;]*\d/, name: 'a raw z-index' }
];

const walk = async (dir) => {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(path)));
    else if (EXTENSIONS.some((extension) => entry.name.endsWith(extension))) found.push(path);
  }
  return found;
};

// Every z-index in the webview goes through the one scale, so adding something that floats means
// placing it in the hierarchy rather than picking a number that happens to work today. Two things
// at the same number resolve by DOM order, which is how a hover card ends up behind the markdown
// body under it — a bug that only shows on the one row that scrolls next to the one bar.
export const checkZLayers = async () => {
  const offenders = [];

  for (const root of ROOTS) {
    for (const file of await walk(root)) {
      if (relative('.', file) === SCALE) continue;

      const lines = (await readFile(file, 'utf8')).split('\n');
      lines.forEach((line, index) => {
        const hit = PATTERNS.find((pattern) => pattern.test.test(line));
        if (hit) offenders.push(`  ${file}:${index + 1} — ${hit.name}`);
      });
    }
  }

  if (offenders.length === 0) return;

  throw new Error(
    `z-index outside ${SCALE}:\n${offenders.join('\n')}\n\n` +
      `Name a layer instead: \`style={{ zIndex: Z.card }}\`. If none of them fits, add one to\n` +
      `LAYER_ORDER in ${SCALE} — where it goes in that list is what it stacks over and under.`
  );
};
