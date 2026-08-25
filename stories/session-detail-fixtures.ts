// Synthetic sessions for the session analysis stories — never a real transcript, like every other
// fixture here. A real one names a real repo and says what you were doing on Tuesday.
//
// Shaped after what the real logs hold, which is the point of the shapes worth checking: a long
// Claude session under one wrapper skill, and a Copilot one where a single `/dev-feature` loads the
// body twice five seconds apart. Both of those are measured behaviours, not inventions.

import { contextPointsFromTurns } from '@src/model/usage/session/contexts';
import { AgentSession, AgentTool } from '@src/model/types';
import {
  ContextPoint,
  SessionDetail,
  SessionUsage,
  SkillInvocation,
  UsageTurn
} from '@src/model/usage/types';

const MINUTE: number = 60_000;
const SECOND: number = 1_000;

// A fixed clock, so a story renders the same bars and the same times every run.
const START: number = Date.UTC(2026, 7, 18, 9, 0, 0);

interface TurnArgs {
  index: number;
  minutesIn: number;
  output: number;
  skill?: string;
  tool?: AgentTool;
  model?: string;
  nanoAiu?: number;
}

const turn = ({
  index,
  minutesIn,
  output,
  skill,
  tool = 'claude',
  model,
  nanoAiu
}: TurnArgs): UsageTurn => ({
  id: `req_${index}`,
  at: START + minutesIn * MINUTE,
  tool,
  sessionId: tool === 'claude' ? 'a1b2c3d4-0000-4000-8000-000000000001' : 'f7be248b-0000-4000-8000-000000000002',
  cwd: '/Users/dev/repos/example-app',
  ...(skill ? { skill } : {}),
  source: tool === 'claude' ? 'read' : 'inferred',
  model: model ?? (tool === 'claude' ? 'claude-opus-5' : 'gpt-5.6-luna'),
  tokens: {
    input: 12,
    output,
    cacheRead: output * 30,
    cacheWrite5m: 0,
    cacheWrite1h: output * 8
  },
  ...(nanoAiu === undefined ? {} : { nanoAiu })
});

// A deterministic stand-in for a random walk. `(step * 137) % 900` was the obvious way to vary the
// turns and it draws a sawtooth — which reads as a bug in the chart rather than as a session.
const wobble = (step: number): number => {
  const noise: number = Math.sin(step * 12.9898) * 43758.5453;
  return noise - Math.floor(noise);
};

// A shape that reads like a real session: a few big turns early, a long tail of small ones, and one
// spike where a sub-skill ran.
const claudeTurns: UsageTurn[] = [
  turn({ index: 1, minutesIn: 0, output: 1_240 }),
  turn({ index: 2, minutesIn: 2, output: 3_180, skill: 'dev-feature' }),
  ...Array.from({ length: 40 }, (_unused, step) =>
    turn({
      index: 10 + step,
      minutesIn: 4 + step * 3,
      output: Math.round(400 + wobble(step) * 1_100),
      skill: 'dev-feature'
    })
  ),
  ...Array.from({ length: 12 }, (_unused, step) =>
    turn({
      index: 60 + step,
      minutesIn: 128 + step * 2,
      output: Math.round(700 + wobble(step + 40) * 2_400),
      skill: 'create-pr'
    })
  ),
  turn({ index: 90, minutesIn: 156, output: 620 })
];

// Every turn re-reads the whole conversation, so a real transcript's cache-read figure compounds
// rather than tracking that turn's own output. The turns are built first and walked after, which is
// what makes the context chart in these stories climb the way one on disk does.
//
// The dip is deliberate and real: a compaction drops the conversation back down, and the curve has
// to be able to draw that without a spline swinging below zero on the way.
const compound = (turns: UsageTurn[]): UsageTurn[] => {
  let carried: number = 6_400;

  return turns.map((one, index) => {
    // Two thirds of the way in, the session compacts.
    if (index === 44) carried = Math.round(carried * 0.42);

    const next: UsageTurn = {
      ...one,
      tokens: { ...one.tokens, cacheRead: carried, cacheWrite5m: 0, cacheWrite1h: one.tokens.output }
    };
    carried += one.tokens.output * 3 + 900;
    return next;
  });
};

const claudeSessionTurns: UsageTurn[] = compound(claudeTurns);

// What a real long session looks like: the wrapper skill typed a few times as the work restarts, the
// PR skill called at each of the two ends it reached, and one reference skill the model pulled in
// once. `claude-api` isn't installed in the fixture set, which is the row with no size.
const claudeLoads: SkillInvocation[] = [
  { skill: 'dev-feature', at: START + 2 * MINUTE, via: 'command' },
  { skill: 'claude-api', at: START + 20 * MINUTE, via: 'tool' },
  { skill: 'dev-feature', at: START + 54 * MINUTE, via: 'command' },
  { skill: 'create-pr', at: START + 96 * MINUTE, via: 'tool' },
  { skill: 'dev-feature', at: START + 110 * MINUTE, via: 'command' },
  { skill: 'create-pr', at: START + 128 * MINUTE, via: 'tool' },
  { skill: 'publish', at: START + 150 * MINUTE, via: 'command' }
];

export const claudeSession: SessionUsage = {
  sessionId: 'a1b2c3d4-0000-4000-8000-000000000001',
  tool: 'claude',
  title: 'Session analysis view for the usage surface',
  cwd: '/Users/dev/repos/example-app',
  firstAt: START,
  lastAt: START + 156 * MINUTE,
  outputTokens: claudeSessionTurns.reduce((sum, one) => sum + one.tokens.output, 0),
  turns: claudeSessionTurns.length,
  days: []
};

export const claudeDetail: SessionDetail = {
  sessionId: claudeSession.sessionId,
  tool: 'claude',
  turns: claudeSessionTurns,
  invocations: claudeLoads,
  // Through the real builder rather than written out, so the curve and the turns can't drift.
  contexts: contextPointsFromTurns(claudeSessionTurns)
};

// The double load, which is the whole reason the row says "loads" rather than "calls": Copilot
// injects the skill because its name was typed, then loads it again when the model asks for what it
// has already been given. Five seconds apart, same body both times.
const copilotTurns: UsageTurn[] = Array.from({ length: 18 }, (_unused, step) =>
  turn({
    index: 200 + step,
    minutesIn: step * 4,
    output: Math.round(300 + wobble(step + 90) * 1_500),
    skill: step > 1 ? 'dev-feature' : undefined,
    tool: 'copilot',
    nanoAiu: 40_000_000 + step * 3_000_000
  })
);

// Copilot's context comes out of the usage database rather than off its turns, so it's its own list
// here too — and one row shorter than the turns, which is the shape that catches a chart assuming
// the two series line up.
const copilotContexts: ContextPoint[] = Array.from({ length: 17 }, (_unused, step) => ({
  at: START + step * 4 * MINUTE,
  model: 'gpt-5.6-luna',
  tokens: 24_000 + step * 5_200 + ((step * 613) % 2_000)
}));

export const copilotDetail: SessionDetail = {
  sessionId: 'f7be248b-0000-4000-8000-000000000002',
  tool: 'copilot',
  turns: copilotTurns,
  invocations: [
    { skill: 'dev-feature', at: START + 4 * MINUTE, via: 'event', chars: 3_592 },
    { skill: 'dev-feature', at: START + 4 * MINUTE + 5 * SECOND, via: 'event', chars: 3_592 }
  ],
  contexts: copilotContexts
};

export const copilotSession: SessionUsage = {
  sessionId: copilotDetail.sessionId,
  tool: 'copilot',
  title: 'Drop the memory section blurbs',
  cwd: '/Users/dev/repos/example-app',
  firstAt: START,
  lastAt: START + 68 * MINUTE,
  outputTokens: copilotTurns.reduce((sum, one) => sum + one.tokens.output, 0),
  turns: copilotTurns.length,
  days: []
};

// The agent still writing to `claudeSession`, for the stories about a page that reads itself. Ages
// are relative to load, like every other agent fixture — a pinned timestamp reads as days idle by
// the time anyone looks at it.
export const liveClaudeAgent: AgentSession = {
  sessionId: claudeSession.sessionId,
  tool: 'claude',
  pid: 10_700,
  otherPids: [],
  cwd: claudeSession.cwd,
  transcriptPath: `/Users/dev/.claude/projects/-Users-dev-repos-example-app/${claudeSession.sessionId}.jsonl`,
  title: claudeSession.title,
  tail: 'working',
  pendingTool: 'Bash',
  lastActivityAt: Date.now() - 3 * SECOND,
  startedAt: Date.now() - 156 * MINUTE,
  version: '2.1.227',
  entrypoint: 'claude-vscode',
  issues: []
};

// The same, stopped at a permission prompt — the one state Copilot writes down rather than leaving
// to be inferred, and the badge that says Waiting without consulting the clock.
export const liveCopilotAgent: AgentSession = {
  sessionId: copilotSession.sessionId,
  tool: 'copilot',
  pid: 11_200,
  otherPids: [],
  cwd: copilotSession.cwd,
  transcriptPath: `/Users/dev/.copilot/session-state/${copilotSession.sessionId}/events.jsonl`,
  title: copilotSession.title,
  tail: 'blocked',
  pendingTool: 'shell',
  lastActivityAt: Date.now() - 40 * SECOND,
  startedAt: Date.now() - 68 * MINUTE,
  version: '1.0.80',
  entrypoint: 'github/cli',
  repository: 'example/example-app',
  branch: 'main',
  issues: []
};

// Two stages, which is the case the radar can't close into a polygon — two vertices are a line.
// Cut from the long session rather than invented, so the turns behind the two spokes are real ones.
export const twoStageDetail: SessionDetail = {
  ...claudeDetail,
  invocations: claudeLoads.filter((load) => load.skill === 'dev-feature' || load.skill === 'publish')
};

// A session that ran no skills at all, which is most short ones.
const bareTurns: UsageTurn[] = claudeSessionTurns
  .slice(0, 4)
  .map((one) => ({ ...one, skill: undefined }));

export const bareDetail: SessionDetail = {
  sessionId: claudeSession.sessionId,
  tool: 'claude',
  turns: bareTurns,
  invocations: [],
  contexts: contextPointsFromTurns(bareTurns)
};

// A session with turns and no usage worth reading — a transcript that never finished an assistant
// turn, which is what an empty context chart is actually made of.
export const noContextDetail: SessionDetail = {
  sessionId: claudeSession.sessionId,
  tool: 'claude',
  turns: bareTurns,
  invocations: [],
  contexts: []
};

// The log is gone — the transcript was swept by Claude Code's own retention, or the row is stale.
export const missingDetail: SessionDetail = {
  sessionId: claudeSession.sessionId,
  tool: 'claude',
  turns: [],
  invocations: [],
  contexts: [],
  error: "This session's transcript couldn't be read."
};
