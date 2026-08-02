import { homedir } from 'node:os';
import { join } from 'node:path';
import { SkillRoot } from '../model/types';
import { listDirectories } from './read';

export const SKILL_FILE = 'SKILL.md';

export const userClaudeDir = (): string => join(homedir(), '.claude');

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
