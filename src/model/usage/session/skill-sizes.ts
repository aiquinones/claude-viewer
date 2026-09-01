// How big the skills a Codex session loaded were. Codex only, and only because of the shape of its
// record: the other two CLIs announce a load by name, while Codex's is the command that opened the
// file — so the path is in hand and the size can be measured off the SKILL.md itself.
//
// That matters most for a skill the panel doesn't list. `~/.codex/skills` isn't a root the config
// snapshot reads, so `findSkillByName` finds nothing for one and the row would be a dash; the file
// is right there on disk, named by the session that read it.

import { resolve } from 'node:path';
import { readTextFile } from '../../../config/read';
import { ConfigError, Result } from '../../../config/result';
import { SkillInvocation } from '../types';

interface SizeCodexLoadsArgs {
  loads: SkillInvocation[];
  // The thread's working directory, which the relative paths are written against. A command runs
  // with its own `workdir`, but every one measured here is the thread's or a worktree under it —
  // and a path that doesn't resolve costs a row its size rather than breaking it.
  cwd: string;
}

// One read per distinct path however many times it was loaded. A path that can't be read leaves the
// load unsized, which is the same answer Claude gives for every one of its loads.
export const sizeCodexLoads = async ({
  loads,
  cwd
}: SizeCodexLoadsArgs): Promise<SkillInvocation[]> => {
  const paths: string[] = [...new Set(loads.map((load) => load.path ?? ''))].filter(Boolean);

  const sizes: Map<string, number> = new Map();
  await Promise.all(
    paths.map(async (path) => {
      const text: Result<string, ConfigError> = await readTextFile(resolve(cwd, path));
      if (text.ok) sizes.set(path, text.value.length);
    })
  );

  return loads.map((load) => {
    const chars: number | undefined = load.path ? sizes.get(load.path) : undefined;
    return chars === undefined ? load : { ...load, chars };
  });
};
