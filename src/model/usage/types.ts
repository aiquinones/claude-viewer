// What a session cost, split by the skill that was running. Both CLIs record per-request output
// tokens; only Claude stamps every turn with its skill, which is what `source` is for.

import { AgentContext, AgentTool } from '../types';
import { Retention } from '../retention/types';
import { UsdParts } from './pricing';

export const USAGE_WINDOWS = ['day', 'week'] as const;

export type UsageWindow = (typeof USAGE_WINDOWS)[number];

// Which sessions count. `all` matches /usage, since limits are account-wide; `workspace` matches
// every other surface here.
export const USAGE_SCOPES = ['all', 'workspace'] as const;

export type UsageScope = (typeof USAGE_SCOPES)[number];

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
  // The branch checked out where it ran. Claude stamps every assistant line with it; Copilot writes
  // one per session in `workspace.yaml`. Absent outside a repo.
  branch?: string;
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
  // Of the window's output tokens, 0–1. Not of the cost: a share of a figure that's dollars on one
  // row and AIU on the next means nothing.
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

// Everything a set of turns adds up to, with nothing said about which turns they were. The usage
// surface's window is one such set and a single session is another, which is why this is separate
// from `UsageBreakdown` — the window is the only thing the two don't share.
export interface UsageSummaryData {
  // Distinct sessions that contributed. A total of zero and a scan that read nothing look the same
  // on the numbers, and this is what tells them apart.
  sessions: number;
  // Sorted by output tokens, largest first.
  slices: UsageSlice[];
  total: UsageTotals;
  // Per CLI, because AIU and USD are different units and no conversion is defined by either CLI's
  // data. The headline shows these two and no combined figure.
  byTool: Record<AgentTool, UsageTotals>;
  // Model ids `pricing.ts` doesn't know. Their tokens count; their dollars don't, and the view
  // names them rather than quietly pricing them at zero.
  unpricedModels: string[];
  // What the dollar figure is made of, and which models produced the window. Both exist for one
  // reason: a total on its own reads as wrong. 1.4M output tokens priced at $249 looks like an
  // error until you can see that $147 of it is cache reads.
  costParts: UsdParts;
  // Sorted by output tokens, largest first.
  models: UsageModelUse[];
}

// One window of the usage surface: a summary, plus which window it is.
export interface UsageBreakdown extends UsageSummaryData {
  window: UsageWindow;
  // The start of the window, absolute.
  since: number;
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
  // The branch of the session's *latest* turn, the same rule `cwd` follows — where it left off,
  // which is what a list sorted by last activity is already about. A session rarely stays on one:
  // 82 of the 112 transcripts here span several, and 41 of 104 end somewhere other than the branch
  // they spent the most turns on. Absent when the session ran outside a repo.
  branch?: string;
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

// How a skill's body got into the context. Both CLIs write this down, and neither writes it once
// per intent — see docs/session-analysis.md.
//
// Deliberately not annotated: a type here would erase the literals `SkillLoadVia` derives from.
export const SKILL_LOAD_VIA = ['command', 'tool', 'event'] as const;

export type SkillLoadVia = (typeof SKILL_LOAD_VIA)[number];

// One time a SKILL.md was loaded into a session's context. A load rather than a call: Copilot
// injects the skill because you typed its name, then loads it again when the model asks for what it
// has already been given, and both of those really are the body entering the context.
export interface SkillInvocation {
  skill: string;
  // Milliseconds since the epoch, so the view places it against its own clock.
  at: number;
  via: SkillLoadVia;
  // The chars Copilot recorded loading. Claude's transcript carries no equivalent — its tool result
  // is the string "Launching skill: <name>" and the body goes in somewhere the log doesn't show.
  chars?: number;
}

// How full the context was on one request, and when. An `AgentContext` plus the clock, so a point
// off a chart reads through the same `readContext` the agent row's bar does — the window, the two
// thresholds and the colour can't drift between the two surfaces.
export interface ContextPoint extends AgentContext {
  at: number;
}

// Which session something is about. The pair rather than the id alone: every read of one goes
// through a per-CLI loader, so the tool is what says which file layout to open — and the panel
// naming a session it can't reach is the whole reason the host resolves this against its own cache.
export interface SessionRef {
  sessionId: string;
  tool: AgentTool;
}

// One session read whole, on demand. Unlike everything else on this surface it is neither windowed
// nor folded: the session is the window, and the turns are the thing being drawn.
export interface SessionDetail {
  // Echoed back, so a reply arriving after the selection moved on can be dropped — the same rule
  // `FileBody` follows.
  sessionId: string;
  tool: AgentTool;
  // Oldest first.
  turns: UsageTurn[];
  // In file order, which is the order they were loaded in.
  invocations: SkillInvocation[];
  // How full the context was at each request, oldest first. Read rather than derived on both sides,
  // and from different files — Claude's three input counters added up off the transcript, Copilot's
  // single `input_tokens` off the usage database, which already includes both cache figures. Empty
  // when neither had anything to give.
  contexts: ContextPoint[];
  // Set when the log couldn't be read at all. The view says so rather than drawing an empty session.
  error?: string;
}
