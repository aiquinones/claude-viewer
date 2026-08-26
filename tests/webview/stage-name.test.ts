import { describe, expect, it } from 'vitest';
import { currentStage, stageLabel } from '@src/webview/stage-name';

// The rule two surfaces share: the session page splits a finished session by these names, and an
// agent row says which one is running. What earns a test is the walk back — the row would be wrong
// in a way nothing else catches if an unnamed skill ended a stage instead of being stepped over.

describe('stageLabel', () => {
  it('is the stored name for a skill that has one', () => {
    expect(stageLabel({ skill: 'dev-feature', names: { 'dev-feature': 'Build' } })).toBe('Build');
  });

  it('trims, since what is stored is what someone typed', () => {
    expect(stageLabel({ skill: 'dev-feature', names: { 'dev-feature': '  Build ' } })).toBe('Build');
  });

  it('is nothing for a skill nobody named', () => {
    expect(stageLabel({ skill: 'create-pr', names: { 'dev-feature': 'Build' } })).toBeUndefined();
  });

  // A blank field is how the naming dialog says "not a stage", so it has to read as absent rather
  // than as a stage with no label.
  it('is nothing for a name that is only whitespace', () => {
    expect(stageLabel({ skill: 'dev-feature', names: { 'dev-feature': '   ' } })).toBeUndefined();
  });
});

describe('currentStage', () => {
  const names: Record<string, string> = { 'dev-feature': 'Build', 'create-pr': 'Ship' };

  it('is the latest named skill in the trail', () => {
    expect(currentStage({ trail: ['dev-feature', 'create-pr'], names })).toEqual({
      skill: 'create-pr',
      label: 'Ship'
    });
  });

  // The reason the host sends the whole trail rather than the last skill. A stage runs on through
  // the skills nobody named — the reader said those aren't stages, and a gap they can't see would
  // end the one they can.
  it('steps over unnamed skills rather than ending the stage', () => {
    expect(
      currentStage({ trail: ['dev-feature', 'read-project-structure', 'perform-testing'], names })
    ).toEqual({ skill: 'dev-feature', label: 'Build' });
  });

  it('is nothing when no skill in the trail is named', () => {
    expect(currentStage({ trail: ['read-project-structure'], names })).toBeUndefined();
  });

  it('is nothing on a session that has loaded no skills', () => {
    expect(currentStage({ trail: [], names })).toBeUndefined();
  });

  // The map speaks for every session on the machine, so it routinely names skills this one never
  // ran. Those say nothing about which stage is open here.
  it('ignores names for skills the session never loaded', () => {
    expect(currentStage({ trail: ['read-project-structure'], names: { publish: 'Release' } })).toBe(
      undefined
    );
  });

  // A stage can be re-entered — back to `dev-feature` after shipping — and the row follows the
  // trail rather than the first time a name appeared.
  it('follows a stage that was re-entered', () => {
    expect(currentStage({ trail: ['dev-feature', 'create-pr', 'dev-feature'], names })).toEqual({
      skill: 'dev-feature',
      label: 'Build'
    });
  });
});
