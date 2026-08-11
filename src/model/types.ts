// Shared shapes for the host and the webview. The host builds these from disk; the webview
// only ever reads them.

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
  // The whole SKILL.md — what the skill costs once Claude opens it. Same field names as
  // SystemPromptFile, because it's the same measurement.
  chars: number;
  estimatedTokens: number;
  // Just the name and the description, which sit in the system prompt on every request whether or
  // not the skill ever runs.
  listingChars: number;
  listingEstimatedTokens: number;
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
  chars: number;
  // chars / 4. A heuristic, not a tokenizer — the UI says "est." wherever it shows.
  estimatedTokens: number;
  // Path of the file whose `@` line pulled this one in.
  importedBy?: string;
  // 0 for a file found on disk, +1 per import hop.
  depth: number;
  // Directory Claude has to be working under for this file to load at all.
  conditionalOn?: string;
  issues: ConfigIssue[];
}

export interface ConfigSnapshot {
  workspaceRoot: string | undefined;
  skills: SkillEntry[];
  // Flat and already in load order. `depth` is all the view needs to draw the import tree.
  systemPrompt: SystemPromptFile[];
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
export const SEARCH_KINDS = ['skill'] as const;

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
}

// The text of one config file, answering a `requestBody` — a SKILL.md below its frontmatter, or a
// CLAUDE.md whole. `path` is echoed back so a reply that arrives after the selection moved on can
// be dropped.
export interface FileBody {
  path: string;
  body: string;
  error?: string;
}

// Host → webview.
export type HostMessage =
  | { type: 'snapshot'; snapshot: ConfigSnapshot }
  | ({ type: 'reveal' } & Reveal)
  | ({ type: 'fileBody' } & FileBody);

// Webview → host. `surfaceUnavailable` carries only the surface's name: the host owns the
// sentence, the same way it owns which paths `openFile` will accept.
export type WebviewMessage =
  | { type: 'ready' }
  | { type: 'refresh' }
  | { type: 'openFile'; path: string }
  | { type: 'requestBody'; path: string }
  | { type: 'surfaceUnavailable'; title: string };
