// The skill loads of one session, rolled up per skill. Pure, so the sort rule and the weighted sum
// are one thing rather than something each component works out for itself.

import { estimateTokens, TokenEstimator } from '../../model/estimate-tokens';
import { SkillEntry } from '../../model/types';
import { SKILL_LOAD_VIA, SkillInvocation, SkillLoadVia } from '../../model/usage/types';
import { findSkillByName } from '../../model/shadowing';

// One skill, and everything this session paid for it.
export interface SkillLoad {
  name: string;
  // How many times the body entered the context. Not how many times you asked for it — Copilot
  // loads a skill twice for one typed command, and that is two bodies in the context.
  loads: number;
  // The skill as installed here, where it is. A session on this machine can name a skill that lives
  // somewhere else, and that row is a name and a count and nothing more.
  skill?: SkillEntry;
  // Estimated tokens for one load, or undefined when nothing on disk or in the log says how big it
  // is. Undefined is a real answer — the row still lists, because the skill still ran.
  size?: number;
  // What the size was read off. The installed file is the rule; a Copilot log that recorded what it
  // loaded is the fallback for a skill this machine doesn't have.
  sizeFrom: 'installed' | 'recorded' | 'unknown';
  // size × loads, and undefined for the same reason size is.
  total?: number;
  // How the loads arrived, in the declared order. Two loads of one skill can be a slash command and
  // the model then calling for what it was already given, which is the shape worth being able to see.
  via: SkillLoadVia[];
  // When it was first loaded, so the chart and this list can be read against each other.
  firstAt: number;
}

interface ToSkillLoadsArgs {
  invocations: SkillInvocation[];
  // Everything installed here, so a row can say what its skill is for and open it.
  skills: SkillEntry[];
  estimator: TokenEstimator;
}

// Most loaded first, ties broken by size — a bigger skill loaded as often as a smaller one is the
// one worth looking at. A skill with no size sorts last within its tie, since there is nothing to
// compare it on.
export const toSkillLoads = ({ invocations, skills, estimator }: ToSkillLoadsArgs): SkillLoad[] => {
  const grouped: Map<string, SkillInvocation[]> = new Map();
  for (const load of invocations) {
    const held: SkillInvocation[] | undefined = grouped.get(load.skill);
    if (held) held.push(load);
    else grouped.set(load.skill, [load]);
  }

  return [...grouped.entries()]
    .map(([name, loads]) => toLoad({ name, loads, skills, estimator }))
    .sort((left, right) => right.loads - left.loads || (right.size ?? -1) - (left.size ?? -1));
};

interface ToLoadArgs {
  name: string;
  loads: SkillInvocation[];
  skills: SkillEntry[];
  estimator: TokenEstimator;
}

const toLoad = ({ name, loads, skills, estimator }: ToLoadArgs): SkillLoad => {
  const skill: SkillEntry | undefined = findSkillByName({ skills, name });
  // The installed file first, so every row that can be is measured the same way and the bars
  // compare. Copilot's recorded body is what keeps a skill this machine doesn't have on the list.
  const recorded: number | undefined = loads.find((load) => load.chars !== undefined)?.chars;
  const chars: number | undefined = skill?.chars ?? recorded;

  const size: number | undefined =
    chars === undefined ? undefined : estimateTokens({ chars, estimator });

  return {
    name,
    loads: loads.length,
    ...(skill ? { skill } : {}),
    ...(size === undefined ? {} : { size, total: size * loads.length }),
    sizeFrom: skill ? 'installed' : recorded === undefined ? 'unknown' : 'recorded',
    via: SKILL_LOAD_VIA.filter((via) => loads.some((load) => load.via === via)),
    firstAt: Math.min(...loads.map((load) => load.at))
  };
};

// What each route is, said plainly. `event` covers both of Copilot's, since its one event fires for
// a typed name and for the model asking alike — which is exactly why it fires twice for one command.
const VIA_LABEL: Record<SkillLoadVia, string> = {
  command: 'typed as a slash command',
  tool: 'the model called for it',
  event: 'announced by the CLI'
};

// How a row's loads arrived, for the count's tooltip. Nothing when there's only one way and one load
// — the row already says that much.
export const viaNote = (load: SkillLoad): string | undefined => {
  if (load.loads === 1 && load.via.length === 1) return VIA_LABEL[load.via[0]];
  if (load.via.length === 0) return undefined;
  return `${load.loads} loads · ${load.via.map((via) => VIA_LABEL[via]).join(', ')}`;
};

// What these skills cost this session in context: every load of every body, added up. The number the
// whole section is for — three loads of a 1,800-token skill is 5,400 tokens spent on one file.
//
// Rows with no size contribute nothing rather than a guess, which is why the count of those is worth
// having beside it.
export const weightedTotal = (loads: SkillLoad[]): number =>
  loads.reduce((sum, load) => sum + (load.total ?? 0), 0);

// How many rows had no size to add. The heading says so, or the total quietly understates itself.
export const unsizedCount = (loads: SkillLoad[]): number =>
  loads.filter((load) => load.size === undefined).length;
