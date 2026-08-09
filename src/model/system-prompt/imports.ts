import { homedir } from 'node:os';
import { dirname, isAbsolute, resolve } from 'node:path';

// A line whose first non-whitespace character is `@` pulls another file into the prompt. The spec
// has to look like a path — a `/` or a dot — so an `@everyone` in prose isn't read as an import.
const IMPORT_LINE = /^\s*@([^\s]*[./][^\s]*)/;

// ``` or ~~~, with any info string after it.
const FENCE_LINE = /^\s*(```|~~~)/;

// The `@` paths a file pulls in, in the order they appear. Pure: it reads text, not the disk.
//
// Lines inside fenced code blocks are skipped — a CLAUDE.md documenting the `@file` syntax is
// showing you an example, not importing anything.
export const findImportSpecs = (text: string): string[] => {
  const specs: string[] = [];
  let inFence: boolean = false;

  for (const line of text.split(/\r?\n/)) {
    if (FENCE_LINE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match: RegExpMatchArray | null = line.match(IMPORT_LINE);
    if (match) specs.push(match[1]);
  }

  return specs;
};

interface ResolveImportArgs {
  spec: string;
  // The file holding the `@` line — relative specs resolve against its directory.
  fromFile: string;
}

// `@AGENTS.md` next to its importer, `@~/.claude/style.md` under home, `@/etc/…` as given.
export const resolveImport = ({ spec, fromFile }: ResolveImportArgs): string => {
  if (spec.startsWith('~/')) return resolve(homedir(), spec.slice(2));
  if (isAbsolute(spec)) return spec;
  return resolve(dirname(fromFile), spec);
};
