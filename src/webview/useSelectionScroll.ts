import { RefObject, useEffect, useRef, useState } from 'react';
import { scrollBehavior } from './scroll-behavior';

interface SelectionScrollArgs {
  // Whether a file is selected, which is also whether the body — and its anchor — is mounted.
  hasSelection: boolean;
  // Bumped on every pick, including re-picking the file that's already open. A boolean or the
  // file's order wouldn't change on a re-pick, and the scroll has to happen anyway.
  selectionNonce: number;
  // Whether the file's text has arrived. The body is one "Reading…" line until it does, and you
  // can't scroll to a page that isn't there yet.
  contentReady: boolean;
}

// How far below the pane's top edge the "you're in the body now" line sits. A scroll to the anchor
// leaves it exactly on that edge, and exactly-on isn't past it — the button wouldn't appear until
// you nudged the wheel. Two pixels also guarantee the observer sees a crossing there at all.
const EDGE_MARGIN: number = 2;

interface SelectionScroll {
  // The scroll container. Both the observer's root and the fallback scroll target.
  paneRef: RefObject<HTMLDivElement>;
  // Sits at the top edge of the body, so it's both what we scroll to and what tells us we're there.
  bodyAnchorRef: RefObject<HTMLDivElement>;
  // Attached by whichever row is selected.
  selectionRef: RefObject<HTMLDivElement>;
  // True once the body's top edge has scrolled above the pane — you're reading the file now, and
  // the list is somewhere above you.
  inBody: boolean;
  goToSelection: () => void;
}

// Picking a file scrolls down to its text; the view offers a way back up once you're down there.
// Both halves need the same three elements, so they're one hook rather than two.
export const useSelectionScroll = ({
  hasSelection,
  selectionNonce,
  contentReady
}: SelectionScrollArgs): SelectionScroll => {
  const paneRef = useRef<HTMLDivElement>(null);
  const bodyAnchorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [inBody, setInBody] = useState<boolean>(false);
  // The pick this hook has already followed all the way down.
  const settled = useRef<number | undefined>(undefined);

  // Twice per pick, because the text arrives after the click: the first scroll starts moving
  // against a body that's still one "Reading…" line, and the second finishes the trip once there's
  // a page to land on. Stopping at `settled` is what keeps a later re-read — a refresh, a file
  // changing on disk — from yanking you back to the top while you're reading.
  useEffect(() => {
    if (!hasSelection || settled.current === selectionNonce) return;

    scrollTo(bodyAnchorRef.current);
    if (contentReady) settled.current = selectionNonce;
  }, [selectionNonce, hasSelection, contentReady]);

  // Whether the anchor has reached the top of the pane, which is the same question as whether the
  // list is still behind you. `isIntersecting` can't answer it — the anchor is equally outside the
  // pane while you're up in the list — so the two tops get compared instead.
  useEffect(() => {
    const pane: HTMLDivElement | null = paneRef.current;
    const anchor: HTMLDivElement | null = bodyAnchorRef.current;
    if (!hasSelection || !pane || !anchor) {
      setInBody(false);
      return;
    }

    const observer: IntersectionObserver = new IntersectionObserver(
      ([entry]) => setInBody(entry.boundingClientRect.top <= (entry.rootBounds?.top ?? 0)),
      { root: pane, rootMargin: `-${EDGE_MARGIN}px 0px 0px 0px` }
    );
    observer.observe(anchor);

    return () => observer.disconnect();
  }, [hasSelection]);

  const goToSelection = (): void => {
    if (selectionRef.current) return scrollTo(selectionRef.current);
    // The selected row's section got collapsed while you were reading, so there's no row to land
    // on. The top of the list is the next best thing.
    paneRef.current?.scrollTo({ top: 0, behavior: scrollBehavior() });
  };

  return { paneRef, bodyAnchorRef, selectionRef, inBody, goToSelection };
};

const scrollTo = (element: HTMLElement | null): void => {
  element?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
};
