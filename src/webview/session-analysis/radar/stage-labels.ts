// The words on the stage radars. Here rather than inline for the reason `chart-labels.ts` exists:
// the prose is the part that gets rewritten, and it shouldn't mean opening a component.

import { formatContextTokens } from '../../format-size';

export const STAGES_TITLE: string = 'Stages';

// What the (i) beside the heading says. Two claims, and the second is the one a reader would
// otherwise wonder about: the cuts are read off the log, and which of them count is theirs.
export const STAGES_NOTE: string =
  'A stage runs from one skill load to the next. Name a skill to make its loads open a stage — the ones you leave unnamed are ignored, and whatever stage was running carries through them.';

// The CTA inside that card, and the one on the card that stands in for the wheels.
export const ASSIGN_NAMES: string = 'Edit stages';

export const SPLIT_SESSION: string = 'View how your session splits between stages';

export const COST_RADAR_TITLE: string = 'Cost per stage';

export const CONTEXT_RADAR_TITLE: string = 'Context growth';

// Said where the session loaded no skills at all, which is most short sessions. Not an error, and
// nothing to offer with it — there is no skill here to name.
export const NO_SKILLS: string = 'No skill was invoked in this session.';

// Said where skills ran and none of them is a stage yet. The wheels would have nothing on them, so
// the card takes their place and carries the way out of the state.
export const UNSPLIT_STAGES: string =
  'Stages are the skills you choose to name. None are named for this session yet.';

// A growth figure, signed. `formatContextTokens` on a negative number prints a bare minus in front
// of a raw count; the sign is the part worth seeing here, since a stage that shrank the context is
// a compaction rather than a small stage.
export const formatGrowth = (tokens: number): string =>
  `${tokens < 0 ? '−' : '+'}${formatContextTokens(Math.abs(tokens))}`;

// What one value is, for the hover bubbles.
export const COST_UNIT: string = 'cost';
export const GROWTH_UNIT: string = 'context';

// Said in the bubble where a stage gave the context back. The radar clamps it to the centre, so
// without this the shape and the number would disagree with no explanation.
export const COMPACTED_NOTE: string = 'the context shrank across this stage';
