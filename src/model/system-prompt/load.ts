import { promptRoots } from '../../config/paths';
import { readTextFile } from '../../config/read';
import { ConfigError, Result } from '../../config/result';
import { estimateTokens } from '../estimate-tokens';
import { ConfigIssue, PromptRoot, SystemPromptFile } from '../types';
import { findImportSpecs, resolveImport } from './imports';

// How many import hops below a file on disk the walk follows before it stops and says so.
const MAX_IMPORT_DEPTH: number = 5;

// Locate → read → follow imports → typed entries, the same shape the skills loader uses. The
// result is flat and in load order: `depth` carries the import tree, so nothing has to nest.
export const loadSystemPrompt = async (
  workspaceRoot: string | undefined
): Promise<SystemPromptFile[]> => {
  const roots: PromptRoot[] = await promptRoots(workspaceRoot);
  const files: SystemPromptFile[] = [];

  // Sequential on purpose: this list *is* the order Claude reads them in.
  for (const root of roots) {
    await walk({ path: root.path, root, depth: 0, chain: [], files });
  }

  return files.map((file, index) => ({ ...file, order: index + 1 }));
};

interface WalkArgs {
  path: string;
  root: PromptRoot;
  depth: number;
  // The files above this one on the current import chain, used to catch cycles.
  chain: string[];
  // Appended to in place, so the order files are visited is the order they end up in.
  files: SystemPromptFile[];
  importedBy?: string;
}

const walk = async ({ path, root, depth, chain, files, importedBy }: WalkArgs): Promise<void> => {
  const read: Result<string, ConfigError> = await readTextFile(path);

  if (!read.ok) {
    // A file that simply isn't there is the common case for CLAUDE.local.md — no row, no noise.
    // An import that doesn't resolve is a different story: someone wrote an `@` line expecting it.
    if (read.error.kind === 'not-found' && !importedBy) return;

    const message: string =
      read.error.kind === 'not-found'
        ? 'imported but not found — nothing is added to the prompt'
        : `could not read: ${read.error.message}`;
    files.push(entry({ path, root, depth, importedBy, text: '', issues: [error(message)] }));
    return;
  }

  const specs: string[] = findImportSpecs(read.value);
  const atLimit: boolean = depth >= MAX_IMPORT_DEPTH;
  const issues: ConfigIssue[] = [];

  if (atLimit && specs.length > 0) {
    issues.push(warning(`import depth limit (${MAX_IMPORT_DEPTH}) reached — its imports aren't shown`));
  }

  // Pushed before recursing, so an imported file lands directly under the file that pulled it in.
  files.push(entry({ path, root, depth, importedBy, text: read.value, issues }));
  if (atLimit) return;

  const nextChain: string[] = [...chain, path];

  for (const spec of specs) {
    const target: string = resolveImport({ spec, fromFile: path });

    if (nextChain.includes(target)) {
      files.push(
        entry({
          path: target,
          root,
          depth: depth + 1,
          importedBy: path,
          text: '',
          issues: [warning('circular import — already open further up this chain, so it stops here')]
        })
      );
      continue;
    }

    await walk({ path: target, root, depth: depth + 1, chain: nextChain, files, importedBy: path });
  }
};

interface EntryArgs {
  path: string;
  root: PromptRoot;
  depth: number;
  text: string;
  issues: ConfigIssue[];
  importedBy?: string;
}

// An import inherits its importer's scope and its conditionality: a file pulled in by a nested
// CLAUDE.md only loads when that nested file does.
const entry = ({ path, root, depth, text, issues, importedBy }: EntryArgs): SystemPromptFile => ({
  path,
  scope: root.scope,
  // Filled in by loadSystemPrompt once the walk is done and the list is flat.
  order: 0,
  chars: text.length,
  estimatedTokens: estimateTokens(text.length),
  importedBy,
  depth,
  conditionalOn: root.conditionalOn,
  issues
});

const warning = (message: string): ConfigIssue => ({ severity: 'warning', message });

const error = (message: string): ConfigIssue => ({ severity: 'error', message });
