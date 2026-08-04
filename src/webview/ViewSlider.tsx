import { CSSProperties, ReactNode } from 'react';

interface ViewSliderProps {
  // false shows `home`, true slides to `detail`.
  showDetail: boolean;
  home: ReactNode;
  detail: ReactNode;
}

// Two panes pinned to the same box, moved by transform alone. `overflow-clip` rather than
// `overflow-hidden`: hidden keeps a scrollport, and the offscreen pane extends it.
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

// Timing lives in `.view-pane` in styles.css, since an inline transition would beat the
// prefers-reduced-motion query. `data-active` keys the delay that hides the pane after it exits.
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
