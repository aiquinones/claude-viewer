import { loadSkills } from './skills';
import { loadSystemPrompt } from './system-prompt/load';
import { ConfigSnapshot } from './types';

// The whole boundary between host and webview: read everything, hand over one object.
// Rebuilt in full whenever a watched file changes — no partial updates to keep in sync.
export const buildSnapshot = async (
  workspaceRoot: string | undefined
): Promise<ConfigSnapshot> => {
  const [skills, systemPrompt] = await Promise.all([
    loadSkills(workspaceRoot),
    loadSystemPrompt(workspaceRoot)
  ]);

  return { workspaceRoot, skills, systemPrompt, loadedAt: Date.now() };
};
