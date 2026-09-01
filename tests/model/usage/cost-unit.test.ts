import { describe, expect, it } from 'vitest';
import { AGENT_TOOLS, AgentTool } from '@src/model/types';
import {
  COST_UNIT,
  costUnitOf,
  isPricedTurn,
  noCostReason,
  unpricedModelsIn
} from '@src/model/usage/cost-unit';
import { EMPTY_TOKENS, UsageTurn } from '@src/model/usage/types';

// Two decisions live here and they are not the same one. The unit belongs to the CLI; whether there
// is a figure at all belongs to the model, because a CLI ships models faster than the rate table
// follows and pricing an unknown one at zero is the error a cost figure can't afford.

interface TurnArgs {
  tool: AgentTool;
  model: string;
  nanoAiu?: number;
}

const turn = ({ tool, model, nanoAiu }: TurnArgs): UsageTurn => ({
  id: `${tool}-${model}`,
  at: 1_700_000_000_000,
  tool,
  sessionId: 'session',
  cwd: '/repo',
  source: 'read',
  model,
  tokens: { ...EMPTY_TOKENS, output: 100 },
  ...(nanoAiu === undefined ? {} : { nanoAiu })
});

describe('COST_UNIT', () => {
  it('answers for every CLI on the surface', () => {
    for (const tool of AGENT_TOOLS) {
      expect(COST_UNIT[tool]).toBeDefined();
    }
  });

  it('gives each CLI the unit its own data is in', () => {
    // Two record tokens and no price, so both are estimated in dollars. Copilot reports its own
    // billed figure and is the only one not worked out from a rate table.
    expect(costUnitOf('claude')).toBe('usd');
    expect(costUnitOf('codex')).toBe('usd');
    expect(costUnitOf('copilot')).toBe('aiu');
  });
});

describe('isPricedTurn', () => {
  it('prices a turn on a model the table knows', () => {
    expect(isPricedTurn(turn({ tool: 'claude', model: 'claude-opus-5' }))).toBe(true);
    expect(isPricedTurn(turn({ tool: 'codex', model: 'gpt-5.6-terra' }))).toBe(true);
  });

  it('refuses a turn on a model it has no rates for', () => {
    expect(isPricedTurn(turn({ tool: 'codex', model: 'gpt-5.9-unheard-of' }))).toBe(false);
    expect(isPricedTurn(turn({ tool: 'claude', model: 'claude-opus-9' }))).toBe(false);
  });

  // Copilot never consults the table — it writes what it was billed.
  it('prices a Copilot turn whatever model it ran', () => {
    expect(isPricedTurn(turn({ tool: 'copilot', model: 'some-inference-model' }))).toBe(true);
  });
});

describe('unpricedModelsIn', () => {
  it('names the models nothing could price, deduped and sorted', () => {
    const models: string[] = unpricedModelsIn([
      turn({ tool: 'codex', model: 'gpt-5.9-unheard-of' }),
      turn({ tool: 'claude', model: 'claude-opus-9' }),
      turn({ tool: 'codex', model: 'gpt-5.9-unheard-of' }),
      turn({ tool: 'codex', model: 'gpt-5.6-terra' })
    ]);

    expect(models).toEqual(['claude-opus-9', 'gpt-5.9-unheard-of']);
  });

  // A Copilot model missing from the table is nothing to report: no figure of its was ever going to
  // come from there.
  it('leaves Copilot out of it', () => {
    expect(unpricedModelsIn([turn({ tool: 'copilot', model: 'some-inference-model' })])).toEqual([]);
  });
});

describe('noCostReason', () => {
  it('names the models, since that is the part the reader can act on', () => {
    expect(noCostReason(['gpt-5.9-unheard-of'])).toContain('gpt-5.9-unheard-of');
  });

  it('still says something when there is no model to name', () => {
    expect(noCostReason([])).not.toBe('');
  });
});
