import { PerfPhase, PerfReadKind } from '../../model/perf/types';

// What each stage is called, in words that say what it did. The card is read by someone asking why
// a launch was slow, and a label that repeats the id tells them nothing they didn't already have.
export const PHASE_LABELS: Record<PerfPhase, string> = {
  activate: 'Activation',
  boot: 'Webview boot',
  snapshot: 'Config read',
  skills: 'Skills',
  'system-prompt': 'System prompt',
  memory: 'Memory',
  agents: 'Active agents',
  paint: 'First paint',
  usage: 'Usage scan'
};

// What the stage actually opened, on the row's `title`. It's the difference between "the config
// read took 900ms" and knowing that the config read is a walk of the whole workspace.
export const PHASE_NOTES: Record<PerfPhase, string> = {
  activate: 'Registering the commands and starting the file watchers.',
  boot: 'Panel shell, bundle and first mount. Before any config is read.',
  snapshot: 'Skills, the system prompt and memory, read concurrently and published as each lands.',
  skills: 'One SKILL.md per skill, across the project, user and plugin scopes.',
  'system-prompt': 'The CLAUDE.md stack and every file it imports — a walk of the workspace.',
  memory: 'The memory directory for the open folder.',
  agents: "Each live agent's session file and the end of its transcript.",
  paint: 'Drawing the landing page. It no longer waits on the config — each surface fills in after.',
  usage: 'Every session log on the machine. Runs after the page is already up.'
};

// How a read prints in the slowest list. A listing and a database query hand back no bytes, so the
// size column would be `0 B` for both — the kind is what says why.
export const READ_KIND_LABELS: Record<PerfReadKind, string> = {
  file: 'read',
  dir: 'listed',
  db: 'query'
};
