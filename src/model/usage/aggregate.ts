// Turns → what each skill cost over a window. Pure, and the webview calls it too: the Day / Week
// toggle re-aggregates in the panel rather than costing a host round trip, the same way
// `sessions/activity.ts` lets a row re-age without a disk read.

import { AGENT_TOOLS, AgentTool } from '../types';
import { cutoff } from './window';
import { EMPTY_USD_PARTS, ratesFor, sumUsdParts, usdPartsFor, UsdParts } from './pricing';
import {
  EMPTY_TOTALS,
  UsageBreakdown,
  UsageModelUse,
  UsageScope,
  UsageSlice,
  UsageSource,
  UsageSummaryData,
  UsageTotals,
  UsageTurn,
  UsageWindow
} from './types';

// The key a slice with no skill is bucketed under. Skill names can't collide with it: a skill's
// name comes from a directory, so it can't be empty.
const NO_SKILL: string = '';

interface AggregateUsageArgs {
  turns: UsageTurn[];
  window: UsageWindow;
  now: number;
  scope: UsageScope;
  workspaceRoot: string | undefined;
}

// The metric isn't an argument. Every figure is computed, and the view prints whichever the setting
// selects — which also means flipping the metric doesn't reshuffle the list.
export const aggregateUsage = ({
  turns,
  window,
  now,
  scope,
  workspaceRoot
}: AggregateUsageArgs): UsageBreakdown => {
  const since: number = cutoff({ window, now });
  const inWindow: UsageTurn[] = turns.filter(
    (turn) => turn.at > since && inScope({ turn, scope, workspaceRoot })
  );

  return { ...summarizeTurns({ turns: inWindow }), window, since };
};

interface SummarizeTurnsArgs {
  // Already narrowed to whatever set is being summarized. Nothing is filtered in here.
  turns: UsageTurn[];
}

// What a set of turns adds up to, with no opinion about which turns they are. A window is one such
// set and a single session is another — the session analysis surface calls this directly, so the two
// read the same numbers out of the same arithmetic.
export const summarizeTurns = ({ turns: inWindow }: SummarizeTurnsArgs): UsageSummaryData => {
  const bySkill: Map<string, UsageTurn[]> = new Map();
  for (const turn of inWindow) {
    const key: string = turn.skill ?? NO_SKILL;
    const bucket: UsageTurn[] | undefined = bySkill.get(key);
    if (bucket) bucket.push(turn);
    else bySkill.set(key, [turn]);
  }

  const total: UsageTotals = sum(inWindow);
  const sessions: number = new Set(inWindow.map((turn) => turn.sessionId)).size;

  const slices: UsageSlice[] = [...bySkill.entries()]
    .map(([skill, group]) => {
      const totals: UsageTotals = sum(group);
      return {
        ...(skill === NO_SKILL ? {} : { skill }),
        ...totals,
        sources: sourcesIn(group),
        // Output tokens, whatever the metric. It's the one quantity both CLIs report in the same
        // unit — a share of a figure that's dollars on one row and AIU on the next means nothing.
        fraction: total.outputTokens === 0 ? 0 : totals.outputTokens / total.outputTokens
      };
    })
    .sort((left, right) => right.outputTokens - left.outputTokens);

  return {
    sessions,
    slices,
    total,
    // Every tool, off `AGENT_TOOLS` rather than written out — a CLI whose usage isn't scanned yet
    // folds to a zero total, which `toolsIn` then leaves out of the view.
    byTool: Object.fromEntries(
      AGENT_TOOLS.map((tool) => [tool, sum(inWindow.filter((turn) => turn.tool === tool))])
    ) as Record<AgentTool, UsageTotals>,
    unpricedModels: unpricedIn(inWindow),
    costParts: costPartsOf(inWindow),
    models: modelsIn(inWindow)
  };
};

// The dollar figure, split by what was billed. Claude only, like the total it adds up to.
const costPartsOf = (turns: UsageTurn[]): UsdParts =>
  turns.reduce((parts: UsdParts, turn: UsageTurn) => {
    if (turn.tool !== 'claude') return parts;

    const next: UsdParts | undefined = usdPartsFor({ model: turn.model, tokens: turn.tokens });
    if (!next) return parts;

    return {
      input: parts.input + next.input,
      output: parts.output + next.output,
      cacheRead: parts.cacheRead + next.cacheRead,
      cacheWrite: parts.cacheWrite + next.cacheWrite
    };
  }, EMPTY_USD_PARTS);

// Which models produced the window, largest first. Spans both CLIs — Copilot runs Claude models
// too, so this is the one place the two are counted together on something other than tokens.
const modelsIn = (turns: UsageTurn[]): UsageModelUse[] => {
  const output: number = turns.reduce((sum, turn) => sum + turn.tokens.output, 0);
  const byModel: Map<string, UsageTurn[]> = new Map();

  for (const turn of turns) {
    const bucket: UsageTurn[] | undefined = byModel.get(turn.model);
    if (bucket) bucket.push(turn);
    else byModel.set(turn.model, [turn]);
  }

  return [...byModel.entries()]
    .map(([model, group]) => {
      const totals: UsageTotals = sum(group);
      return {
        model,
        outputTokens: totals.outputTokens,
        turns: totals.turns,
        usd: totals.usd,
        fraction: output === 0 ? 0 : totals.outputTokens / output,
        // Only Claude's rows are priced at all, so an unrated model is only worth flagging there.
        unpriced: group.some((turn) => turn.tool === 'claude') && !ratesFor(model)
      };
    })
    .sort((left, right) => right.outputTokens - left.outputTokens);
};

const sum = (turns: UsageTurn[]): UsageTotals =>
  turns.reduce(
    (totals: UsageTotals, turn: UsageTurn) => ({
      outputTokens: totals.outputTokens + turn.tokens.output,
      usd: totals.usd + usdOf(turn),
      nanoAiu: totals.nanoAiu + (turn.nanoAiu ?? 0),
      turns: totals.turns + 1
    }),
    EMPTY_TOTALS
  );

// Dollars are Claude's number and AIU is Copilot's, and neither converts to the other. Pricing a
// Copilot turn would be worse than not having one: it records the output side only, so the figure
// would come out several times low and still look like a price.
//
// Every billed part counts. A figure that left out the context re-reads would be four fifths short
// on a real session, which is the one error a cost figure can't afford.
const usdOf = (turn: UsageTurn): number => {
  if (turn.tool !== 'claude') return 0;

  const parts: UsdParts | undefined = usdPartsFor({ model: turn.model, tokens: turn.tokens });
  if (!parts) return 0;

  return sumUsdParts(parts);
};

// In the declared order rather than first-seen, so a slice fed by both CLIs always reads the same
// way round.
const sourcesIn = (turns: UsageTurn[]): UsageSource[] => {
  const seen: Set<UsageSource> = new Set(turns.map((turn) => turn.source));
  return (['read', 'inferred'] as const).filter((source) => seen.has(source));
};

// Sorted and deduped — the view names these, and a list that reorders between refreshes reads as
// churn.
const unpricedIn = (turns: UsageTurn[]): string[] => {
  const unpriced: string[] = turns
    .filter((turn) => turn.tool === 'claude' && !ratesFor(turn.model))
    .map((turn) => turn.model);

  return [...new Set(unpriced)].sort((left, right) => left.localeCompare(right));
};

interface InScopeArgs {
  turn: UsageTurn;
  scope: UsageScope;
  workspaceRoot: string | undefined;
}

// Same rule as `agent-groups.ts`: a worktree sits under `<root>/.claude/worktrees/` and counts as
// this workspace, which is the case worth getting right — it gets its own transcript directory and
// would otherwise read as somewhere else entirely.
const inScope = ({ turn, scope, workspaceRoot }: InScopeArgs): boolean => {
  if (scope === 'all') return true;
  if (!workspaceRoot) return false;
  return turn.cwd === workspaceRoot || turn.cwd.startsWith(`${workspaceRoot}/`);
};

// Which CLIs actually contributed. Cost mode shows one total per tool and no combined figure, so
// the view needs to know which to draw. Takes the summary rather than the breakdown — a single
// session is summarized without ever being a window.
export const toolsIn = (summary: UsageSummaryData): AgentTool[] =>
  AGENT_TOOLS.filter((tool) => summary.byTool[tool].turns > 0);
