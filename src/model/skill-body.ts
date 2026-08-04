import { parseFrontmatter, Frontmatter } from '../config/frontmatter';
import { readTextFile } from '../config/read';
import { ConfigError, Result, ok } from '../config/result';

// One SKILL.md below its frontmatter block. A file with no frontmatter is read whole — the block
// is optional to us here, and `loadSkills` already flags its absence on the entry.
export const loadSkillBody = async (path: string): Promise<Result<string, ConfigError>> => {
  const read: Result<string, ConfigError> = await readTextFile(path);
  if (!read.ok) return read;

  const parsed: Result<Frontmatter, string> = parseFrontmatter(read.value);
  return ok(parsed.ok ? parsed.value.body : read.value);
};
