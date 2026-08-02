import { CSSProperties, ReactNode } from 'react';

// Long enough to read as movement, short enough that a back-and-forth doesn't feel slow.
const SLIDE_MS: number = 200;

interface ViewSliderProps {
  // false shows `home`, true slides to `detail`.
  showDetail: boolean;
  home: ReactNode;
  detail: ReactNode;
}

// Two full-width panes on one track that translates between them. Both stay mounted, so going
// home and coming back keeps whatever was selected — and so the outgoing pane has something to
// show while it slides away.
//
// The track is viewport-width with panes that refuse to shrink, rather than a 200%-wide track
// holding two half-width panes. Same result, except no element is ever wider than the panel, so
// nothing outside this file can center or reflow the overflow.
export const ViewSlider = ({ showDetail, home, detail }: ViewSliderProps) => (
  <div className="h-screen w-full overflow-hidden">
    <div
      className="flex h-full w-full transition-transform ease-out motion-reduce:transition-none"
      style={{
        transform: showDetail ? 'translateX(-100%)' : 'translateX(0)',
        transitionDuration: `${SLIDE_MS}ms`
      }}
    >
      <Pane active={!showDetail}>{home}</Pane>
      <Pane active={showDetail}>{detail}</Pane>
    </div>
  </div>
);

interface PaneProps {
  active: boolean;
  children: ReactNode;
}

// `shrink-0` and `min-w-0` are what keep a pane exactly one panel wide. A flex item defaults to
// `min-width: auto`, so a pane refuses to shrink below its content's min-content width — a long
// file path in the skills detail was enough to push the whole track sideways, which read as the
// panel being shifted left. An empty skills list has no wide content, so it hid the bug.
//
// The offscreen pane goes `visibility: hidden` once the slide finishes, which is what takes its
// buttons out of the tab order. Hiding it any earlier would blank it mid-animation, so the delay
// applies on the way out only.
const Pane = ({ active, children }: PaneProps) => {
  const style: CSSProperties = {
    visibility: active ? 'visible' : 'hidden',
    transition: 'visibility 0s linear',
    transitionDelay: active ? '0ms' : `${SLIDE_MS}ms`
  };

  return (
    <div
      className="h-full w-full min-w-0 shrink-0 overflow-hidden"
      style={style}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
};
