// Where a menu opened at a point actually sits. Pure — the DOM measuring is the caller's, so the
// rule can be read without one.

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

interface ClampArgs {
  // Where the pointer was, in client coordinates.
  point: Point;
  // The menu, once it has been measured. Zero before that, which parks it at the point itself —
  // one frame in the right corner beats a frame in the middle of the panel.
  size: Size;
  viewport: Size;
}

// How close a menu may come to the panel's edge.
const MARGIN: number = 8;

// The menu hangs down and to the right of the pointer, and flips to the other side of it when there
// isn't room. Flipping rather than sliding along the edge: a menu that slid would end up under the
// pointer, and the first item is where the pointer already is.
export const clampToViewport = ({ point, size, viewport }: ClampArgs): Point => ({
  x: _fit({ start: point.x, extent: size.width, limit: viewport.width }),
  y: _fit({ start: point.y, extent: size.height, limit: viewport.height })
});

interface FitArgs {
  start: number;
  extent: number;
  limit: number;
}

const _fit = ({ start, extent, limit }: FitArgs): number => {
  const flipped: number = start + extent + MARGIN > limit ? start - extent : start;
  // Still clamped after the flip: a menu taller than the panel has nowhere good to go, and the top
  // edge is the end you want to see.
  return Math.max(MARGIN, Math.min(flipped, limit - extent - MARGIN));
};
