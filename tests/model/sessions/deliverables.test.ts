import { describe, expect, it } from 'vitest';
import { Deliverable } from '@src/model/types';
import { deliverablesInCommand, mergeDeliverables } from '@src/model/sessions/deliverables';

const CWD: string = '/Users/dev/repos/example-app';

const declare = (payload: string): Deliverable[] =>
  deliverablesInCommand({ command: `echo 'claude-viewer:deliverable ${payload}'`, cwd: CWD });

describe('deliverablesInCommand', () => {
  it('reads a url declaration', () => {
    expect(declare('{"type":"storybook","title":"Storybook","url":"http://localhost:6006"}')).toEqual(
      [{ kind: 'storybook', title: 'Storybook', url: 'http://localhost:6006/' }]
    );
  });

  it('resolves a relative path against the session cwd', () => {
    expect(declare('{"type":"file","title":"Plan","path":"docs/plan.md"}')).toEqual([
      { kind: 'file', title: 'Plan', path: `${CWD}/docs/plan.md` }
    ]);
  });

  it('keeps an absolute path that is inside the cwd', () => {
    expect(declare(`{"type":"file","title":"Plan","path":"${CWD}/docs/plan.md"}`)).toEqual([
      { kind: 'file', title: 'Plan', path: `${CWD}/docs/plan.md` }
    ]);
  });

  // The whole reason the loader resolves against the cwd rather than taking what it was given: the
  // path an agent names is the one thing on a row that a person didn't choose, and `_isKnownFile`
  // will open it.
  it('drops a path outside the cwd', () => {
    expect(declare('{"type":"file","title":"Key","path":"/Users/dev/.ssh/id_rsa"}')).toEqual([]);
    expect(declare('{"type":"file","title":"Key","path":"../../.ssh/id_rsa"}')).toEqual([]);
  });

  // `relative` yields `..foo` for a directory of that name sitting inside the cwd, so the escape
  // check is a whole first segment rather than a `..` prefix.
  it('keeps a path under a directory whose name starts with two dots', () => {
    expect(declare('{"type":"file","title":"Note","path":"..drafts/plan.md"}')).toEqual([
      { kind: 'file', title: 'Note', path: `${CWD}/..drafts/plan.md` }
    ]);
  });

  // The cwd itself names a directory, and a chip opens a file.
  it('drops a path that is the cwd', () => {
    expect(declare('{"type":"file","title":"Here","path":"."}')).toEqual([]);
    expect(declare(`{"type":"file","title":"Here","path":"${CWD}"}`)).toEqual([]);
  });

  it('drops a url whose scheme is not http or https', () => {
    expect(declare('{"type":"link","title":"X","url":"javascript:alert(1)"}')).toEqual([]);
    expect(declare('{"type":"link","title":"X","url":"file:///etc/passwd"}')).toEqual([]);
  });

  it('drops a declaration naming neither a url nor a path', () => {
    expect(declare('{"type":"link","title":"Nowhere"}')).toEqual([]);
  });

  // An unrecognised kind is drawn with the wrong icon rather than vanishing — a newer format naming
  // a kind this version hasn't heard of should still reach the row.
  it('degrades an unknown kind to link', () => {
    expect(declare('{"type":"dashboard","title":"Grafana","url":"https://example.com"}')).toEqual([
      { kind: 'link', title: 'Grafana', url: 'https://example.com/' }
    ]);
  });

  it('falls back to the kind name when no title was given', () => {
    expect(declare('{"type":"storybook","url":"http://localhost:6006"}')[0].title).toBe('Storybook');
  });

  it('ignores a path when a url is also given, rather than dropping the whole thing', () => {
    expect(declare('{"type":"file","title":"Both","url":"https://x.test","path":"a.md"}')).toEqual([
      { kind: 'file', title: 'Both', url: 'https://x.test/' }
    ]);
  });

  // The case real data found and the fixtures couldn't: writing the instructions file is a Bash
  // call whose command holds the marker, and every example inside it would declare itself.
  it('ignores a marker inside a heredoc', () => {
    const command: string =
      `cat > docs/deliverables.md <<'EOF'\n` +
      `Declare one like this:\n` +
      `echo '${'claude-viewer:deliverable'} {"type":"link","title":"X","url":"https://x.test"}'\n` +
      `EOF`;

    expect(deliverablesInCommand({ command, cwd: CWD })).toEqual([]);
  });

  // `cat > file <<'EOF'` puts the redirect ahead of the marker too, so the rule catches the write
  // either way it's spelled.
  it('ignores a marker after a redirect that opens the command', () => {
    const command: string =
      `cat > note.txt\necho 'claude-viewer:deliverable {"type":"link","title":"X","url":"https://x.test"}'`;

    expect(deliverablesInCommand({ command, cwd: CWD })).toEqual([]);
  });

  // The deliberate boundary: only what precedes an occurrence is examined. A redirect *after* it is
  // left alone, because a compound command that declares and then sends something else to a file is
  // the likelier shape — and a lost declaration is worse than a rare spurious one.
  it('still reads a declaration followed later by a redirect', () => {
    const command: string =
      `echo 'claude-viewer:deliverable {"type":"link","title":"X","url":"https://x.test"}'` +
      ` && pnpm build > build.log`;

    expect(deliverablesInCommand({ command, cwd: CWD })).toHaveLength(1);
  });

  it('yields nothing for a command with no marker, and nothing for bad JSON', () => {
    expect(deliverablesInCommand({ command: 'pnpm run storybook', cwd: CWD })).toEqual([]);
    expect(declare('{"type":"link", not json}')).toEqual([]);
  });

  // Depth-matched rather than "up to the last brace", or the first declaration swallows the second.
  it('reads two declarations from one command', () => {
    const command: string =
      `echo 'claude-viewer:deliverable {"type":"link","title":"A","url":"https://a.test"}' && ` +
      `echo 'claude-viewer:deliverable {"type":"link","title":"B","url":"https://b.test"}'`;

    expect(deliverablesInCommand({ command, cwd: CWD }).map((one) => one.title)).toEqual(['A', 'B']);
  });

  // A title holding a brace and an escaped quote is what the string-aware scan is for.
  it('reads a title containing a brace', () => {
    expect(declare('{"type":"link","title":"a } \\" b","url":"https://x.test"}')[0].title).toBe(
      'a } " b'
    );
  });
});

describe('mergeDeliverables', () => {
  const storybook: Deliverable = { kind: 'storybook', title: 'Storybook', url: 'http://a.test/' };

  it('replaces a declaration of the same kind and title in place', () => {
    const moved: Deliverable = { ...storybook, url: 'http://b.test/' };
    expect(mergeDeliverables([storybook], [moved])).toEqual([moved]);
  });

  it('appends one that differs in title', () => {
    const other: Deliverable = { ...storybook, title: 'Docs' };
    expect(mergeDeliverables([storybook], [other])).toEqual([storybook, other]);
  });

  it('appends one that differs only in kind', () => {
    const other: Deliverable = { ...storybook, kind: 'link' };
    expect(mergeDeliverables([storybook], [other])).toHaveLength(2);
  });

  // The cap keeps the newest, the way the skill trail does — what a session just produced is what
  // you are looking for.
  it('caps at eight, keeping the newest', () => {
    const many: Deliverable[] = Array.from({ length: 12 }, (_unused, index) => ({
      kind: 'link' as const,
      title: `link-${index}`,
      url: `https://example.com/${index}`
    }));

    const merged: Deliverable[] = mergeDeliverables([], many);
    expect(merged).toHaveLength(8);
    expect(merged[0].title).toBe('link-4');
    expect(merged[7].title).toBe('link-11');
  });
});
