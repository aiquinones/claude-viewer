import { describe, expect, it } from 'vitest';
import { parseDeepLink } from '@src/commands/handle-uri/deep-link';

// The whole vscode:// grammar, which is a pure function of a path, a query and a fragment. Worth a
// test for the reason the other pure rules here are: it's the one part of a link nothing on screen
// can show you went wrong — an unknown shape falls back to the panel rather than reporting anything.

// The three fields `vscode.Uri` hands over, so a case names only what it's about.
const parse = (path: string, query: string = '', fragment?: string) =>
  parseDeepLink({ path, query, fragment });

describe('parseDeepLink', () => {
  it('opens the panel for an empty path', () => {
    expect(parse('/')).toEqual({ kind: 'panel' });
  });

  it('opens the panel for a segment that names nothing', () => {
    expect(parse('/hooks')).toEqual({ kind: 'panel' });
  });

  describe('skills', () => {
    it('names one skill', () => {
      expect(parse('/skill/dev-feature')).toEqual({
        kind: 'skill',
        name: 'dev-feature',
        scope: undefined,
        section: undefined
      });
    });

    it('reads a section from the fragment', () => {
      expect(parse('/skill/dev-feature', '', '7-release-the-worktree')).toMatchObject({
        section: '7-release-the-worktree'
      });
    });

    // Both forms are read, since whether a fragment survives the OS handoff isn't checkable here.
    it('reads a section from ?section= too', () => {
      expect(parse('/skill/dev-feature', 'section=plan')).toMatchObject({ section: 'plan' });
    });

    it('keeps a scope it recognises and drops one it does not', () => {
      expect(parse('/skill/commit', 'scope=user')).toMatchObject({ scope: 'user' });
      expect(parse('/skill/commit', 'scope=nowhere')).toMatchObject({ scope: undefined });
    });

    it('falls back to the picker with no name', () => {
      expect(parse('/skill', 'q=dev')).toEqual({ kind: 'pick', query: 'dev' });
    });
  });

  describe('surfaces', () => {
    it('names a surface by its id', () => {
      expect(parse('/usage')).toEqual({ kind: 'surface', surface: 'usage' });
      expect(parse('/memory')).toEqual({ kind: 'surface', surface: 'memory' });
    });

    // The word someone types. The id is only 'active-agents' because 'agents' is reserved for the
    // subagent surface, which a link author has no reason to know about.
    it('reads agents as the active-agents surface', () => {
      expect(parse('/agents')).toEqual({ kind: 'surface', surface: 'active-agents' });
      expect(parse('/active-agents')).toEqual({ kind: 'surface', surface: 'active-agents' });
    });

    // `/skill/<name>` has to keep winning over the surface named `skills`, one letter away.
    it('does not confuse skills with skill', () => {
      expect(parse('/skills')).toEqual({ kind: 'surface', surface: 'skills' });
      expect(parse('/skill/commit')).toMatchObject({ kind: 'skill', name: 'commit' });
    });
  });

  describe('sessions', () => {
    it('names one session by id, and nothing about which CLI wrote it', () => {
      expect(parse('/session/abc123')).toEqual({ kind: 'session', sessionId: 'abc123' });
    });

    it('falls back to the picker with no id', () => {
      expect(parse('/session')).toEqual({ kind: 'session', sessionId: undefined });
    });
  });
});
