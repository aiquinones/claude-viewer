import { join } from 'node:path';
import { Frontmatter, parseFrontmatter } from '../../config/frontmatter';
import { MEMORY_FILE, memoryDir } from '../../config/paths';
import { FileStats, fileStats, listFiles, readTextFile } from '../../config/read';
import { ConfigError, Result } from '../../config/result';
import {
  ConfigIssue,
  MEMORY_TYPES,
  MemoryEntry,
  MemoryIndex,
  MemoryIndexEntry,
  MemorySet
} from '../types';
import { parseMemoryIndex } from './index-file';
import { findMemoryLinks } from './links';
import { MemoryFrontmatter, parseMemoryFrontmatter } from './memory-schema';

// Locate → read → validate → typed entries, the same shape every other loader uses. Undefined when
// no folder is open: this directory is keyed on the working directory, and there's no user-scoped
// memory to fall back to.
export const loadMemory = async (
  workspaceRoot: string | undefined
): Promise<MemorySet | undefined> => {
  if (!workspaceRoot) return undefined;

  const dir: string = memoryDir(workspaceRoot);
  const fileNames: string[] = (await listFiles(dir)).filter(isMemoryFile);
  const read: ReadMemory[] = await Promise.all(
    fileNames.map((fileName) => readMemory({ dir, fileName }))
  );

  const index: MemoryIndex = await loadIndex({ dir, fileNames });
  // Every name that exists, so a `[[link]]` can say whether it points at anything.
  const names: Set<string> = new Set(read.map((memory) => memory.name));
  const indexed: Set<string> = new Set(
    index.entries.map((entry) => entry.path).filter((path): path is string => path !== undefined)
  );

  const memories: MemoryEntry[] = read.map((memory) => toEntry({ memory, names, indexed }));

  return { dir, index, memories: sortMemories(memories) };
};

// The index is markdown, not a memory, so it never appears as a row of its own.
const isMemoryFile = (fileName: string): boolean =>
  fileName.endsWith('.md') && fileName !== MEMORY_FILE;

interface LoadIndexArgs {
  dir: string;
  // The memory files that exist, by name — what an entry's target is resolved against.
  fileNames: string[];
}

// MEMORY.md, plus what each of its lines resolves to. A line pointing at a file that isn't there
// still costs tokens claiming a memory exists, which is the failure this surface is here to show.
const loadIndex = async ({ dir, fileNames }: LoadIndexArgs): Promise<MemoryIndex> => {
  const indexPath: string = join(dir, MEMORY_FILE);
  const read: Result<string, ConfigError> = await readTextFile(indexPath);
  const base: MemoryIndex = {
    path: indexPath,
    present: false,
    chars: 0,
    entries: [],
    issues: []
  };

  if (!read.ok) {
    const missing: boolean = read.error.kind === 'not-found';
    // No index and no memories is simply an empty directory — the view says so on its own.
    const issues: ConfigIssue[] =
      missing && fileNames.length === 0
        ? []
        : [
            warning(
              missing
                ? `no ${MEMORY_FILE} — nothing points at these files, so no session will read them`
                : `could not read ${MEMORY_FILE}: ${read.error.message}`
            )
          ];
    return { ...base, issues };
  }

  const known: Set<string> = new Set(fileNames);
  const entries: MemoryIndexEntry[] = parseMemoryIndex(read.value).map((entry) => ({
    ...entry,
    path: known.has(entry.target) ? join(dir, entry.target) : undefined
  }));
  const dangling: number = entries.filter((entry) => !entry.path).length;

  return {
    ...base,
    present: true,
    chars: read.value.length,
    entries,
    issues: dangling === 0 ? [] : [warning(danglingMessage(dangling))]
  };
};

const danglingMessage = (count: number): string =>
  count === 1
    ? '1 entry points at a file that is not there — it costs tokens and recalls nothing'
    : `${count} entries point at files that are not there — they cost tokens and recall nothing`;

interface ReadMemoryArgs {
  dir: string;
  fileName: string;
}

// One file, read and parsed but not yet joined to the index or to the other memories.
interface ReadMemory {
  name: string;
  path: string;
  body: string;
  chars: number;
  modifiedAt: number;
  frontmatter: MemoryFrontmatter | undefined;
  issues: ConfigIssue[];
}

// Never throws and never returns nothing: a file that can't be read or parsed still becomes a row
// carrying the reason.
const readMemory = async ({ dir, fileName }: ReadMemoryArgs): Promise<ReadMemory> => {
  const path: string = join(dir, fileName);
  const fallbackName: string = fileName.replace(/\.md$/, '');
  const stats: FileStats | undefined = await fileStats(path);
  const read: Result<string, ConfigError> = await readTextFile(path);

  const base: ReadMemory = {
    name: fallbackName,
    path,
    body: '',
    chars: 0,
    modifiedAt: stats?.mtimeMs ?? 0,
    frontmatter: undefined,
    issues: []
  };

  if (!read.ok) {
    return { ...base, issues: [error(`could not read the file: ${read.error.message}`)] };
  }

  const sized: ReadMemory = { ...base, chars: read.value.length, body: read.value };
  const parsed: Result<Frontmatter, string> = parseFrontmatter(read.value);

  if (!parsed.ok) {
    return {
      ...sized,
      issues: [warning('no frontmatter block — this file has no name, description or type')]
    };
  }

  const frontmatter: MemoryFrontmatter | undefined = parseMemoryFrontmatter({
    fields: parsed.value.fields,
    metadata: parsed.value.maps.metadata
  });

  if (!frontmatter) {
    return {
      ...sized,
      body: parsed.value.body,
      issues: [warning('frontmatter did not validate — shown as the raw file')]
    };
  }

  return {
    ...sized,
    name: frontmatter.name ?? fallbackName,
    body: parsed.value.body,
    modifiedAt: frontmatter.modifiedAt ?? stats?.mtimeMs ?? 0,
    frontmatter
  };
};

interface ToEntryArgs {
  memory: ReadMemory;
  names: Set<string>;
  indexed: Set<string>;
}

const toEntry = ({ memory, names, indexed }: ToEntryArgs): MemoryEntry => {
  const isIndexed: boolean = indexed.has(memory.path);

  return {
    name: memory.name,
    description: memory.frontmatter?.description ?? '',
    type: memory.frontmatter?.type,
    declaredType: memory.frontmatter?.declaredType,
    path: memory.path,
    chars: memory.chars,
    modifiedAt: memory.modifiedAt,
    links: findMemoryLinks(memory.body, names),
    indexed: isIndexed,
    issues: [...memory.issues, ...joinIssues({ memory, isIndexed })]
  };
};

interface JoinIssuesArgs {
  memory: ReadMemory;
  isIndexed: boolean;
}

// The problems that only show up once the file is read against everything else: what the index
// says, and what the frontmatter left out.
const joinIssues = ({ memory, isIndexed }: JoinIssuesArgs): ConfigIssue[] => {
  const issues: ConfigIssue[] = [];

  if (!isIndexed) {
    issues.push(warning(`no line in ${MEMORY_FILE} — written, but no session will recall it`));
  }
  if (memory.frontmatter && !memory.frontmatter.description) {
    issues.push(warning('no description — recall has nothing to match against'));
  }
  if (memory.frontmatter && !memory.frontmatter.type) {
    issues.push(
      warning(
        memory.frontmatter.declaredType
          ? `metadata.type is "${memory.frontmatter.declaredType}", which is not one of ${MEMORY_TYPES.join(', ')}`
          : 'no metadata.type — it is grouped as untyped'
      )
    );
  }

  return issues;
};

// Type order first so the list reads the way MEMORY_TYPES does, then alphabetical inside a type.
// Untyped memories sort last: they're the ones to look at, and the view gives them their own group.
const sortMemories = (memories: MemoryEntry[]): MemoryEntry[] =>
  [...memories].sort((left, right) => {
    const byType: number = typeRank(left) - typeRank(right);
    return byType !== 0 ? byType : left.name.localeCompare(right.name);
  });

const typeRank = (memory: MemoryEntry): number => {
  const index: number = MEMORY_TYPES.findIndex((type) => type === memory.type);
  return index === -1 ? MEMORY_TYPES.length : index;
};

const warning = (message: string): ConfigIssue => ({ severity: 'warning', message });

const error = (message: string): ConfigIssue => ({ severity: 'error', message });
