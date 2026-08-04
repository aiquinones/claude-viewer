// Shared shapes for the host and the webview. The host builds these from disk; the webview
// only ever reads them.

// Skill scopes, most specific first — the array order *is* the precedence order, so `scopeRank`
// reads position off it. Memory adds 'local' and 'nested' when that surface lands.
//
// Deliberately not annotated: a type here would erase the literals that `Scope` is derived from,
// and deriving is what keeps adding a scope to one edit instead of four.
export const SCOPES = ['project', 'user', 'plugin'] as const;

export type Scope = (typeof SCOPES)[number];

export type IssueSeverity = 'warning' | 'error';

// A problem attached to whatever it affects, so a bad file becomes a visible note on one row
// instead of a missing row or a crashed tree.
export interface ConfigIssue {
  severity: IssueSeverity;
  message: string;
}

// A directory that may contain `<name>/SKILL.md` subdirectories.
export interface SkillRoot {
  scope: Scope;
  dir: string;
  pluginName?: string;
}

export interface SkillEntry {
  // Frontmatter `name`, falling back to the directory name.
  name: string;
  description: string;
  allowedTools: string[];
  scope: Scope;
  // Absolute path to SKILL.md. Unique per entry, so it doubles as the row key.
  path: string;
  pluginName?: string;
  // Files under references/ and scripts/, counted so the row can say a skill ships extras.
  bundledFiles: number;
  // Path of the same-named skill that wins, when this one is shadowed.
  shadowedBy?: string;
  issues: ConfigIssue[];
}

export interface ConfigSnapshot {
  workspaceRoot: string | undefined;
  skills: SkillEntry[];
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

// One skill's SKILL.md below the frontmatter, answering a `requestBody`. `path` is echoed back so
// a reply that arrives after the selection moved on can be dropped.
export interface SkillBody {
  path: string;
  body: string;
  error?: string;
}

// Host → webview.
export type HostMessage =
  | { type: 'snapshot'; snapshot: ConfigSnapshot }
  | ({ type: 'reveal' } & Reveal)
  | ({ type: 'skillBody' } & SkillBody);

// Webview → host. `surfaceUnavailable` carries only the surface's name: the host owns the
// sentence, the same way it owns which paths `openFile` will accept.
export type WebviewMessage =
  | { type: 'ready' }
  | { type: 'refresh' }
  | { type: 'openFile'; path: string }
  | { type: 'requestBody'; path: string }
  | { type: 'surfaceUnavailable'; title: string };
