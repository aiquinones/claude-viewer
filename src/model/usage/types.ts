// What a session cost, split by the skill that was running. Both CLIs record per-request output
// tokens; only Claude stamps every turn with its skill, which is what `source` is for.

import { AgentTool } from '../types';
import { Retention } from '../retention/types';
import { UsdParts } from './pricing';

// Which number the surface reads. `output-tokens` is measured on both sides and is what Claude
// Code's own /usage reports, so it's the default and the only metric with one cross-CLI total.
//
// Deliberately not annotated: a type here would erase the literals UsageMetric derives from.
export const USAGE_METRICS = ['output-tokens', 'cost'] as const;

export type UsageMetric = (typeof USAGE_METRICS)[number];

export const USAGE_WINDOWS = ['day', 'week'] as const;

export type UsageWindow = (typeof USAGE_WINDOWS)[number];

// Which sessions count. `all` matches /usage, since limits are account-wide; `workspace` matches
// every other surface here.
export const USAGE_SCOPES = ['all', 'workspace'] as const;

export type UsageScope = (typeof USAGE_SCOPES)[number];

// Which tokens the Claude dollar figure counts. `all` is every billed token — input, cache reads,
// cache writes and output. `output` prices output alone, which is how Claude Code weights a skill's
// share of your usage, and it leaves out the cache reads that otherwise dominate the figure.
//
// Deliberately not annotated: a type here would erase the literals UsageCostBasis derives from.
export const USAGE_COST_BASES = ['all', 'output'] as const;

export type UsageCostBasis = (typeof USAGE_COST_BASES)[number];

// Where a turn's skill came from. Claude stamps `attributionSkill` on the turn and clears it, so
// the boundaries are exact. Copilot writes `skill.invoked` and no completion event, so a skill
// claims every later message until the next one — a heuristic, and the only option available.
export const USAGE_SOURCES = ['read', 'inferred'] as const;

export type UsageSource = (typeof USAGE_SOURCES)[number];

// One request's token counts. Cache writes are split by TTL because they're priced differently and
// the transcripts record them separately — averaging the two would guess where the data doesn't.
export interface UsageTokens {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite5m: number;
  cacheWrite1h: number;
}

export const EMPTY_TOKENS: UsageTokens = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite5m: 0,
  cacheWrite1h: 0
};

// One model request, from either CLI. Deduped by request id upstream — one request can span several
// transcript lines carrying the same usage, and counting those twice moves the headline number by
// about a point.
export interface UsageTurn {
  // The CLI's own id for the request — `requestId` on Claude, `messageId` on Copilot. What the
  // dedupe is keyed on, so a line read twice across two passes can't be counted twice.
  id: string;
  // Milliseconds since the epoch. Absolute, so the window is computed against the reader's clock.
  at: number;
  tool: AgentTool;
  sessionId: string;
  // Where the agent was working. What the `workspace` scope filters on.
  cwd: string;
  // Absent when no skill was active, which is most turns.
  skill?: string;
  source: UsageSource;
  model: string;
  tokens: UsageTokens;
  // Copilot's billed figure. The event log carries a running session total rather than a per-request
  // one, so this is a checkpoint's delta shared out across the turns it covers — exact per session
  // and per prompt, approximate only where a skill boundary falls inside one checkpoint.
  nanoAiu?: number;
}

// What one skill cost over the window. `sources` is a set rather than a flag: a skill can be read
// on a Claude row and inferred on a Copilot one, and the tooltip has to say so.
export interface UsageSlice {
  // Absent for the turns that ran with no skill. Rendered rather than hidden — otherwise the
  // percentages look like a breakdown that doesn't add up.
  skill?: string;
  outputTokens: number;
  usd: number;
  nanoAiu: number;
  turns: number;
  sources: UsageSource[];
  // Of the window's total for the active metric, 0–1.
  fraction: number;
}

export interface UsageTotals {
  outputTokens: number;
  usd: number;
  nanoAiu: number;
  turns: number;
}

export const EMPTY_TOTALS: UsageTotals = {
  outputTokens: 0,
  usd: 0,
  nanoAiu: 0,
  turns: 0
};

// One model's share of the window. Both CLIs contribute — Copilot runs Claude models as well as
// OpenAI ones, so this spans them and only the dollars are Claude Code's.
export interface UsageModelUse {
  model: string;
  outputTokens: number;
  turns: number;
  usd: number;
  // Of the window's output tokens, 0–1.
  fraction: number;
  // No rates for it in `pricing.ts`, so its tokens count and its dollars don't.
  unpriced: boolean;
}

export interface UsageBreakdown {
  window: UsageWindow;
  // The start of the window, absolute.
  since: number;
  // Distinct sessions that contributed. A total of zero and a scan that read nothing look the same
  // on the numbers, and this is what tells them apart.
  sessions: number;
  // Sorted by the active metric, largest first.
  slices: UsageSlice[];
  total: UsageTotals;
  // Per CLI, because AIU and USD are different units and no conversion is defined by either CLI's
  // data. Cost mode shows these two and no combined figure.
  byTool: Record<AgentTool, UsageTotals>;
  // Model ids `pricing.ts` doesn't know. Their tokens count; their dollars don't, and the view
  // names them rather than quietly pricing them at zero.
  unpricedModels: string[];
  // What the dollar figure is made of, and which models produced the window. Both exist for one
  // reason: a total on its own reads as wrong. 1.4M output tokens priced at $249 looks like an
  // error until you can see that $147 of it is cache reads.
  //
  // Always the full split, whatever the basis counts — the parts nobody is counting are exactly the
  // ones a reader needs in order to know which figure they're looking at.
  costParts: UsdParts;
  // Which of those parts `total.usd` adds up.
  costBasis: UsageCostBasis;
  // Sorted by output tokens, largest first.
  models: UsageModelUse[];
}

// Both windows, aggregated. The host computes them together and posts one message: the toggle is
// then instant, and the panel never carries a few thousand raw turns across the bridge to get there.
export interface UsageReport {
  windows: Record<UsageWindow, UsageBreakdown>;
  // When the scan behind these numbers finished. The view ages it, the way agent rows age.
  scannedAt: number;
}

// What one day of one session cost. Output tokens only: it's the one figure both CLIs report in the
// same unit, and a grid painted in two units would be a grid painted in neither.
export interface SessionDay {
  // Local `YYYY-MM-DD`. A calendar day is what the grid draws and the calendar is the reader's —
  // the host and the panel are the same machine, so either one can compute it.
  day: string;
  outputTokens: number;
  turns: number;
}

// One session, from either CLI, over its whole life. The grid and the list are this same list read
// two ways: rolled up by day, or sorted by activity.
//
// Unlike a UsageTurn this outlives the window. The Sessions tab is about everything on disk, and
// keeping the turns behind it would grow the cache with the corpus instead of with the window.
export interface SessionUsage {
  sessionId: string;
  tool: AgentTool;
  // The session's own name — Claude's first `ai-title`, Copilot's `workspace.yaml` name. Absent on
  // a session too short to have been given one, which is 10 of the 87 transcripts measured here.
  title?: string;
  // Where the agent was working. What the scope filter reads, and what a row falls back to for a
  // name when there is no title.
  cwd: string;
  firstAt: number;
  lastAt: number;
  outputTokens: number;
  turns: number;
  // Ascending, and only the days the session actually spent something — an idle month costs nothing
  // to carry.
  days: SessionDay[];
}

// Every session on disk, already narrowed to the scope in force. Its own message rather than a
// field on UsageReport: the report is a seven-day window re-aggregated on every poll, and this is
// the whole corpus.
export interface UsageHistory {
  // Most recently active first.
  sessions: SessionUsage[];
  // How long Claude Code keeps a transcript, and which settings file said so. Carried here because
  // it is the thing that explains the list: history older than this was deleted by Claude Code's
  // own sweep, so a grid drawn further back is empty by construction rather than by accident.
  //
  // Claude's number. Copilot documents no equivalent and writes none to disk.
  retention: Retention;
  scannedAt: number;
}
