import { AgentSession } from '@src/model/types';
import { WORKSPACE } from './fixtures';

// Synthetic only, like every other fixture here — working on this extension means reading your own
// ~/.claude, and a real session carries a real prompt and a real path.
//
// Ages are relative to load, not absolute: the view derives every state from `now - lastActivityAt`,
// so a fixture pinned to a fixed timestamp would read as days idle by the time anyone looked.
const ago = (ms: number): number => Date.now() - ms;

const makeAgent = (
  overrides: Partial<AgentSession> & Pick<AgentSession, 'sessionId' | 'cwd'>
): AgentSession => ({
  tool: 'claude',
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

// The Copilot defaults on top of those: its own directory layout, its own version line, and the
// repository and branch Claude's session files don't carry.
const makeCopilotAgent = (
  overrides: Partial<AgentSession> & Pick<AgentSession, 'sessionId' | 'cwd'>
): AgentSession =>
  makeAgent({
    tool: 'copilot',
    transcriptPath: `/Users/dev/.copilot/session-state/${overrides.sessionId}/events.jsonl`,
    version: '1.0.80',
    entrypoint: 'github/cli',
    repository: 'example/example-app',
    branch: 'main',
    ...overrides
  });

// Mid-turn and writing — the pulsing dot.
export const workingAgent: AgentSession = makeAgent({
  sessionId: '7d94fa75-c078-4b85-ae4e-031d5af6d96b',
  cwd: WORKSPACE,
  title: 'Add a retry to the upload queue',
  lastPrompt: 'the upload retries three times and then gives up silently — fix that',
  tail: 'working',
  pendingTool: 'Bash',
  lastActivityAt: ago(3_000),
  // A tenth of a 1M window. The comfortable case, and the one that proves `within` is muted rather
  // than green.
  context: { tokens: 103_900, model: 'claude-opus-5' }
});

// A tool call with nothing written since. The transcript can't say whether that's a permission
// prompt or a long build, which is why the row prints both the tool and the age.
export const waitingAgent: AgentSession = makeAgent({
  sessionId: '8639d45a-dc24-4ed6-a735-25e3358dc92e',
  pid: 8800,
  cwd: `${WORKSPACE}/.claude/worktrees/feat+upload-retries`,
  title: 'Rework the queue so a failed upload is visible',
  tail: 'working',
  pendingTool: 'Edit',
  lastActivityAt: ago(7 * 60_000),
  // A session that already opened a PR and kept working — the link stays on the row after.
  pullRequest: { number: 412, url: 'https://github.com/example/example-app/pull/412' },
  // Past the warn threshold and a fifth of the way along its window — the case the ticks exist for.
  context: { tokens: 214_000, model: 'claude-opus-5' }
});

// The common case: the last turn ended in text, and the agent is waiting for a human.
export const idleAgent: AgentSession = makeAgent({
  sessionId: '45291568-a32e-4ecc-95d2-78234b543e00',
  pid: 9145,
  cwd: WORKSPACE,
  title: 'Review the migration before it ships',
  lastActivityAt: ago(11 * 60_000),
  pullRequest: { number: 408, url: 'https://github.com/example/example-app/pull/408' },
  // A 200k model, so the same tokens fill far more of the bar than they would on Opus. Which is the
  // whole reason the window is per model rather than one number.
  context: { tokens: 48_200, model: 'claude-sonnet-4-6' }
});

// Another repo entirely. Four sessions in one directory is normal, and so is one somewhere else.
export const elsewhereAgent: AgentSession = makeAgent({
  sessionId: 'e650a55c-3f1b-4d2a-9c8e-1b7f2d5a9e04',
  pid: 9864,
  cwd: '/Users/dev/repos/notes-site',
  transcriptPath: '/Users/dev/.claude/projects/-Users-dev-repos-notes-site/e650a55c.jsonl',
  title: 'Fix the RSS date format',
  tail: 'working',
  pendingTool: 'Read',
  lastActivityAt: ago(28_000),
  context: { tokens: 92_400, model: 'claude-haiku-4-5-20251001' }
});

// Started, but nothing written yet — the process is real and the transcript isn't there. Also the
// no-title case, where the row falls back to the folder.
export const noTranscriptAgent: AgentSession = makeAgent({
  sessionId: '3b442016-77c1-4a90-8e51-2f0d6c8b1a33',
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

// Blocked, but on you rather than on a machine: `AskUserQuestion` is the tool an agent stops at
// when the answer it needs is yours. Same badge as `waitingAgent`, different robot — this pair is
// what the Robots mode says that the Details row can't.
export const askingAgent: AgentSession = makeAgent({
  sessionId: 'd2c9f4a1-5b83-4e17-9f60-8a3e1c7d4b52',
  pid: 9012,
  cwd: `${WORKSPACE}/services/api`,
  title: 'Pick a migration strategy for the sessions table',
  lastPrompt: 'we need to move sessions off the primary — work out how',
  tail: 'working',
  pendingTool: 'AskUserQuestion',
  // Past the stale threshold, which is what makes a `working` tail read as blocked.
  lastActivityAt: ago(150_000),
  // Past the error threshold. A third of the bar, painted red — the split the card explains.
  context: { tokens: 331_000, model: 'claude-opus-5' }
});

// A title long enough to prove the row truncates rather than wraps, and a prompt behind it.
export const longTitleAgent: AgentSession = makeAgent({
  sessionId: 'b745818d-e9c4-4467-a065-c7fb5ca8ba2b',
  pid: 8613,
  cwd: `${WORKSPACE}/packages/integrations/salesforce`,
  title:
    'Work out why the salesforce connector drops webhooks under load, and write the post-mortem for it',
  tail: 'working',
  pendingTool: 'Grep',
  lastActivityAt: ago(9_000),
  // The largest context measured on a real machine while designing this.
  context: { tokens: 410_600, model: 'claude-opus-5' }
});

// A model the built-in table has never heard of, so its window is the settable fallback. Not in
// `allAgents`: it's here for the card, which is the only place the difference is visible.
export const unknownModelAgent: AgentSession = makeAgent({
  sessionId: '15b7ce2b-e48a-4c0f-b2d9-6a41e3f8c507',
  pid: 8471,
  cwd: WORKSPACE,
  title: 'Try the new model on the parser',
  tail: 'working',
  pendingTool: 'Read',
  lastActivityAt: ago(12_000),
  context: { tokens: 61_000, model: 'claude-opus-6' }
});

// Bigger than the window assumed for its model, which can only mean the table is wrong. The bar
// clamps full and the card says so rather than letting a bad denominator pass as a reading.
export const overWindowAgent: AgentSession = makeAgent({
  sessionId: 'c1ff1d3f-bcf2-4e88-a1d7-93b0e5f27a46',
  pid: 8492,
  cwd: WORKSPACE,
  title: 'Long session on a model whose window moved',
  tail: 'working',
  pendingTool: 'Bash',
  lastActivityAt: ago(30_000),
  context: { tokens: 268_000, model: 'claude-sonnet-4-6' }
});

// A Copilot session mid-turn, in the same folder as the Claude ones. Four agents in one repo is
// normal; four agents from two different CLIs is the case this surface now has to read cleanly.
export const copilotWorkingAgent: AgentSession = makeCopilotAgent({
  sessionId: '430d333d-6c86-49be-8e91-7d23ea5a9b95',
  pid: 99699,
  cwd: WORKSPACE,
  title: 'Trace the flaky upload test',
  lastPrompt: 'the upload test fails about one run in five on CI',
  tail: 'working',
  pendingTool: 'bash',
  lastActivityAt: ago(2_000)
});

// The state only Copilot can state. `tail: 'blocked'` is an unanswered `permission.requested` in
// the log, so the row says Waiting immediately — no 60-second threshold, and the age below it is
// deliberately short to prove the clock isn't what decided.
export const copilotBlockedAgent: AgentSession = makeCopilotAgent({
  sessionId: 'f7be248b-6390-4eb8-b419-91dffdee9bd7',
  pid: 98987,
  cwd: `${WORKSPACE}/services/api`,
  title: 'Roll the staging database forward',
  branch: 'feat/schema-v4',
  tail: 'blocked',
  pendingTool: 'bash',
  lastActivityAt: ago(6_000)
});

// An MCP tool, which prints server-qualified so a remote `create_pull_request` doesn't read like a
// local one. Also the no-branch case: a session started outside a git repo has none.
export const copilotMcpAgent: AgentSession = makeCopilotAgent({
  sessionId: 'c1f0a8d2-4b6e-4a71-9d3c-5e8f7a2b0c14',
  pid: 10412,
  cwd: '/Users/dev/repos/notes-site',
  title: 'Open the release PR',
  repository: 'example/notes-site',
  branch: undefined,
  tail: 'working',
  pendingTool: 'github:create_pull_request',
  lastActivityAt: ago(15_000)
});

// Most recently active first, the way the loader sorts them — across both CLIs, so the list reads
// as one thing rather than two lists stacked.
export const allAgents: AgentSession[] = [
  copilotWorkingAgent,
  workingAgent,
  copilotBlockedAgent,
  longTitleAgent,
  copilotMcpAgent,
  noTranscriptAgent,
  elsewhereAgent,
  askingAgent,
  waitingAgent,
  idleAgent
];

// Nothing in this workspace — every agent is somewhere else.
export const remoteAgents: AgentSession[] = [elsewhereAgent, noTranscriptAgent, copilotMcpAgent];

// One of each robot, in the order the moods are declared. The story that has to show four poses
// side by side wants exactly this and nothing else.
export const everyMoodAgents: AgentSession[] = [
  workingAgent,
  waitingAgent,
  askingAgent,
  idleAgent
];

// One CLI at a time, for the stories that check a row reads right without the other to compare to.
export const copilotAgents: AgentSession[] = [
  copilotWorkingAgent,
  copilotBlockedAgent,
  copilotMcpAgent
];
