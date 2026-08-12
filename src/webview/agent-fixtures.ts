import { AgentSession } from '../model/types';
import { WORKSPACE } from './fixtures';

// Synthetic only, like every other fixture here — working on this extension means reading your own
// ~/.claude, and a real session carries a real prompt and a real path.
//
// Ages are relative to load, not absolute: the view derives every state from `now - lastActivityAt`,
// so a fixture pinned to a fixed timestamp would read as days idle by the time anyone looked.
const ago = (ms: number): number => Date.now() - ms;

const makeAgent = (
  overrides: Partial<AgentSession> & Pick<AgentSession, 'sessionId' | 'name' | 'cwd'>
): AgentSession => ({
  pid: 10700,
  transcriptPath: `/Users/dev/.claude/projects/-Users-dev-repos-example-app/${overrides.sessionId}.jsonl`,
  tail: 'settled',
  lastActivityAt: ago(4 * 60_000),
  startedAt: ago(50 * 60_000),
  version: '2.1.227',
  entrypoint: 'claude-vscode',
  issues: [],
  ...overrides
});

// Mid-turn and writing — the pulsing dot.
export const workingAgent: AgentSession = makeAgent({
  sessionId: '7d94fa75-c078-4b85-ae4e-031d5af6d96b',
  name: 'example-app-f8',
  cwd: WORKSPACE,
  title: 'Add a retry to the upload queue',
  lastPrompt: 'the upload retries three times and then gives up silently — fix that',
  tail: 'working',
  pendingTool: 'Bash',
  lastActivityAt: ago(3_000)
});

// A tool call with nothing written since. The transcript can't say whether that's a permission
// prompt or a long build, which is why the row prints both the tool and the age.
export const waitingAgent: AgentSession = makeAgent({
  sessionId: '8639d45a-dc24-4ed6-a735-25e3358dc92e',
  name: 'example-app-02',
  pid: 8800,
  cwd: `${WORKSPACE}/.claude/worktrees/feat+upload-retries`,
  title: 'Rework the queue so a failed upload is visible',
  tail: 'working',
  pendingTool: 'Edit',
  lastActivityAt: ago(7 * 60_000)
});

// The common case: the last turn ended in text, and the agent is waiting for a human.
export const idleAgent: AgentSession = makeAgent({
  sessionId: '45291568-a32e-4ecc-95d2-78234b543e00',
  name: 'example-app-b9',
  pid: 9145,
  cwd: WORKSPACE,
  title: 'Review the migration before it ships',
  lastActivityAt: ago(11 * 60_000)
});

// Another repo entirely. Four sessions in one directory is normal, and so is one somewhere else.
export const elsewhereAgent: AgentSession = makeAgent({
  sessionId: 'e650a55c-3f1b-4d2a-9c8e-1b7f2d5a9e04',
  name: 'notes-site-ed',
  pid: 9864,
  cwd: '/Users/dev/repos/notes-site',
  transcriptPath: '/Users/dev/.claude/projects/-Users-dev-repos-notes-site/e650a55c.jsonl',
  title: 'Fix the RSS date format',
  tail: 'working',
  pendingTool: 'Read',
  lastActivityAt: ago(28_000)
});

// Started, but nothing written yet — the process is real and the transcript isn't there. Also the
// no-title case, where the row falls back to the folder.
export const noTranscriptAgent: AgentSession = makeAgent({
  sessionId: '3b442016-77c1-4a90-8e51-2f0d6c8b1a33',
  name: 'example-app-57',
  pid: 10233,
  cwd: '/Users/dev/repos/scratch',
  transcriptPath: '/Users/dev/.claude/projects/-Users-dev-repos-scratch/3b442016.jsonl',
  lastActivityAt: ago(20_000),
  startedAt: ago(20_000),
  issues: [
    {
      severity: 'warning',
      message: 'no transcript on disk yet — nothing has been written for this session'
    }
  ]
});

// A title long enough to prove the row truncates rather than wraps, and a prompt behind it.
export const longTitleAgent: AgentSession = makeAgent({
  sessionId: 'b745818d-e9c4-4467-a065-c7fb5ca8ba2b',
  name: 'example-app-97',
  pid: 8613,
  cwd: `${WORKSPACE}/packages/integrations/salesforce`,
  title:
    'Work out why the salesforce connector drops webhooks under load, and write the post-mortem for it',
  tail: 'working',
  pendingTool: 'Grep',
  lastActivityAt: ago(9_000)
});

// Most recently active first, the way the loader sorts them.
export const allAgents: AgentSession[] = [
  workingAgent,
  longTitleAgent,
  noTranscriptAgent,
  elsewhereAgent,
  waitingAgent,
  idleAgent
];

// Nothing in this workspace — every agent is somewhere else.
export const remoteAgents: AgentSession[] = [elsewhereAgent, noTranscriptAgent];
