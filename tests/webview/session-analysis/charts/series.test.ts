import { describe, expect, it } from 'vitest';
import { AgentTool } from '@src/model/types';
import { EMPTY_TOKENS, UsageTurn } from '@src/model/usage/types';
import { SeriesPoint, toCostSeries } from '@src/webview/session-analysis/charts/series';

// The rule worth pinning is what the cost series does with a turn nothing can price. A curve of
// zeros and no curve at all look similar on screen and mean opposite things: the first says every
// request was free, the second lets the section name the model it has no rates for.

interface TurnArgs {
  tool: AgentTool;
  output: number;
  model?: string;
  nanoAiu?: number;
}

const DEFAULT_MODEL: Record<AgentTool, string> = {
  claude: 'claude-opus-5',
  copilot: 'claude-sonnet-5',
  codex: 'gpt-5.6-terra'
};

const turn = ({ tool, output, model, nanoAiu }: TurnArgs): UsageTurn => ({
  id: `${tool}-${output}`,
  at: 1_700_000_000_000 + output,
  tool,
  sessionId: 'session',
  cwd: '/repo',
  source: 'read',
  model: model ?? DEFAULT_MODEL[tool],
  tokens: { ...EMPTY_TOKENS, output },
  ...(nanoAiu === undefined ? {} : { nanoAiu })
});

describe('toCostSeries', () => {
  // The case that keeps recurring: a CLI ships a model faster than the rate table follows.
  it('drops a turn nothing can price rather than plotting it at zero', () => {
    const points: SeriesPoint[] = toCostSeries([
      turn({ tool: 'codex', output: 10, model: 'gpt-5.9-unheard-of' }),
      turn({ tool: 'claude', output: 20, model: 'claude-opus-9' })
    ]);

    expect(points).toEqual([]);
  });

  it('prices a Codex turn from its tokens, the same as a Claude one', () => {
    const points: SeriesPoint[] = toCostSeries([turn({ tool: 'codex', output: 1_000_000 })]);

    // gpt-5.6-terra is $12 per million output tokens.
    expect(points.map((point) => point.value)).toEqual([12]);
  });

  it('takes a Copilot turn at the figure it reported', () => {
    const points: SeriesPoint[] = toCostSeries([turn({ tool: 'copilot', output: 10, nanoAiu: 500 })]);

    expect(points.map((point) => point.value)).toEqual([500]);
  });

  // A Copilot turn is priced by its own report, so a model the table has never heard of is no
  // reason to drop it — the filter written as "does the table know this model" would.
  it('keeps a Copilot turn on a model the rate table has no entry for', () => {
    const points: SeriesPoint[] = toCostSeries([
      turn({ tool: 'copilot', output: 10, model: 'some-inference-model', nanoAiu: 700 })
    ]);

    expect(points.map((point) => point.value)).toEqual([700]);
  });

  // A mixed session shouldn't lose the priced half to the unpriced one, which a filter written the
  // other way round would do.
  it('keeps the priced turns when a session mixes them', () => {
    const points: SeriesPoint[] = toCostSeries([
      turn({ tool: 'codex', output: 10, model: 'gpt-5.9-unheard-of' }),
      turn({ tool: 'copilot', output: 20, nanoAiu: 700 })
    ]);

    expect(points.map((point) => point.value)).toEqual([700]);
  });
});
