import { join } from 'node:path';
import { parseFrontmatter, Frontmatter } from '../config/frontmatter';
import { SKILL_FILE, skillRoots } from '../config/paths';
import { countFiles, listDirectories, readTextFile } from '../config/read';
import { ConfigError, Result } from '../config/result';
import { parseSkillFrontmatter, SkillFrontmatter } from './skill-schema';
import { resolveShadowing, scopeRank } from './shadowing';
import { ConfigIssue, SkillEntry, SkillRoot } from './types';

// Locate → parse → validate → typed entries. Every config surface copies this shape.
export const loadSkills = async (workspaceRoot: string | undefined): Promise<SkillEntry[]> => {
  const roots: SkillRoot[] = await skillRoots(workspaceRoot);
  const perRoot: SkillEntry[][] = await Promise.all(roots.map(loadRoot));
  return sortSkills(resolveShadowing(perRoot.flat()));
};

const loadRoot = async (root: SkillRoot): Promise<SkillEntry[]> => {
  const dirNames: string[] = await listDirectories(root.dir);
  return Promise.all(dirNames.map((dirName) => loadSkill({ root, dirName })));
};

interface LoadSkillArgs {
  root: SkillRoot;
  dirName: string;
}

// One skill directory → one entry. Never throws and never returns nothing: a directory with no
// readable SKILL.md still shows up, carrying the reason it's broken.
const loadSkill = async ({ root, dirName }: LoadSkillArgs): Promise<SkillEntry> => {
  const dir: string = join(root.dir, dirName);
  const path: string = join(dir, SKILL_FILE);
  const bundledFiles: number = await countBundled(dir);
  const base: SkillEntry = {
    name: dirName,
    description: '',
    allowedTools: [],
    scope: root.scope,
    path,
    pluginName: root.pluginName,
    bundledFiles,
    chars: 0,
    listingChars: 0,
    issues: []
  };

  const read: Result<string, ConfigError> = await readTextFile(path);
  if (!read.ok) {
    const message: string =
      read.error.kind === 'not-found'
        ? `no ${SKILL_FILE} in this directory`
        : `could not read ${SKILL_FILE}: ${read.error.message}`;
    return withListingCost({ ...base, issues: [error(message)] });
  }

  // The file was read, so it has a size even when nothing below this parses.
  const sized: SkillEntry = { ...base, chars: read.value.length };

  const parsed: Result<Frontmatter, string> = parseFrontmatter(read.value);
  if (!parsed.ok) {
    return withListingCost({
      ...sized,
      issues: [warning('no frontmatter block — Claude sees no description')]
    });
  }

  const frontmatter: SkillFrontmatter | undefined = parseSkillFrontmatter(parsed.value.fields);
  if (!frontmatter) {
    return withListingCost({
      ...sized,
      issues: [warning('frontmatter did not validate — shown as the raw file')]
    });
  }

  return withListingCost({
    ...sized,
    name: frontmatter.name ?? dirName,
    description: frontmatter.description ?? '',
    allowedTools: frontmatter.allowedTools,
    issues: collectIssues({ frontmatter, dirName })
  });
};

// What the skill costs on every request: the line Claude reads when deciding whether to invoke it.
// Approximate — the real listing wraps the pair in a little punctuation — but the size of the
// description is what the number is there to show.
const withListingCost = (entry: SkillEntry): SkillEntry => {
  const listing: string = `${entry.name}: ${entry.description}`;
  return { ...entry, listingChars: listing.length };
};

interface CollectIssuesArgs {
  frontmatter: SkillFrontmatter;
  dirName: string;
}

const collectIssues = ({ frontmatter, dirName }: CollectIssuesArgs): ConfigIssue[] => {
  const issues: ConfigIssue[] = [];

  if (!frontmatter.description) {
    issues.push(warning('no description — Claude has nothing to match against'));
  }
  if (frontmatter.name && frontmatter.name !== dirName) {
    issues.push(warning(`frontmatter name "${frontmatter.name}" differs from directory "${dirName}"`));
  }

  return issues;
};

const countBundled = async (dir: string): Promise<number> => {
  const counts: number[] = await Promise.all([
    countFiles(join(dir, 'references')),
    countFiles(join(dir, 'scripts'))
  ]);
  return counts[0] + counts[1];
};

// Scope order first so the list reads project → user → plugin, then alphabetical within a scope.
const sortSkills = (skills: SkillEntry[]): SkillEntry[] =>
  [...skills].sort((left, right) => {
    const byScope: number = scopeRank(left.scope) - scopeRank(right.scope);
    return byScope !== 0 ? byScope : left.name.localeCompare(right.name);
  });

const warning = (message: string): ConfigIssue => ({ severity: 'warning', message });

const error = (message: string): ConfigIssue => ({ severity: 'error', message });
