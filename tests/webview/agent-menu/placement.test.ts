import { describe, expect, it } from 'vitest';
import { anchorFor } from '@src/webview/agent-menu/placement';

const ROW = { left: 12, bottom: 96 };

describe('anchorFor', () => {
  it('hangs the menu off the pointer when there was one', () => {
    expect(anchorFor({ detail: 1, pointer: { x: 240, y: 310 }, row: ROW })).toEqual({
      x: 240,
      y: 310
    });
  });

  it('keeps the pointer on a double click, where the count is higher', () => {
    expect(anchorFor({ detail: 2, pointer: { x: 240, y: 310 }, row: ROW })).toEqual({
      x: 240,
      y: 310
    });
  });

  // A keyboard Enter reports `0,0`, which is the panel's top-left corner rather than a place the
  // row is.
  it('hangs it under the row when the click came from the keyboard', () => {
    expect(anchorFor({ detail: 0, pointer: { x: 0, y: 0 }, row: ROW })).toEqual({ x: 12, y: 96 });
  });
});
