import { RefObject, useEffect, useRef, useState } from 'react';

interface SelectionScrollArgs {
  // Whether a file is selected, which is also whether the body — and its anchor — is mounted.
  hasSelection: boolean;
  // Bumped on every pick, including re-picking the file that's already open. A boolean or the
  // file's order wouldn't change on a re-pick, and the scroll has to happen anyway.
  selectionNonce: number;
}

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
  selectionNonce
}: SelectionScrollArgs): SelectionScroll => {
  const paneRef = useRef<HTMLDivElement>(null);
  const bodyAnchorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [inBody, setInBody] = useState<boolean>(false);

  // The pick and the scroll land in the same commit, so the anchor is already mounted here.
  useEffect(() => {
    if (!hasSelection) return;
    scrollTo(bodyAnchorRef.current);
  }, [selectionNonce, hasSelection]);

  // Not-intersecting alone doesn't say which way: the anchor is also outside the pane while you're
  // still up in the list. Comparing the two tops is what separates "scrolled past" from "not yet".
  useEffect(() => {
    const pane: HTMLDivElement | null = paneRef.current;
    const anchor: HTMLDivElement | null = bodyAnchorRef.current;
    if (!hasSelection || !pane || !anchor) {
      setInBody(false);
      return;
    }

    const observer: IntersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const paneTop: number = entry.rootBounds?.top ?? 0;
        setInBody(!entry.isIntersecting && entry.boundingClientRect.top < paneTop);
      },
      { root: pane }
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

// Read per scroll rather than once: the setting can change while the panel is open.
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
