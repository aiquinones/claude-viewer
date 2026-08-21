// Shared shapes for the host and the webview. The host builds these from disk; the webview
// only ever reads them.

import { TokenEstimator } from './estimate-tokens';
import { SettingsSection, ViewerSettings } from './settings/settings';
import {
  UsageCostBasis,
  UsageHistory,
  UsageMetric,
  UsageReport,
  UsageScope
} from './usage/types';

// Two surfaces, two orderings, and they aren't the same list read backwards — each one gets its
// own array, and `Scope` is the union.
//
// Deliberately not annotated: a type here would erase the literals that `Scope` is derived from,
// and deriving is what keeps adding a scope to one edit instead of four.

// Skills, most specific first — the array order *is* the precedence order, so `scopeRank` reads
// position off it.
export const SKILL_SCOPES = ['project', 'user', 'plugin'] as const;

// System prompt, first loaded first. Nothing overrides anything here; the order is the content.
export const PROMPT_SCOPES = ['user', 'project', 'local', 'nested'] as const;

export type SkillScope = (typeof SKILL_SCOPES)[number];

export type PromptScope = (typeof PROMPT_SCOPES)[number];

export type Scope = SkillScope | PromptScope;

export type IssueSeverity = 'warning' | 'error';

// A problem attached to whatever it affects, so a bad file becomes a visible note on one row
// instead of a missing row or a crashed tree.
export interface ConfigIssue {
  severity: IssueSeverity;
  message: string;
}

// A directory that may contain `<name>/SKILL.md` subdirectories.
export interface SkillRoot {
  scope: SkillScope;
  dir: string;
  pluginName?: string;
}

export interface SkillEntry {
  // Frontmatter `name`, falling back to the directory name.
  name: string;
  description: string;
  allowedTools: string[];
  scope: SkillScope;
  // Absolute path to SKILL.md. Unique per entry, so it doubles as the row key.
  path: string;
  pluginName?: string;
  // Files under references/ and scripts/, counted so the row can say a skill ships extras.
  bundledFiles: number;
  // The whole SKILL.md — what the skill costs once Claude opens it. Same field name as
  // SystemPromptFile, because it's the same measurement.
  //
  // Chars rather than tokens: the estimate is a setting, so it's derived in the webview where the
  // setting lives. The host only ever reports what it read.
  chars: number;
  // Just the name and the description, which sit in the system prompt on every request whether or
  // not the skill ever runs.
  listingChars: number;
  // Path of the same-named skill that wins, when this one is shadowed.
  shadowedBy?: string;
  issues: ConfigIssue[];
}

// A CLAUDE.md the loader knows to look for, before it's read. `nested` roots carry the directory
// they load under; the other three always load.
export interface PromptRoot {
  scope: PromptScope;
  path: string;
  conditionalOn?: string;
}

// One file in the system prompt. Nothing here overrides anything — the whole stack is
// concatenated — so the interesting fields are the position and the size.
export interface SystemPromptFile {
  // Absolute path. Unique per entry, so it doubles as the row key.
  path: string;
  scope: PromptScope;
  // Position in the flattened load order, imports included.
  order: number;
  // What it costs is estimated from this in the webview, under whichever estimator is set.
  chars: number;
  // Path of the file whose `@` line pulled this one in.
  importedBy?: string;
  // 0 for a file found on disk, +1 per import hop.
  depth: number;
  // Directory Claude has to be working under for this file to load at all.
  conditionalOn?: string;
  issues: ConfigIssue[];
}

// How a session's log ends. A finished turn always ends the same way — for Claude an assistant line
// whose only block is text, for Copilot an `assistant.turn_end` — so everything else is mid-turn.
//
// `blocked` is the one the disk states outright. Copilot writes `permission.requested` and answers
// it with `permission.completed`, so an unanswered one means a prompt is open right now. Claude's
// transcript has no such line and never produces this — its waiting is inferred from the clock.
//
// Deliberately not annotated: a type here would erase the literals the union derives from.
export const TRANSCRIPT_TAILS = ['settled', 'working', 'blocked'] as const;

export type TranscriptTail = (typeof TRANSCRIPT_TAILS)[number];

// What an agent is doing. Mostly nothing writes this down — `sessions/activity` derives it from how
// the log ends and how long ago that was.
export const AGENT_ACTIVITIES = ['running', 'blocked', 'idle'] as const;

export type AgentActivity = (typeof AGENT_ACTIVITIES)[number];

// Which CLI a session belongs to. Both write a directory of live processes and an append-only log of
// the conversation, which is enough shared shape for one row type and one list.
export const AGENT_TOOLS = ['claude', 'copilot'] as const;

export type AgentTool = (typeof AGENT_TOOLS)[number];

// How each one prints. The row says which CLI it is, because "what is running in this repo" is a
// question about all of them at once.
export const AGENT_TOOL_LABEL: Record<AgentTool, string> = {
  claude: 'Claude Code',
  copilot: 'Copilot CLI'
};

// The colours a row can be given by hand, so two agents in one repo can be told apart at a glance.
// Six, because that's how many colours the editor's chart palette names — the CSS values live in
// webview/agent-color/, since nothing on the host side has an opinion about them.
//
// Unset is the seventh state and the default: a row nobody has coloured paints as it always did.
//
// Deliberately not annotated: a type here would erase the literals `AgentColor` derives from.
export const AGENT_COLORS = ['blue', 'green', 'purple', 'orange', 'red', 'yellow'] as const;

export type AgentColor = (typeof AGENT_COLORS)[number];

// Chosen colours, keyed by session id. A session id lives as long as the process, which is exactly
// as long as the choice is worth keeping — the host prunes the map to what's still running.
export type AgentColors = Record<string, AgentColor>;

// How full a session's context was on its last real request, and which model was answering. The
// model travels with the number because the window it's read against depends on it, and only the
// transcript line knows which one ran.
//
// Claude only. Copilot's event log carries per-message output tokens and a running billed total,
// and neither can be turned into a context size — so a Copilot session simply has none of this.
export interface AgentContext {
  // input + cache_read + cache_creation on the last non-synthetic assistant line.
  tokens: number;
  // The alias the transcript recorded, `claude-opus-5` rather than a dated snapshot id. Empty when
  // the line carried usage but no model, which shouldn't happen and isn't worth failing over.
  model: string;
}

// A pull request a session opened. Both fields or neither — a link with no number has nothing to
// print, and a number with no link has nowhere to go.
export interface AgentPullRequest {
  number: number;
  url: string;
}

// One agent process that exists right now, joined to the log it's writing. Unlike every other entry
// here this describes something live, so the time fields are absolute — the view ages them against
// its own clock rather than trusting when the snapshot was built.
//
// Both CLIs land in this one shape. A field only one of them writes is optional, which is what the
// optional fields already were: Claude may not have written a title or opened a PR yet either.
export interface AgentSession {
  // Unique per session. Doubles as the row key — a Claude session id and a Copilot one are both
  // UUIDs and can't collide.
  sessionId: string;
  tool: AgentTool;
  pid: number;
  // Where the agent is working. A session inside a worktree reports the worktree, not the repo.
  cwd: string;
  // The log this session is appending to: a `.jsonl` transcript for Claude, `events.jsonl` for
  // Copilot. Clicking the row opens it.
  transcriptPath: string;
  // The session's own generated title. Claude rewrites it as the session goes on, so this is the
  // *first* one it wrote — the later ones chase the newest turn. Copilot keeps the current one in
  // `workspace.yaml`, so there's nothing to choose. Absent until one has been written.
  title?: string;
  // `owner/repo`, and the branch the agent is on. Copilot records both; Claude records neither.
  repository?: string;
  branch?: string;
  // The PR this session opened, if it opened one. Claude only — Copilot logs no equivalent.
  pullRequest?: AgentPullRequest;
  // The last prompt, already truncated by the CLI that wrote it.
  lastPrompt?: string;
  tail: TranscriptTail;
  // The tool the agent is waiting on, when the log ends on a tool call or a permission request. The
  // name only: the input is arbitrary text from the agent's own work, and this panel gets
  // screenshotted.
  pendingTool?: string;
  // How full the model's context is. Claude only, and absent until the session finishes one
  // assistant turn.
  context?: AgentContext;
  // When the log was last written, and when the process started.
  lastActivityAt: number;
  startedAt: number;
  version: string;
  entrypoint: string;
  issues: ConfigIssue[];
}

// Auto-memory: the files Claude writes about you, under `~/.claude/projects/<encoded>/memory/`.
// Nothing here is authored by hand, which is the whole reason the surface exists.
//
// The four types the memory instructions name. A file carrying anything else still renders, in its
// own group — degrade, don't drop.
//
// Deliberately not annotated: a type here would erase the literals `MemoryType` derives from.
export const MEMORY_TYPES = ['user', 'feedback', 'project', 'reference'] as const;

export type MemoryType = (typeof MEMORY_TYPES)[number];

// A `[[name]]` in a memory's body. A link with no target is not a failure — the instructions say it
// marks something worth writing later — so `resolved` dims the chip rather than flagging it.
export interface MemoryLink {
  name: string;
  resolved: boolean;
}

// What the body pane renders. A memory is one; so is MEMORY.md, which has no type, no age and no
// links — which is why this is the shape the pane takes rather than MemoryEntry.
export interface MemoryDocument {
  // A memory's frontmatter `name` (falling back to the filename); the filename for the index.
  name: string;
  // Empty for the index: the file is its own description.
  description: string;
  // Absolute path. What the body is fetched by, and unique, so it doubles as the selection key.
  path: string;
  links: MemoryLink[];
  issues: ConfigIssue[];
}

// One memory file. Unlike a skill it costs nothing until it's recalled, so there's one cost here
// rather than two: the index is what carries the price of merely existing.
export interface MemoryEntry extends MemoryDocument {
  // Undefined when `metadata.type` is missing or is a word this doesn't know.
  type?: MemoryType;
  // What it said instead, when it said something. Printed, so a typo is visible rather than silent.
  declaredType?: string;
  chars: number;
  // `metadata.modified` where the file has one, else the file's own mtime. Absolute, so the view
  // ages it against its own clock.
  modifiedAt: number;
  // A line in MEMORY.md points at this file. False means it's written but nothing will recall it.
  indexed: boolean;
}

// One line of MEMORY.md: `- [Title](file.md) — hook`.
export interface MemoryIndexEntry {
  title: string;
  // The link target as written, relative to the memory directory.
  target: string;
  // The trailing clause after the dash, which is most of what the index spends its tokens on.
  hook?: string;
  // Absolute path of the file it resolves to, or undefined when nothing is there — an entry still
  // costing tokens to claim a memory exists.
  path?: string;
}

// MEMORY.md itself. It is loaded into every session, so it is the one number on this surface that
// gets paid whether or not any memory is ever recalled.
export interface MemoryIndex {
  path: string;
  // False when there's no MEMORY.md at all — memories on disk that nothing points at.
  present: boolean;
  chars: number;
  entries: MemoryIndexEntry[];
  issues: ConfigIssue[];
}

// The memory directory for the open workspace, read whole. Keyed on the working directory: with no
// folder open there's nothing to read, and no user scope to fall back to.
export interface MemorySet {
  // The directory that was looked in. The empty state has to say which one — a worktree has its own.
  dir: string;
  index: MemoryIndex;
  // Alphabetical within a type; the view does the grouping.
  memories: MemoryEntry[];
}

export interface ConfigSnapshot {
  workspaceRoot: string | undefined;
  skills: SkillEntry[];
  // Flat and already in load order. `depth` is all the view needs to draw the import tree.
  systemPrompt: SystemPromptFile[];
  // Undefined when no folder is open: the memory directory is keyed on the working directory, so
  // there is nothing to look in rather than nothing to show.
  memory: MemorySet | undefined;
  loadedAt: number;
}

// One skill in the mention graph — only what a node draws. Everything else about it is on the
// entry the panel already has.
export interface SkillGraphNode {
  // The skill's SKILL.md path. What edges point at, and the row key.
  path: string;
  name: string;
  description: string;
  scope: SkillScope;
  pluginName?: string;
}

// A directed mention: the text of `from` names the skill at `to`. `weight` is how many times, which
// is what makes one line heavier than another.
export interface SkillGraphEdge {
  from: string;
  to: string;
  weight: number;
}

// Who references whom, across the listed skills. Positions aren't here — layout is the webview's.
export interface SkillGraph {
  // Connected skills only. A skill nothing mentions, that mentions nothing, isn't in the graph.
  nodes: SkillGraphNode[];
  edges: SkillGraphEdge[];
  // The snapshot this was built from. Both sides use it as the cache key, so a refresh invalidates
  // the graph without anyone having to remember to.
  loadedAt: number;
}

// Mapped to a themed ThemeIcon host-side, so adapters stay free of vscode.
export type TreeNodeIcon = 'shadowed' | 'warning' | 'error';

// One row in the sidebar tree. `children` makes it collapsible.
export interface TreeNode {
  // Unique across the whole tree — VS Code keys expansion state off it.
  id: string;
  label: string;
  // Dimmed text after the label: a scope, a count.
  description?: string;
  tooltip?: string;
  icon?: TreeNodeIcon;
  // Clicking opens the panel on this skill. Absent on rows that aren't an entry.
  revealPath?: string;
  children?: TreeNode[];
  // A first-render hint only; the reader's own folding wins after that.
  collapsed?: boolean;
}

// What kind of thing a search result is. Grows with the surfaces; the result row prints it, which
// is what keeps one list of skills, CLAUDE.md files and hooks readable.
//
// Deliberately not annotated: a type here would erase the literals `SearchKind` derives from.
//
// A kind doubles as a filter word — `filter:skill` — so no kind may be a prefix of another, or the
// shorter one would claim the token before you finished typing the longer one.
export const SEARCH_KINDS = ['skill', 'memory'] as const;

export type SearchKind = (typeof SEARCH_KINDS)[number];

// One searchable thing, chewed up ahead of the query: the label lowercased, plus a bitmask of the
// positions each character occurs at. See docs/spotlight-search.md for what the masks buy.
export interface SearchDoc {
  // Unique across the index — a skill's path. Doubles as the row key.
  id: string;
  label: string;
  kind: SearchKind;
  // `label` lowercased. What the query actually matches against.
  haystack: string;
  // character → set bit per position it occurs at, one 32-bit word per 32 characters.
  masks: Map<string, number[]>;
  // Position in the panel's own ordering, used to break a tie between equal scores.
  rank: number;
  // Present but not in effect — a shadowed skill today. The row dims it.
  inactive?: boolean;
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
  // Indices in `label` the query matched, ascending. The row highlights them.
  positions: number[];
}

export interface SurfaceArgs {
  snapshot: ConfigSnapshot;
}

// One per surface: snapshot in, root row out. Undefined means that surface isn't built yet.
export type SurfaceAdapter = (args: SurfaceArgs) => TreeNode | undefined;

// Selecting one skill from outside the webview — the command palette or a vscode:// link. The
// nonce is what makes revealing the same skill twice in a row a second event rather than a no-op.
export interface Reveal {
  path: string;
  nonce: number;
  // A heading inside the file, as a link named it — see webview/markdown/find-section.ts for how
  // loosely it's matched. Undefined means the top of the file, which is every reveal but a link's.
  section?: string;
}

// The text of one config file, answering a `requestBody` — a SKILL.md below its frontmatter, or a
// CLAUDE.md whole. `path` is echoed back so a reply that arrives after the selection moved on can
// be dropped.
export interface FileBody {
  path: string;
  body: string;
  error?: string;
}

// Host → webview. Settings ride their own message rather than a field on the snapshot: changing a
// budget shouldn't re-walk the disk for every CLAUDE.md to answer a question the disk never had.
export type HostMessage =
  | { type: 'snapshot'; snapshot: ConfigSnapshot }
  | { type: 'settings'; settings: ViewerSettings }
  // Live processes, most recently active first. Empty is a normal answer. Its own message rather
  // than a snapshot field: an agent starting shouldn't cost a re-read of every skill.
  | { type: 'agents'; agents: AgentSession[] }
  | ({ type: 'reveal' } & Reveal)
  | ({ type: 'fileBody' } & FileBody)
  | { type: 'skillGraph'; graph: SkillGraph }
  // The whole map every time — it's a handful of entries, and a delta would be a protocol for
  // something that fits in one message.
  | { type: 'agentColors'; colors: AgentColors }
  // What the sessions on this machine have cost, both windows already aggregated. Its own message
  // for the reason agents are, and more so: the scan behind it reads every transcript on disk, and
  // nothing else should have to wait for it.
  | { type: 'usage'; report: UsageReport }
  // Every session on disk, for the Sessions tab. Its own message rather than a field on the report:
  // that one is a seven-day window on a 15s poll, this is the whole corpus on a slower one.
  | { type: 'usageHistory'; history: UsageHistory };

// Webview → host. `surfaceUnavailable` carries only the surface's name: the host owns the
// sentence, the same way it owns which paths `openFile` will accept. `openSettings` is the same
// deal — the webview names the section it wants, the host turns that into the query.
export type WebviewMessage =
  | { type: 'ready' }
  | { type: 'refresh' }
  | { type: 'openFile'; path: string }
  // Go to the agent itself — its Claude Code tab, or the terminal it runs in. A session id rather
  // than anything about how to reach it: what this window can reach is the host's question, and
  // the answer changes between one click and the next.
  | { type: 'openAgent'; sessionId: string }
  | { type: 'requestBody'; path: string }
  // No path: the graph is over every listed skill, and the host caches it per snapshot.
  | { type: 'requestGraph' }
  | { type: 'surfaceUnavailable'; title: string }
  // Which surface is on screen, `undefined` for the landing page. The id is a plain string here:
  // SurfaceId is derived from SURFACES, which is webview-only, so the host matches it against its
  // own constant the way it already matches command ids against package.json.
  | { type: 'surfaceChanged'; surface: string | undefined }
  | { type: 'openSettings'; section: SettingsSection }
  // One row's colour. No `color` clears it — the row goes back to painting like every other one.
  | { type: 'setAgentColor'; sessionId: string; color?: AgentColor }
  // The usage surface's own toggles. They write `claudeViewer.usage.*` — the extension's settings,
  // not Claude's — and the host owns which layer that lands in.
  // The estimator dialog's Apply. Writes `claudeViewer.tokens.estimator` — the extension's own
  // settings, not Claude's.
  | { type: 'setEstimator'; estimator: TokenEstimator }
  | {
      type: 'setUsage';
      metric?: UsageMetric;
      scope?: UsageScope;
      costBasis?: UsageCostBasis;
    };
