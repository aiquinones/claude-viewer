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
  // Opening from a surface narrows to what it holds — and to views, so jumping somewhere else is
  // still one of the things the box can do.
  it('adds view to the kind a surface holds', () => {
    expect(kindForSurface('skills')).toEqual(['skill', 'view']);
    expect(kindForSurface('memory')).toEqual(['memory', 'view']);
  });

  it('leaves only view where a surface has nothing indexed', () => {
    expect(kindForSurface('usage')).toEqual(['view']);
    expect(kindForSurface('system-prompt')).toEqual(['view']);
  });

  it('narrows nothing from the landing page', () => {
    expect(kindForSurface(undefined)).toEqual([]);
  });
});
