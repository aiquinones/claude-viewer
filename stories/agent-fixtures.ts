import { AgentSession, Deliverable, Subagent } from '@src/model/types';
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
  otherPids: [],
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

// The Codex defaults. Two things separate it from the other two: its log is a dated `rollout-*`
// file rather than anything named for the session, and it carries **no pid** — Codex records its
// process nowhere, so a row of it is what proves the menu drops Kill rather than printing
// `undefined`.
const makeCodexAgent = (
  overrides: Partial<AgentSession> & Pick<AgentSession, 'sessionId' | 'cwd'>
): AgentSession => {
  const agent: AgentSession = makeAgent({
    tool: 'codex',
    transcriptPath: `/Users/dev/.codex/sessions/2026/08/26/rollout-2026-08-26T01-01-24-${overrides.sessionId}.jsonl`,
    version: '',
    entrypoint: '',
    repository: 'example/example-app',
    branch: 'main',
    ...overrides
  });

  delete agent.pid;
  return agent;
};

// Mid-turn and writing — the pulsing dot.
export const workingAgent: AgentSession = makeAgent({
  sessionId: '7d94fa75-c078-4b85-ae4e-031d5af6d96b',
  cwd: WORKSPACE,
  title: 'Add a retry to the upload queue',
  lastPrompt: 'the upload retries three times and then gives up silently — fix that',
  tail: 'working',
  pendingTool: 'Bash',
  lastActivityAt: ago(3_000),
  // The stage is `dev-feature`, not the skill loaded after it: `read-project-structure` has no name
  // in `stageNames`, so the split steps over it and the row still says Build. The case the whole
  // trail exists for — the latest skill alone would say nothing here.
  skillTrail: ['dev-feature', 'read-project-structure'],
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
  // Two named skills, so the later one wins: the row says Ship rather than Build.
  skillTrail: ['dev-feature', 'create-pr'],
  // Past the warn threshold and a fifth of the way along its window — the case the ticks exist for.
  context: { tokens: 214_000, model: 'claude-opus-5' }
});

// One of each kind. The loader resolves a `file` path against the session's cwd and drops anything
// outside it, so the fixture's path is under WORKSPACE the way a real one always is.
export const deliverables: Deliverable[] = [
  { kind: 'storybook', title: 'Storybook', url: 'http://localhost:6006' },
  { kind: 'file', title: 'Plan', path: `${WORKSPACE}/docs/upload-retries.md` },
  { kind: 'link', title: 'Preview', url: 'https://preview.example.com/upload-retries' }
];

// A session that declared things it produced. Its PR is the one the panel found on its own, so this
// is also the case where both halves of the footer's link row are drawn at once.
export const deliverableAgent: AgentSession = makeAgent({
  sessionId: 'c1f0a2d4-5e6b-47c8-9a01-2b3c4d5e6f70',
  cwd: WORKSPACE,
  title: 'Rebuild the upload queue view',
  tail: 'working',
  pendingTool: 'Bash',
  lastActivityAt: ago(9_000),
  pullRequest: { number: 418, url: 'https://github.com/example/example-app/pull/418' },
  deliverables,
  skillTrail: ['dev-feature'],
  context: { tokens: 88_400, model: 'claude-opus-5' }
});

// A title long enough to hit the chip's own cap. An agent writes these and nothing bounds what it
// writes, which is the case the truncate exists for.
export const longDeliverableAgent: AgentSession = makeAgent({
  sessionId: 'd2e1b3c5-6f70-4819-ab12-3c4d5e6f7081',
  cwd: WORKSPACE,
  title: 'Wire the settings pane',
  tail: 'settled',
  deliverables: [
    {
      kind: 'link',
      title: 'The staging deployment of the settings pane, rebuilt from this branch',
      url: 'https://staging.example.com/settings'
    }
  ]
});

// The common case: the last turn ended in text, and the agent is waiting for a human.
export const idleAgent: AgentSession = makeAgent({
  sessionId: '45291568-a32e-4ecc-95d2-78234b543e00',
  pid: 9145,
  cwd: WORKSPACE,
  title: 'Review the migration before it ships',
  lastActivityAt: ago(11 * 60_000),
  pullRequest: { number: 408, url: 'https://github.com/example/example-app/pull/408' },
  // An idle row keeps its stage and loses the shimmer — where a session ended is a fact rather
  // than something in progress.
  skillTrail: ['claude-api'],
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

// Two live processes on one conversation, which is what `--resume` leaves behind when the process
// it was opened from doesn't exit. One row, and a red flag saying the pid it names isn't the only
// one — the loaders find this and used to drop it silently.
export const resumedAgent: AgentSession = makeAgent({
  sessionId: '2f8e1a94-6c30-4b7d-a5e2-c94f0d18b673',
  pid: 11402,
  otherPids: [10988],
  cwd: `${WORKSPACE}/services/api`,
  title: 'Pick up the migration from yesterday',
  tail: 'working',
  pendingTool: 'Bash',
  lastActivityAt: ago(45_000),
  context: { tokens: 187_000, model: 'claude-opus-5' }
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
  // Nothing named, so no stage — which is what most rows look like until someone has named a
  // skill, and what proves a long title takes the room the stage isn't using.
  skillTrail: ['perform-testing'],
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
  lastActivityAt: ago(2_000),
  // Both CLIs write their skill loads down, so a stage reads the same on either row.
  skillTrail: ['dev-feature'],
  // A Copilot reading, out of the usage database rather than the event log. GPT-5.6 spells its id
  // with a dot, which the window table normalizes away.
  context: { tokens: 96_400, model: 'gpt-5.6-luna' }
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
  // The footer is the same footer a Claude row draws. Copilot names its PR once, in the output of
  // the command that opened it, rather than on a line of its own like Claude does.
  pullRequest: { number: 89, url: 'https://github.com/example/example-app/pull/89' },
  tail: 'blocked',
  pendingTool: 'bash',
  lastActivityAt: ago(6_000),
  // The same model Claude Code writes as `claude-haiku-4-5`. Copilot's dotted spelling has to reach
  // the same 200k row, which is the case the normalization exists for.
  context: { tokens: 148_000, model: 'claude-haiku-4.5' }
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

// The sub-agents a session has out. Only Copilot writes these: a `subagent.started` with no
// `subagent.completed` behind it, joined to that sub-agent's own rows in the usage database.
//
// One of them has finished no request yet, so it carries no reading — that's the ordinary state for
// the first second or two of a sub-agent's life, and it draws no bar rather than an empty one. The
// last has no purpose, which is what a sub-agent whose `task` call fell outside the window looks
// like.
export const subagents: Subagent[] = [
  {
    id: 'call_kBU8gx9lKjCsicYKlU9299Vt',
    name: 'general-purpose',
    displayName: 'General Purpose Agent',
    purpose: 'Trace where the upload retry budget is set',
    model: 'gpt-5.6-luna',
    context: { tokens: 26_000, model: 'gpt-5.6-luna' }
  },
  {
    id: 'call_Wf4he84wxJj0oNxdjfNX34Ig',
    name: 'explore',
    displayName: 'Explore Agent',
    purpose: 'Sweep the stories for the old heading copy',
    model: 'claude-haiku-4.5'
  },
  {
    id: 'call_H4oUY7KiJIUP8BpFnvK6zUB8',
    name: 'general-purpose',
    displayName: 'General Purpose Agent',
    model: 'gpt-5.6-luna',
    context: { tokens: 212_000, model: 'gpt-5.6-luna' }
  }
];

// A Copilot session with work delegated out. Its own bar measures its own conversation — the
// sub-agents' rows in the usage database are filed under the same session id and are deliberately
// not part of it.
export const copilotSubagentAgent: AgentSession = makeCopilotAgent({
  sessionId: 'f6d7b743-f17f-4360-8bfd-ac490b27a92e',
  pid: 92816,
  cwd: WORKSPACE,
  title: 'Split the retry budget out of the uploader',
  branch: 'feat/retry-budget',
  tail: 'working',
  pendingTool: 'task',
  lastActivityAt: ago(3_000),
  context: { tokens: 302_000, model: 'gpt-5.6-luna' },
  subagents,
  pullRequest: { number: 419, url: 'https://github.com/example/example-app/pull/419' }
});

// A Codex session mid-turn. `exec` is what its tool calls are named — one tool that runs a script,
// where Claude has Bash and Edit and Read.
export const codexWorkingAgent: AgentSession = makeCodexAgent({
  sessionId: '01a03d16-918d-7b93-88b5-ac866afdf539',
  cwd: WORKSPACE,
  title: 'Give the scope badges a quieter treatment',
  lastPrompt: 'the scope pill in the row is really ugly, come up with another option',
  tail: 'working',
  pendingTool: 'exec',
  lastActivityAt: ago(5_000),
  // The one CLI that states its own window, so this reading carries it and the card says `stated`
  // rather than naming the built-in table.
  context: { tokens: 87_300, model: 'gpt-5.6-terra', window: 258_400 },
  // Read off the commands that opened the files — Codex has no skill event, so a stage on one of
  // these rows is inferred from a `sed` of a SKILL.md and nothing else.
  skillTrail: ['dev-feature', 'style-plan']
});

// Idle, and in a worktree — the second half is what makes the cwd print, since the row only says
// where it is when that isn't the workspace root.
export const codexIdleAgent: AgentSession = makeCodexAgent({
  sessionId: '01a03d1d-5414-7ee2-8e4c-8f420d1d2eaa',
  cwd: `${WORKSPACE}/.claude/worktrees/feat+scope-markers`,
  title: 'Move the skill scope under the title',
  tail: 'settled',
  lastActivityAt: ago(18 * 60_000),
  branch: 'feat/scope-markers',
  context: { tokens: 31_200, model: 'gpt-5.6-terra', window: 258_400 }
});

export const codexAgents: AgentSession[] = [codexWorkingAgent, codexIdleAgent];

// Most recently active first, the way the loader sorts them — across every CLI, so the list reads
// as one thing rather than three lists stacked.
export const allAgents: AgentSession[] = [
  copilotSubagentAgent,
  copilotWorkingAgent,
  codexWorkingAgent,
  workingAgent,
  copilotBlockedAgent,
  longTitleAgent,
  copilotMcpAgent,
  noTranscriptAgent,
  resumedAgent,
  elsewhereAgent,
  askingAgent,
  waitingAgent,
  codexIdleAgent,
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
