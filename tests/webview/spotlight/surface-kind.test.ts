import { describe, expect, it } from 'vitest';
import { SearchDoc } from '@src/model/types';
import { kindForSurface, searchViews, surfaceForDoc } from '@src/webview/spotlight/surface-kind';
import { SURFACES } from '@src/webview/surfaces';

// Only the three fields the router reads. The masks are the matcher's business, not this one's.
const doc = (fields: Pick<SearchDoc, 'id' | 'kind'>): SearchDoc => ({
  ...fields,
  label: fields.id,
  haystack: fields.id,
  masks: new Map(),
  rank: 0
});

describe('searchViews', () => {
  it('carries every surface, titled the way its card is', () => {
    const views = searchViews();

    expect(views).toHaveLength(SURFACES.length);
    expect(views.find((view) => view.id === 'system-prompt')?.title).toBe('System Prompt');
  });
});

describe('surfaceForDoc', () => {
  it('sends a view to the surface it names', () => {
    expect(surfaceForDoc(doc({ id: 'usage', kind: 'view' }))).toBe('usage');
    expect(surfaceForDoc(doc({ id: 'active-agents', kind: 'view' }))).toBe('active-agents');
  });

  // An index built before a surface was renamed. Nothing opens rather than the first surface in
  // the map opening for no reason.
  it('sends a view naming no surface nowhere', () => {
    expect(surfaceForDoc(doc({ id: 'robots', kind: 'view' }))).toBeUndefined();
  });

  it('sends everything else to the surface that renders its kind', () => {
    expect(surfaceForDoc(doc({ id: '/repo/SKILL.md', kind: 'skill' }))).toBe('skills');
    expect(surfaceForDoc(doc({ id: '/repo/a.md', kind: 'memory' }))).toBe('memory');
  });
});

describe('kindForSurface', () => {
  it('narrows to the kind a surface holds, and nothing else', () => {
    expect(kindForSurface('skills')).toEqual(['skill']);
    expect(kindForSurface('memory')).toEqual(['memory']);
  });

  // No `view` pill anywhere: a pill says what you're searching for, and being on a surface doesn't
  // mean you're looking for a surface.
  it('never adds a view pill', () => {
    for (const surface of SURFACES) {
      expect(kindForSurface(surface.id)).not.toContain('view');
    }
  });

  // Which is what keeps views reachable from most of the panel — three surfaces index nothing, so
  // they open the box on everything.
  it('narrows nothing where a surface has nothing indexed', () => {
    expect(kindForSurface('usage')).toEqual([]);
    expect(kindForSurface('system-prompt')).toEqual([]);
    expect(kindForSurface('active-agents')).toEqual([]);
  });

  it('narrows nothing from the landing page', () => {
    expect(kindForSurface(undefined)).toEqual([]);
  });
});
