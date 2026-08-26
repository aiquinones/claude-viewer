// One session cut into stages. A stage is *based on* a skill without being one: naming a skill is
// what makes its loads open a stage, and a skill nobody named is invisible to the split — the stage
// that was running carries straight through it. So the cuts are read off the log and which cuts
// count is the reader's. Pure — both numbers come off turns and contexts the host already sent.

import {
  ContextPoint,
  SkillInvocation,
  UsageMetric,
  UsageTurn
} from '../../model/usage/types';
import { stageLabel } from '../stage-name';
import { turnValue } from './charts/series';

// One skill's stages, folded together. A skill that opens a stage twice is one entry rather than
// two: the radar keys an axis on the name, and two axes with one label is a chart nobody can read.
export interface SessionStage {
  // The skill that opened it. What the axis is keyed on, and what the name is keyed on.
  skill: string;
  // What the reader named it. Never the skill's own name — an unnamed skill opens no stage.
  label: string;
  // The metric summed over the turns inside it.
  value: number;
  // What the context gained across it. Negative where something compacted mid-stage, which real
  // sessions do — the chart clamps it, this doesn't.
  growth: number;
  // How many times this skill opened a stage.
  stages: number;
  turns: number;
  // When it first opened, which is the order the spokes are drawn in.
  firstAt: number;
}

// Where one stage starts and which skill opened it.
interface Boundary {
  skill: string;
  at: number;
}

interface ToStagesArgs {
  turns: UsageTurn[];
  invocations: SkillInvocation[];
  contexts: ContextPoint[];
  metric: UsageMetric;
  // The stage names, keyed by skill. A skill in here opens a stage; one that isn't, doesn't.
  names: Record<string, string>;
}

// The stages of one session, in the order they first opened. Empty until the reader has named at
// least one skill. Turns before the first stage belong to no stage and are dropped — the session
// was doing something, but nothing says what, and a bucket named for that would be a guess with a
// label on it.
export const toStages = ({
  turns,
  invocations,
  contexts,
  metric,
  names
}: ToStagesArgs): SessionStage[] => {
  const bounds: Boundary[] = boundaries({ invocations, names });
  if (bounds.length === 0) return [];

  const sortedTurns: UsageTurn[] = [...turns].sort((left, right) => left.at - right.at);
  const sortedContexts: ContextPoint[] = [...contexts].sort((left, right) => left.at - right.at);

  const folded: Map<string, SessionStage> = new Map();

  for (let i = 0; i < bounds.length; i += 1) {
    const start: number = bounds[i].at;
    // The last stage runs to the end of the session rather than to a boundary that never came.
    const end: number = i + 1 < bounds.length ? bounds[i + 1].at : Number.POSITIVE_INFINITY;

    const inside: UsageTurn[] = sortedTurns.filter((turn) => turn.at >= start && turn.at < end);

    const stage: SessionStage = {
      skill: bounds[i].skill,
      // Non-empty by construction — `boundaries` already dropped the skills with no name.
      label: stageLabel({ skill: bounds[i].skill, names }) ?? bounds[i].skill,
      value: inside.reduce((sum, turn) => sum + turnValue({ turn, metric }), 0),
      growth: growthOver({ contexts: sortedContexts, start, end }),
      stages: 1,
      turns: inside.length,
      firstAt: start
    };

    const held: SessionStage | undefined = folded.get(stage.skill);
    folded.set(stage.skill, held ? merge({ held, stage }) : stage);
  }

  return [...folded.values()].sort((left, right) => left.firstAt - right.firstAt);
};

interface BoundariesArgs {
  invocations: SkillInvocation[];
  names: Record<string, string>;
}

// Which loads actually open a stage. Unnamed skills are dropped first and the repeat rule runs over
// what's left, so a named skill interrupted only by unnamed ones is still one stage — the reader
// said those loads aren't stages, and a gap they can't see would split the one they can.
//
// A load of the skill that's already running doesn't open a stage either: Copilot injects a skill
// because you typed its name and loads it again five seconds later when the model asks for what it
// already has, and a stage between those two would be five seconds wide.
const boundaries = ({ invocations, names }: BoundariesArgs): Boundary[] => {
  const sorted: SkillInvocation[] = [...invocations]
    .filter((load) => stageLabel({ skill: load.skill, names }) !== undefined)
    .sort((left, right) => left.at - right.at);

  const bounds: Boundary[] = [];
  for (const load of sorted) {
    if (bounds.length > 0 && bounds[bounds.length - 1].skill === load.skill) continue;
    bounds.push({ skill: load.skill, at: load.at });
  }
  return bounds;
};

interface GrowthArgs {
  // Oldest first.
  contexts: ContextPoint[];
  start: number;
  end: number;
}

// What the context gained across one stage. Measured from the last reading *before* it started, so
// the skill's own body counts as part of the stage that loaded it — that's most of what makes a
// stage expensive. The first stage usually has no earlier reading, so it measures from its own
// first one and the body it loaded rides in the baseline instead.
const growthOver = ({ contexts, start, end }: GrowthArgs): number => {
  const inside: ContextPoint[] = contexts.filter((point) => point.at >= start && point.at < end);
  if (inside.length === 0) return 0;

  const before: ContextPoint | undefined = [...contexts]
    .reverse()
    .find((point) => point.at < start);

  const baseline: number = (before ?? inside[0]).tokens;
  return inside[inside.length - 1].tokens - baseline;
};

interface MergeArgs {
  held: SessionStage;
  stage: SessionStage;
}

// A second stage under a name that already has one. Everything adds; the label and the first time
// stay the ones already there.
const merge = ({ held, stage }: MergeArgs): SessionStage => ({
  ...held,
  value: held.value + stage.value,
  growth: held.growth + stage.growth,
  stages: held.stages + stage.stages,
  turns: held.turns + stage.turns
});

// The tallest value on a set of stages, which is what a radar with nothing else to scale to uses.
export const stagePeak = (stages: SessionStage[], read: (stage: SessionStage) => number): number =>
  stages.reduce((peak, stage) => Math.max(peak, read(stage)), 0);

// Every skill this session loaded, in the order it first did. What the naming dialog lists — the
// choice being made there is which of these are stages, so it can't be a list of the stages.
export const invokedSkills = (invocations: SkillInvocation[]): string[] => {
  const seen: Map<string, number> = new Map();

  for (const load of invocations) {
    const first: number | undefined = seen.get(load.skill);
    if (first === undefined || load.at < first) seen.set(load.skill, load.at);
  }

  return [...seen.entries()].sort((left, right) => left[1] - right[1]).map(([skill]) => skill);
};
