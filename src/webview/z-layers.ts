// The skills detail pane is its own stacking context (`relative z-0` in SkillView), so these
// numbers only compete with each other rather than panel-wide. The pinned rows own the top of the
// scale: the Content bar sits at the top and each markdown heading one step under its parent.
export const STICKY_TOP_Z: number = 30;

// A hover card hangs off a row *above* the pinned stack and drops down across it, so it has to
// clear the whole scale — not just the heading it happens to be next to. `z-20` read like it did
// and didn't: the Content bar is 30, so a card tall enough to reach it went behind it.
export const OVER_STICKY_CLASS: string = 'z-40';
