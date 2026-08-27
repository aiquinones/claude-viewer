import { describe, expect, it } from 'vitest';
import { AGENT_TOOLS } from '@src/model/types';
import { COST_UNIT, costUnitOf, hasCost } from '@src/model/usage/cost-unit';

// The table is the decision, so what's asserted is that a decision was made for every CLI. A fourth
// one added without an entry would otherwise reach the views as `undefined` and format as a figure.

describe('COST_UNIT', () => {
  it('answers for every CLI on the surface', () => {
    for (const tool of AGENT_TOOLS) {
      expect(COST_UNIT[tool]).toBeDefined();
    }
  });

  it('gives each CLI the unit its own data is in', () => {
    expect(costUnitOf('claude')).toBe('usd');
    expect(costUnitOf('copilot')).toBe('aiu');
    // Codex bills against a rate-limit window. Not zero dollars and not zero AIU — no unit.
    expect(costUnitOf('codex')).toBe('none');
  });

  it('reports which CLIs have a cost figure to draw at all', () => {
    expect(hasCost('claude')).toBe(true);
    expect(hasCost('copilot')).toBe(true);
    expect(hasCost('codex')).toBe(false);
  });
});
