import { describe, expect, it } from 'vitest';
import { SearchView, buildSearchIndex } from '@src/model/search/build-index';
import { searchIndex } from '@src/model/search/search';
import { ConfigSnapshot, SearchDoc, SkillEntry } from '@src/model/types';

// Only the fields the index reads carry anything — it takes a name, a path and whether something
// shadows it, and never looks at what a skill costs.
const skill = (name: string, shadowedBy?: string): SkillEntry => ({
  name,
  description: `the ${name} skill`,
  allowedTools: [],
  scope: 'project',
  path: `/repo/.claude/skills/${name}/SKILL.md`,
  bundledFiles: 0,
  chars: 100,
  listingChars: 20,
  shadowedBy,
  issues: []
});

const snapshotOf = (skills: SkillEntry[]): ConfigSnapshot => ({
  workspaceRoot: '/repo',
  skills,
  systemPrompt: [],
  memory: undefined,
  loadedAt: 0
});

const VIEWS: SearchView[] = [
  { id: 'skills', title: 'Skills' },
  { id: 'usage', title: 'Usage' },
  { id: 'robots', title: 'Robots', soon: true }
];

const docFor = (index: SearchDoc[], label: string): SearchDoc =>
  index.find((doc) => doc.label === label)!;

describe('buildSearchIndex views', () => {
  it('ranks the surfaces ahead of what is inside them', () => {
    const index: SearchDoc[] = buildSearchIndex({
      snapshot: snapshotOf([skill('deploy')]),
      views: VIEWS
    });

    expect(index.slice(0, VIEWS.length).map((doc) => doc.kind)).toEqual(['view', 'view', 'view']);
    expect(docFor(index, 'Skills').rank).toBeLessThan(docFor(index, 'deploy').rank);
  });

  it('marks a surface that is not built inactive, and leaves a ready one alone', () => {
    const index: SearchDoc[] = buildSearchIndex({ snapshot: snapshotOf([]), views: VIEWS });

    expect(docFor(index, 'Robots').inactive).toBe(true);
    expect(docFor(index, 'Usage').inactive).toBeFalsy();
  });

  // The id is what routes the click, so a view's has to survive alongside file paths.
  it('keeps view ids distinct from the paths beside them', () => {
    const index: SearchDoc[] = buildSearchIndex({
      snapshot: snapshotOf([skill('skills')]),
      views: VIEWS
    });

    expect(new Set(index.map((doc) => doc.id)).size).toBe(index.length);
    expect(docFor(index, 'Skills').id).toBe('skills');
  });

  // Kinds are what the pills narrow by, and a view is one of them now.
  it('narrows to views alone under a view filter', () => {
    const index: SearchDoc[] = buildSearchIndex({
      snapshot: snapshotOf([skill('use-the-thing')]),
      views: VIEWS
    });

    const hits = searchIndex({ index, query: 'us', kinds: ['view'] });
    expect(hits.map((hit) => hit.doc.label)).toEqual(['Usage']);
  });

  // Nothing passes views today except App and the stories, so the default has to be the old shape.
  it('builds an index with no views at all', () => {
    const index: SearchDoc[] = buildSearchIndex({ snapshot: snapshotOf([skill('deploy')]) });

    expect(index.map((doc) => doc.kind)).toEqual(['skill']);
  });

  // Same rule shadowing already follows: on disk, and it won't be what runs.
  it('still dims a shadowed skill with views in front of it', () => {
    const index: SearchDoc[] = buildSearchIndex({
      snapshot: snapshotOf([skill('deploy', '/elsewhere/SKILL.md')]),
      views: VIEWS
    });

    expect(docFor(index, 'deploy').inactive).toBe(true);
  });
});
