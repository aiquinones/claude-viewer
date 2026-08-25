import { describe, expect, it } from 'vitest';
import { mergeStageNames } from '@src/webview/session-analysis/stage-names/stage-names';

// The dialog only ever lists the stages of the session in front of you, so the rule that matters is
// what happens to everyone else's names on the way out.

describe('mergeStageNames', () => {
  it('stores what was typed', () => {
    const merged = mergeStageNames({
      skills: ['dev-feature'],
      current: {},
      draft: { 'dev-feature': 'Build' }
    });

    expect(merged).toEqual({ 'dev-feature': 'Build' });
  });

  // Clearing a field is how you go back to the skill's own name. Storing an empty string instead
  // would draw a nameless spoke.
  it('drops the key when the field is cleared', () => {
    const merged = mergeStageNames({
      skills: ['commit'],
      current: { commit: 'Ship' },
      draft: { commit: '' }
    });

    expect(merged).toEqual({});
  });

  it('drops a field that is only whitespace, and trims the rest', () => {
    const merged = mergeStageNames({
      skills: ['commit', 'review'],
      current: {},
      draft: { commit: '   ', review: '  Review  ' }
    });

    expect(merged).toEqual({ review: 'Review' });
  });

  // The dialog never showed these, so it can't be the thing that clears them.
  it('leaves overrides for skills this session never ran alone', () => {
    const merged = mergeStageNames({
      skills: ['commit'],
      current: { commit: 'Ship', 'some-other-skill': 'Elsewhere' },
      draft: { commit: '' }
    });

    expect(merged).toEqual({ 'some-other-skill': 'Elsewhere' });
  });

  it('is a no-op when nothing was touched', () => {
    const current: Record<string, string> = { commit: 'Ship' };
    const merged = mergeStageNames({ skills: ['commit'], current, draft: { commit: 'Ship' } });

    expect(merged).toEqual(current);
  });
});
