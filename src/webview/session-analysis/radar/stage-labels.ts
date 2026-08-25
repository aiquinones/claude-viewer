// The words on the stage radars. Here rather than inline for the reason `chart-labels.ts` exists:
// the prose is the part that gets rewritten, and it shouldn't mean opening a component.

import { formatContextTokens } from '../../format-size';

export const STAGES_TITLE: string = 'Stages';

// What the (i) beside the heading says. The claim is that the splits are read rather than guessed,
// which is the thing a reader would otherwise wonder about a chart of "stages".
export const STAGES_NOTE: string =
  'We use the reading of skills to deterministically split the session in different stages';

// The CTA inside that card.
export const ASSIGN_NAMES: string = 'Assign names to stages';

export const CONTEXT_RADAR_TITLE: string = 'Context growth';

// Said where the session loaded no skills at all, which is most short sessions. Not an error — a
// session with no stages is a session nobody split.
export const EMPTY_STAGES: string = 'No skills were loaded, so this session has no stages.';

// A growth figure, signed. `formatContextTokens` on a negative number prints a bare minus in front
// of a raw count; the sign is the part worth seeing here, since a stage that shrank the context is
// a compaction rather than a small stage.
export const formatGrowth = (tokens: number): string =>
  `${tokens < 0 ? '−' : '+'}${formatContextTokens(Math.abs(tokens))}`;

// What one value is, for the hover bubbles.
export const GROWTH_UNIT: string = 'context';

// Said in the bubble where a stage gave the context back. The radar clamps it to the centre, so
// without this the shape and the number would disagree with no explanation.
export const COMPACTED_NOTE: string = 'the context shrank across this stage';
