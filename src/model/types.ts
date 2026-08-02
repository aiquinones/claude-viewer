// Shared shapes for the host and the webview. The host builds these from disk; the webview
// only ever reads them.

// Skill scopes, most specific first. Memory adds 'local' and 'nested' when that surface lands.
export type Scope = 'project' | 'user' | 'plugin';

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

// Selecting one skill from outside the webview — the command palette or a vscode:// link. The
// nonce is what makes revealing the same skill twice in a row a second event rather than a no-op.
export interface Reveal {
  path: string;
  nonce: number;
}

// Host → webview.
export type HostMessage =
  | { type: 'snapshot'; snapshot: ConfigSnapshot }
  | ({ type: 'reveal' } & Reveal);

// Webview → host.
export type WebviewMessage =
  | { type: 'ready' }
  | { type: 'refresh' }
  | { type: 'openFile'; path: string };
