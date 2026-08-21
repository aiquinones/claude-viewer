// Everything in the panel that stacks, back to front. Nothing else in the webview writes a
// z-index — it names a layer here and gets a number, so adding something that floats means
// deciding where it sits in this list. `build.mjs` fails on a raw `z-*` utility or a literal
// `zIndex` anywhere else, which is what keeps that decision from being skipped.
//
// The list reads as one order because the panes that hold a markdown body set `contained`, making
// their own stacking context: a pinned heading can climb over its neighbours without ever reaching
// the nav. That's why `nav` is above `stickyTop` here and the two never actually meet.
//
// Not annotated: the type derives from these literals, and a `Record<string, number>` would widen
// every name to `string`.
const LAYER_ORDER = [
  // A pane that traps a z-scale of its own. Zero on purpose — what it buys is the stacking
  // context, not a lift, and a pane that rose would take its headings over the nav with it.
  ['contained', 0],
  // A backdrop a canvas paints under its own content. Also zero: the content above it is
  // unpositioned and comes later in the DOM, so anything higher here would cover it.
  ['ground', 0],
  // Lifted clear of that backdrop — the flow's hint row, the graph's card, the nav's rail handle.
  ['raised', 10],
  // Pinned markdown headings, one step down per depth. Reserves the band up to `stickyTop`;
  // `stickyHeadingZ` is what lands in it.
  ['stickyHeading', 20],
  // A pane's own pinned bar, above every heading that stacks under it.
  ['stickyTop', 30],
  // Every hover card, tooltip and popover. Above the whole pinned stack, because a card hangs off
  // a row *above* those bars and drops down across them.
  ['card', 40],
  // The skills list sliding in over the detail pane.
  ['nav', 50],
  // The spotlight and the dialogs, over all of it.
  ['overlay', 60]
] as const;

export type ZLayer = (typeof LAYER_ORDER)[number][0];

export const Z: Record<ZLayer, number> = Object.fromEntries(LAYER_ORDER) as Record<ZLayer, number>;

// How many slots `stickyHeading` reserves below `stickyTop`. Deeper headings share the last one
// rather than sinking into the layer beneath.
const STICKY_HEADING_DEPTHS: number = Z.stickyTop - Z.stickyHeading;

// A pinned heading's z-index: one step below its parent, so a `##` stacks under its `#` and both
// stack under the pane's own bar.
export const stickyHeadingZ = (depth: number): number =>
  Z.stickyTop - Math.min(Math.max(depth, 1), STICKY_HEADING_DEPTHS);
