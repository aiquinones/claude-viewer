import { loadSkills } from './skills';
import { ConfigSnapshot } from './types';

// The whole boundary between host and webview: read everything, hand over one object.
// Rebuilt in full whenever a watched file changes — no partial updates to keep in sync.
export const buildSnapshot = async (
  workspaceRoot: string | undefined
): Promise<ConfigSnapshot> => ({
  workspaceRoot,
  skills: await loadSkills(workspaceRoot),
  loadedAt: Date.now()
});
