import { ConfigError, Result } from '../config/result';
import { listed } from '../model/shadowing';
import { loadSkillBody } from '../model/skill-body';
import { SkillText, buildSkillGraph } from '../model/skill-graph/build-graph';
import { ConfigSnapshot, SkillEntry, SkillGraph } from '../model/types';
import { currentSnapshot } from './config-store';

// The last graph built, and nothing else — `loadedAt` is the cache key, so a refresh drops it
// without anyone having to remember to. Same trick `useFileBody` uses to need no cache at all.
let graph: SkillGraph | undefined;

// Reading every SKILL.md is the expensive part, which is why this is built once per snapshot and
// not once per open. The panel asks when the skills view mounts, since the toggle has to know
// whether the selected skill is in the graph before you click it.
export const currentSkillGraph = async (): Promise<SkillGraph> => {
  const snapshot: ConfigSnapshot = await currentSnapshot();
  if (graph?.loadedAt === snapshot.loadedAt) return graph;

  const skills: SkillEntry[] = listed(snapshot.skills);
  const texts: SkillText[] = await Promise.all(skills.map(readText));

  graph = buildSkillGraph({ texts, loadedAt: snapshot.loadedAt });
  return graph;
};

// An unreadable skill still gets to be mentioned by others; it just mentions nobody.
const readText = async (skill: SkillEntry): Promise<SkillText> => {
  const read: Result<string, ConfigError> = await loadSkillBody(skill.path);
  return { skill, body: read.ok ? read.value : '' };
};
