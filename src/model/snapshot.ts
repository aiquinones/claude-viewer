import { loadMemory } from './memory/load';
import { loadSkills } from './skills';
import { loadSystemPrompt } from './system-prompt/load';
import { ConfigSnapshot } from './types';

// The config on disk, as one object. Rebuilt in full whenever a watched file changes — no partial
// updates to keep in sync.
//
// Live agents are not in here. They change on their own schedule and carry no config, so they ride
// their own message from `host/agents-store.ts` — see the note there.
export const buildSnapshot = async (
  workspaceRoot: string | undefined
): Promise<ConfigSnapshot> => {
  const [skills, systemPrompt, memory] = await Promise.all([
    loadSkills(workspaceRoot),
    loadSystemPrompt(workspaceRoot),
    loadMemory(workspaceRoot)
  ]);

  return { workspaceRoot, skills, systemPrompt, memory, loadedAt: Date.now() };
};
