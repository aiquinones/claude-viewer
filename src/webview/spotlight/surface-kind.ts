import { SearchDoc, SearchKind } from '../../model/types';
import { SearchView } from '../../model/search/build-index';
import { Surface, SURFACES, SurfaceId } from '../surfaces';

// Which kind of thing each surface holds, or undefined while it has nothing in the index yet. A
// `Record` over `SurfaceId`, so a new surface has to answer the question rather than skip it.
//
// `view` isn't in here: every surface is one, so it says nothing about which.
const KIND_BY_SURFACE: Record<SurfaceId, SearchKind | undefined> = {
  skills: 'skill',
  'system-prompt': undefined,
  'active-agents': undefined,
  usage: undefined,
  memory: 'memory'
};

// The surfaces as search docs. `status` is read off the widened `Surface`, not off the `as const`
// literal — comparing against 'soon' on the literal type is a no-overlap error the day the last
// `soon` surface ships.
export const searchViews = (): SearchView[] =>
  (SURFACES as readonly Surface[]).map((surface) => ({
    id: surface.id,
    title: surface.title,
    soon: surface.status === 'soon'
  }));

// Opening the spotlight from inside a surface starts narrowed to it. From the landing page — no
// surface — it starts on everything.
//
// A `view` pill is deliberately not added here: a pill says what you're searching *for*, and
// opening the box inside the skills surface means you're looking for a skill. A surface holding
// nothing indexed adds no pill at all, so views are still reachable from most of the panel.
export const kindForSurface = (surface: SurfaceId | undefined): SearchKind[] => {
  const kind: SearchKind | undefined = surface ? KIND_BY_SURFACE[surface] : undefined;
  return kind ? [kind] : [];
};

// Where choosing a result goes. A `view` names its surface outright, so it routes by its own id
// rather than through the map above; anything else routes by kind.
export const surfaceForDoc = (doc: SearchDoc): SurfaceId | undefined =>
  doc.kind === 'view' ? surfaceById(doc.id) : surfaceForKind(doc.kind);

// Undefined for an id no surface answers to — a doc left over from an index built before a
// surface was renamed.
const surfaceById = (id: string): SurfaceId | undefined =>
  SURFACES.find((surface) => surface.id === id)?.id;

// A result knows its kind, and choosing it has to open the surface that renders it.
// `Object.entries` widens the keys back to string, hence the cast.
const surfaceForKind = (kind: SearchKind): SurfaceId | undefined =>
  (Object.entries(KIND_BY_SURFACE) as [SurfaceId, SearchKind | undefined][]).find(
    ([, held]) => held === kind
  )?.[0];
