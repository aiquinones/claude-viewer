import { describe, expect, it } from 'vitest';
import { AgentTool } from '@src/model/types';
import { EMPTY_TOKENS, UsageTurn } from '@src/model/usage/types';
import { SeriesPoint, toCostSeries } from '@src/webview/session-analysis/charts/series';

// The rule worth pinning is what the cost series does for a CLI that has no cost. A curve of zeros
// and no curve at all look similar on screen and mean opposite things: the first says every request
// was free, the second lets the section say why there is no figure.

interface TurnArgs {
  tool: AgentTool;
  output: number;
  nanoAiu?: number;
}

const turn = ({ tool, output, nanoAiu }: TurnArgs): UsageTurn => ({
  id: `${tool}-${output}`,
  at: 1_700_000_000_000 + output,
  tool,
  sessionId: 'session',
  cwd: '/repo',
  source: 'read',
  model: tool === 'claude' ? 'claude-opus-5' : 'gpt-5.6-terra',
  tokens: { ...EMPTY_TOKENS, output },
  ...(nanoAiu === undefined ? {} : { nanoAiu })
});

describe('toCostSeries', () => {
  it('drops a costless CLI rather than plotting it at zero', () => {
    const points: SeriesPoint[] = toCostSeries([
      turn({ tool: 'codex', output: 10 }),
      turn({ tool: 'codex', output: 20 })
    ]);

    expect(points).toEqual([]);
  });

  it('draws the CLIs that do have a cost', () => {
    const points: SeriesPoint[] = toCostSeries([turn({ tool: 'copilot', output: 10, nanoAiu: 500 })]);

    expect(points.map((point) => point.value)).toEqual([500]);
  });

  // A mixed window shouldn't lose the priced half to the unpriced one, which a filter written the
  // other way round would do.
  it('keeps the priced turns when a session mixes them', () => {
    const points: SeriesPoint[] = toCostSeries([
      turn({ tool: 'codex', output: 10 }),
      turn({ tool: 'copilot', output: 20, nanoAiu: 700 })
    ]);

    expect(points.map((point) => point.value)).toEqual([700]);
  });
});
