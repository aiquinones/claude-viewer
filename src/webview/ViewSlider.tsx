import { CSSProperties, ReactNode } from 'react';

interface ViewSliderProps {
  // false shows `home`, true slides to `detail`.
  showDetail: boolean;
  home: ReactNode;
  detail: ReactNode;
}

// Two panes stacked on the same box, moved by transform alone. Both stay mounted, so going home
// and coming back keeps whatever was selected — and so the outgoing pane has something to show
// while it slides away.
//
// Each pane is `absolute inset-0`, so it is the container by definition at every layout pass and
// nothing but the transform ever moves it.
//
// `overflow-clip`, not `overflow-hidden`. Hidden still creates a scrollport — the box can be
// scrolled programmatically even with no scrollbar — and the offscreen pane sits one panel to the
// right, which extends that scrollable area. Something in the webview scrolled it on first paint,
// so the panel opened shifted left and straightened out on the first navigation. Clip does the
// same clipping with no scroll container, so there is nothing left to scroll.
export const ViewSlider = ({ showDetail, home, detail }: ViewSliderProps) => (
  <div className="relative h-screen w-full overflow-clip">
    <Pane active={!showDetail} offset={showDetail ? '-100%' : '0%'}>
      {home}
    </Pane>
    <Pane active={showDetail} offset={showDetail ? '0%' : '100%'}>
      {detail}
    </Pane>
  </div>
);

interface PaneProps {
  active: boolean;
  // Where this pane sits relative to the panel: 0% is on screen, ±100% is one panel away.
  offset: string;
  children: ReactNode;
}

// Timing lives in the `.view-pane` rules in styles.css, not here — an inline transition would beat
// the prefers-reduced-motion media query. `data-active` is what those rules key the exit delay off:
// the pane goes `visibility: hidden` only once the slide has finished, which is what takes its
// buttons out of the tab order without blanking it mid-animation.
const Pane = ({ active, offset, children }: PaneProps) => {
  const style: CSSProperties = {
    transform: `translateX(${offset})`,
    visibility: active ? 'visible' : 'hidden'
  };

  return (
    <div
      className="view-pane absolute inset-0 overflow-clip"
      style={style}
      data-active={active}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
};
