// What a vscode:// link is allowed to call each surface. A deliberate host-side copy of the ids in
// webview/surfaces.ts — that file is webview-only, and panel.ts already keeps its own two the same
// way. Duplicating them here also means a link's vocabulary is a promise: the landing page can
// rename a card without breaking a bookmark.
const LINKED_SURFACES: Record<string, string> = {
  skills: 'skills',
  'system-prompt': 'system-prompt',
  'active-agents': 'active-agents',
  // The word someone types. The id is only 'active-agents' because 'agents' is reserved for the
  // subagent surface, which is a distinction a link author has no reason to know about.
  agents: 'active-agents',
  usage: 'usage',
  memory: 'memory'
};

// A path segment → the surface it names, or undefined if it names none.
export const linkedSurface = (segment: string): string | undefined => LINKED_SURFACES[segment];
