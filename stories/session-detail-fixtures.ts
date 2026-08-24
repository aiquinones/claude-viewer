// Synthetic sessions for the session analysis stories — never a real transcript, like every other
// fixture here. A real one names a real repo and says what you were doing on Tuesday.
//
// Shaped after what the real logs hold, which is the point of the shapes worth checking: a long
// Claude session under one wrapper skill, and a Copilot one where a single `/dev-feature` loads the
// body twice five seconds apart. Both of those are measured behaviours, not inventions.

import { AgentTool } from '@src/model/types';
import { SessionDetail, SessionUsage, SkillInvocation, UsageTurn } from '@src/model/usage/types';

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

// A shape that reads like a real session: a few big turns early, a long tail of small ones, and one
// spike where a sub-skill ran.
const claudeTurns: UsageTurn[] = [
  turn({ index: 1, minutesIn: 0, output: 1_240 }),
  turn({ index: 2, minutesIn: 2, output: 3_180, skill: 'dev-feature' }),
  ...Array.from({ length: 40 }, (_unused, step) =>
    turn({
      index: 10 + step,
      minutesIn: 4 + step * 3,
      output: 400 + ((step * 137) % 900),
      skill: 'dev-feature'
    })
  ),
  ...Array.from({ length: 12 }, (_unused, step) =>
    turn({
      index: 60 + step,
      minutesIn: 128 + step * 2,
      output: 900 + ((step * 211) % 2_600),
      skill: 'create-pr'
    })
  ),
  turn({ index: 90, minutesIn: 156, output: 620 })
];

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
  outputTokens: claudeTurns.reduce((sum, one) => sum + one.tokens.output, 0),
  turns: claudeTurns.length,
  days: []
};

export const claudeDetail: SessionDetail = {
  sessionId: claudeSession.sessionId,
  tool: 'claude',
  turns: claudeTurns,
  invocations: claudeLoads
};

// The double load, which is the whole reason the row says "loads" rather than "calls": Copilot
// injects the skill because its name was typed, then loads it again when the model asks for what it
// has already been given. Five seconds apart, same body both times.
const copilotTurns: UsageTurn[] = Array.from({ length: 18 }, (_unused, step) =>
  turn({
    index: 200 + step,
    minutesIn: step * 4,
    output: 300 + ((step * 173) % 1_400),
    skill: step > 1 ? 'dev-feature' : undefined,
    tool: 'copilot',
    nanoAiu: 40_000_000 + step * 3_000_000
  })
);

export const copilotDetail: SessionDetail = {
  sessionId: 'f7be248b-0000-4000-8000-000000000002',
  tool: 'copilot',
  turns: copilotTurns,
  invocations: [
    { skill: 'dev-feature', at: START + 4 * MINUTE, via: 'event', chars: 3_592 },
    { skill: 'dev-feature', at: START + 4 * MINUTE + 5 * SECOND, via: 'event', chars: 3_592 }
  ]
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

// A session that ran no skills at all, which is most short ones.
export const bareDetail: SessionDetail = {
  sessionId: claudeSession.sessionId,
  tool: 'claude',
  turns: claudeTurns.slice(0, 4).map((one) => ({ ...one, skill: undefined })),
  invocations: []
};

// The log is gone — the transcript was swept by Claude Code's own retention, or the row is stale.
export const missingDetail: SessionDetail = {
  sessionId: claudeSession.sessionId,
  tool: 'claude',
  turns: [],
  invocations: [],
  error: "This session's transcript couldn't be read."
};
