import { ReactNode } from 'react';

interface FlowSplitProps {
  // Open pushes the flow into its rail and slides the detail pane in beside it.
  focused: boolean;
  flow: ReactNode;
  detail: ReactNode;
}

// The two-column shell variants A and B share.
//
// Flex with a transitioned width, not a grid: `grid-template-columns` can only animate between
// tracks of the same type, and the two states here are "all of it" and "11rem" — `1fr` and a
// length don't interpolate, so the columns would snap. `100%` → `11rem` are both lengths and do.
//
// The flow pane still needs `min-w-0`, or it refuses to shrink below its widest card. Scrolling
// belongs to whatever each pane holds — the column scrolls, the canvas pans.
// The height is here rather than on whatever renders it, the same way `GraphView` owns
// `graph-box` — the panel and a story would otherwise each have to remember, and one of them
// wouldn't.
export const FlowSplit = ({ focused, flow, detail }: FlowSplitProps) => (
  <div className="flex h-[min(70vh,32rem)] min-h-72 w-full overflow-clip rounded-lg border border-border">
    <div className="flow-pane min-w-0 shrink-0 overflow-clip" data-focused={focused}>
      {flow}
    </div>
    {focused && <div className="min-w-0 flex-1 overflow-clip border-l border-border">{detail}</div>}
  </div>
);
