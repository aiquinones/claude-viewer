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
export const ViewSlider = ({ showDetail, home, detail }: ViewSliderProps) => (
  <div className="h-screen overflow-hidden">
    <div
      className="flex h-full w-[200%] transition-transform ease-out motion-reduce:transition-none"
      style={{
        transform: showDetail ? 'translateX(-50%)' : 'translateX(0)',
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
    <div className="h-full w-1/2 overflow-hidden" style={style} aria-hidden={!active}>
      {children}
    </div>
  );
};
