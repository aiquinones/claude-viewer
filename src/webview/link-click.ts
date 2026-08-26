import { MouseEvent } from 'react';

// Whether a click landed on a link. A clickable row that holds one needs this instead of the link
// stopping its own bubble: VS Code turns an `<a href>` in a webview into an external open from a
// click listener on the frame's `window`, and React 18 attaches its own at `#root` — so a
// `stopPropagation()` in a link's handler kills the event well below the thing that opens it.
export const isLinkClick = (event: MouseEvent): boolean =>
  event.target instanceof Element && event.target.closest('a[href]') !== null;
