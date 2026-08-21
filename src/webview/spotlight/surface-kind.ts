import { SearchKind } from '../../model/types';
import { SurfaceId } from '../surfaces';

// Which kind of thing each surface holds, or undefined while it has nothing in the index yet. A
// `Record` over `SurfaceId`, so a new surface has to answer the question rather than skip it.
const KIND_BY_SURFACE: Record<SurfaceId, SearchKind | undefined> = {
  skills: 'skill',
  'system-prompt': undefined,
  'active-agents': undefined,
  usage: undefined,
  memory: 'memory'
};

// Opening the spotlight from inside a surface starts narrowed to it. From the landing page — no
// surface — it starts on everything.
export const kindForSurface = (surface: SurfaceId | undefined): SearchKind[] => {
  const kind: SearchKind | undefined = surface ? KIND_BY_SURFACE[surface] : undefined;
  return kind ? [kind] : [];
};

// The other direction: a result knows its kind, and choosing it has to open the surface that
// renders it. `Object.entries` widens the keys back to string, hence the cast.
export const surfaceForKind = (kind: SearchKind): SurfaceId | undefined =>
  (Object.entries(KIND_BY_SURFACE) as [SurfaceId, SearchKind | undefined][]).find(
    ([, held]) => held === kind
  )?.[0];
