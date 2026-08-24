import { describe, expect, it } from 'vitest';
import { cardDrop, ClipBox } from '@src/webview/hover-drop';

// Which end a hover card opens toward. The rule exists because the cost (i) has two mount points
// that disagree: the last line of the usage surface's scroll body, and the top of the session
// page's — where opening upward put the card behind the breadcrumb header and cut it in half.

// A pane running under a header, which is the shape both surfaces have.
const PANE: ClipBox = { top: 100, bottom: 900 };

// The (i) is a 14px icon, so a trigger is 14 tall wherever it sits.
const triggerAt = (top: number): ClipBox => ({ top, bottom: top + 14 });

describe('cardDrop', () => {
  it('opens up when there is room above', () => {
    expect(cardDrop({ trigger: triggerAt(800), cardHeight: 260, clip: PANE })).toBe('up');
  });

  it('opens down when the trigger is near the top of the pane', () => {
    expect(cardDrop({ trigger: triggerAt(160), cardHeight: 260, clip: PANE })).toBe('down');
  });

  // The bug this was written for. The same trigger has 312px above it measured to the top of the
  // panel and 212 measured to the top of the pane it's actually in, so a 260px card fits by the
  // first reading and is cut in half by the second.
  it('measures against the pane, not the panel', () => {
    const trigger: ClipBox = triggerAt(320);

    expect(cardDrop({ trigger, cardHeight: 260, clip: { top: 0, bottom: 900 } })).toBe('up');
    expect(cardDrop({ trigger, cardHeight: 260, clip: PANE })).toBe('down');
  });

  // Up is the preference rather than a coin flip: it's what the card does everywhere it's read
  // today, so a trigger with room on both sides doesn't move.
  it('prefers up when both ends hold it', () => {
    expect(cardDrop({ trigger: triggerAt(500), cardHeight: 200, clip: PANE })).toBe('up');
  });

  // 300px of room above, less 8px of margin, so 292 is the tallest card that still opens up.
  it('keeps the edge margin off both ends', () => {
    expect(cardDrop({ trigger: triggerAt(400), cardHeight: 292, clip: PANE })).toBe('up');
    expect(cardDrop({ trigger: triggerAt(400), cardHeight: 293, clip: PANE })).toBe('down');
  });

  // A card taller than the pane fits nowhere, and the answer is the end that cuts off less rather
  // than the preference — there is no side that "works" to prefer.
  it('takes the roomier end when neither holds it', () => {
    expect(cardDrop({ trigger: triggerAt(200), cardHeight: 1200, clip: PANE })).toBe('down');
    expect(cardDrop({ trigger: triggerAt(800), cardHeight: 1200, clip: PANE })).toBe('up');
  });
});
