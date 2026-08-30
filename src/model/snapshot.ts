import { loadMemory } from './memory/load';
import { perfPhase } from './perf/recorder';
import { loadSkills } from './skills';
import { loadSystemPrompt } from './system-prompt/load';
import { ConfigSnapshot, MemorySet, SkillEntry, SNAPSHOT_PARTS, SystemPromptFile } from './types';

// The config on disk, as one object. Rebuilt in full whenever a watched file changes — a refresh
// re-reads everything, so there is no partial invalidation to keep in sync.
//
// It does arrive in pieces, though. The three loaders run concurrently and land at wildly
// different times: memory is one directory, skills is every SKILL.md on the machine, and the
// system prompt walks the workspace looking for nested CLAUDE.md files. So this hands back the
// three promises rather than awaiting them, and `host/config-store.ts` publishes each as it lands.
//
// Live agents are not in here. They change on their own schedule and carry no config, so they ride
// their own message from `host/agents-store.ts` — see the note there.
export interface SnapshotParts {
  skills: Promise<SkillEntry[]>;
  systemPrompt: Promise<SystemPromptFile[]>;
  memory: Promise<MemorySet | undefined>;
}

// Starts all three. Named stages rather than three bare calls: they run concurrently, and the perf
// overlay's whole job is saying which of them a slow launch went into.
//
// Has to be called from inside the `snapshot` stage, not beside it — reads are attributed through
// AsyncLocalStorage, so a loader started outside that stage leaves the parent row empty.
export const startSnapshotParts = (workspaceRoot: string | undefined): SnapshotParts => ({
  skills: perfPhase('skills', () => loadSkills(workspaceRoot)),
  systemPrompt: perfPhase('system-prompt', () => loadSystemPrompt(workspaceRoot)),
  memory: perfPhase('memory', () => loadMemory(workspaceRoot))
});

// The shell: the folder, three empty parts, and every part still to come. Synchronous and reads
// nothing, which is what lets the panel draw before any of the loaders have finished.
export const emptySnapshot = (workspaceRoot: string | undefined): ConfigSnapshot => ({
  workspaceRoot,
  skills: [],
  systemPrompt: [],
  memory: undefined,
  loadedAt: Date.now(),
  pending: [...SNAPSHOT_PARTS]
});
