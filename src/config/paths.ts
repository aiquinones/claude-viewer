import { homedir } from 'node:os';
import { join, relative } from 'node:path';
import { PromptRoot, SkillRoot } from '../model/types';
import { findFilesNamed, listDirectories } from './read';

export const SKILL_FILE = 'SKILL.md';

export const CLAUDE_FILE = 'CLAUDE.md';

export const LOCAL_CLAUDE_FILE = 'CLAUDE.local.md';

// The auto-memory index. One line per memory, and the only part of the directory that is loaded
// into every session.
export const MEMORY_FILE = 'MEMORY.md';

// Directories the nested CLAUDE.md scan never descends into. `.claude` is on the list because it
// holds config rather than project subdirectories — and because a repo can park whole worktrees
// under `.claude/worktrees`, which would report every file in them twice.
const SKIP_DIRS = [
  'node_modules',
  '.git',
  '.claude',
  'dist',
  'build',
  'out',
  '.next',
  'coverage'
] as const;

// How far below the workspace root the scan goes. A monorepo shouldn't cost a full-disk walk on
// every save.
const NESTED_SCAN_DEPTH: number = 6;

export const userClaudeDir = (): string => join(homedir(), '.claude');

// One file per running Claude Code process, named by pid.
export const sessionsDir = (): string => join(userClaudeDir(), 'sessions');

// One directory per working directory, each holding that directory's session transcripts. The whole
// history of every session lives under here, which is what the usage surface reads.
export const projectsDir = (): string => join(userClaudeDir(), 'projects');

interface TranscriptPathArgs {
  cwd: string;
  sessionId: string;
}

// One working directory's own directory under `projects/`: the path with every non-alphanumeric
// character turned into a dash. Lossy — `.claude` and `-claude` land on the same name — so it is
// only ever computed in this direction. To label a directory, read the `cwd` a session carries
// rather than decoding the name back.
export const projectDir = (cwd: string): string =>
  join(projectsDir(), cwd.replace(/[^a-zA-Z0-9]/g, '-'));

// A session's transcript, inside that directory.
export const transcriptPath = ({ cwd, sessionId }: TranscriptPathArgs): string =>
  join(projectDir(cwd), `${sessionId}.jsonl`);

// The memories Claude wrote about one working directory — one file per fact. A worktree is its own
// working directory, so it gets its own memories, which is what a session running there would load.
export const memoryDir = (cwd: string): string => join(projectDir(cwd), 'memory');

const copilotDir = (): string => join(homedir(), '.copilot');

// One directory per Copilot CLI session, named by session id. Everything a row needs is inside it,
// so unlike Claude there's no second directory to find and no path encoding to compute.
export const copilotSessionStateDir = (): string => join(copilotDir(), 'session-state');

// The session's metadata: cwd, repository, branch and title, as flat YAML scalars.
export const copilotWorkspacePath = (sessionDir: string): string =>
  join(sessionDir, 'workspace.yaml');

// The session's append-only event log — the conversation and its lifecycle in one stream.
export const copilotEventsPath = (sessionDir: string): string => join(sessionDir, 'events.jsonl');

// A process holds a session by writing `inuse.<pid>.lock` into its directory, and removes the file
// on a clean exit. The pid is read from the name rather than the contents: both carry it and they
// agree, but the name is there after one readdir and the contents cost an open.
const IN_USE_LOCK = /^inuse\.(\d+)\.lock$/;

export const lockedPid = (fileName: string): number | undefined => {
  const match: RegExpExecArray | null = IN_USE_LOCK.exec(fileName);
  return match ? Number(match[1]) : undefined;
};

// Every CLAUDE.md that can reach the system prompt, in load order. The first three always load;
// the nested ones only load when Claude is working under their directory, which is why they carry
// `conditionalOn` and sit at the end.
export const promptRoots = async (workspaceRoot: string | undefined): Promise<PromptRoot[]> => {
  const roots: PromptRoot[] = [{ scope: 'user', path: join(userClaudeDir(), CLAUDE_FILE) }];

  if (!workspaceRoot) return roots;

  roots.push({ scope: 'project', path: join(workspaceRoot, CLAUDE_FILE) });
  roots.push({ scope: 'local', path: join(workspaceRoot, LOCAL_CLAUDE_FILE) });
  roots.push(...(await nestedPromptRoots(workspaceRoot)));

  return roots;
};

// The `**/CLAUDE.md` under the workspace, minus the one at the root, which is already the project
// scope. Sorted by path so the list is stable between refreshes.
const nestedPromptRoots = async (workspaceRoot: string): Promise<PromptRoot[]> => {
  const found: string[] = await findFilesNamed({
    dir: workspaceRoot,
    fileName: CLAUDE_FILE,
    skip: SKIP_DIRS,
    maxDepth: NESTED_SCAN_DEPTH
  });

  return found
    .filter((path) => path !== join(workspaceRoot, CLAUDE_FILE))
    .sort((left, right) => left.localeCompare(right))
    .map((path) => ({
      scope: 'nested' as const,
      path,
      // The directory holding it, relative to the root — that's what the row has to say.
      conditionalOn: relative(workspaceRoot, join(path, '..'))
    }));
};

// Every directory that can hold skills, most specific scope first. `workspaceRoot` is undefined
// when no folder is open — that's a normal state, it just means no project scope.
export const skillRoots = async (workspaceRoot: string | undefined): Promise<SkillRoot[]> => {
  const roots: SkillRoot[] = [];

  if (workspaceRoot) {
    roots.push({ scope: 'project', dir: join(workspaceRoot, '.claude', 'skills') });
  }

  roots.push({ scope: 'user', dir: join(userClaudeDir(), 'skills') });
  roots.push(...(await pluginSkillRoots()));

  return roots;
};

// Walks ~/.claude/plugins/marketplaces/<marketplace>/plugins/<plugin>/skills. Done by listing
// directories rather than globbing so a missing level is just an empty list.
const pluginSkillRoots = async (): Promise<SkillRoot[]> => {
  const marketplacesDir: string = join(userClaudeDir(), 'plugins', 'marketplaces');
  const marketplaces: string[] = await listDirectories(marketplacesDir);

  const perMarketplace: SkillRoot[][] = await Promise.all(
    marketplaces.map(async (marketplace) => {
      const pluginsDir: string = join(marketplacesDir, marketplace, 'plugins');
      const plugins: string[] = await listDirectories(pluginsDir);
      return plugins.map((plugin) => ({
        scope: 'plugin' as const,
        dir: join(pluginsDir, plugin, 'skills'),
        pluginName: plugin
      }));
    })
  );

  return perMarketplace.flat();
};
